export interface LinkParams {
  frequencyMHz: number
  distanceKm: number
  txPowerDbm: number
  txGainDbi: number
  rxGainDbi: number
  additionalLossDb: number
  rxSensitivityDbm: number
  obstacleHeightM: number
  towerHeightTxM: number
  towerHeightRxM: number
}

export interface CalcResults {
  fsplDb: number
  totalLossDb: number
  receivedPowerDbm: number
  fadeMarginDb: number
  fresnelRadiusM: number
  quality:
    | 'Связь невозможна'
    | 'Критически низкий запас'
    | 'Допустимый уровень устойчивости'
    | 'Устойчивый канал связи'
  terrainSamples?: number[]
}
