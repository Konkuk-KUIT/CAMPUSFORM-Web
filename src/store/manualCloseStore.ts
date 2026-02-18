import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ManualCloseStore {
  closedProjectIds: number[];
  openedProjectIds: number[];
  closeProject: (id: number) => void;
  openProject: (id: number) => void;
}

export const useManualCloseStore = create<ManualCloseStore>()(
  persist(
    (set) => ({
      closedProjectIds: [],
      openedProjectIds: [], // 추가
      closeProject: (id) =>
        set((state) => ({
          closedProjectIds: [...state.closedProjectIds, id],
          openedProjectIds: state.openedProjectIds.filter((v) => v !== id), // 추가
        })),
      openProject: (id) =>
        set((state) => ({
          openedProjectIds: [...state.openedProjectIds, id], // 추가
          closedProjectIds: state.closedProjectIds.filter((v) => v !== id),
        })),
    }),
    { name: 'manual-close-store' }
  )
);