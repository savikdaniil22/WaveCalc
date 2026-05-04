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
  const height = 220
  const groundY = 180
  const leftTowerX = 70
  const rightTowerX = 550
  const scaleY = 2
  const txY = groundY - towerHeightTxM * scaleY
  const rxY = groundY - towerHeightRxM * scaleY
  const fresnelRy = Math.max(8, Math.min(fresnelRadiusM * 2, 45))
  const obstacleY = groundY - obstacleHeightM * scaleY

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full rounded-lg bg-slate-950/70">
      <line x1={30} y1={groundY} x2={width - 30} y2={groundY} stroke="#334155" strokeWidth={2} />
      <rect x={leftTowerX - 6} y={txY} width={12} height={groundY - txY} fill="#14b8a6" />
      <rect x={rightTowerX - 6} y={rxY} width={12} height={groundY - rxY} fill="#14b8a6" />
      <line x1={leftTowerX} y1={txY} x2={rightTowerX} y2={rxY} stroke="#f8fafc" strokeWidth={2} />
      <ellipse
        cx={(leftTowerX + rightTowerX) / 2}
        cy={(txY + rxY) / 2}
        rx={(rightTowerX - leftTowerX) / 2}
        ry={fresnelRy}
        fill="rgba(56,189,248,0.15)"
        stroke="#38bdf8"
        strokeDasharray="6 6"
      />
      <rect x={307} y={obstacleY} width={8} height={groundY - obstacleY} fill="#f97316" />
    </svg>
  )
}
