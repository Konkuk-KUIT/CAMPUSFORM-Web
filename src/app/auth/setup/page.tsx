// 프로필 설정 페이지
import ProfileSetupForm from '@/components/form/auth/ProfileSetupForm';
import Header from '@/components/Header';

export default function SetupPage() {
  return (
    <div>
      <Header title="프로필 설정" backTo="/auth/login" />
      <ProfileSetupForm />
    </div>
  );
}
