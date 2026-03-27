"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

const sizes = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)} role="status" aria-live="polite">
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-[#FF2D78]/20 border-t-[#FF2D78]",
          sizes[size]
        )}
        aria-hidden="true"
      />
      {text && (
        <p className="text-[#1E1012]/60 text-sm">{text}</p>
      )}
      <span className="sr-only">Cargando{text ? `: ${text}` : ""}</span>
    </div>
  );
}

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = "Cargando cositas ricas..." }: PageLoaderProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <div className="text-4xl animate-bounce" aria-hidden="true">🍬</div>
      <p className="font-handwritten text-lg text-[#1E1012]/60">{message}</p>
      <span className="sr-only">Cargando, por favor espere</span>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
  const baseClasses = "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]";
  
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      aria-hidden="true"
    />
  );
}
