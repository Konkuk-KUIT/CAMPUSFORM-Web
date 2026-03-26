import Navbar from '@/components/Navbar';

interface QuestionSectionProps {
  title: string;
  content: string;
  maxLength?: number;
}

export default function QuestionSection({ title, content, maxLength }: QuestionSectionProps) {
  return (
    <div className="py-1">
      <h3 className="text-gray-950 text-[14px] font-medium leading-[20px] [font-variant-numeric:lining-nums_proportional-nums] [font-feature-settings:'dlig'_on] mb-[5px] w-[290px] mx-auto">
        {title}
        <br />
        {maxLength && <span className="text-body-sm">({maxLength}자)</span>}
      </h3>
      <div className="w-[310px] rounded-10 bg-[#F3F4F8] pt-[15px] pr-[16px] pb-[15px] pl-[16px]">
        <p className="text-gray-600 text-[13px] font-normal leading-[22px] tracking-[1%] [font-variant-numeric:lining-nums_proportional-nums] whitespace-pre-wrap">{content}</p>
      </div>
      <Navbar />
    </div>
  );
}
