'use client';

interface InfoModalProps {
  description: string;
  onConfirm: () => void;
}

export default function InfoModal({
  description,
  onConfirm,
}: InfoModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="flex flex-col w-[330px] bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="mt-12 w-full pl-6">
          <p className="text-base font-medium text-gray-900 leading-snug whitespace-pre-line">
            {description}
          </p>
        </div>

        <div className="mt-auto flex justify-end w-full pb-3 pr-3 pt-8">
          <button 
            onClick={onConfirm}
            className="w-16 h-12 flex items-center justify-center text-base font-medium text-gray-900 hover:text-black transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
