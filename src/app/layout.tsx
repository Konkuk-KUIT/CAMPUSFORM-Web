import Navbar from '@/components/Navbar';
import '@/style/globals.css';
import localFont from 'next/font/local';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={pretendard.className}>
        {' '}
        <div className="w-full max-w-93.75 mx-auto min-h-screen bg-white pb-20">{children}</div>        
        <Navbar />
      </body>
    </html>
  );
}
