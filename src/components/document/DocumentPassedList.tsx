import ApplicantCountHeader from '@/components/ui/ApplicantCountHeader';
import Button from '@/components/ui/Btn';
import ApplicantMessageCard from '@/components/document/ApplicantMessageCard';
import NotificationMessageForm from '@/components/ui/NotificationMessageForm';
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
