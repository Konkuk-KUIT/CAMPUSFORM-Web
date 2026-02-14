import InterviewInfoSettingForm from '@/components/form/InterviewInfoSettingForm';
import ProjectIdSetter from '@/components/ProjectIdSetter';

export default function InterviewInfoSettingPage({ params }: { params: { projectId: string } }) {
  return (
    <>
      <ProjectIdSetter projectId={Number(params.projectId)} />
      <InterviewInfoSettingForm />
    </>
  );
}
