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
  { key: 'txGainDbi', label: 'Коэф. усиления антенны TX (dBi)' },
  { key: 'rxGainDbi', label: 'Коэф. усиления антенны RX (dBi)' },
  { key: 'cableLossDb', label: 'Потери в кабеле (dB)', step: '0.1' },
  { key: 'connectorLossDb', label: 'Потери в разъемах (dB)', step: '0.1' },
  { key: 'additionalLossDb', label: 'Дополнительные потери (dB)', step: '0.1' },
  { key: 'rxSensitivityDbm', label: 'Чувствительность приемника (dBm)' },
  { key: 'towerHeightTxM', label: 'Высота мачты TX (м)' },
  { key: 'towerHeightRxM', label: 'Высота мачты RX (м)' },
  { key: 'obstacleHeightM', label: 'Высота препятствия (м)' },
  { key: 'txLat', label: 'Широта TX', step: '0.0001' },
  { key: 'txLon', label: 'Долгота TX', step: '0.0001' },
  { key: 'rxLat', label: 'Широта RX', step: '0.0001' },
  { key: 'rxLon', label: 'Долгота RX', step: '0.0001' },
]

const optionalCoordinateKeys: Array<keyof LinkParams> = ['txLat', 'txLon', 'rxLat', 'rxLon']

export const ParameterForm = () => {
  const params = useLinkStore((s) => s.params)
  const updateParam = useLinkStore((s) => s.updateParam)
  const reset = useLinkStore((s) => s.reset)
  const { errors } = useCalculations()

  return (
    <Card className="h-full">
      <CardTitle className="flex items-center gap-2">
        <Satellite size={16} />
        Модуль 1 - Ввод параметров
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
                value={params[field.key] ?? ''}
                onChange={(event) => {
                  const raw = event.target.value
                  if (optionalCoordinateKeys.includes(field.key) && raw === '') {
                    updateParam(field.key as 'txLat' | 'txLon' | 'rxLat' | 'rxLon', undefined)
                    return
                  }
                  updateParam(field.key, Number(raw))
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
