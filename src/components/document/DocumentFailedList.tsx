import ApplicantCountHeader from '@/components/ApplicantCountHeader';
import Button from '@/components/Btn';
import NotificationMessageForm from '@/components/NotificationMessageForm';

export default function DocumentFailedList() {
  return (
    <>
      <ApplicantCountHeader />
      <NotificationMessageForm />
      <div className="bg-gray-50">
        <Button variant="primary" size="lg" className="fixed bottom-20">
          서류 마감하기
        </Button>
      </div>
    </>
  );
}
