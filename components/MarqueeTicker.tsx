"use client";

import { useReducedMotion } from "framer-motion";

interface MarqueeTickerProps {
  messages: string[];
}

export function MarqueeTicker({ messages }: MarqueeTickerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion || messages.length === 0) {
    return (
      <div className="bg-[#7C3AED] text-white py-2 text-center">
        <p className="text-sm font-medium">{messages[0] ?? ""}</p>
      </div>
    );
  }

  const separator = " ✦ ";
  const track = messages.join(separator) + separator;

  return (
    <div className="bg-[#7C3AED] text-white py-2 overflow-hidden">
      {/* Screen reader accessible version */}
      <span className="sr-only" aria-live="polite">
        {messages.join(". ")}
      </span>
      {/* Visual marquee */}
      <div
        className="flex whitespace-nowrap [&:hover_.marquee-track]:[animation-play-state:paused]"
        aria-hidden="true"
      >
        <span className="marquee-track inline-block animate-[marquee_30s_linear_infinite] text-sm font-medium">
          {track}
        </span>
        <span className="marquee-track inline-block animate-[marquee_30s_linear_infinite] text-sm font-medium">
          {track}
        </span>
      </div>
    </div>
  );
}
