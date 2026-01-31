import ApplicantCountHeader from '@/components/interview/ApplicantCountHeader';
import Button from '@/components/ui/Btn';
import ApplicantMessageCard from '@/components/interview/ApplicantMessageCard';
import NotificationMessageForm from '@/components/ui/NotificationMessageForm';
import Link from 'next/link';

export default function InterviewPassedList() {
  return (
    <>
      <ApplicantCountHeader type="합격자" count={11} />
      <NotificationMessageForm type="합격자" />
      <ApplicantMessageCard type="합격자" />
      <Link href="/interview/complete" className="">
        <Button variant="primary" size="lg" className="fixed bottom-20">
          면접 마감하기
        </Button>
      </Link>
    </>
  );
}
