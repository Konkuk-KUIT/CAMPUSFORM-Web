import DocumentContent from '@/components/document/DocumentContent';
import DocumentHeader from '@/components/ui/DocumentHeader';
import Navbar from '@/components/Navbar';

// 서류 지원자 관리 페이지
export default function DocumentListPage() {
  return (
    <div className="">
      <DocumentHeader />
      <div className="">
        <DocumentContent />
      </div>
      <Navbar />
    </div>
  );
}
