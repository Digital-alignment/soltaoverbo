interface ScribbleProps {
  variant?: 'circle' | 'underline' | 'star' | 'arrow';
  className?: string;
  color?: string;
}

export default function Scribble({
  variant = 'circle',
  className = '',
  color = '#BEC540',
}: ScribbleProps) {
  const scribbles = {
    circle: (
      <svg viewBox="0 0 100 100" fill="none" className={`w-full h-full ${className}`}>
        <path
          d="M85 50C85 68 68 85 50 85C32 85 15 68 15 50C15 32 32 15 50 15C68 15 85 32 85 50Z"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          className="animate-wiggle"
        />
        <path
          d="M82 48C82 66 66 82 48 82C30 82 14 66 14 48C14 30 30 14 48 14C66 14 82 30 82 48Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </svg>
    ),
    underline: (
      <svg viewBox="0 0 200 20" fill="none" className={`w-full h-full ${className}`}>
        <path
          d="M5 10 Q 25 5, 50 10 T 100 10 T 150 10 T 195 10"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M5 15 Q 30 12, 60 15 T 120 15 T 195 15"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 100 100" fill="none" className={`w-full h-full ${className}`}>
        <path
          d="M50 15 L60 45 L90 50 L60 55 L50 85 L40 55 L10 50 L40 45 Z"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="animate-wiggle"
        />
      </svg>
    ),
    arrow: (
      <svg viewBox="0 0 100 60" fill="none" className={`w-full h-full ${className}`}>
        <path
          d="M10 30 Q 30 20, 50 30 T 85 30"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M75 20 L85 30 L75 40"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    ),
  };

  return scribbles[variant];
}
