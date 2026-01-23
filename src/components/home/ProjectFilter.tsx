"use client";

import CheckBox from "../Checkbox";

interface ProjectFilterProps {
  isOnlyRecruiting: boolean;
  onChange: (checked: boolean) => void;
}

export default function ProjectFilter({ isOnlyRecruiting, onChange }: ProjectFilterProps) {
  return (
    <div className="flex w-full items-center justify-end px-4 mt-[12px] mb-2">
      <CheckBox 
        checked={isOnlyRecruiting} 
        onChange={onChange}
        label="모집 중만 보기" 
      />
    </div>
  );
}