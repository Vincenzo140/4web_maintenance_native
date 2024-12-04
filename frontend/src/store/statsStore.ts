import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StatsState {
  visitCount: number;
  incrementVisits: () => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      visitCount: 0,
      incrementVisits: () => set((state) => ({ visitCount: state.visitCount + 1 })),
    }),
    {
      name: 'dashboard-stats',
    }
  )
);