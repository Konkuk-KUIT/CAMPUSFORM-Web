// Updated filename to PascalCase

'use client';

export interface AppointmentInfoButtonProps {
  date?: string;
  time?: string;
  onClick: () => void;
}

export default function AppointmentInfoButton({ date, time, onClick }: AppointmentInfoButtonProps) {
  const displayText = date && time ? `${date} ${time}` : '--월 --일 (-) --:--';

  return (
    <button onClick={onClick} className="w-30.25 h-5 bg-blue-100 rounded-5 text-center">
      <p className="text-body-xs-rg text-black">{displayText}</p>
    </button>
  );
}
