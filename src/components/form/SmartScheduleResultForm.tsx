'use client';

import { useState, useEffect } from 'react';
import { getSmartSchedulePreview } from '@/services/smartScheduleService';
import { projectService } from '@/services/projectService';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/ui/Header';
import Navbar from '@/components/Navbar';
import Btn from '@/components/ui/Btn';
import { useCurrentProjectStore } from '@/store/currentProjectStore';

interface Applicant {
  id: number;
  name: string;
  school: string;
  major: string;
  position: string;
}

interface Interviewer {
  id: number;
  name: string;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
  applicants: Applicant[];
  interviewers: Interviewer[];
}

interface DateSchedule {
  date: string;
  slots: TimeSlot[];
}

interface UnassignedApplicant extends Applicant {
  reason: string;
}

export default function SmartScheduleResultForm() {
  const router = useRouter();
  const projectId = useCurrentProjectStore(s => s.projectId);
  const [showInfo, setShowInfo] = useState(false);
  // selectedDate는 useEffect에서 최초 세팅됨


  // 실제 API 데이터 연동
  const [scheduleData, setScheduleData] = useState<DateSchedule[]>([]);
  const [unassignedApplicants, setUnassignedApplicants] = useState<UnassignedApplicant[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;
      try {
        // 스마트 시간표 결과 조회 (GET API)
        const res = await getSmartSchedulePreview(projectId);
        const data = res.data;
        console.log('[SmartScheduleResult] API 응답:', data);
        setScheduleData(data.days || []);
        setUnassignedApplicants(data.unassignedApplicants || []);
      } catch (e) {
        console.error('[SmartScheduleResult] 데이터 조회 실패:', e);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 날짜 YYYY-MM-DD → 'M월 D일 (요일)' 변환
  function formatDateToKorean(dateStr: string) {
    const date = new Date(dateStr);
    const week = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getMonth() + 1}월 ${date.getDate()}일 (${week[date.getDay()]})`;
  }

  // 시간 형식 변환: "10:00:00" → "10:00"
  function formatTime(time: string) {
    return time.substring(0, 5); // HH:mm:ss → HH:mm
  }

  // 시간 범위 형식: "10:00 - 10:20"
  function formatTimeRange(startTime: string, endTime: string) {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  }

  const handleConfirm = async () => {
    if (!projectId) {
      alert('프로젝트를 선택해주세요.');
      return;
    }

    console.log('[ScheduleResult] ===== 면접 시간 확정 시작 =====');
    console.log('[ScheduleResult] projectId:', projectId);

    try {
      const result = await projectService.confirmSmartSchedule(projectId);
      console.log('[ScheduleResult] ===== 확정 성공 =====');
      console.log('[ScheduleResult] 서버 응답:', result);
      console.log('[ScheduleResult] ============================');
      
      alert('면접 시간이 확정되었습니다.');
      router.push('/smart-schedule');
    } catch (error: any) {
      console.error('[ScheduleResult] ===== 확정 실패 =====');
      console.error('[ScheduleResult] 에러:', error);
      console.error('[ScheduleResult] 에러 메시지:', error?.message);
      console.error('[ScheduleResult] 에러 응답:', error?.response?.data);
      console.error('[ScheduleResult] ============================');
      
      alert('면접 시간 확정에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <Header title="스마트 시간표 결과" backTo="/smart-schedule" />
      </div>

      {/* Content */}
      <div className="pb-[150px]">
        {/* Info Link */}
        <div className="px-4 pt-4 pb-3 flex items-center gap-[5px]">
          <button onClick={() => setShowInfo(true)} className="text-body-md text-gray-400 underline">
            스마트 시간표 유의사항 안내
          </button>
          <div className="w-[18px] h-[18px] relative">
            <Image src="/icons/info-2.svg" alt="info" width={18} height={18} />
          </div>
        </div>

        {/* Unassigned Applicants */}
        {unassignedApplicants.length > 0 && (
          <div className="px-4 pb-4">
            <h2 className="text-subtitle-sm-sb text-gray-950 mb-3">
              면접 배정 불가 인원({unassignedApplicants.length}명)
            </h2>
            <div className="space-y-2">
              {unassignedApplicants.map((applicant, index) => (
                <div key={index} className="bg-gray-50 rounded-[10px] p-4">
                  <p className="text-body-rg text-gray-950 mb-1">
                    {applicant.name}({applicant.school}/{applicant.major}/{applicant.position})
                  </p>
                  <p className="text-body-rg text-gray-700">사유: {applicant.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date Sections */}
        {scheduleData.map((dateSchedule, dateIndex) => (
          dateSchedule.slots.length > 0 && (
            <div key={dateIndex} className="mb-4">
              {/* Date Header */}
              <div className="px-4 pb-3">
                <h2 className="text-subtitle-sm-sb text-gray-950">
                  {formatDateToKorean(dateSchedule.date)}
                </h2>
              </div>

              {/* Schedule Cards */}
              <div className="px-4 space-y-3">
                {dateSchedule.slots.map((slot, index) => (
                  <div key={index} className="border-[1.5px] border-gray-200 rounded-[10px] p-4">
                    {/* Time */}
                    <p className="text-subtitle-rg text-primary mb-3">
                      {formatTimeRange(slot.startTime, slot.endTime)}
                    </p>

                    {/* Applicants */}
                    <div className="mb-3">
                      <div className="flex gap-4">
                        <span className="text-body-md text-gray-950 w-[56px] flex-shrink-0">지원자</span>
                        <div className="flex-1 space-y-1">
                          {slot.applicants.map((applicant, appIndex) => (
                            <p key={appIndex} className="text-body-rg text-gray-950">
                              {applicant.name}({applicant.school}/{applicant.major}/{applicant.position})
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Interviewers */}
                    <div className="flex gap-4">
                      <span className="text-body-md text-gray-950 w-[56px] flex-shrink-0">면접관</span>
                      <p className="text-body-rg text-gray-950 flex-1">
                        {slot.interviewers.map((i) => i.name).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Bottom Button */}
      <div className="fixed bottom-[65px] left-0 right-0 bg-white border-t border-gray-100 px-5 max-w-93.75 mx-auto pt-[10px] pb-[10px]">
        <Btn variant="primary" size="lg" className="w-full" onClick={handleConfirm}>
          면접 시간 확정
        </Btn>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,31,31,0.40)]">
          <div className="bg-white rounded-[10px] w-[343px] px-6 py-[34px] relative">
            {/* Close Button */}
            <button onClick={() => setShowInfo(false)} className="absolute top-[10px] right-[10px] w-[24px] h-[24px]">
              <Image src="/icons/close.svg" alt="close" width={24} height={24} />
            </button>

            {/* Content */}
            <div className="flex flex-col justify-center w-[285px] h-[205px]">
              <p className="text-subtitle-sm-rg text-gray-950 mb-4">
                지원자와 면접관의 가능 시간을 알고리즘
                <br />
                기반으로 최적의 면접 시간을 자동 추천합니다.
                <br />
                아래 유의사항을 확인해주세요.
              </p>

              <div className="space-y-2 text-subtitle-sm-md text-gray-950">
                <p>
                  1. 입력된 가능한 시간대를 기준으로 자동배정
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;됩니다.
                </p>
                <p>
                  2. 겹치는 일정이 없도록 가장 효율적인 조합을
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;우선시합니다.
                </p>
                <p>3. 시간 확정 후에는 수동으로 변경 가능합니다.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}
