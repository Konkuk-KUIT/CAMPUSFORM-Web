"use client";

interface NotificationCardProps {
  title: string;
  content: string;
  timeAgo: string;
  isUnread?: boolean;
}

export default function NotificationCard({
  title,
  content,
  timeAgo,
  isUnread = false,
}: NotificationCardProps) {
  return (
    <div 
      className={`w-[375px] h-[80px] border-t border-[#EFEFEF] flex flex-col font-['Pretendard'] cursor-pointer px-[20px] pt-[12px]
                  ${isUnread ? "bg-[#EFF3FF]" : "bg-white"}`}
    >
      <div className="flex items-center w-full">
        <div className={`w-[23px] h-[23px] ${isUnread ? "text-primary" : "text-gray-950"}`}>
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