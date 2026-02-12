'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Btn';
import SheetDropdown from '@/components/home/addproject/SheetDropdown';
import { fetchGoogleSheetHeaders } from '@/services/sheetService';
import { fetchGoogleAuthorizeUrl, exchangeGoogleOAuthCode } from '@/services/googleAuthService';

export default function ConnectForm() {
  const router = useRouter();

  const handleEditPosition = () => {
    router.push('/home/addproject/connect/edit-position');
  };

  // 실제로는 AddProjectForm에서 sheetUrl, projectId를 받아와야 함. 예시로 projectId=1, sheetUrl 하드코딩
  const [sheetHeaders, setSheetHeaders] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // ...existing code...
  const [needLogin, setNeedLogin] = useState(false);
  const [needSheetShare, setNeedSheetShare] = useState(false);
  const [badSheetUrl, setBadSheetUrl] = useState(false);
  const [serverError, setServerError] = useState(false);
  const searchParams = useSearchParams();
  const [needGoogleSync, setNeedGoogleSync] = useState(false);
  useEffect(() => {
    const sheetUrl = searchParams.get('sheetUrl') || '';
    const code = searchParams.get('code');
    // 환경변수 기준으로 redirect_uri 사용 (구글 콘솔 등록값과 반드시 일치)
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || `${window.location.origin}/oauth/google/callback`;

    // 콜백에서 code가 있으면 토큰 교환 → sheet-headers 재호출
    if (code) {
      (async () => {
        try {
          await exchangeGoogleOAuthCode(code, redirectUri);
          if (sheetUrl) {
            const data = await fetchGoogleSheetHeaders(sheetUrl);
            setSheetHeaders(Array.isArray(data) ? data : []);
            setErrorMsg(null);
            setNeedGoogleSync(false);
            setNeedLogin(false);
            setNeedSheetShare(false);
            setBadSheetUrl(false);
            setServerError(false);
          }
        } catch (err) {
          setServerError(true);
          setErrorMsg('Google 연동 서버 오류가 발생했습니다. 잠시 후 다시 시도하거나 문의해 주세요.');
        }
      })();
      return;
    }

    // sheetUrl이 없으면 에러
    if (!sheetUrl) {
      setSheetHeaders([]);
      setErrorMsg('시트 URL이 없습니다.');
      return;
    }

    // 토큰이 있으면 바로 헤더 조회, 없으면 authorize-url로 리다이렉트
    fetchGoogleSheetHeaders(sheetUrl)
      .then((data) => {
        setSheetHeaders(Array.isArray(data) ? data : []);
        setErrorMsg(null);
        setNeedGoogleSync(false);
        setNeedLogin(false);
        setNeedSheetShare(false);
        setBadSheetUrl(false);
        setServerError(false);
      })
      .catch(async (err) => {
        const status = err?.response?.status;
        const code = err?.response?.data?.code;
        if (status === 404 && code === 'Token Not Found') {
          // 안내 없이 바로 연동 시도, 실패 시 안내
          try {
            const { authorizeUrl } = await fetchGoogleAuthorizeUrl(redirectUri);
            if (authorizeUrl) {
              window.location.href = authorizeUrl;
            }
          } catch (e) {
            setErrorMsg('Google 연동 서버 오류가 발생했습니다. 잠시 후 다시 시도하거나 문의해 주세요.');
            setServerError(true);
          }
        } else if (status === 401 && code === 'Unauthorized') {
          setNeedLogin(true);
          setErrorMsg('로그인이 필요합니다. 로그인 후 다시 시도해 주세요.');
        } else if (status === 401 && code === 'Token Expired') {
          setNeedGoogleSync(true);
          setErrorMsg('Google 연동이 만료되었습니다. 다시 연동해 주세요.');
        } else if (status === 403) {
          setNeedSheetShare(true);
          setErrorMsg('이 시트에 대한 접근 권한이 없습니다. 시트가 해당 Google 계정과 공유되어 있는지 확인해 주세요.');
        } else if (status === 400) {
          setBadSheetUrl(true);
          setErrorMsg('시트 URL을 확인해 주세요.');
        } else if (status === 500) {
          setServerError(true);
          setErrorMsg('서버 오류가 발생했습니다. 잠시 후 다시 시도하거나 문의해 주세요.');
        } else {
          setServerError(true);
          setErrorMsg('알 수 없는 오류가 발생했습니다.');
        }
      });
  }, [searchParams]);

  const [mappings, setMappings] = useState({
    name: '',
    school: '',
    major: '',
    gender: '',
    phone: '',
    email: '',
    position: '',
  });

  const handleMappingChange = (field: keyof typeof mappings, value: string) => {
    setMappings(prev => ({ ...prev, [field]: value }));
  };

  const handleConnect = () => {
    console.log('연동 데이터:', mappings);
    router.back();
  };

  const renderSection = (label: string, fieldKey: keyof typeof mappings, placeholder: string, showEdit = false) => (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center pr-2">
        <label className="text-[14px] font-bold text-gray-950">{label}</label>
        {showEdit && (
          <button 
            onClick={handleEditPosition}
            className="text-body-sm-rg text-[var(--color-primary)] underline"
          >
            편집하기
          </button>
        )}
      </div>
      <SheetDropdown
        options={sheetHeaders}
        value={mappings[fieldKey]}
        onChange={val => handleMappingChange(fieldKey, val)}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="relative w-[375px] bg-white min-h-screen flex flex-col">
        <Header title="스프레드 시트 연동" backTo="/home/addproject" />
        <div className="flex-1 px-5 py-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide pb-24">
          <p className="text-[12px] text-gray-500 leading-[18px]">
            스프레드 시트의 질문을 서비스 표준 항목과 연결해 주세요.
            <br />
            연결된 정보는 이후 서류·면접 관리에 활용됩니다.
          </p>
          {/* 에러 안내 UI 제거: 아무 메시지도 노출하지 않음 */}
          {!errorMsg && (
            <div className="flex flex-col gap-6">
              {renderSection('이름', 'name', '이름을 작성해주세요.')}
              {renderSection('학교', 'school', '학교를 작성해주세요.')}
              {renderSection('학과', 'major', '학과를 작성해주세요.')}
              {renderSection('성별', 'gender', '성별을 선택해주세요.')}
              {renderSection('전화번호', 'phone', '연락처를 작성해주세요.')}
              {renderSection('이메일', 'email', '이메일 주소')}
              {renderSection('지원 포지션', 'position', '지원 포지션을 선택해주세요.', true)}
            </div>
          )}
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-4 max-w-93.75 mx-auto">
          <Button variant="primary" size="lg" className="w-full" onClick={handleConnect}>
            연동하기
          </Button>
        </div>
        {/* Spacer for fixed button */}
        <div className="h-24" />
      </div>
    </div>
  );
}
