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
  bubble?: {
    top: string;
    left: string;
    width: string;
    text: string;
  };
}

const TUTORIAL_CONTENTS: Record<TutorialStep, TutorialContent> = {
  1: {
    title: '원하는 단계를 눌러',
    description: '언제든 다시 수정할 수 있어요.',
    highlight: {
      top: '57px',
      left: '14px',
      width: '346px',
      height: '48px',
      radius: '8px',
    },
    message: {
      top: '148px',
      left: '56px',
      width: '260px',
      align: 'center',
    },
  },
  2: {
    title: '시간대별로 가능 면접관을 확인할 수 있어요.',
    highlight: {
      top: '306px',
      left: '9px',
      width: '360px',
      height: '270px',
      radius: '12px',
    },
    message: {
      top: '246px',
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
      top: '373px',
      left: '16px',
      width: '343px',
      height: '110px',
      radius: '8px',
    },
    message: {
      top: '320px',
      left: '42px',
      width: '288px',
      align: 'center',
    },
  },
  4: {
    title: '배정된 면접 시간을 확인할 수 있어요.',
    description: '미배정자는 사유 확인 후 완전 직접 조정 가능',
    highlight: {
      top: '242px',
      left: '8px',
      width: '363px',
      height: '320px',
      radius: '10px',
    },
    message: {
      top: '186px',
      left: '28px',
      width: '320px',
      align: 'center',
    },
  },
};

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
        <div
          className="absolute border border-dashed border-white bg-transparent pointer-events-none"
          style={{
            top: content.highlight.top,
            left: content.highlight.left,
            width: content.highlight.width,
            height: content.highlight.height,
            borderRadius: content.highlight.radius ?? '8px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.68)',
          }}
        />

        <div
          className="absolute pointer-events-none text-white"
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
            <p
              className={`whitespace-pre-line text-[12px] font-medium leading-[18px] text-white ${
                currentStep === 3 ? 'mt-[150px]' : 'mt-8'
              }`}
            >
              {content.subDescription}
            </p>
          )}
        </div>

        {content.bubble && (
          <div
            className="absolute rounded-[12px] bg-white px-4 py-3 text-center shadow-[0_8px_24px_rgba(0,0,0,0.18)] pointer-events-none"
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
          className="absolute bottom-[82px] left-0 right-0 flex items-center justify-between px-5 pointer-events-auto"
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