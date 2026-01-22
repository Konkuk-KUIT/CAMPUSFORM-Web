'use client';

// 컴포넌트 테스트용 페이지

import Textbox from '@/components/Textbox';
import TextboxLarge from '@/components/TextboxLarge';
import Toggle from '@/components/Toggle';
import Checkbox from '@/components/Checkbox';
import Dropdown from '@/components/Dropdown';
import InputManager from '@/components/InputManager';
import InputTitle from '@/components/InputTitle';
import InputQna from '@/components/InputQna';
import SelectList from '@/components/SelectList';
import NameSort from '@/components/NameSort';
import RecruitStatus from '@/components/RecruitStatus';
import SelectModal from '@/components/SelectModal';
import SelectModalWide from '@/components/SelectModalWide';

export default function HyeonseungTest() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 pb-24">
      <div className="mb-4 text-lg font-semibold">Textbox</div>
      
      <div className="mb-4">기본 상태</div>
      <Textbox placeholder="이름 또는 닉네임을 입력하세요" />
      
      <div className="mb-4 mt-8">오류 상태</div>
      <Textbox 
        placeholder="이름 또는 닉네임을 입력하세요" 
        error={true}
        errorMessage="오류메시지"
      />

      <div className="mb-4 mt-12 text-lg font-semibold">TextboxLarge</div>
      
      <div className="mb-4">기본 상태</div>
      <TextboxLarge placeholder="내용을 입력하세요" />
      
      <div className="mb-4 mt-8">Filled 상태 (값 입력)</div>
      <TextboxLarge 
        placeholder="내용을 입력하세요"
        value="테스트 내용입니다"
      />
      
      <div className="mb-4 mt-8">Color 상태</div>
      <TextboxLarge 
        placeholder="내용을 입력하세요"
        color={true}
      />

      <div className="mb-4 mt-12 text-lg font-semibold">Dropdown</div>
      <Dropdown />
      
      <div className="mb-4 mt-12 text-lg font-semibold">Checkbox</div>
      <Checkbox label="체크박스 1" />

      <div className="mb-4 mt-12 text-lg font-semibold">Toggle</div>
      <Toggle />

      <div className="mb-4 mt-12 text-lg font-semibold">InputManager</div>
      <InputManager onSubmit={(value) => console.log('제출된 값:', value)} />

      <div className="mb-4 mt-12 text-lg font-semibold">InputTitle</div>
      <InputTitle />

      <div className="mb-4 mt-12 text-lg font-semibold">InputQna</div>
      <InputQna label="질문 내용" placeholder="질문 답변" />

      <div className="mb-4 mt-12 text-lg font-semibold">SelectList</div>
      <SelectList onChange={(value) => console.log('선택된 값:', value)} />

      <div className="mb-4 mt-12 text-lg font-semibold">NameSort</div>
      <div className="flex flex-col gap-4">
        <NameSort state="default">이름 오름차순</NameSort>
        <NameSort state="hover">이름 오름차순</NameSort>
        <NameSort state="pressed">이름 오름차순</NameSort>
      </div>

      <div className="mb-4 mt-12 text-lg font-semibold">RecruitStatus</div>
      <RecruitStatus onChange={(value) => console.log('선택된 상태:', value)} />
      
      <div className="mb-4 mt-12 text-lg font-semibold">SelectModal</div>
      <SelectModal 
        options={[
          { id: 'set', label: '설정하기' },
          { id: 'delete', label: '삭제하기' }
        ]}
        onChange={(value) => console.log('선택:', value)}
      />

      <div className="mb-4 mt-12 text-lg font-semibold">SelectModalWide</div>
      <SelectModalWide 
        options={[
          { id: 'name-asc', label: '이름 오름차순' },
          { id: 'name-desc', label: '이름 내림차순' },
          { id: 'star', label: '별표 순' }
        ]}
        onChange={(value) => console.log('선택:', value)}
      />
    </div>
  );
}