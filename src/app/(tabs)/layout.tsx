import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import FrapButton from '@/components/layout/FrapButton';

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f2f0eb] relative w-full">
      <Navbar />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 pb-[100px] lg:pb-16">
        {children}
      </main>
      <FrapButton />
      <BottomNav />
    </div>
  );
}
