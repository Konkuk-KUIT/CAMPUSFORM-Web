import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ManualCloseStore {
  closedProjectIds: number[];
  closeProject: (id: number) => void;
}

export const useManualCloseStore = create<ManualCloseStore>()(
  persist(
    (set) => ({
      closedProjectIds: [],
      closeProject: (id) =>
        set(state => ({
          closedProjectIds: state.closedProjectIds.includes(id)
            ? state.closedProjectIds
            : [...state.closedProjectIds, id],
        })),
    }),
    { name: 'manual-close-store' }
  )
);