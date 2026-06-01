'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useCurrentProjectStore } from '@/store/currentProjectStore';

type TutorialStep = 1 | 2 | 3 | 4;

interface SmartScheduleTutorialOverlayProps {
  currentStep: TutorialStep;
  projectId?: number | null;
  onClose?: () => void;
}

interface HighlightBox {
  top: string;
  left: string;
  width: string;
  height: string;
  radius?: string;
}

interface MessageBox {
  top: string;
  left: string;
  width: string;
  align?: 'left' | 'center' | 'right';
}

interface TutorialContent {
  title: string;
  description?: string;
  subDescription?: string;
  highlight: HighlightBox;
  message: MessageBox;
  arrow?: {
    top: string;
    left: string;
    height: string;
    direction: 'up' | 'down';
  };
  bubble?: {
    top: string;
    left: string;
    width: string;
    text: string;
  };
}

const OUTER_BORDER_GAP = 8;

const TUTORIAL_CONTENTS: Record<TutorialStep, TutorialContent> = {
  1: {
    title: '원하는 단계를 눌러',
    description: '언제든 다시 수정할 수 있어요.',
    highlight: {
      top: '52px',
      left: '10px',
      width: '356px',
      height: '58px',
      radius: '8px',
    },
    message: {
      top: '154px',
      left: '56px',
      width: '260px',
      align: 'center',
    },
    arrow: {
      top: '116px',
      left: '187px',
      height: '28px',
      direction: 'down',
    },
  },
  2: {
    title: '시간대별로 가능 면접관을 확인할 수 있어요.',
    highlight: {
      top: '303px',
      left: '7px',
      width: '362px',
      height: '270px',
      radius: '12px',
    },
    message: {
      top: '267px',
      left: '36px',
      width: '300px',
      align: 'center',
    },
    bubble: {
      top: '444px',
      left: '142px',
      width: '136px',
      text: '운영진A (필수)\n운영진B',
    },
  },
  3: {
    title: '지원자에게 보낼 면접 시간 페이지를',
    description: '미리 보고 수정할 수 있어요.',
    subDescription:
      '지원자들이 제출한 시간을\n실시간으로 볼 수 있어요.\n\n단체 전화번호를 복사해\n링크를 한 번에 전송할 수 있어요.',
    highlight: {
      top: '362px',
      left: '16px',
      width: '343px',
      height: '132px',
      radius: '12px',
    },
    message: {
      top: '282px',
      left: '38px',
      width: '300px',
      align: 'center',
    },
    arrow: {
      top: '326px',
      left: '187px',
      height: '26px',
      direction: 'up',
    },
  },
  4: {
    title: '캠퍼스를 알고리즘이 찾아낸 최적의 시간표를 확인할 수 있어요.',
    description: '* 미배정자는 사유 확인 후 일정 직접 조절 가능',
    highlight: {
      top: '236px',
      left: '5px',
      width: '365px',
      height: '285px',
      radius: '18px',
    },
    message: {
      top: '164px',
      left: '28px',
      width: '320px',
      align: 'center',
    },
    arrow: {
      top: '206px',
      left: '187px',
      height: '22px',
      direction: 'down',
    },
  },
};

function GuideArrow({
  top,
  left,
  height,
  direction,
}: {
  top: string;
  left: string;
  height: string;
  direction: 'up' | 'down';
}) {
  const isUp = direction === 'up';

  return (
    <div
      className="absolute z-[5] pointer-events-none"
      style={{
        top,
        left,
        height,
      }}
    >
      <div className="h-full w-[1.5px] bg-white" />

      <div
        className={`absolute left-1/2 h-[9px] w-[9px] -translate-x-1/2 rotate-45 border-white ${
          isUp
            ? '-top-[1px] border-l-[1.5px] border-t-[1.5px]'
            : 'bottom-0 border-b-[1.5px] border-r-[1.5px]'
        }`}
      />
    </div>
  );
}

export default function SmartScheduleTutorialOverlay({
  currentStep,
  projectId: propProjectId,
  onClose,
}: SmartScheduleTutorialOverlayProps) {
  const router = useRouter();
  const storeProjectId = useCurrentProjectStore(s => s.projectId);
  const projectId = propProjectId ?? storeProjectId;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const completed = window.localStorage.getItem('smartScheduleTutorialCompleted');

    if (!completed) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const content = TUTORIAL_CONTENTS[currentStep];

  if (!content) return null;

  const shouldShowOuterBorder = currentStep !== 2 && currentStep !== 4;

  const goToStep = (step: TutorialStep) => {
    if (!projectId) return;

    const paths: Record<TutorialStep, string> = {
      1: `/smart-schedule/${projectId}/setting`,
      2: `/smart-schedule/${projectId}/interview-schedule`,
      3: `/smart-schedule/${projectId}/applicant`,
      4: `/smart-schedule/${projectId}/result`,
    };

    router.push(paths[step]);
  };

  const handlePrev = () => {
    if (currentStep <= 1) return;
    goToStep((currentStep - 1) as TutorialStep);
  };

  const handleNext = () => {
    if (currentStep >= 4) return;
    goToStep((currentStep + 1) as TutorialStep);
  };

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('smartScheduleTutorialCompleted', 'true');
    }

    setIsVisible(false);
    onClose?.();
  };

  const renderCommonMessage = () => {
    if (currentStep === 3) return null;

    return (
      <>
        {content.arrow && <GuideArrow {...content.arrow} />}

        <div
          className="absolute z-[5] pointer-events-none text-white"
          style={{
            top: content.message.top,
            left: content.message.left,
            width: content.message.width,
            textAlign: content.message.align ?? 'center',
          }}
        >
          <p className="whitespace-pre-line text-[13px] font-semibold leading-[19px] text-white">
            {content.title}
          </p>

          {content.description && (
            <p className="mt-1 whitespace-pre-line text-[12px] font-medium leading-[18px] text-white">
              {content.description}
            </p>
          )}

          {content.subDescription && (
            <p className="mt-8 whitespace-pre-line text-[12px] font-medium leading-[18px] text-white">
              {content.subDescription}
            </p>
          )}
        </div>
      </>
    );
  };

  const renderStep3Guide = () => {
    if (currentStep !== 3) return null;

    return (
      <>
        <div className="absolute left-[38px] top-[280px] z-[5] w-[300px] text-center text-white pointer-events-none">
          <p className="text-[13px] font-semibold leading-[19px]">
            지원자에게 보낼 면접 시간 페이지를
          </p>
          <p className="mt-1 text-[13px] font-semibold leading-[19px]">
            미리 보고 수정할 수 있어요.
          </p>
        </div>

        <GuideArrow top="326px" left="187px" height="26px" direction="up" />

        <GuideArrow top="504px" left="100px" height="32px" direction="down" />

        <div className="absolute left-[28px] top-[544px] z-[5] w-[160px] text-center text-white pointer-events-none">
          <p className="whitespace-pre-line text-[13px] font-semibold leading-[20px]">
            지원자들이 제출한 시간을{'\n'}실시간으로 볼 수 있어요.
          </p>
        </div>

        <GuideArrow top="504px" left="282px" height="32px" direction="down" />

        <div className="absolute left-[196px] top-[544px] z-[5] w-[165px] text-center text-white pointer-events-none">
          <p className="whitespace-pre-line text-[13px] font-semibold leading-[20px]">
            단체 전화번호를 복사해{'\n'}링크를 한 번에 전송할 수 있어요.
          </p>
        </div>
      </>
    );
  };

  const isFirst = currentStep === 1;
  const isLast = currentStep === 4;

  return (
    <div
      className="fixed inset-0 z-[9999] flex justify-center pointer-events-auto"
      onClick={event => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onTouchStart={event => {
        event.stopPropagation();
      }}
    >
      <div className="relative h-full w-93.75 overflow-hidden">
        {/* 안쪽: 실제 구멍 + dim */}
        <div
          className="absolute z-[1] bg-transparent pointer-events-none"
          style={{
            top: content.highlight.top,
            left: content.highlight.left,
            width: content.highlight.width,
            height: content.highlight.height,
            borderRadius: content.highlight.radius ?? '8px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.68)',
          }}
        />

        {/* 바깥쪽: Step 1, Step 3에서만 보이는 점선 테두리 */}
        {shouldShowOuterBorder && (
          <div
            className="absolute z-[4] border-[1.5px] border-dashed border-white bg-transparent pointer-events-none"
            style={{
              top: `calc(${content.highlight.top} - ${OUTER_BORDER_GAP}px)`,
              left: `calc(${content.highlight.left} - ${OUTER_BORDER_GAP}px)`,
              width: `calc(${content.highlight.width} + ${OUTER_BORDER_GAP * 2}px)`,
              height: `calc(${content.highlight.height} + ${OUTER_BORDER_GAP * 2}px)`,
              borderRadius: `calc(${content.highlight.radius ?? '8px'} + 6px)`,
            }}
          />
        )}

        {renderCommonMessage()}

        {renderStep3Guide()}

        {content.bubble && (
          <div
            className="absolute z-[5] rounded-[12px] bg-white px-4 py-3 text-center shadow-[0_8px_24px_rgba(0,0,0,0.18)] pointer-events-none"
            style={{
              top: content.bubble.top,
              left: content.bubble.left,
              width: content.bubble.width,
            }}
          >
            <p className="whitespace-pre-line text-[13px] font-medium leading-[24px] text-gray-950">
              {content.bubble.text}
            </p>
          </div>
        )}

        <div
          className="absolute bottom-[82px] left-0 right-0 z-[6] flex items-center justify-between px-5 pointer-events-auto"
          onClick={event => {
            event.stopPropagation();
          }}
          onTouchStart={event => {
            event.stopPropagation();
          }}
        >
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            className={`text-[19px] font-semibold text-white ${
              isFirst ? 'opacity-30' : 'opacity-100'
            }`}
          >
            ‹ 이전
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={handleClose}
              className="text-[19px] font-semibold text-white"
            >
              종료 ›
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="text-[19px] font-semibold text-white"
            >
              다음 ›
            </button>
          )}
        </div>
      </div>
    </div>
  );
}