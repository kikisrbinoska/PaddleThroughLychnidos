export function WaveBackground() {
  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-48 w-full"
    >
      <path
        d="M0,60 C80,110 160,10 240,55 C300,88 340,50 400,70 L400,0 L0,0 Z"
        fill="#52BEFA"
        opacity="0.35"
      />
      <path
        d="M0,90 C90,40 170,130 260,85 C320,55 360,100 400,80 L400,0 L0,0 Z"
        fill="#7ADB83"
        opacity="0.3"
      />
      <path
        d="M0,120 C100,150 180,80 260,120 C320,148 360,110 400,130 L400,0 L0,0 Z"
        fill="#1570EF"
        opacity="0.2"
      />
    </svg>
  );
}
