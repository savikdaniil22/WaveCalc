export interface LinkParams {
  frequencyMHz: number
  distanceKm: number
  txPowerDbm: number
  txGainDbi: number
  rxGainDbi: number
  cableLossDb: number
  connectorLossDb: number
  additionalLossDb: number
  rxSensitivityDbm: number
  obstacleHeightM: number
  towerHeightTxM: number
  towerHeightRxM: number
  txLat?: number
  txLon?: number
  rxLat?: number
  rxLon?: number
}

export interface CalcResults {
  fsplDb: number
  totalLossDb: number
  receivedPowerDbm: number
  fadeMarginDb: number
  fresnelRadiusM: number
  quality: 'Надежный канал' | 'Пограничный канал' | 'Ненадежный канал'
  dbmToMw: number
  dbmToUv50: number
  terrainSamples?: number[]
}
