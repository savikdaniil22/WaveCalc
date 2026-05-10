interface FresnelVisualizerProps {
  fresnelRadiusM: number
  obstacleHeightM: number
  towerHeightTxM: number
  towerHeightRxM: number
}

export const FresnelVisualizer = ({
  fresnelRadiusM,
  obstacleHeightM,
  towerHeightTxM,
  towerHeightRxM,
}: FresnelVisualizerProps) => {
  const width = 620
  const height = 240
  const groundY = 200
  const leftTowerX = 70
  const rightTowerX = 550
  const spanX = rightTowerX - leftTowerX
  const obstacleX = leftTowerX + spanX / 2
  const safeFresnelRadiusM = Math.max(0, fresnelRadiusM)

  // Вертикальный масштаб подбирается динамически, чтобы не искажать профиль зоны.
  const maxVisualHeightM = Math.max(
    towerHeightTxM,
    towerHeightRxM,
    obstacleHeightM,
    ((towerHeightTxM + towerHeightRxM) / 2) + safeFresnelRadiusM,
    1,
  )
  const availableHeightPx = groundY - 24
  const scaleY = availableHeightPx / (maxVisualHeightM * 1.12)

  const toSvgY = (meters: number) => groundY - meters * scaleY
  const txY = toSvgY(towerHeightTxM)
  const rxY = toSvgY(towerHeightRxM)
  const obstacleY = toSvgY(obstacleHeightM)

  const samples = 80
  const upperBoundaryPoints: string[] = []
  const lowerBoundaryPoints: string[] = []

  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples
    const x = leftTowerX + spanX * t
    const losHeightM = towerHeightTxM + (towerHeightRxM - towerHeightTxM) * t
    const fresnelAtXM = safeFresnelRadiusM * 2 * Math.sqrt(t * (1 - t))
    upperBoundaryPoints.push(`${x},${toSvgY(losHeightM + fresnelAtXM)}`)
    lowerBoundaryPoints.push(`${x},${toSvgY(losHeightM - fresnelAtXM)}`)
  }

  const zonePolygonPoints = `${upperBoundaryPoints.join(' ')} ${lowerBoundaryPoints.reverse().join(' ')}`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full rounded-lg bg-slate-950/70">
      <line x1={30} y1={groundY} x2={width - 30} y2={groundY} stroke="#334155" strokeWidth={2} />
      <rect x={leftTowerX - 6} y={txY} width={12} height={groundY - txY} fill="#14b8a6" />
      <rect x={rightTowerX - 6} y={rxY} width={12} height={groundY - rxY} fill="#14b8a6" />
      <line x1={leftTowerX} y1={txY} x2={rightTowerX} y2={rxY} stroke="#f8fafc" strokeWidth={2} />
      <polygon points={zonePolygonPoints} fill="rgba(56,189,248,0.15)" />
      <polyline points={upperBoundaryPoints.join(' ')} fill="none" stroke="#38bdf8" strokeDasharray="6 6" />
      <polyline points={lowerBoundaryPoints.join(' ')} fill="none" stroke="#38bdf8" strokeDasharray="6 6" />
      <rect x={obstacleX - 4} y={obstacleY} width={8} height={groundY - obstacleY} fill="#f97316" />
    </svg>
  )
}
