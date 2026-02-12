'use client';

import { useState } from 'react';
import Image from 'next/image';
import Calendar from '@/components/home/Calendar';

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

  const handleClose = () => {
    onConfirm(startDate, endDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-75.75">
        <div
          className="flex justify-between items-center pt-4 px-4
"
        >
          <h2 className="text-body-md">모집 기한 설정</h2>
          <button onClick={handleClose}>
            <Image src="/icons/close.svg" alt="close" width={24} height={24} />
          </button>
        </div>
        <div className="p-3">
          <Calendar
            selected={startDate}
            onDateChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            disableTodayHighlight
            className="w-67.75"
          />
        </div>
      </div>
    </div>
  );
}
