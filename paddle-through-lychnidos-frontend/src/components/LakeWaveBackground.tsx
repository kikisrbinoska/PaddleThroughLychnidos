export function LakeWaveBackground() {
  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-1/2 w-full"
    >
      <defs>
        <linearGradient id="lake-wave-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7acbfb" />
          <stop offset="100%" stopColor="#1d8cf0" />
        </linearGradient>
      </defs>
      <path
        d="M0,180 C100,150 300,150 400,180 L400,400 L0,400 Z"
        fill="url(#lake-wave-gradient)"
        opacity="0.18"
      />
      <path
        d="M0,220 C120,195 280,245 400,215 L400,400 L0,400 Z"
        fill="url(#lake-wave-gradient)"
        opacity="0.24"
      />
      <path
        d="M0,270 C140,290 260,250 400,270 L400,400 L0,400 Z"
        fill="url(#lake-wave-gradient)"
        opacity="0.35"
      />
    </svg>
  );
}
