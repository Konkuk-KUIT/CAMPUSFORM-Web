// Updated filename to PascalCase

'use client';

export interface Applicant {
  name: string;
  major: string;
  position: string;
  isHighlighted?: boolean;
}

export interface ApplicantTimeSlotCardProps {
  time: string;
  applicants: Applicant[];
}

export default function ApplicantTimeSlotCard({ time, applicants }: ApplicantTimeSlotCardProps) {
  return (
    <div className="flex gap-3 items-start bg-white p-4">
      {/* 시간 */}
      <div className="text-subtitle-rg  ml-4 text-black min-w-17">{time}</div>

      {/* 지원자 목록 박스 */}
      <div className="flex-1 bg-white border border-gray-200 rounded-10 p-3">
        <div className="flex flex-col gap-1">
          {applicants.map((applicant, index) => (
            <div
              key={index}
              className={`text-body-sm-rg text-center ${applicant.isHighlighted ? 'text-primary' : 'text-black'}`}
            >
              {applicant.name}({applicant.major}/{applicant.position})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
