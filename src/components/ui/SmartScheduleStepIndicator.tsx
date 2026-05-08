'use client';

interface Step {
  id: number;
  label: string;
  title: string;
}

interface SmartScheduleStepIndicatorProps {
  currentStep: number; // 1, 2, 3, 4
  onStepClick?: (step: number) => void;
}

const STEPS: Step[] = [
  { id: 1, label: 'Step 1', title: '정보 입력' },
  { id: 2, label: 'Step 2', title: '면접관' },
  { id: 3, label: 'Step 3', title: '지원자' },
  { id: 4, label: 'Step 4', title: '결과' },
];

export default function SmartScheduleStepIndicator({
  currentStep,
  onStepClick,
}: SmartScheduleStepIndicatorProps) {
  const getStepColors = (stepId: number) => {
    if (stepId === currentStep) {
      return {
        bg: 'bg-blue-500',
        stepText: 'text-white',
        titleText: 'text-white',
      };
    } else if (stepId < currentStep) {
      return {
        bg: 'bg-gray-200',
        stepText: 'text-gray-600',
        titleText: 'text-gray-800',
      };
    } else {
      return {
        bg: 'bg-gray-100',
        stepText: 'text-gray-400',
        titleText: 'text-gray-500',
      };
    }
  };

  return (
    <div className="w-full px-4 py-4 bg-white">
      <div className="flex gap-3 justify-between">
        {STEPS.map((step) => {
          const colors = getStepColors(step.id);
          const isDisabled = step.id > currentStep;

          return (
            <button
              key={step.id}
              onClick={() => !isDisabled && onStepClick?.(step.id)}
              disabled={isDisabled}
              className={`
                flex-1 flex flex-col items-center justify-center
                h-14 rounded-lg px-2 py-2
                transition-all duration-200
                ${colors.bg}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
              `}
            >
              <span className={`text-xs font-medium leading-tight ${colors.stepText}`}>
                {step.label}
              </span>
              <span className={`text-sm font-medium leading-tight mt-1 ${colors.titleText}`}>
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
