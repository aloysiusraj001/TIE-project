import React from 'react';

interface RadarChartProps {
  data: { pillar: string; score: number }[];
  size?: number;
  maxScore?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size = 300, maxScore = 4 }) => {
  const center = size / 2;
  // Reduce radius to increase the margin for labels, preventing clipping.
  const radius = center * 0.60;
  const numAxes = data.length;
  const angleSlice = (Math.PI * 2) / numAxes;

  const dataPoints = data.map((item, i) => {
    const angle = angleSlice * i - Math.PI / 2;
    const r = (item.score / maxScore) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g>
        {/* Grid */}
        {[...Array(maxScore)].map((_, level) => {
          const r = (radius * (level + 1)) / maxScore;
          const points = data.map((_, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="rgba(100, 116, 139, 0.5)" // slate-500 with opacity
              strokeWidth="1"
            />
          );
        })}

        {/* Axes and Labels */}
        {data.map((item, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          
          // A default multiplier to position labels outside the chart.
          let labelRadiusMultiplier = 1.1;

          // Indices for 'Personalization' (1, top-right) and 'Ownership' (4, top-left)
          // need to be closer to avoid being clipped by the component's bounding box.
          if (i === 1 || i === 4) {
              labelRadiusMultiplier = 1.0;
          }

          const labelX = center + radius * labelRadiusMultiplier * Math.cos(angle);
          const labelY = center + radius * labelRadiusMultiplier * Math.sin(angle);

          const cosAngle = Math.cos(angle);
          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          
          // Adjust text anchor based on which side of the chart the label is on
          if (cosAngle > 0.01) {
            textAnchor = 'start';
          } else if (cosAngle < -0.01) {
            textAnchor = 'end';
          }

          return (
            <g key={item.pillar}>
              <line x1={center} y1={center} x2={x2} y2={y2} stroke="rgba(100, 116, 139, 0.5)" strokeWidth="1" />
              <text
                x={labelX}
                y={labelY}
                fontSize="10" // Reduced font size to help prevent clipping.
                fill="rgb(148, 163, 184)" // slate-400
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="font-semibold"
              >
                {item.pillar}
              </text>
            </g>
          );
        })}

        {/* Data Shape */}
        <polygon
          points={dataPoints}
          fill="rgba(245, 176, 20, 0.3)" // brand-accent with opacity
          stroke="#F5B014" // brand-accent
          strokeWidth="2"
        />
         {data.map((item, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const r = (item.score / maxScore) * radius;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return (
                <circle key={i} cx={x} cy={y} r="3" fill="#F5B014" />
            )
        })}
      </g>
    </svg>
  );
};

export default RadarChart;