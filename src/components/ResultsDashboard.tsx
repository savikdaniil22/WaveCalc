import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AlertTriangle, CheckCircle2, CircleX, Download } from 'lucide-react'
import { useCalculations } from '@/hooks/useCalculations'
import { Badge } from '@/ui/badge'
import { Button } from '@/ui/button'
import { Card, CardContent, CardTitle } from '@/ui/card'
import { FresnelVisualizer } from './FresnelVisualizer'

const qualityStyles = {
  'Устойчивый канал связи': 'bg-emerald-500/20 text-emerald-300',
  'Допустимый уровень устойчивости': 'bg-amber-500/20 text-amber-200',
  'Критически низкий запас': 'bg-orange-500/20 text-orange-200',
  'Связь невозможна': 'bg-rose-500/20 text-rose-200',
} as const

export const ResultsDashboard = () => {
  const { results, params, hasErrors } = useCalculations()

  const chartData = useMemo(
    () =>
      results
        ? [
            { name: 'Pпер', fullName: 'Мощность передатчика', value: params.txPowerDbm },
            { name: 'Потери', fullName: 'Суммарные потери', value: -results.totalLossDb },
            { name: 'Pвх', fullName: 'Мощность на входе приемника', value: results.receivedPowerDbm },
            { name: 'Чувств.', fullName: 'Чувствительность приемника', value: params.rxSensitivityDbm },
            { name: 'Запас', fullName: 'Запас по уровню сигнала', value: results.fadeMarginDb },
          ]
        : [],
    [params.rxSensitivityDbm, params.txPowerDbm, results],
  )

  const downloadResults = () => {
    if (!results) return

    const report = [
      'WaveCalc - Отчет по радиолинии',
      `Дата формирования: ${new Date().toLocaleString('ru-RU')}`,
      '',
      'Входные параметры:',
      `- Частота: ${params.frequencyMHz} МГц`,
      `- Дистанция: ${params.distanceKm} км`,
      `- Мощность передатчика: ${params.txPowerDbm} dBm`,
      `- Коэффициент усиления TX: ${params.txGainDbi} dBi`,
      `- Коэффициент усиления RX: ${params.rxGainDbi} dBi`,
      `- Дополнительные потери: ${params.additionalLossDb} dB`,
      `- Чувствительность приемника: ${params.rxSensitivityDbm} dBm`,
      `- Высота препятствия: ${params.obstacleHeightM} м`,
      `- Высота мачты TX: ${params.towerHeightTxM} м`,
      `- Высота мачты RX: ${params.towerHeightRxM} м`,
      '',
      'Результаты расчета:',
      `- Потери в свободном пространстве: ${results.fsplDb.toFixed(2)} dB`,
      `- Суммарные потери: ${results.totalLossDb.toFixed(2)} dB`,
      `- Мощность на входе приемника: ${results.receivedPowerDbm.toFixed(2)} dBm`,
      `- Запас по замиранию: ${results.fadeMarginDb.toFixed(2)} dB`,
      `- Радиус 1-й зоны Френеля: ${results.fresnelRadiusM.toFixed(2)} м`,
      `- Оценка канала: ${results.quality}`,
    ].join('\n')

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `wavecalc-results-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.txt`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
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
          <Metric title="Запас по уровню сигнала" value={`${results.fadeMarginDb.toFixed(2)} dB`} />
          <Metric title="Радиус 1-й зоны Френеля" value={`${results.fresnelRadiusM.toFixed(2)} м`} />
        </CardContent>
      </Card>

      <Card>
        <CardTitle>Визуализация параметров радиолинии </CardTitle>
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
          <Download size={16} />
          Скачивание результатов
        </CardTitle>
        <CardContent className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={downloadResults}>
            Скачать результаты расчета (txt)
          </Button>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardTitle>Основные характеристики радиолинии</CardTitle>
        <CardContent className="space-y-4 text-sm text-slate-200">
          <ParameterDescription
            title="Потери в свободном пространстве (FSPL)"
            text="Показывают, насколько ослабляется сигнал при распространении между передатчиком и приемником. Зависят от расстояния и рабочей частоты: чем больше FSPL, тем слабее сигнал у приемника."
          />
          <ParameterDescription
            title="Мощность на входе приемника"
            text="Характеризует уровень сигнала после прохождения радиоканала. Если мощность выше чувствительности приемника — связь возможна; если ниже — прием становится нестабильным или невозможным."
          />
          <ParameterDescription
            title="Запас по уровню сигнала"
            text="Это разница между фактическим уровнем сигнала и минимально допустимым уровнем для приемника. Параметр отражает устойчивость канала к помехам, погодным условиям и временным ослаблениям сигнала."
            thresholds={[
              'более 10 dB — устойчивый канал;',
              '5-10 dB — допустимое качество;',
              'менее 5 dB — высокий риск нестабильной связи.',
            ]}
          />
          <ParameterDescription
            title="Радиус первой зоны Френеля"
            text="Определяет область вокруг линии распространения сигнала, которая должна оставаться максимально свободной от препятствий. Перекрытие зоны Френеля вызывает дополнительные потери и ухудшает устойчивость связи."
            thresholds={['для надежной связи желательно сохранять свободными не менее 60% первой зоны Френеля.']}
          />
          <ParameterDescription
            title="Суммарные потери"
            text="Отражают общее ослабление сигнала с учетом потерь в свободном пространстве и дополнительных потерь в оборудовании и линии передачи. Используются при расчете мощности на входе приемника."
          />
          <ParameterDescription
            title="Чувствительность приемника"
            text="Минимальный уровень сигнала, при котором приемник способен корректно принимать данные. Если фактический уровень сигнала ниже чувствительности, связь становится невозможной или нестабильной."
          />
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

const ParameterDescription = ({
  title,
  text,
  thresholds,
}: {
  title: string
  text: string
  thresholds?: string[]
}) => (
  <div className="space-y-1">
    <p className="font-semibold text-slate-100">{title}</p>
    <p className="text-slate-300">{text}</p>
    {thresholds?.map((item) => (
      <p key={item} className="text-slate-300">
        - {item}
      </p>
    ))}
  </div>
)

const QualityIcon = ({ quality }: { quality: string }) => {
  if (quality === 'Устойчивый канал связи') return <CheckCircle2 className="text-emerald-300" />
  if (quality === 'Допустимый уровень устойчивости')
    return <AlertTriangle className="text-amber-300" />
  if (quality === 'Критически низкий запас') return <AlertTriangle className="text-orange-300" />
  return <CircleX className="text-rose-300" />
}
