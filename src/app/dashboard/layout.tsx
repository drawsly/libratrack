import { auth } from '@/auth';
import KBar from '@/shared/components/kbar';
import AppSidebar from '@/shared/components/layout/app-sidebar';
import Header from '@/shared/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { SessionProvider } from 'next-auth/react';
import { cookies } from 'next/headers';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <SessionProvider session={session}>
      <KBar>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </KBar>
    </SessionProvider>
  );
}
