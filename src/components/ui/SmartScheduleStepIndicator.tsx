'use client';

type SmartScheduleStep = 1 | 2 | 3 | 4;

interface Step {
  id: SmartScheduleStep;
  label: string;
  title: string;
}

interface SmartScheduleStepIndicatorProps {
  currentStep: SmartScheduleStep;
  maxAccessibleStep?: SmartScheduleStep;
  onStepClick?: (step: SmartScheduleStep) => void;
  isLocked?: boolean;
}

const STEPS: Step[] = [
  { id: 1, label: 'Step 1', title: '정보 입력' },
  { id: 2, label: 'Step 2', title: '면접관' },
  { id: 3, label: 'Step 3', title: '지원자' },
  { id: 4, label: 'Step 4', title: '결과' },
];

export default function SmartScheduleStepIndicator({
  currentStep,
  maxAccessibleStep = currentStep,
  onStepClick,
  isLocked = false,
}: SmartScheduleStepIndicatorProps) {
  const getStepColors = (stepId: SmartScheduleStep) => {
    const isCurrent = stepId === currentStep;
    const isAccessible = stepId <= maxAccessibleStep;

    if (isCurrent) {
      return {
        fill: '#5A81FA',
        stroke: '#5A81FA',
        label: 'text-[#efefef]',
        title: 'text-white font-semibold',
      };
    }
    if (isLocked) {
      return {
        fill: '#F2F2F2',
        stroke: '#F2F2F2',
        label: 'text-[#b0b0b0]',
        title: 'text-[#5d5d5d]',
      };
    }
    if (isAccessible) {
      return {
        fill: '#FFFFFF',
        stroke: '#5A81FA',
        label: 'text-[#6d6d6d]',
        title: 'text-[#1f1f1f]',
      };
    }
    return {
      fill: '#F2F2F2',
      stroke: '#F2F2F2',
      label: 'text-[#b0b0b0]',
      title: 'text-[#5d5d5d]',
    };
  };

  const handleStepClick = (stepId: SmartScheduleStep) => {
    if (isLocked && stepId !== currentStep) return;
    if (stepId > maxAccessibleStep) return;
    onStepClick?.(stepId);
  };

  return (
    <div className="w-full bg-white px-4 pt-2 pb-2">
      <svg viewBox="0 0 343 48" fill="none" className="w-full" style={{ maxWidth: '343px', margin: '0 auto', display: 'block' }}>
        {STEPS.map((step, index) => {
          const colors = getStepColors(step.id);
          const isFirst = index === 0;
          const isLast = index === STEPS.length - 1;
          const isDisabled = isLocked ? step.id !== currentStep : step.id > maxAccessibleStep;
          const x = index * 84;

          let path: string;
          if (isFirst) {
            path = `M4,1 H79 L91,24 L79,47 H4 C2.3,47 1,45.7 1,44 V4 C1,2.3 2.3,1 4,1 Z`;
          } else if (isLast) {
            path = `M${x},1 H${x + 87} C${x + 89.5},1 ${x + 91},3 ${x + 91},5 V43 C${x + 91},45 ${x + 89.5},47 ${x + 87},47 H${x} L${x + 12},24 L${x},1 Z`;
          } else {
            path = `M${x},1 H${x + 79} L${x + 91},24 L${x + 79},47 H${x} L${x + 12},24 L${x},1 Z`;
          }

          const labelX = isFirst ? 45.5 : x + 45.5;
          const titleX = isFirst ? 45.5 : x + 45.5;

          return (
            <g
              key={step.id}
              onClick={() => !isDisabled && handleStepClick(step.id)}
              style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
            >
              <path d={path} fill={colors.fill} stroke={colors.stroke} />
              <text
                x={labelX}
                y={17}
                textAnchor="middle"
                fill={colors.fill === '#5A81FA' ? '#efefef' : colors.fill === '#FFFFFF' ? '#6d6d6d' : '#b0b0b0'}
                fontSize="12"
                fontWeight="500"
                fontFamily="Pretendard, sans-serif"
              >
                {step.label}
              </text>
              <text
                x={titleX}
                y={36}
                textAnchor="middle"
                fill={colors.fill === '#5A81FA' ? '#ffffff' : colors.fill === '#FFFFFF' ? '#1f1f1f' : '#5d5d5d'}
                fontSize="13"
                fontWeight={step.id === currentStep ? '600' : '500'}
                fontFamily="Pretendard, sans-serif"
              >
                {step.title}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
