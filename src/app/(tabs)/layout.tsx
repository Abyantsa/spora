import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col pb-[74px] lg:pb-0 relative">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
