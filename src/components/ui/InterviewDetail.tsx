interface ApplicantCardProps {
  name: string;
  gender: string;
  status: "합격" | "보류" | "불합격";
  university: string;
  phone: string;
  email: string;
  interviewDate: string;
  commentCount?: number;
}

export default function ApplicantCard({
  name,
  gender,
  status,
  university,
  phone,
  email,
  interviewDate,
  commentCount = 0,
}: ApplicantCardProps) {
  
  const statusColors = {
    합격: "bg-point-green",
    보류: "bg-point-yellow",
    불합격: "bg-point-red",
  };

  return (
    <div className="relative w-[343px] h-[155px] bg-white border border-gray-100 rounded-[10px] overflow-hidden font-['Pretendard']">
      
      <div className="absolute top-[17px] left-[16px] w-[114px] h-[93px] flex flex-col justify-between">
        <h3 className="text-body-md font-semibold text-gray-950 whitespace-nowrap leading-[20px]">
          {name} / {gender}
        </h3>
        
        <div className="flex flex-col gap-[2px]">
          <p className="text-body-rg text-gray-950 whitespace-nowrap leading-[20px]">{university}</p>
          <p className="text-body-rg text-gray-950 whitespace-nowrap leading-[20px]">{phone}</p>
          <p className="text-body-rg text-gray-950 whitespace-nowrap leading-[20px]">{email}</p>
        </div>
      </div>

      <div className="absolute top-[19px] left-[100px] w-[51px] h-[19.5px] flex items-center gap-[4px] px-[5px] py-[1px] rounded-[10px] bg-gray-100">
        <span className={`w-[7px] h-[7px] rounded-full ${statusColors[status]}`} />
        <span className="text-body-xs-rg text-gray-950 leading-[17px]">
          {status}
        </span>
      </div>

      <div className="absolute top-[120px] left-[16px] flex items-center px-[8px] py-[2px] bg-blue-200 rounded-[4px]">
        <span className="text-body-xs-rg text-gray-950 whitespace-nowrap font-medium leading-[17px]">
          {interviewDate}
        </span>
      </div>

      <div className="absolute top-[16.5px] right-[16px] w-[24px] h-[24px] cursor-pointer">
        <img src="/icons/star-off.svg" alt="star" className="w-full h-full" />
      </div>

      <div className="absolute bottom-[16.5px] right-[16px] flex items-center gap-[6px] text-gray-300">
        <div className="w-[18px] h-[18px] flex items-center justify-center">
          <img src="/icons/comment.svg" alt="comment" className="w-full h-full" />
        </div>
        <span className="text-body-md text-gray-300 leading-none">
          {commentCount}
        </span> 
      </div>
      
    </div>
  );
}