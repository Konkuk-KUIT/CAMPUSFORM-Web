import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ManualCloseStore {
  closedProjectIds: number[];
  closeProject: (id: number) => void;
  openProject: (id: number) => void;
}

export const useManualCloseStore = create<ManualCloseStore>()(
  persist(
    (set) => ({
      closedProjectIds: [],
      closeProject: (id) =>
        set((state) => ({ closedProjectIds: [...state.closedProjectIds, id] })),
      openProject: (id) =>
        set((state) => ({ closedProjectIds: state.closedProjectIds.filter((v) => v !== id) })),
    }),
    { name: 'manual-close-store' }
  )
);