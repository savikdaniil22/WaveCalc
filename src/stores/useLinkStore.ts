import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LinkParams } from '@/types/link'

const defaultParams: LinkParams = {
  frequencyMHz: 2400,
  distanceKm: 12,
  txPowerDbm: 20,
  txGainDbi: 17,
  rxGainDbi: 17,
  additionalLossDb: 5,
  rxSensitivityDbm: -80,
  obstacleHeightM: 10,
  towerHeightTxM: 30,
  towerHeightRxM: 30,
}

interface LinkState {
  params: LinkParams
  updateParam: <K extends keyof LinkParams>(key: K, value: LinkParams[K]) => void
  reset: () => void
}

export const useLinkStore = create<LinkState>()(
  persist(
    (set) => ({
      params: defaultParams,
      updateParam: (key, value) =>
        set((state) => ({
          params: { ...state.params, [key]: value },
        })),
      reset: () => set({ params: defaultParams }),
    }),
    {
      name: 'wavecalc-link-storage',
    },
  ),
)
