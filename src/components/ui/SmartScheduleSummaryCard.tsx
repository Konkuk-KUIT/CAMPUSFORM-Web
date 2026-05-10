'use client';

import Image from 'next/image';

interface InterviewSetting {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  slotDurationMin: number;
  breakDurationMin?: number;
  breakTimeMin?: number;
  maxApplicantsPerSlot?: number;
  maxApplicantsPerInterview?: number;
  maxApplicantsPerTime?: number;
  minInterviewersPerSlot?: number;
  maxInterviewersPerSlot?: number;
  interviewDates?: string[];
}

interface SmartScheduleSummaryCardProps {
  interviewSetting: InterviewSetting | null;
}

const gray4IconFilter =
  'brightness(0) saturate(100%) invert(56%) sepia(0%) saturate(0%) hue-rotate(179deg) brightness(95%) contrast(88%)';

const formatKoreanDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(2);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
};

const formatDateRange = (dates?: string[]) => {
  if (!dates || dates.length === 0) return '-';

  const sortedDates = [...dates].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  const groupedByMonth = sortedDates.reduce<Record<string, number[]>>((acc, dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2);
    const month = date.getMonth() + 1;
    const key = `${year}년 ${month}월`;

    if (!acc[key]) acc[key] = [];
    acc[key].push(date.getDate());

    return acc;
  }, {});

  return Object.entries(groupedByMonth)
    .map(([monthLabel, days]) => {
      const sortedDays = [...days].sort((a, b) => a - b);

      const ranges: string[] = [];
      let start = sortedDays[0];
      let prev = sortedDays[0];

      for (let i = 1; i < sortedDays.length; i++) {
        const current = sortedDays[i];

        if (current === prev + 1) {
          prev = current;
        } else {
          ranges.push(start === prev ? `${start}` : `${start}~${prev}`);
          start = current;
          prev = current;
        }
      }

      ranges.push(start === prev ? `${start}` : `${start}~${prev}`);

      return `${monthLabel} ${ranges.join(', ')}일`;
    })
    .join(', ');
};

const formatTime = (time: string) => {
  if (!time) return '-';

  const [hour, minute] = time.split(':');

  return `${Number(hour)}:${minute}`;
};

export default function SmartScheduleSummaryCard({
  interviewSetting,
}: SmartScheduleSummaryCardProps) {
  if (!interviewSetting) return null;

  const dateText = interviewSetting.interviewDates?.length
    ? formatDateRange(interviewSetting.interviewDates)
    : `${formatKoreanDate(interviewSetting.startDate)} ~ ${formatKoreanDate(
        interviewSetting.endDate,
      )}`;

  const breakDuration =
    interviewSetting.breakDurationMin ?? interviewSetting.breakTimeMin ?? 10;

  const maxApplicants =
    interviewSetting.maxApplicantsPerSlot ??
    interviewSetting.maxApplicantsPerInterview ??
    interviewSetting.maxApplicantsPerTime ??
    3;

  const minInterviewers = interviewSetting.minInterviewersPerSlot ?? 1;
  const maxInterviewers = interviewSetting.maxInterviewersPerSlot ?? 2;

  return (
    <div className="mx-4 mt-3 rounded-[10px] border border-gray-100 bg-white px-5 py-4">
      <div className="flex items-center gap-3">
        <Image
          src="/icons/calendar.svg"
          alt="면접 날짜"
          width={20}
          height={20}
          className="h-5 w-5 shrink-0"
          style={{ filter: gray4IconFilter }}
        />
        <p className="text-body-rg text-gray-950">
          {dateText}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Image
          src="/icons/clock.svg"
          alt="면접 시간"
          width={18}
          height={18}
          className="h-4 w-4 shrink-0"
          style={{ filter: gray4IconFilter }}
        />
        <p className="text-body-rg text-gray-950">
          {formatTime(interviewSetting.startTime)} - {formatTime(interviewSetting.endTime)}
          <span>
            {' '}
            · 면접 {interviewSetting.slotDurationMin}분 · 휴식 {breakDuration}분
          </span>
        </p>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Image
          src="/icons/users.svg"
          alt="면접 인원"
          width={18}
          height={18}
          className="h-4 w-4 shrink-0"
          style={{ filter: gray4IconFilter }}
        />
        <p className="text-body-rg text-gray-950">
          지원자 최대 {maxApplicants}명 · 면접관 {minInterviewers}~{maxInterviewers}명
        </p>
      </div>
    </div>
  );
}