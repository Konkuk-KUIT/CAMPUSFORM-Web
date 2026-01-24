import ApplicantCountHeader from '@/components/ApplicantCountHeader';
import Button from '@/components/Btn';
import ApplicantMessageCard from '@/components/document/ApplicantMessageCard';
import NotificationMessageForm from '@/components/NotificationMessageForm';
import Link from 'next/link';

export default function DocumentPassedList() {
  return (
    <>
      <ApplicantCountHeader />
      <NotificationMessageForm />
      <ApplicantMessageCard />
      <Link href="/document/complete" className="">
        <Button variant="primary" size="lg" className="fixed bottom-20">
          서류 마감하기
        </Button>
      </Link>
    </>
  );
}
