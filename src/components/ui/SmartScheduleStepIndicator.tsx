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

  /**
   * true면 현재 step 외에는 모두 클릭 불가 처리.
   * 예: 면접 시간 확정 후 Step4에 고정할 때 사용.
   */
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
  const getStepStyle = (stepId: SmartScheduleStep) => {
    const isCurrent = stepId === currentStep;
    const isPast = stepId < currentStep;
    const isFuture = stepId > currentStep;
    const isAccessible = stepId <= maxAccessibleStep;

    if (isCurrent) {
      return {
        container: 'bg-[#5B7CFA] border-[#5B7CFA]',
        label: 'text-white',
        title: 'text-white',
      };
    }

    if (isLocked) {
      return {
        container: 'bg-[#F2F2F2] border-[#F2F2F2]',
        label: 'text-[#A8A8A8]',
        title: 'text-[#A8A8A8]',
      };
    }

    if (isPast && isAccessible) {
      return {
        container: 'bg-white border-[#5B7CFA]',
        label: 'text-[#5B7CFA]',
        title: 'text-[#222222]',
      };
    }

    if (isFuture && isAccessible) {
      return {
        container: 'bg-white border-[#5B7CFA]',
        label: 'text-[#5B7CFA]',
        title: 'text-[#222222]',
      };
    }

    return {
      container: 'bg-[#F2F2F2] border-[#F2F2F2]',
      label: 'text-[#A8A8A8]',
      title: 'text-[#A8A8A8]',
    };
  };

  const handleStepClick = (stepId: SmartScheduleStep) => {
    if (isLocked && stepId !== currentStep) return;
    if (stepId > maxAccessibleStep) return;

    onStepClick?.(stepId);
  };

  return (
    <div className="w-full bg-white px-4 py-3">
      <div className="flex w-full items-center">
        {STEPS.map((step, index) => {
          const style = getStepStyle(step.id);
          const isFirst = index === 0;
          const isLast = index === STEPS.length - 1;
          const isDisabled = isLocked ? step.id !== currentStep : step.id > maxAccessibleStep;

          return (
            <button
              key={step.id}
              type="button"
              disabled={isDisabled}
              onClick={() => handleStepClick(step.id)}
              aria-current={step.id === currentStep ? 'step' : undefined}
              className={`
                relative flex h-[42px] flex-1 flex-col items-center justify-center
                border-y border-r px-1 transition-all duration-150
                ${isFirst ? 'rounded-l-[6px] border-l' : '-ml-[10px] pl-[12px]'}
                ${isLast ? 'rounded-r-[6px] pr-1' : 'pr-[12px]'}
                ${style.container}
                ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'}
              `}
              style={{
                clipPath: isLast
                  ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 12px 50%)'
                  : isFirst
                    ? 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                    : 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)',
                zIndex: STEPS.length - index,
              }}
            >
              <span className={`text-[10px] font-semibold leading-[12px] ${style.label}`}>
                {step.label}
              </span>
              <span className={`mt-[1px] text-[11px] font-semibold leading-[13px] ${style.title}`}>
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}