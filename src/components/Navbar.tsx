'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ResultSelectionModal from '@/components/ui/ResultSelectionModal';
import { useCurrentProjectStore } from '@/store/currentProjectStore';

export default function Navbar() {
  const pathname = usePathname();
  const projectId = useCurrentProjectStore(s => s.projectId);

  const isManage = pathname.startsWith('/manage');
  const isDocument = pathname.startsWith('/document');
  const isInterview = pathname.startsWith('/interview');
  const isSchedule = pathname.startsWith('/schedule') || pathname.startsWith('/smart-schedule');
  const isResult = pathname.startsWith('/result');

  const [isResultOpen, setIsResultOpen] = useState(false);

  // ← 추가: projectId가 있으면 해당 경로로, 없으면 기본 경로로
  const documentHref = projectId ? `/document/${projectId}` : '/document';
  const interviewHref = projectId ? `/interview/${projectId}` : '/interview';

  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full h-16.25 bg-white z-50 text-10">
        <div className="relative h-full">
          <div className="grid grid-cols-5 items-center h-full mx-auto w-fit">
            <Link href="/manage" className="flex flex-col items-center gap-2.25 px-6 py-2.25">
              <Image src={isManage ? '/icons/tool.svg' : '/icons/tool-off.svg'} alt="관리" width={24} height={24} />
              <span className={isManage ? 'text-black' : 'text-gray-500'}>관리</span>
            </Link>

            <Link href={documentHref} className="flex flex-col items-center gap-2.25 px-6 py-2.25">  {/* ← 수정 */}
              <Image src={isDocument ? '/icons/document.svg' : '/icons/document-off.svg'} alt="서류" width={24} height={24} />
              <span className={isDocument ? 'text-black' : 'text-gray-500'}>서류</span>
            </Link>
            <div />

            <Link href={interviewHref} className="flex flex-col items-center gap-2.25 px-6 py-2.25">  {/* ← 수정 */}
              <Image src={isInterview ? '/icons/interview.svg' : '/icons/interview-off.svg'} alt="면접" width={24} height={24} />
              <span className={isInterview ? 'text-black' : 'text-gray-500'}>면접</span>
            </Link>

            <Link href="/smart-schedule" className="flex flex-col items-center gap-2.25 px-6 py-2.25">
              <Image src={isSchedule ? '/icons/schedule.svg' : '/icons/schedule-off.svg'} alt="시간표" width={24} height={24} />
              <span className={isSchedule ? 'text-black' : 'text-gray-500'}>시간표</span>
            </Link>
          </div>

          <button onClick={() => setIsResultOpen(true)} className="absolute left-1/2 -translate-x-1/2 -top-1 flex flex-col items-center">
            <div className="w-17.25 h-17.25 rounded-full bg-primary flex flex-col items-center justify-center">
              <Image src={isResult ? '/icons/result.svg' : '/icons/result-off.svg'} alt="결과" width={24} height={24} />
              <span className="mt-1 text-white">결과</span>
            </div>
          </button>
        </div>
      </nav>
      <ResultSelectionModal isOpen={isResultOpen} onClose={() => setIsResultOpen(false)} />
    </>
  );
}