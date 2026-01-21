'use client';

// Lightweight static preview matching the provided Figma design
// Shows 3-day columns with colored availability blocks.

const dayCols = [
  {
    label: '수', date: '5', blocks: [
      { color: '#c7d6ff' },
      { color: '#2a4bf4' },
      { color: '#2a4bf4' },
      { color: '#c7d6ff' },
      { color: '#c7d6ff' },
      { color: '#c7d6ff' },
      { color: '#c7d6ff' },
    ],
  },
  {
    label: '목', date: '6', blocks: [
      { color: '#c7d6ff' },
      { color: '#2a4bf4' },
      { color: '#2a4bf4' },
      { color: '#e9e9e9' },
      { color: '#e9e9e9' },
      { color: '#e9e9e9' },
      { color: '#c7d6ff' },
    ],
  },
  {
    label: '금', date: '7', blocks: [
      { color: '#c7d6ff' },
      { color: '#c7d6ff' },
      { color: '#c7d6ff' },
      { color: '#e9e9e9' },
      { color: '#6f90ff' },
      { color: '#6f90ff' },
      { color: '#e9e9e9' },
    ],
  },
];

export default function SmartScheduleCalendarPreview() {
  return (
    <div className="w-full rounded-[10px] bg-[#f6f6f6] p-3">
      {/* Header */}
      <div className="flex items-center justify-center text-center relative mb-3">
        <span className="text-[15px] font-medium text-[#1f1f1f]">2025년 11월</span>
        <span className="absolute right-0 text-[13px] text-gray-500">📅</span>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-3 text-center text-[14px] text-[#6e7781] mb-1">
        {dayCols.map(day => (
          <div key={day.label} className="flex flex-col items-center gap-0.5">
            <span className="leading-[20px]">{day.label}</span>
            <span className="text-[15px] leading-[20px] text-[#3b5cf6] font-medium">{day.date}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[40px_1fr] gap-2">
        {/* Time labels */}
        <div className="flex flex-col justify-between text-[14px] text-[#1f1f1f] leading-[20px] h-[360px] pt-1 pb-2">
          {['12', '13', '14', '15', '16', '17'].map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>

        {/* Columns */}
        <div className="grid grid-cols-3 gap-1">
          {dayCols.map(day => (
            <div key={day.label} className="flex flex-col gap-1">
              {day.blocks.map((block, idx) => (
                <div
                  key={idx}
                  className="h-[38px] w-full rounded-[2px] border border-white"
                  style={{ backgroundColor: block.color, borderStyle: 'dashed' }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
