'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '@/components/ui/Btn';
import TextboxLarge from '@/components/ui/TextboxLarge';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';

interface NotificationMessageFormProps {
  type?: '합격자' | '불합격자';
  onTemplateApply?: (template: string, isVariableEnabled: boolean) => void;
}

export default function NotificationMessageForm({ type = '합격자', onTemplateApply }: NotificationMessageFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [template, setTemplate] = useState('');
  const [isVariableEnabled, setIsVariableEnabled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);

  const title = type === '합격자' ? '합격자 문자 템플릿 입력' : '불합격자 문자 템플릿 입력';
  const modalTitle = type === '합격자' ? '합격자' : '불합격자';

  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    // 템플릿이 변경되면 변수 적용 상태를 리셋
    setIsVariableEnabled(false);
  };

  const handleApplyVariables = () => {
    setIsVariableEnabled(true);
    // 변수 적용하기를 누르면 바로 상위로 전달
    if (onTemplateApply) {
      onTemplateApply(template, true);
    }
  };

  const handleApplyTemplate = () => {
    if (onTemplateApply) {
      onTemplateApply(template, isVariableEnabled);
    }
  };

  // contentEditable에서 텍스트 변경 처리
  const handleEditableInput = () => {
    if (editableRef.current) {
      const text = editableRef.current.innerText;
      setTemplate(text);
    }
  };

  // 변수 부분을 하이라이트하는 함수
  const renderHighlightedHTML = () => {
    if (!template) return '';

    let html = template
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
    
    // @이름, @포지션을 파랑색 span으로 감싸기
    html = html.replace(
      /([@＠]이름|[@＠]포지션)/g,
      '<span style="color: #3B82F6;">$1</span>'
    );
    
    return html;
  };

  // 변수 적용 시 contentEditable 내용 업데이트
  useEffect(() => {
    if (isVariableEnabled && editableRef.current && template) {
      editableRef.current.innerHTML = renderHighlightedHTML();
    }
  }, [isVariableEnabled, template]);

  // contentEditable 스타일 (TextboxLarge와 동일)
  const getEditableStyles = () => {
    if (isFocused) {
      return 'bg-white border-primary border-1.5';
    }
    if (template) {
      return 'bg-white border-gray-100 border';
    }
    return 'bg-gray-100 border-gray-200 border-0.5';
  };

  return (
    <div className="flex flex-col gap-2 mt-3">
      <div className="flex items-center gap-1">
        <span className="text-subtitle-sm-md">{title}</span>
        <Image
          src={'/icons/info.svg'}
          alt="정보"
          width={18}
          height={18}
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer"
        />
      </div>
      {/* 템플릿 모달창 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="font-normal text-[15px] leading-5.75 text-black">
          <p className="mb-4">이 템플릿은 두 가지 방식으로 사용할 수 있어요.</p>

          <div className="mb-4">
            <h3 className="text-primary font-medium text-[15px] leading-5.75 mb-2">동일 문자 일괄 전송</h3>
            <ol className="list-decimal list-inside font-normal text-[15px] leading-5.75 text-black">
              <li>상단 {modalTitle} 명단의 &apos;전화번호 복사하기&apos;</li>
              <li>텔플릿 하단 &apos;템플릿 복사하기&apos;</li>
              <li>문자 앱에서 전체에게 동일하게 전송</li>
            </ol>
          </div>

          <div>
            <h3 className="text-primary font-medium text-[15px] leading-5.75 mb-2">자동 치환 개별 전송</h3>
            <ol className="list-decimal list-inside font-normal text-[15px] leading-5.75 text-black">
              <li>
                템플릿에 <span className="font-semibold">@이름</span>, <span className="font-semibold">@포지션</span>{' '}
                변수 입력
              </li>
              <li>&apos;변수 적용하기&apos;로 개인별 문자를 생성</li>
              <li>&apos;변수 복사하기&apos;, &apos;문자 복사하기&apos;로 문자 앱에서 개별 전송</li>
            </ol>
          </div>
        </div>
      </Modal>

      {/* 합격자/불합격자 문자 템플릿 입력 */}
      {!isVariableEnabled ? (
        // 변수 적용 전: 일반 TextboxLarge
        <TextboxLarge 
          placeholder="문자 내용을 입력하세요. @이름과 @포지션 변수를 사용하면 개인별 문자 생성이 가능합니다."
          value={template}
          onChange={handleTemplateChange}
        />
      ) : (
        // 변수 적용 후: contentEditable div (TextboxLarge 스타일 매칭)
        <div className="relative">
          <div
            ref={editableRef}
            contentEditable
            onInput={handleEditableInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-85.75 h-41.25 p-4 rounded-10 outline-none resize-none transition-colors text-body-sm-rg text-gray-950 shadow-[2px_2px_20px_0px_rgba(0,0,0,0.03)] ${getEditableStyles()}`}
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowY: 'auto',
            }}
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{ __html: renderHighlightedHTML() }}
          />
          {template && (
            <span className="absolute bottom-4 right-4 text-10 text-gray-200">자동저장됨</span>
          )}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button 
          variant="neutral" 
          size="sm"
          onClick={handleApplyVariables}
        >
          변수 적용하기
        </Button>
        <Button 
          variant="neutral" 
          size="sm"
          onClick={handleApplyTemplate}
        >
          템플릿 복사하기
        </Button>
      </div>
    </div>
  );
}