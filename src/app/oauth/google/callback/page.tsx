import GoogleOAuthCallbackContent from '@/components/auth/GoogleOAuthCallbackContent';

export default async function GoogleOAuthCallbackPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code = '' } = await searchParams;
  return <GoogleOAuthCallbackContent code={code} />;
}
