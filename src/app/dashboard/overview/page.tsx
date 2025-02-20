import { auth } from '@/auth';
import PageContainer from '@/components/layout/page-container';

export default async function OverViewPage() {
  const session = await auth();

  return (
    <PageContainer>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          Hoş Geldiniz, {session?.user.name}
        </h1>
        <h2 className="text-1xl font-bold">Genel Bakış Sayfası</h2>

        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </PageContainer>
  );
}
