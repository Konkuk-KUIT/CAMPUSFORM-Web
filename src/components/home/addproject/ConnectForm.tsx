'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Btn';
import SheetDropdown from '@/components/home/addproject/SheetDropdown';
import { getSheetHeaders } from '@/services/googleSheetService';
import { toast, ToastContainer } from '@/components/Toast';
import Loading from '@/components/ui/Loading';
import { useNewProjectStore } from '@/store/newProjectStore';

interface SheetHeader {
  name: string;
  index: number;
}

export default function ConnectForm({ sheetUrl: sheetUrlProp }: { sheetUrl: string }) {
  const router = useRouter();
  const { setProjectForm, projectForm, mappingFields, setMappingFields } = useNewProjectStore();

  const sheetUrl =
    sheetUrlProp ||
    projectForm.sheetUrl ||
    (typeof window !== 'undefined' ? sessionStorage.getItem('pendingSheetUrl') : '') ||
    '';

  const [sheetHeaders, setSheetHeaders] = useState<SheetHeader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mappings, setMappings] = useState(mappingFields);

  useEffect(() => {
    if (!sheetUrl) {
      Promise.resolve().then(() => {
        toast.error('시트 URL이 없습니다.');
        setIsLoading(false);
      });
      return;
    }

    if (!projectForm.sheetUrl) {
      setProjectForm({ sheetUrl });
    }

    getSheetHeaders(sheetUrl)
      .then((data: SheetHeader[]) => {
        setSheetHeaders(data);
      })
      .catch(() => {
        toast.error('시트 헤더를 불러오지 못했습니다.');
      })
      .finally(() => setIsLoading(false));
  }, [sheetUrl]);

  const handleMappingChange = (field: keyof typeof mappings, value: string) => {
    setMappings(prev => ({ ...prev, [field]: value }));
    setMappingFields({ [field]: value });
  };

  const buildRequiredMappings = () => ({
    nameIdx: sheetHeaders.find(h => h.name === mappings.name)?.index ?? -1,
    schoolIdx: sheetHeaders.find(h => h.name === mappings.school)?.index ?? -1,
    majorIdx: sheetHeaders.find(h => h.name === mappings.major)?.index ?? -1,
    genderIdx: sheetHeaders.find(h => h.name === mappings.gender)?.index ?? -1,
    phoneIdx: sheetHeaders.find(h => h.name === mappings.phone)?.index ?? -1,
    emailIdx: sheetHeaders.find(h => h.name === mappings.email)?.index ?? -1,
    positionIdx: sheetHeaders.find(h => h.name === mappings.position)?.index ?? -1,
  });

  const handleEditPosition = () => {
    setProjectForm({ sheetUrl, requiredMappings: buildRequiredMappings() });
    router.push('/home/addproject/connect/edit-position');
  };

  const handleConnect = () => {
    setProjectForm({ sheetUrl, requiredMappings: buildRequiredMappings() });
    sessionStorage.removeItem('pendingSheetUrl');
    router.push('/home/addproject');
  };

  const renderSection = (label: string, fieldKey: keyof typeof mappings, placeholder: string, showEdit = false) => (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center pr-2">
        <label className="text-14 font-bold text-gray-950">{label}</label>
        {showEdit && (
          <button onClick={handleEditPosition} className="text-body-sm-rg text-primary underline">
            편집하기
          </button>
        )}
      </div>
      <SheetDropdown
        options={sheetHeaders.map(h => h.name)}
        value={mappings[fieldKey]}
        onChange={val => handleMappingChange(fieldKey, val)}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <ToastContainer />
      <div className="relative w-93.75 bg-white min-h-screen flex flex-col">
        <Header title="스프레드 시트 연동" backTo="/home/addproject" />

        <div className="flex-1 px-5 py-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide pb-24">
          <p className="text-12 text-gray-500 leading-4.5">
            스프레드 시트의 질문을 서비스 표준 항목과 연결해 주세요.
            <br />
            연결된 정보는 이후 서류·면접 관리에 활용됩니다.
          </p>

          {isLoading && (
            <div className="flex-1 flex items-center justify-center">
              <Loading fullScreen={false} />
            </div>
          )}

          {!isLoading && (
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
          <Button variant="primary" size="lg" className="w-full" onClick={handleConnect} disabled={isLoading}>
            연동하기
          </Button>
        </div>

        <div className="h-24" />
      </div>
    </div>
  );
}
