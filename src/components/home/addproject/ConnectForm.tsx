'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Btn';
import SheetDropdown from '@/components/home/addproject/SheetDropdown';
import { getSheetHeaders, type SheetHeader } from '@/services/projectService';

export default function ConnectForm() {
  const router = useRouter();
  const [sheetUrl, setSheetUrl] = useState<string>('');
  // 기본 예시 데이터로 시작
  const [sheetHeaders, setSheetHeaders] = useState<string[]>([
    '이름을 작성해주세요.',
    '학교를 작성해주세요.',
    '학과를 작성해주세요.',
    '성별을 선택해주세요.',
    '연락처를 작성해주세요.',
    '이메일 주소',
    '지원 포지션을 선택해주세요.',
    '나이를 작성해주세요.',
    '지원 동기를 작성해주세요.',
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadSuccess, setLoadSuccess] = useState(false);

  const handleEditPosition = () => {
    router.push('/home/addproject/connect/edit-position');
  };

  // sessionStorage에서 구글 시트 URL 로드 및 헤더 가져오기
  useEffect(() => {
    const savedSheetUrl = sessionStorage.getItem('sheetUrl');
    if (savedSheetUrl) {
      setSheetUrl(savedSheetUrl);
      fetchSheetHeaders(savedSheetUrl);
    }
  }, []);

  const fetchSheetHeaders = async (url: string) => {
    setIsLoading(true);
    try {
      const headers = await getSheetHeaders(url);
      const headerNames = headers.map((h: SheetHeader) => h.name);
      if (headerNames.length > 0) {
        setSheetHeaders(headerNames);
        setLoadSuccess(true);
      }
    } catch (err) {
      console.error('Failed to fetch sheet headers:', err);
      // 실패해도 기본 데이터 유지
    } finally {
      setIsLoading(false);
    }
  };

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
    // 필수 항목 유효성 검사
    const requiredFields = ['name', 'school', 'major', 'phone', 'email', 'position'] as const;
    const missingFields = requiredFields.filter(field => !mappings[field]);
    
    if (missingFields.length > 0) {
      alert('모든 필수 항목을 선택해주세요.');
      return;
    }

    // 선택된 항목의 인덱스를 찾아서 저장
    const requireMappings = {
      nameIdx: sheetHeaders.indexOf(mappings.name),
      schoolIdx: sheetHeaders.indexOf(mappings.school),
      majorIdx: sheetHeaders.indexOf(mappings.major),
      phoneIdx: sheetHeaders.indexOf(mappings.phone),
      emailIdx: sheetHeaders.indexOf(mappings.email),
      positionIdx: sheetHeaders.indexOf(mappings.position),
    };

    // sessionStorage에 매핑 정보 저장
    sessionStorage.setItem('projectMappings', JSON.stringify(requireMappings));
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
          {isLoading && (
            <div className="px-4 py-2 bg-blue-50 border-l-4 border-blue-500 rounded mb-4">
              <p className="text-[12px] text-blue-700">구글 시트 헤더를 불러오는 중...</p>
            </div>
          )}

          {!isLoading && loadSuccess && (
            <div className="px-4 py-2 bg-green-50 border-l-4 border-green-500 rounded mb-4">
              <p className="text-[12px] text-green-700">✓ 구글 시트와 연결되었습니다!</p>
            </div>
          )}

          {!isLoading && !loadSuccess && sheetUrl && (
            <div className="px-4 py-2 bg-yellow-50 border-l-4 border-yellow-500 rounded mb-4">
              <p className="text-[12px] text-yellow-700">⚠ 구글 시트 연결 실패. 예시 데이터로 진행합니다.</p>
            </div>
          )}

          <p className="text-[12px] text-gray-500 leading-[18px]">
            스프레드 시트의 질문을 서비스 표준 항목과 연결해 주세요.
            <br />
            연결된 정보는 이후 서류·면접 관리에 활용됩니다.
          </p>

          <div className="flex flex-col gap-6">
            {renderSection('이름', 'name', '이름을 작성해주세요.')}
            {renderSection('학교', 'school', '학교를 작성해주세요.')}
            {renderSection('학과', 'major', '학과를 작성해주세요.')}
            {renderSection('성별', 'gender', '성별을 선택해주세요.')}
            {renderSection('전화번호', 'phone', '연락처를 작성해주세요.')}
            {renderSection('이메일', 'email', '이메일 주소')}
            {renderSection('지원 포지션', 'position', '지원 포지션을 선택해주세요.', true)}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-4 max-w-93.75 mx-auto">
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full" 
            onClick={handleConnect}
            disabled={isLoading}
          >
            연동하기
          </Button>
        </div>        
        {/* Spacer for fixed button */}
        <div className="h-24" />
      </div>
    </div>
  );
}
