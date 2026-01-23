import ApplicantCountHeader from '@/components/interview/ApplicantCountHeader';
import Button from '@/components/Btn';
import ApplicantMessageCard from '@/components/interview/ApplicantMessageCard';
import NotificationMessageForm from '@/components/NotificationMessageForm';

export default function InterviewFailedList() {
  return (
    <>
      <ApplicantCountHeader type="불합격자" count={5} />
      <NotificationMessageForm type="불합격자" />
      <ApplicantMessageCard type="불합격자" />
      <div className="bg-gray-50">
        <Button variant="primary" size="lg" className="fixed bottom-20">
          면접 마감하기
        </Button>
      </div>
    </>
  );
}
