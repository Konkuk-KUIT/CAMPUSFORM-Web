"use client";

import { useMemo, useState } from "react";

interface ApplicationManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
}

interface Manager {
  id: number;
  name: string;
  email: string;
  isLeader?: boolean;
}

export default function ApplicationManageModal({
  isOpen,
  onClose,
  projectTitle,
}: ApplicationManageModalProps) {
  if (!isOpen) return null;

  const [status, setStatus] = useState("모집 중");
  const [managerInput, setManagerInput] = useState("");
  const [managers, setManagers] = useState<Manager[]>([
    { id: 1, name: "닉네임", email: "xxxxx@gmail.com", isLeader: true },
    { id: 2, name: "닉네임", email: "xxxxx@gmail.com" },
  ]);

  const managerCount = useMemo(() => managers.length, [managers]);

  const addManager = () => {
    if (!managerInput.trim()) return;
    setManagers((prev) => [
      ...prev,
      { id: Date.now(), name: managerInput.trim(), email: `${managerInput.trim()}@gmail.com` },
    ]);
    setManagerInput("");
  };

  const removeManager = (id: number) => {
    setManagers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-[375px] max-w-full h-[90vh] bg-gray-50 rounded-[16px] overflow-hidden flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        {/* Header */}
        <div className="relative flex items-center justify-center h-[52px] bg-white border-b border-gray-100">
          <span className="text-[15px] font-semibold text-gray-900">지원서 관리</span>
          <button
            onClick={onClose}
            className="absolute right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* 모집 상태 */}
          <div className="mb-5">
            <p className="text-[13px] font-medium text-gray-800 mb-2">모집 상태</p>
            <button
              className="w-full h-[44px] px-3 bg-white border border-gray-200 rounded-[10px] flex items-center justify-between text-[13px] text-gray-900"
              onClick={() => setStatus(status === "모집 중" ? "모집 완료" : "모집 중")}
            >
              <span>{status}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          {/* 구글폼 URL */}
          <div className="mb-5">
            <p className="text-[13px] font-medium text-gray-800 mb-2">구글폼 스프레드 시트 URL</p>
            <div className="w-full h-[44px] px-3 flex items-center rounded-[10px] bg-gray-100 text-[13px] text-gray-400">
              https://docs.google.com/spreadsheets...
            </div>
          </div>

          {/* 모집 기간 */}
          <div className="mb-5">
            <p className="text-[13px] font-medium text-gray-800 mb-2">모집 기간 설정</p>
            <div className="flex items-center gap-3 text-[13px] text-gray-800">
              <span className="flex items-center gap-1">
                2025-11-12
                <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <line x1="16" y1="3" x2="16" y2="7" />
                  <line x1="8" y1="3" x2="8" y2="7" />
                </svg>
              </span>
              <span className="text-gray-500">~</span>
              <span className="flex items-center gap-1">
                2025-11-14
                <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <line x1="16" y1="3" x2="16" y2="7" />
                  <line x1="8" y1="3" x2="8" y2="7" />
                </svg>
              </span>
            </div>
          </div>

          {/* 관리자 추가 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-medium text-gray-800">관리자 추가하기</p>
              <span className="text-[12px] text-gray-500">({managerCount}명)</span>
            </div>

            <div className="flex gap-2 mb-3">
              <input
                value={managerInput}
                onChange={(e) => setManagerInput(e.target.value)}
                placeholder="구글 계정을 입력해주세요"
                className="flex-1 h-[44px] px-3 border border-gray-200 rounded-[10px] text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary"
              />
              <button
                onClick={addManager}
                className="w-[60px] h-[44px] bg-primary text-white rounded-[10px] text-[13px] font-semibold hover:bg-blue-600 transition"
              >
                추가
              </button>
            </div>

            <div className="space-y-2">
              {managers.map((manager) => (
                <div
                  key={manager.id}
                  className="flex items-center justify-between bg-white border border-gray-100 rounded-[10px] px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-[36px] h-[36px] rounded-full bg-gray-200" />
                    <div className="flex flex-col text-[12px] text-gray-900 leading-tight">
                      <div className="flex items-center gap-1">
                        <span className="text-[13px] font-semibold">{manager.name}</span>
                        {manager.isLeader && (
                          <span className="px-1.5 h-[16px] text-[10px] text-primary border border-primary rounded-[4px] flex items-center justify-center">
                            대표
                          </span>
                        )}
                      </div>
                      <span className="text-gray-500">{manager.email}</span>
                    </div>
                  </div>

                  {!manager.isLeader && (
                    <button
                      onClick={() => removeManager(manager.id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="h-[60px] bg-white border-t border-gray-200 flex items-center justify-between px-6 text-[11px] text-gray-500">
          <span className="opacity-50">관리</span>
          <span className="opacity-50">서류</span>
          <span className="text-primary font-semibold">설정</span>
          <span className="opacity-50">면접</span>
          <span className="opacity-50">시간표</span>
        </div>
      </div>
    </div>
  );
}
