import { useEffect, useState } from 'react'
import { RotateCcw, Satellite } from 'lucide-react'
import { useLinkStore } from '@/stores/useLinkStore'
import { useCalculations } from '@/hooks/useCalculations'
import { Button } from '@/ui/button'
import { Card, CardContent, CardTitle } from '@/ui/card'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import type { LinkParams } from '@/types/link'

const fields: Array<{ key: keyof LinkParams; label: string; step?: string }> = [
  { key: 'frequencyMHz', label: 'Частота (МГц)' },
  { key: 'distanceKm', label: 'Дистанция (км)', step: '0.1' },
  { key: 'txPowerDbm', label: 'Мощность передатчика (dBm)' },
  { key: 'txGainDbi', label: 'Усиление передающей антенны (dBi)' },
  { key: 'rxGainDbi', label: 'Усиление приёмной антенны (dBi)' },
  { key: 'additionalLossDb', label: 'Потери в линии передачи (dB)', step: '0.1' },
  { key: 'rxSensitivityDbm', label: 'Чувствительность приемника (dBm)' },
  { key: 'towerHeightTxM', label: 'Высота передающей антенны (м)' },
  { key: 'towerHeightRxM', label: 'Высота приёмной антенны (м)' },
  { key: 'obstacleHeightM', label: 'Высота препятствия (м)' },
]

const toDraftValues = (params: LinkParams): Record<keyof LinkParams, string> => ({
  frequencyMHz: String(params.frequencyMHz),
  distanceKm: String(params.distanceKm),
  txPowerDbm: String(params.txPowerDbm),
  txGainDbi: String(params.txGainDbi),
  rxGainDbi: String(params.rxGainDbi),
  additionalLossDb: String(params.additionalLossDb),
  rxSensitivityDbm: String(params.rxSensitivityDbm),
  obstacleHeightM: String(params.obstacleHeightM),
  towerHeightTxM: String(params.towerHeightTxM),
  towerHeightRxM: String(params.towerHeightRxM),
})

export const ParameterForm = () => {
  const params = useLinkStore((s) => s.params)
  const updateParam = useLinkStore((s) => s.updateParam)
  const reset = useLinkStore((s) => s.reset)
  const { errors } = useCalculations()
  const [draftValues, setDraftValues] = useState<Record<keyof LinkParams, string>>(() =>
    toDraftValues(params),
  )

  useEffect(() => {
    setDraftValues(toDraftValues(params))
  }, [params])

  return (
    <Card className="h-full">
      <CardTitle className="flex items-center gap-2">
        <Satellite size={16} />
        Ввод параметров
      </CardTitle>
      <CardContent>
        <div className="grid gap-3">
          {fields.map((field) => (
            <div key={field.key} className="grid gap-1.5">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                type="number"
                step={field.step ?? '1'}
                value={draftValues[field.key]}
                onChange={(event) => {
                  const raw = event.target.value
                  setDraftValues((prev) => ({ ...prev, [field.key]: raw }))
                  if (raw === '') return
                  const parsed = Number(raw)
                  if (Number.isNaN(parsed)) return
                  updateParam(field.key, parsed as LinkParams[typeof field.key])
                }}
              />
              {errors[field.key] && <p className="text-xs text-rose-400">{errors[field.key]}</p>}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Сбросить значения
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
