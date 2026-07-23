'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/ui/Header';
import Btn from '@/components/ui/Btn';
import { useCurrentProjectStore } from '@/store/currentProjectStore';
import { projectService } from '@/services/projectService';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { toast } from '@/components/Toast';

export default function ApplicantEditAdminForm() {
  const router = useRouter();
  const projectId = useCurrentProjectStore(s => s.projectId);

  const [guidanceText, setGuidanceText] = useState('');
  const [slotsSummaries, setSlotsSummaries] = useState<any[]>([]);
  const [interviewSetting, setInterviewSetting] = useState<any>(null);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [investigationLink, setInvestigationLink] = useState<string>('');

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        const [config, slotsData, linkData] = await Promise.allSettled([
          projectService.getApplicantLinkConfig(projectId),
          projectService.getInterviewSlots(projectId),
          projectService.getInvestigationLink(projectId),
        ]);

        if (config.status === 'fulfilled' && config.value?.guidanceText != null) {
          setGuidanceText(config.value.guidanceText);
        }

        if (slotsData.status === 'fulfilled' && slotsData.value?.summaries) {
          setSlotsSummaries(slotsData.value.summaries);
          const dates = slotsData.value.summaries.map((s: any) => s.date).filter(Boolean);
          if (dates.length > 0) setInterviewSetting({ interviewDates: dates });
        } else {
          // fallback: getInterviewSetting
          try {
            const setting = await projectService.getInterviewSetting(projectId);
            if (setting?.interviewDates?.length > 0) {
              setInterviewSetting(setting);
            }
          } catch {}
        }

        if (linkData.status === 'fulfilled' && linkData.value?.url) {
          setInvestigationLink(linkData.value.url);
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
      }
    };

    fetchData();
  }, [projectId]);

  const timeSlotsByDate: Record<string, string[]> = useMemo(() => {
    if (slotsSummaries.length > 0) {
      const result: Record<string, string[]> = {};
      slotsSummaries.forEach((summary: any) => {
        if (summary.date && summary.slots) {
          const dateKey = format(new Date(summary.date), 'M월 d일 (E)', { locale: ko });
          result[dateKey] = summary.slots.map((s: any) => s.startTime.substring(0, 5));
        }
      });
      return result;
    }

    if (!interviewSetting?.interviewDates || !interviewSetting?.startTime) return {};

    const result: Record<string, string[]> = {};
    const [startHour, startMin] = interviewSetting.startTime.split(':').map(Number);
    const [endHour, endMin] = interviewSetting.endTime.split(':').map(Number);

    interviewSetting.interviewDates.forEach((dateStr: string) => {
      const dateKey = format(new Date(dateStr), 'M월 d일 (E)', { locale: ko });
      const times: string[] = [];
      let h = startHour, m = startMin;
      while (h < endHour || (h === endHour && m < endMin)) {
        times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        m += 30;
        if (m >= 60) { m = 0; h += 1; }
      }
      result[dateKey] = times;
    });

    return result;
  }, [slotsSummaries, interviewSetting]);

  const toggleDate = (date: string) => {
    setExpandedDates(prev => {
      const next = new Set(prev);
      next.has(date) ? next.delete(date) : next.add(date);
      return next;
    });
  };

  const handleSave = async () => {
    if (!projectId) return;
    setIsSaving(true);
    try {
      await projectService.updateApplicantLinkConfig(projectId, { guidanceText });
      toast.success('저장되었습니다.');
      router.push(`/smart-schedule/${projectId}/applicant`);
    } catch (error) {
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        title="지원자 면접 시간 모집"
        backTo={projectId ? `/smart-schedule/${projectId}/applicant` : undefined}
      />

      <div className="flex-1 pb-[100px]">
        {/* 안내 문구 섹션 */}
        <div className="px-[26px] pt-[18px] pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-subtitle-sm-md text-gray-950">지원자 안내 문구</span>
            {investigationLink && (
              <a
                href={investigationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-sm text-primary underline"
              >
                미리보기
              </a>
            )}
          </div>
          <textarea
            value={guidanceText}
            onChange={e => setGuidanceText(e.target.value)}
            placeholder="지원자에게 보여질 안내 문구를 입력하세요&#10;(ex. 안녕하세요 ○○입니다. 면접 가능 시간을 선택해 주세요. 선택한 시간을 바탕으로 일정이 확정됩니다.)"
            className="w-full h-[110px] bg-white border border-gray-200 rounded-[10px] px-5 py-[18px] text-body-sm-rg text-gray-950 placeholder:text-gray-300 focus:outline-none focus:border-primary resize-none"
          />
        </div>

        {/* 면접 가능 시간 섹션 */}
        <div className="px-[26px] pt-4 pb-2">
          <span className="text-subtitle-sm-sb text-gray-950">면접 가능 시간</span>
        </div>

        {Object.keys(timeSlotsByDate).length === 0 ? (
          <div className="text-center py-8 text-body-sm text-gray-300">
            면접 정보 설정 후 이용 가능합니다.
          </div>
        ) : (
          <div className="space-y-0">
            {Object.entries(timeSlotsByDate)
              .filter(([_, times]) => times.length > 0)
              .map(([date, times]) => {
                const isExpanded = expandedDates.has(date);
                return (
                  <div key={date}>
                    <button
                      onClick={() => toggleDate(date)}
                      className={`w-full h-[50px] flex items-center justify-between px-[26px] border-b border-gray-100 ${
                        isExpanded ? 'bg-blue-50' : 'bg-white'
                      }`}
                    >
                      <span className="text-subtitle-sm-md text-gray-950">{date}</span>
                      <Image
                        src="/icons/dropdown-down.svg"
                        alt=""
                        width={31}
                        height={31}
                        className={isExpanded ? 'rotate-180' : ''}
                      />
                    </button>

                    {isExpanded && (
                      <div className="bg-white px-4 py-4 border-b border-gray-100">
                        <div className="grid grid-cols-4 gap-2">
                          {times.map(time => (
                            <div
                              key={time}
                              className="h-9 rounded-[5px] border border-gray-200 bg-white flex items-center justify-center text-body-sm-rg text-gray-950"
                            >
                              {time}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* 저장하기 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-93.75 mx-auto bg-white px-5 py-4">
        <Btn
          onClick={handleSave}
          disabled={isSaving}
          variant="primary"
          size="lg"
          className="w-full"
        >
          {isSaving ? '저장 중...' : '저장하기'}
        </Btn>
      </div>
    </div>
  );
}
