import ApplicantCountHeader from '@/components/ui/ApplicantCountHeader';
import Button from '@/components/ui/Btn';
import NotificationMessageForm from '@/components/ui/NotificationMessageForm';
import ApplicantMessageCard from '@/components/document/ApplicantMessageCard';
import Link from 'next/link';

export default function DocumentPassedList() {
  return (
    <>
      <ApplicantCountHeader type="합격자" />
      <NotificationMessageForm type="합격자" />
      <ApplicantMessageCard type="합격자" />
      <Link href="/document/complete" className="">
        <Button variant="primary" size="lg" className="fixed bottom-20">
          서류 마감하기
        </Button>
      </Link>
    </>
  );
}
