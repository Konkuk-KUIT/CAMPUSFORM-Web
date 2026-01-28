import Image from 'next/image';
import AppointmentInfoButton from '@/components/AppointmentInfoButton';

interface ApplicantCardProps {
  name: string;
  gender: string;
  status: '합격' | '보류' | '불합격';
  university: string;
  phone: string;
  email: string;
  commentCount?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  appointmentDate?: string;
  appointmentTime?: string;
  onAppointmentClick?: () => void;
}

export default function ApplicantCardBasic({
  name,
  gender,
  status,
  university,
  phone,
  email,
  commentCount = 0,
  isFavorite = false,
  onToggleFavorite,
  appointmentDate,
  appointmentTime,
  onAppointmentClick,
}: ApplicantCardProps) {
  const statusColors = {
    합격: 'bg-point-green',
    보류: 'bg-point-yellow',
    불합격: 'bg-point-red',
  };

  return (
    <div className="w-full bg-white border border-gray-100 rounded-10 p-4">
      {/* 상단: 이름, 성별, 상태 */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="whitespace-nowrap">
          <span className="text-body-md text-gray-950">{name}</span>
          <span className="text-body-rg text-gray-600"> / {gender}</span>
        </h3>

        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-10 bg-[#EFEFEF]">
          <span className={`w-1.75 h-1.75 rounded-full ${statusColors[status]}`} />
          <span className="text-body-xs-rg text-gray-950">{status}</span>
        </div>
      </div>

      {/* 중단: 지원자 정보 */}
      <div className="flex flex-col gap-0.5 text-body-rg text-gray-950">
        <p>{university}</p>
        <p>{phone}</p>
        <p>{email}</p>
      </div>

      {/* 하단: 면접 일정 + 댓글/즐겨찾기 */}
      {onAppointmentClick && (
        <div className="flex items-center justify-between mt-2">
          <AppointmentInfoButton
            date={appointmentDate}
            time={appointmentTime}
            onClick={onAppointmentClick}
          />

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-gray-300">
              <Image src="/icons/comment.svg" alt="댓글" width={14} height={14} />
              <span className="text-body-xs">{commentCount}</span>
            </div>

            <button onClick={onToggleFavorite} className="shrink-0">
              <Image
                src={isFavorite ? '/icons/star.svg' : '/icons/star-off.svg'}
                alt="즐겨찾기"
                width={18}
                height={18}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}