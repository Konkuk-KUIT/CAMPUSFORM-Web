import Navbar from '@/components/Navbar';

interface QuestionSectionProps {
  title: string;
  content: string;
  maxLength?: number;
}

export default function QuestionSection({ title, content, maxLength }: QuestionSectionProps) {
  return (
    <div className="mb-4">
      <h3 className="text-body-md text-black mb-1">
        {title}
        <br />
        {maxLength && <span className="text-body-sm">({maxLength}자)</span>}
      </h3>
      <div className="p-4 rounded-10 bg-gray-50">
        <p className="py-1 text-body-sm-rg text-gray-800 whitespace-pre-wrap">{content}</p>
      </div>
      <Navbar />
    </div>
  );
}
