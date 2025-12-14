interface WavyLineProps {
  className?: string;
  color?: string;
  width?: number;
  animate?: boolean;
}

export default function WavyLine({
  className = '',
  color = '#BEC540',
  width = 200,
  animate = false,
}: WavyLineProps) {
  return (
    <svg
      width={width}
      height="12"
      viewBox="0 0 200 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animate ? 'animate-float' : ''}`}
      preserveAspectRatio="none"
    >
      <path
        d="M0 6 Q 5 2, 10 6 T 20 6 T 30 6 T 40 6 T 50 6 T 60 6 T 70 6 T 80 6 T 90 6 T 100 6 T 110 6 T 120 6 T 130 6 T 140 6 T 150 6 T 160 6 T 170 6 T 180 6 T 190 6 T 200 6"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
