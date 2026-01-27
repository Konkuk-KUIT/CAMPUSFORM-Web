"use client";

interface CommentProps {
  title: string;
  content: string;
  timeAgo: string;
  isUnread?: boolean;
}

export default function Comment({
  title,
  content,
  timeAgo,
  isUnread = false,
}: CommentProps) {
  return (
    <div 
      className={`w-[375px] h-[80px] border-t border-gray-100 flex flex-col font-['Pretendard'] cursor-pointer px-[20px] pt-[12px]
                  ${isUnread ? "bg-blue-50" : "bg-white"}`}
    >
      <div className="flex items-center w-full">
        <div className={`w-[23px] h-[23px] flex-shrink-0 flex items-center justify-center ${isUnread ? "text-primary" : "text-gray-950"}`}>
          <img 
            src={isUnread ? "/icons/newapplicant-blue.svg" : "/icons/newapplicant.svg"}
            alt="new applicant" 
            className={`w-full h-full ${isUnread ? "" : "grayscale"}`} 
          />
        </div>

        <h4 className="ml-[8px] text-body-sm text-gray-950 flex-1">
          {title}
        </h4>

        <span className="text-body-sm text-gray-500">
          {timeAgo}
        </span>
      </div>

      <div className="ml-[50px] mt-[2px]">
        <p className="text-body-md text-gray-950 leading-[21px]">
          {content}
        </p>
      </div>
    </div>
  );
}