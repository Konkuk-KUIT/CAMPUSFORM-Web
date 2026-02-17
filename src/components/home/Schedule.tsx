"use client";
import { useState } from "react";
import Image from "next/image";
interface ScheduleProps {
  title: string;
  timeRange: string;
  initialChecked?: boolean;
}

export default function Schedule({ title, timeRange, initialChecked = false }: ScheduleProps) {
  const [isChecked, setIsChecked] = useState(initialChecked);
  return (
    <div
    onClick={() => setIsChecked(!isChecked)}
    className="w-[311px] min-h-[54px] bg-blue-50 rounded-[10px] flex items-center gap-[14px] px-[6px] py-2">
      <div className="w-[7px] h-[38px] bg-primary rounded-[10px] flex-shrink-0" />

      <div className="flex flex-col flex-1 min-w-0">
        <h4 className="text-body-rg text-gray-950">
          {title}
        </h4>
        <p className="text-body-xs-rg text-gray-500">
          {timeRange}
        </p>
      </div>

      <div className="w-[20px] h-[20px] flex items-center justify-center flex-shrink-0">
        {isChecked ? (
          <Image 
            src="/icons/checked.svg" 
            alt="checked" 
            width={20} 
            height={20} 
            className="transition-transform duration-200 scale-110"
          />
        ) : (
          <Image 
            src="/icons/unchecked.svg" 
            alt="unchecked" 
            width={20} 
            height={20} 
            className="transition-transform duration-200"
          />
        )}
      </div>
    </div>
  );
}