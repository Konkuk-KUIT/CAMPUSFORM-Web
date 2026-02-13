'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Button from '@/components/ui/Btn';
import SheetDropdown from '@/components/home/addproject/SheetDropdown';
import { useNewProjectStore } from '@/store/newProjectStore';
import { projectService } from '@/services/projectService';

interface PositionMapping {
  original: string;
  changed: string;
}

export default function PositionEditForm() {
  const router = useRouter();
  const { setProjectForm, projectForm } = useNewProjectStore();

  const [collectedPositions, setCollectedPositions] = useState<string[]>([]);
  const [positions, setPositions] = useState<PositionMapping[]>([{ original: '', changed: '' }]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);

  useEffect(() => {
    const fetchPositions = async () => {
      const sheetUrl = projectForm.sheetUrl;
      const positionColumnIndex = projectForm.requiredMappings?.positionIdx ?? -1;

      if (!sheetUrl) return; // sheetUrl만 체크

      try {
        const result = await projectService.getMappingColumnValues(sheetUrl, positionColumnIndex);
        setCollectedPositions(result.values);
      } catch (e) {
        console.error('포지션 목록 조회 오류:', e);
      }
    };

    fetchPositions();
  }, [projectForm.sheetUrl, projectForm.requiredMappings?.positionIdx]);

  const handleAddPosition = () => {
    setPositions([...positions, { original: '', changed: '' }]);
  };

  const handleRemovePosition = (index: number) => {
    setPositions(positions.filter((_, i) => i !== index));
  };

  const handlePositionChange = (index: number, field: 'original' | 'changed', value: string) => {
    const newPositions = [...positions];
    newPositions[index][field] = value;
    setPositions(newPositions);
  };

  const togglePosition = (position: string) => {
    setSelectedPositions(prev => (prev.includes(position) ? prev.filter(p => p !== position) : [...prev, position]));
  };

  const handleSubmit = () => {
    const valueMappings = positions
      .filter(p => p.original && p.changed)
      .map(p => ({ fromValue: p.original, toValue: p.changed }));

    setProjectForm({ valueMappings });
    router.back();
  };

  return (
    <div className="flex justify-center min-h-screen bg-white">
      <div className="relative w-93.75 bg-white min-h-screen flex flex-col">
        <Header title="포지션 편집" backTo="/home/addproject/connect" hideNotification={true} />

        <div className="flex-1 px-4 pt-6 pb-32 flex flex-col gap-6 overflow-y-auto scrollbar-hide">
          <p className="text-[13px] font-normal leading-4.5 tracking-[0.13px] text-gray-500">
            중복되거나 다른 표기의 포지션이 있으십니까?
            <br />
            하나의 포지션 표기로 통합해 주세요.
          </p>

          <div className="flex flex-col gap-3">
            <h3 className="text-[15px] font-medium leading-5.25 text-black">수집된 포지션</h3>
            <div className="flex flex-wrap gap-2.5">
              {collectedPositions.map((position, index) => (
                <button
                  key={index}
                  onClick={() => togglePosition(position)}
                  className={`h-6.75 px-2.5 py-0.75 rounded-[13px] text-[13px] font-medium leading-[1.5] tracking-[-0.286px] ${
                    selectedPositions.includes(position) ? 'bg-primary text-white' : 'bg-blue-50 text-[#5d5d5d]'
                  }`}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h3 className="text-[15px] font-medium leading-5.25 text-black">포지션 변경</h3>
              <button
                onClick={handleAddPosition}
                className="flex items-center gap-1 text-[13px] font-normal leading-4.5 tracking-[0.13px] text-[var(--color-primary)] underline decoration-solid"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14m-7-7h14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                추가하기
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {positions.map((position, index) => (
                <div key={index} className="relative">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-12 font-medium leading-4.25 text-[#888] mb-1.5 block">변경 전</label>
                      <SheetDropdown
                        options={collectedPositions}
                        value={position.original}
                        onChange={val => handlePositionChange(index, 'original', val)}
                        placeholder="---"
                        showNoneOption={false}
                      />
                    </div>

                    <div className="flex items-center pt-5.75">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="text-[#888]">
                        <path
                          d="M1 4h8m0 0L6.5 1.5M9 4L6.5 6.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <label className="text-12 font-medium leading-4.25 text-[#888] mb-1.5 block">변경 후</label>
                      <SheetDropdown
                        options={collectedPositions}
                        value={position.changed}
                        onChange={val => handlePositionChange(index, 'changed', val)}
                        placeholder="---"
                        showNoneOption={false}
                      />
                    </div>

                    {positions.length > 1 && (
                      <button
                        onClick={() => handleRemovePosition(index)}
                        className="flex items-center pt-5.75 text-[#d9d9d9]"
                      >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M11 7l-4 4m0-4l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-93.75 bg-white px-4 py-4">
          <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit}>
            적용하기
          </Button>
        </div>
      </div>
    </div>
  );
}
