import ApplicantCountHeader from '@/components/ui/ApplicantCountHeader';
import Button from '@/components/ui/Btn';
import NotificationMessageForm from '@/components/ui/NotificationMessageForm';

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
