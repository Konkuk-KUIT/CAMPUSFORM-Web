"use client";

import Schedule from "@/components/home/Schedule";
import ProfileCard from "@/components/ProfileCross";
import ProfileCardArrow from "@/components/Profile";
import ApplicantInterviewDetail from "@/components/InterviewDetail";
import ApplicantFileCard from "@/components/ApplicantFile";
import ApplicantInterviewCard from "@/components/ApplicantInterview";
import ApplicantSummaryCard from "@/components/ApplicantSummaryCard";
import ApplicantCardBasic from "@/components/ApplicantCardBasic";
import HomeOn from "@/components/home/HomeOn";
import HomeOff from "@/components/home/HomeOff";
import NotificationCard from "@/components/home/notification/NotificationCard";

export default function TestPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex justify-center py-10 font-['Pretendard']">
      {/* 375px 모바일 레이아웃 기준 나열 */}
      <div className="w-[375px] bg-white shadow-lg flex flex-col gap-8 pb-20 overflow-x-hidden">
        
        {/* 1. 공고 카드 섹션 (Home On/Off) */}
        <section className="flex flex-col items-center gap-4 pt-6">
          <HomeOn 
            title="요리퐁 6기 신입부원 모집"
            status="모집 중"
            dateRange="2023.11.01 - 2023.11.15"
            applicantCount={12}
          />
          <HomeOff 
            title="요리퐁 5기 부원 모집"
            status="모집 마감"
            dateRange="2022.11.01 - 2022.11.15"
            applicantCount={45}
          />
        </section>

        {/* 2. 지원자 상세 카드 섹션 (Basic / Interview) */}
        <section className="flex flex-col items-center gap-4">
          <ApplicantCardBasic 
            name="김민준" gender="남" status="합격" university="건국대학교"
            phone="010-1234-5678" email="minjun@gmail.com" commentCount={3}
          />
          <ApplicantInterviewDetail 
            name="이현지" gender="여" status="보류" university="연세대학교"
            phone="010-9876-5432" email="hyunji@yonsei.ac.kr"
            interviewDate="11월 15일 (수) 14:00" commentCount={5}
          />
        </section>

        {/* 3. 알림 카드 섹션 (New Applicant / Comment) */}
        <section className="flex flex-col border-y border-gray-100">
          <NotificationCard 
            type="applicant"
            title="요리퐁 6기 신입부원 모집"
            subContent="- 이현지 님의 지원서"
            content="새로운 지원서가 도착했습니다."
            timeAgo="방금 전"
            isUnread={true}
          />
          <NotificationCard 
            type="comment"
            title="댓글 알림"
            content="한상희 님이 댓글을 작성했어요."
            timeAgo="1분 전"
            isUnread={false}
          />
        </section>

        {/* 4. 리스트형 카드 섹션 (Interview / File / Summary) */}
        <section className="flex flex-col items-center gap-0 border-b border-gray-100">
          <ApplicantInterviewCard 
            name="박준영" info="중앙대 / 경영학과 / 홀서빙"
            status="면접 예정" interviewDate="11월 16일 (목) 15:00" commentCount={1}
          />
          <ApplicantFileCard 
            id="2"
            name="최수아" info="한양대 / 산업디자인과 / 매니저"
            initialStatus="보류" commentCount={0}
          />
          <ApplicantSummaryCard 
            name="김민준" university="건국대" major="컴퓨터공학과" role="요리사"
          />
        </section>

        {/* 5. 일정 및 프로필 섹션 */}
        <section className="flex flex-col items-center gap-4 px-4">
          <Schedule 
            title="요리퐁 6기 면접 일정"
            timeRange="오후 2:00 - 오후 2:30"
            initialChecked={false}
          />
          <Schedule 
            title="운영진 정기 회의"
            timeRange="오후 4:00 - 오후 5:00"
            initialChecked={true}
          />
          <ProfileCard 
            nickname="요리퐁마스터(X)"
            email="master@gmail.com"
          />
          <ProfileCardArrow 
            nickname="요리퐁마스터(Arrow)"
            email="master@gmail.com"
          />
        </section>

      </div>
    </main>
  );
}