'use client';

interface DeleteModalProps {
  title: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteModal({
  title,
  description,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-['Pretendard']">
      <div className="bg-white rounded-10 shadow-lg p-6 w-[280px] flex flex-col gap-4">
        {/* 타이틀 */}
        <h2 className="text-subtitle-sb text-gray-950">
          {title}
        </h2>

        {/* 설명 텍스트 (옵션) */}
        {description && (
          <p className="text-body-rg text-gray-600">
            {description}
          </p>
        )}

        {/* 버튼 그룹 */}
        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-md text-body-md font-medium text-gray-950 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            취소
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-md text-body-md font-medium text-white bg-point-red hover:brightness-90 disabled:opacity-50 transition-all flex items-center justify-center gap-1"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
