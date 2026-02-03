'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Btn';
import SheetDropdown from '@/components/home/addproject/SheetDropdown';

export default function ConnectForm() {
  const router = useRouter();

  const sheetHeaders = [
    '이름을 작성해주세요.',
    '학교를 작성해주세요.',
    '학과를 작성해주세요.',
    '성별을 선택해주세요.',
    '연락처를 작성해주세요.',
    '이메일 주소',
    '지원 포지션을 선택해주세요.',
    '나이를 작성해주세요.',
    '지원 동기를 작성해주세요.',
  ];

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

  const renderSection = (label: string, fieldKey: keyof typeof mappings, placeholder: string) => (
    <div className="flex flex-col gap-2">
      <label className="text-[14px] font-bold text-gray-950">{label}</label>
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

          <div className="flex flex-col gap-6">
            {renderSection('이름', 'name', '이름을 작성해주세요.')}
            {renderSection('학교', 'school', '학교를 작성해주세요.')}
            {renderSection('학과', 'major', '학과를 작성해주세요.')}
            {renderSection('성별', 'gender', '성별을 선택해주세요.')}
            {renderSection('전화번호', 'phone', '연락처를 작성해주세요.')}
            {renderSection('이메일', 'email', '이메일 주소')}
            {renderSection('지원 포지션', 'position', '지원 포지션을 선택해주세요.')}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-4 max-w-93.75 mx-auto">
          <Button variant="primary" size="lg" className="w-full" onClick={handleConnect}>
            연동하기
          </Button>
        </div>
      </div>
    </div>
  );
}
