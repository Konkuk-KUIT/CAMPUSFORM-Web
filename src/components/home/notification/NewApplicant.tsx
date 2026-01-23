"use client";

interface NotificationCardProps {
  title: string;
  subContent?: string; 
  content: string;
  timeAgo: string;
  isUnread?: boolean;
}

export default function NotificationCard({
  title,
  subContent,
  content,
  timeAgo,
  isUnread = false,
}: NotificationCardProps) {
  return (
    <div 
      className={`w-[375px] min-h-[80px] border-t border-gray-100 flex flex-col font-['Pretendard'] cursor-pointer px-[20px] pt-[12px] pb-[12px]
                  ${isUnread ? "bg-blue-50" : "bg-white"}`}
    >
      <div className="flex items-center w-full">
        <div className={`w-[23px] h-[23px] flex-shrink-0 ${isUnread ? "text-primary" : "text-gray-950"}`}>
          <img 
            src={isUnread ? "/icons/comment-blue.svg" : "/icons/comment.svg"} 
            alt="icon" 
            className="w-full h-full" 
          />
        </div>

        <h4 className="ml-[8px] text-body-sm text-gray-950 flex-1">
          {title}
        </h4>

        <span className="text-body-sm text-gray-500">
          {timeAgo}
        </span>
      </div>

      <div className="ml-[50px] mt-[2px] flex flex-col gap-[2px]">
        {subContent && (
          <p className="text-body-md text-gray-500">
            {subContent}
          </p>
        )}
        
        <p className="text-body-md text-gray-950 leading-[21px]">
          {content}
        </p>
      </div>
    </div>
  );
}