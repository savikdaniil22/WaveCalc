import type { CalcResults, LinkParams } from '@/types/link'

export const calculateFspl = (distanceKm: number, frequencyMHz: number) =>
  20 * Math.log10(distanceKm) + 20 * Math.log10(frequencyMHz) + 32.44

export const calculateTotalLoss = (
  fsplDb: number,
  additionalLossDb: number,
) => fsplDb + additionalLossDb

export const calculateReceivedPower = (
  txPowerDbm: number,
  txGainDbi: number,
  rxGainDbi: number,
  totalLossDb: number,
) => txPowerDbm + txGainDbi + rxGainDbi - totalLossDb

export const calculateFadeMargin = (receivedPowerDbm: number, sensitivityDbm: number) =>
  receivedPowerDbm - sensitivityDbm

export const calculateFirstFresnelRadius = (distanceKm: number, frequencyMHz: number) => {
  const distanceM = distanceKm * 1000
  const wavelengthM = 300 / frequencyMHz
  return Math.sqrt((wavelengthM * distanceM) / 4)
}

export const dbmToMw = (dbm: number) => 10 ** (dbm / 10)

export const dbmToUv50 = (dbm: number) => {
  const pW = 10 ** ((dbm - 30) / 10)
  const vrms = Math.sqrt(pW * 50)
  return vrms * 1_000_000
}

const getQuality = (marginDb: number): CalcResults['quality'] => {
  if (marginDb < 0) return 'Ненадежный канал'
  if (marginDb < 10) return 'Связь нестабильна'
  return 'Надежный канал'
}

export const validateParams = (params: LinkParams) => {
  const errors: Partial<Record<keyof LinkParams, string>> = {}
  if (params.frequencyMHz <= 0) errors.frequencyMHz = 'Частота должна быть больше нуля.'
  if (params.distanceKm <= 0) errors.distanceKm = 'Дистанция должна быть больше нуля.'
  return errors
}

export const calculateLinkResults = (params: LinkParams): CalcResults => {
  const fsplDb = calculateFspl(params.distanceKm, params.frequencyMHz)
  const totalLossDb = calculateTotalLoss(
    fsplDb,
    params.additionalLossDb,
  )
  const receivedPowerDbm = calculateReceivedPower(
    params.txPowerDbm,
    params.txGainDbi,
    params.rxGainDbi,
    totalLossDb,
  )
  const fadeMarginDb = calculateFadeMargin(receivedPowerDbm, params.rxSensitivityDbm)
  const fresnelRadiusM = calculateFirstFresnelRadius(params.distanceKm, params.frequencyMHz)

  return {
    fsplDb,
    totalLossDb,
    receivedPowerDbm,
    fadeMarginDb,
    fresnelRadiusM,
    quality: getQuality(fadeMarginDb),
    dbmToMw: dbmToMw(receivedPowerDbm),
    dbmToUv50: dbmToUv50(receivedPowerDbm),
  }
}
