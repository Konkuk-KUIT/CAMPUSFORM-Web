// Updated filename to PascalCase

'use client';

export interface Applicant {
  name: string;
  major: string;
  position: string;
}

export interface ScheduleResultCardProps {
  timeRange: string;
  applicants: Applicant[];
  interviewers: string[];
}

export default function ScheduleResultCard({ timeRange, applicants, interviewers }: ScheduleResultCardProps) {
  return (
    <div className="bg-white rounded-[15px] border border-gray-200 p-5">
      {/* 시간 */}
      <p className="text-subtitle-rg text-primary mb-3">{timeRange}</p>

      {/* 지원자 */}
      <div className="flex gap-6 mb-3">
        <p className="text-body-md text-black min-w-11.25">지원자</p>
        <div className="flex flex-col gap-2">
          {applicants.map((applicant, index) => (
            <p key={index} className="text-body-rg text-black">
              {applicant.name}({applicant.major}/{applicant.position})
            </p>
          ))}
        </div>
      </div>

      {/* 면접관 */}
      <div className="flex gap-6">
        <p className="text-body-md text-black min-w-11.25">면접관</p>
        <p className="text-body-rg text-black">{interviewers.join(', ')}</p>
      </div>
    </div>
  );
}
