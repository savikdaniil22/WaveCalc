import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AlertTriangle, CheckCircle2, CircleX, Mountain } from 'lucide-react'
import { useCalculations } from '@/hooks/useCalculations'
import { useLinkStore } from '@/stores/useLinkStore'
import { fetchElevation } from '@/services/elevation'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Card, CardContent, CardTitle } from '@/ui/card'
import { FresnelVisualizer } from './FresnelVisualizer'

const qualityStyles = {
  'Надежный канал': 'bg-emerald-500/20 text-emerald-300',
  'Связь нестабильна': 'bg-amber-500/20 text-amber-200',
  'Ненадежный канал': 'bg-rose-500/20 text-rose-200',
} as const

export const ResultsDashboard = () => {
  const { results, params, hasErrors } = useCalculations()
  const updateParam = useLinkStore((s) => s.updateParam)
  const [elevationStatus, setElevationStatus] = useState<string>('')

  const chartData = useMemo(
    () =>
      results
        ? [
            { name: 'Pпер', fullName: 'Мощность передатчика', value: params.txPowerDbm },
            { name: 'Потери', fullName: 'Суммарные потери', value: -results.totalLossDb },
            { name: 'Pвх', fullName: 'Мощность на входе приемника', value: results.receivedPowerDbm },
            { name: 'Чувств.', fullName: 'Чувствительность приемника', value: params.rxSensitivityDbm },
            { name: 'Запас', fullName: 'Запас по замиранию', value: results.fadeMarginDb },
          ]
        : [],
    [params.rxSensitivityDbm, params.txPowerDbm, results],
  )

  const requestTerrain = async () => {
    if (
      params.txLat === undefined ||
      params.txLon === undefined ||
      params.rxLat === undefined ||
      params.rxLon === undefined
    ) {
      setElevationStatus('Сначала задайте координаты TX/RX.')
      return
    }
    setElevationStatus('Загрузка высот рельефа...')
    const txElevation = await fetchElevation(params.txLat, params.txLon)
    const rxElevation = await fetchElevation(params.rxLat, params.rxLon)
    if (txElevation === null || rxElevation === null) {
      setElevationStatus('Сервис высот недоступен.')
      return
    }
    updateParam('towerHeightTxM', Math.max(1, Math.round(txElevation / 10)))
    updateParam('towerHeightRxM', Math.max(1, Math.round(rxElevation / 10)))
    setElevationStatus('Рельеф получен. Высоты мачт скорректированы.')
  }

  if (hasErrors || !results) {
    return (
      <Card>
        <CardTitle>Модуль 2/3 - Расчет и визуализация</CardTitle>
        <CardContent>
          <p className="text-sm text-rose-300">
            Укажите корректные положительные значения частоты и дистанции.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardTitle className="flex items-center justify-between">
          <span>Основные параметры радиолинии</span>
          <span className="inline-flex items-center gap-2">
            <QualityIcon quality={results.quality} />
            <Badge className={qualityStyles[results.quality]}>{results.quality}</Badge>
          </span>
        </CardTitle>
        <CardContent className="grid gap-2 md:grid-cols-2">
          <Metric title="Потери в свободном пространстве" value={`${results.fsplDb.toFixed(2)} dB`} />
          <Metric title="Мощность на входе приемника" value={`${results.receivedPowerDbm.toFixed(2)} dBm`} />
          <Metric title="Запас по замиранию" value={`${results.fadeMarginDb.toFixed(2)} dB`} />
          <Metric title="Радиус 1-й зоны Френеля" value={`${results.fresnelRadiusM.toFixed(2)} м`} />
        </CardContent>
      </Card>

      <Card>
        <CardTitle>График параметров радиолинии </CardTitle>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                  dataKey="name"
                  stroke="#cbd5e1"
                  interval={0}
                  tick={{ fontSize: 14 }}
              />
              <YAxis stroke="#cbd5e1" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#e5e7eb',
                }}
                labelStyle={{ color: '#e5e7eb' }}
                itemStyle={{ color: '#38bdf8' }}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''}
                formatter={(value) => [`${Number(value).toFixed(2)}`, 'Значение']}
              />
              <Bar dataKey="value" name="Параметры радиолинии" fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardTitle>Визуализация зоны Френеля </CardTitle>
        <CardContent className="h-72">
          <FresnelVisualizer
            fresnelRadiusM={results.fresnelRadiusM}
            obstacleHeightM={params.obstacleHeightM}
            towerHeightTxM={params.towerHeightTxM}
            towerHeightRxM={params.towerHeightRxM}
          />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardTitle className="flex items-center gap-2">
          <Mountain size={16} />
          Профиль рельефа (Open-Elevation API)
        </CardTitle>
        <CardContent className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={requestTerrain}>
            Загрузить рельеф по координатам
          </Button>
          {elevationStatus && <p className="text-sm text-slate-300">{elevationStatus}</p>}
        </CardContent>
      </Card>
    </div>
  )
}

const Metric = ({ title, value }: { title: string; value: string }) => (
  <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
    <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
    <p className="mt-1 text-lg font-semibold text-slate-100">{value}</p>
  </div>
)

const QualityIcon = ({ quality }: { quality: string }) => {
  if (quality === 'Надежный канал') return <CheckCircle2 className="text-emerald-300" />
  if (quality === 'Связь нестабильная') return <AlertTriangle className="text-amber-300" />
  return <CircleX className="text-rose-300" />
}
