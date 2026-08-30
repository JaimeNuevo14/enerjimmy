function buildPath(values: number[], width: number, height: number) {
  if (values.length === 0) return { line: "", area: "" };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = values.length > 1 ? width / (values.length - 1) : 0;

  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * (height * 0.75) - height * 0.1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const line = points.join(" ");
  const area = `${points[0].split(",")[0]},${height} ${line} ${width},${height}`;

  return { line, area };
}

export default function Sparkline({ values }: { values: number[] }) {
  const width = 300;
  const height = 110;
  const { line, area } = buildPath(values, width, height);
  const lastPoint = line.split(" ").pop();
  const [cx, cy] = (lastPoint ?? "0,0").split(",").map(Number);

  if (values.length < 2) {
    return (
      <div className="chart empty" style={{ padding: "24px 14px" }}>
        Registra al menos dos sesiones para ver la progresión.
      </div>
    );
  }

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <line x1="0" y1={height * 0.25} x2={width} y2={height * 0.25} stroke="var(--line)" strokeWidth="1" />
        <line x1="0" y1={height * 0.5} x2={width} y2={height * 0.5} stroke="var(--line)" strokeWidth="1" />
        <line x1="0" y1={height * 0.75} x2={width} y2={height * 0.75} stroke="var(--line)" strokeWidth="1" />
        <polygon points={area} fill="var(--accent)" opacity="0.12" />
        <polyline
          points={line}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={cx} cy={cy} r="4.5" fill="var(--accent)" />
      </svg>
    </div>
  );
}
