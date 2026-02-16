import ConnectForm from '@/components/home/addproject/ConnectForm';

export default async function ConnectPage({ searchParams }: { searchParams: Promise<{ sheetUrl?: string }> }) {
  const { sheetUrl = '' } = await searchParams;
  return <ConnectForm sheetUrl={sheetUrl} />;
}
