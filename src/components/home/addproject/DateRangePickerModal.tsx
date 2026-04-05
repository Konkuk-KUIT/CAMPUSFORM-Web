'use client';

import { useState } from 'react';
import Image from 'next/image';
import Calendar from '@/components/home/Calendar';
import Button from '@/components/ui/Btn';

interface DateRangePickerModalProps {
  onClose: () => void;
  onConfirm: (startDate: Date | null, endDate: Date | null) => void;
  initialStartDate: Date | null;
  initialEndDate: Date | null;
}

export default function DateRangePickerModal({
  onClose,
  onConfirm,
  initialStartDate,
  initialEndDate,
}: DateRangePickerModalProps) {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);

  const handleDateChange = (date: Date | [Date | null, Date | null] | null) => {
    if (Array.isArray(date)) {
      const [start, end] = date;
      setStartDate(start);
      setEndDate(end);
    }
  };

  const handleConfirm = () => {
    onConfirm(startDate, endDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-75.75 flex flex-col">
        <div className="flex justify-between items-center pt-4 px-4">
          <h2 className="text-body-md">모집 기한 설정</h2>
          <button onClick={onClose} className="p-1 cursor-pointer hover:opacity-70 transition-opacity">
            <Image src="/icons/close.svg" alt="close" width={24} height={24} />
          </button>
        </div>

        <div className="px-3 py-4 flex-1 overflow-y-auto">
          <Calendar
            variant="modal"
            selected={startDate}
            onDateChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            disableTodayHighlight
            className="w-67.75"
          />
        </div>

        <div className="px-4 py-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full! h-12!"
            onClick={handleConfirm}
            disabled={!startDate || !endDate}
          >
            설정하기
          </Button>
        </div>
      </div>
    </div>
  );
}
