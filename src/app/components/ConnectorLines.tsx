interface Connection {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  label?: string;
  active?: boolean;
}

interface ConnectorLinesProps {
  connections: Connection[];
  width: number;
  height: number;
}

export function ConnectorLines({ connections, width, height }: ConnectorLinesProps) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={width}
      height={height}
      style={{ overflow: "visible" }}
    >
      <defs>
        {connections.map((c, i) => (
          <marker
            key={`arrow-${i}`}
            id={`arrow-${i}`}
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L6,3 Z" fill={c.color} />
          </marker>
        ))}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {connections.map((c, i) => {
        const mx = (c.from.x + c.to.x) / 2;
        const my = (c.from.y + c.to.y) / 2;
        return (
          <g key={i}>
            <line
              x1={c.from.x}
              y1={c.from.y}
              x2={c.to.x}
              y2={c.to.y}
              stroke={c.color}
              strokeWidth={c.active ? 2 : 1}
              strokeOpacity={c.active ? 0.9 : 0.35}
              strokeDasharray={c.active ? "none" : "4 4"}
              markerEnd={`url(#arrow-${i})`}
              filter={c.active ? "url(#glow)" : undefined}
            />
            {c.label && (
              <text
                x={mx}
                y={my - 5}
                textAnchor="middle"
                fontSize="8"
                fill={c.color}
                opacity={0.7}
                fontFamily="'Share Tech Mono', monospace"
              >
                {c.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
