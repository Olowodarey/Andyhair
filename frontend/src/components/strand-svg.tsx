/**
 * Decorative animated "hair strand" curves for the hero. Each path draws in
 * via the `.strand-path` stroke-dashoffset animation (disabled under
 * prefers-reduced-motion in globals.css).
 */
export function StrandSvg({ className }: { className?: string }) {
  const strands = [
    {
      d: "M-50 380 C 250 260, 480 470, 760 330 S 1250 190, 1500 320",
      opacity: 0.5,
      delay: "0s",
    },
    {
      d: "M-50 430 C 280 320, 520 520, 800 380 S 1280 250, 1500 380",
      opacity: 0.3,
      delay: "0.35s",
    },
    {
      d: "M-50 330 C 220 210, 450 420, 720 290 S 1220 140, 1500 260",
      opacity: 0.2,
      delay: "0.7s",
    },
    {
      d: "M-50 480 C 300 380, 560 560, 840 430 S 1300 310, 1500 440",
      opacity: 0.12,
      delay: "1.05s",
    },
  ];

  return (
    <svg
      viewBox="0 0 1440 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id="strand-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C6913C" />
          <stop offset="50%" stopColor="#E3B96A" />
          <stop offset="100%" stopColor="#C6913C" />
        </linearGradient>
      </defs>
      {strands.map((strand) => (
        <path
          key={strand.d}
          d={strand.d}
          pathLength={1}
          fill="none"
          stroke="url(#strand-gold)"
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={strand.opacity}
          className="strand-path"
          style={{ animationDelay: strand.delay }}
        />
      ))}
    </svg>
  );
}
