/**
 * Decorative neural-network illustration for the hero. Pure SVG + CSS animation
 * (pulses travel along the edges); hidden from assistive tech and on small screens.
 */
const L1 = [70, 150, 230, 310];
const L2 = [50, 120, 190, 260, 330];
const L3 = [110, 190, 270];
const X = [60, 200, 340];

export function NeuralArt() {
  const edges: [number, number, number, number][] = [];
  L1.forEach((a) => L2.forEach((b) => edges.push([X[0], a, X[1], b])));
  L2.forEach((a) => L3.forEach((b) => edges.push([X[1], a, X[2], b])));
  return (
    <div className="neural" aria-hidden="true">
      <svg viewBox="0 0 400 380" role="presentation">
        <defs>
          <linearGradient id="ng" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
          <radialGradient id="nglow">
            <stop offset="0" stopColor="var(--accent-2)" stopOpacity=".55" />
            <stop offset="1" stopColor="var(--accent-2)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="190" r="190" fill="url(#nglow)" />
        <g className="n-edges">
          {edges.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        <g className="n-pulses">
          {edges.filter((_, i) => i % 3 === 0).map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} style={{ animationDelay: `${(i * 0.37) % 3}s` }} />
          ))}
        </g>
        <g className="n-nodes">
          {L1.map((y) => <circle key={`a${y}`} cx={X[0]} cy={y} r="9" />)}
          {L2.map((y) => <circle key={`b${y}`} cx={X[1]} cy={y} r="11" />)}
          {L3.map((y) => <circle key={`c${y}`} cx={X[2]} cy={y} r="13" />)}
        </g>
      </svg>
    </div>
  );
}
