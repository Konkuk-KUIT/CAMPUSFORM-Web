'use client';

export interface ResultCardProps {
  type: '서류결과' | '면접결과';
  totalApplicantCount: number;
  currentStagePassCount: number;
  competitionRate: string;
  genderRatio: {
    malePercent: number;
    femalePercent: number;
    otherPercent: number;
  };
}

export default function ResultCard({
  type,
  totalApplicantCount,
  currentStagePassCount,
  competitionRate,
  genderRatio,
}: ResultCardProps) {
  const getLabels = () => {
    switch (type) {
      case '서류결과':
        return { total: '총 지원자 수', passed: '서류 합격자 수', ratio: '서류 경쟁률' };
      case '면접결과':
        return { total: '총 지원자 수', passed: '면접 합격자 수', ratio: '최종 경쟁률' };
    }
  };

  const labels = getLabels();

  return (
    <div className="w-full h-32 bg-white px-10 py-4">
      {/* 상단 정보 */}
      <div className="flex justify-between items-stretch mb-3">
        <div className="flex flex-col items-center">
          <p className="text-body-sm-rg text-black mb-2">{labels.total}</p>
          <p className="text-body text-black">{totalApplicantCount}명</p>
        </div>
        <div className="w-px bg-gray-100 self-stretch"></div>
        <div className="flex flex-col items-center">
          <p className="text-body-sm-rg text-black mb-2">{labels.passed}</p>
          <p className="text-body text-black">{currentStagePassCount}명</p>
        </div>
        <div className="w-px bg-gray-100 self-stretch"></div>
        <div className="flex flex-col items-center">
          <p className="text-body-sm-rg text-black mb-2">{labels.ratio}</p>
          <p className="text-body text-black">{competitionRate}</p>
        </div>
      </div>

      {/* 막대 바 */}
      <div className="relative w-full h-3.75 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="absolute left-0 top-0 h-full bg-blue-200"
          style={{ width: `${genderRatio.malePercent}%` }}
        ></div>
        <div
          className="absolute right-0 top-0 h-full bg-blue-300"
          style={{ width: `${genderRatio.femalePercent}%` }}
        ></div>
      </div>

      {/* 성비 */}
      <div className="flex justify-between text-body-xs-rg text-black">
        <span>남 {genderRatio.malePercent}%</span>
        <span>여 {genderRatio.femalePercent}%</span>
      </div>
    </div>
  );
}
