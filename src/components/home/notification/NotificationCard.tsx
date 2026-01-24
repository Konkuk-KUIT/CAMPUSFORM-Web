"use client";

type NotificationType = 'applicant' | 'comment';

interface NotificationCardProps {
  type: NotificationType;     
  title: string;
  subContent?: string;       
  content: string;
  timeAgo: string;
  isUnread?: boolean;
}

export default function NotificationCard({
  type,
  title,
  subContent,
  content,
  timeAgo,
  isUnread = false,
}: NotificationCardProps) {

  const getIconSrc = () => {
    if (type === 'applicant') {
      return isUnread ? "/icons/newapplicant-blue.svg" : "/icons/newapplicant.svg";
    }
    return isUnread ? "/icons/comment-blue.svg" : "/icons/comment.svg";
  };

  const iconClassName = type === 'applicant' && !isUnread ? "w-full h-full grayscale" : "w-full h-full";

  return (
    <div 
      className={`w-[375px] min-h-[80px] border-t border-gray-100 flex flex-col font-['Pretendard'] cursor-pointer px-[20px] py-[12px]
                  ${isUnread ? "bg-blue-50" : "bg-white"}`}
    >
      <div className="flex items-center w-full">
        <div className={`w-[23px] h-[23px] flex-shrink-0 flex items-center justify-center ${isUnread ? "text-primary" : "text-gray-950"}`}>
          <img 
            src={getIconSrc()}
            alt={type} 
            className={iconClassName} 
          />
        </div>

        <h4 className="ml-[8px] text-body-sm text-gray-950 flex-1 font-bold">
          {title}
        </h4>

        <span className="text-body-sm text-gray-500 flex-shrink-0">
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