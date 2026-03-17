"use client";

interface StickerBadgeProps {
  text: string;
  color: string;
  rotation?: number;
  className?: string;
}

export function StickerBadge({ text, color, rotation = -3, className = "" }: StickerBadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-1 text-xs font-bold text-white rounded-full shadow-md group-hover:animate-wiggle ${className}`}
      style={{ backgroundColor: color, transform: `rotate(${rotation}deg)` }}
      aria-label={text}
    >
      {text}
    </span>
  );
}
