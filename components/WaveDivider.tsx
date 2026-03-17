interface WaveDividerProps {
  color?: string;
  flip?: boolean;
  className?: string;
}

export function WaveDivider({ color = "#FFFBF0", flip = false, className = "" }: WaveDividerProps) {
  return (
    <div className={`w-full overflow-hidden leading-none ${className}`} style={flip ? { transform: "scaleY(-1)" } : undefined}>
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-10">
        <path d="M0,20 C150,40 350,0 600,20 C850,40 1050,0 1200,20 L1200,40 L0,40 Z" fill={color} />
      </svg>
    </div>
  );
}
