"use client";

import Link from "next/link";

interface CreatedByEnubeProps {
  className?: string;
}

/**
 * Enube ISO mark — interlocking module motif
 * Dark version for light backgrounds
 */
function EnubeMark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1080 1080"
      className={className}
      aria-label="Enube mark"
      role="img"
    >
      <path
        fill="currentColor"
        d="M502.71,739.9c-22.99,0-41.69-18.7-41.69-41.69v-74.59c0-22.99,18.7-41.69,41.69-41.69h74.59c22.99,0,41.69,18.7,41.69,41.69v74.59c0,22.99-18.7,41.69-41.69,41.69h-74.59ZM744.53,659.29c-22.99,0-41.69-18.7-41.69-41.69v-74.59c0-.59.01-1.19.03-1.77.43-11.54-4.01-22.85-12.18-31.02-7.76-7.76-18.51-12.21-29.48-12.21l-3.31.06h-235.8l-3.31-.06c-11.14,0-21.61,4.33-29.48,12.21-8.17,8.17-12.61,19.48-12.18,31.03.02.57.03,1.17.03,1.76v74.59c0,22.99-18.7,41.69-41.69,41.69h-74.59c-22.99,0-41.69-18.7-41.69-41.69v-74.59c0-22.99,18.7-41.69,41.69-41.69h74.59l3.31.06c11.14,0,21.61-4.34,29.48-12.21,8.17-8.17,12.61-19.48,12.18-31.03-.02-.57-.03-1.17-.03-1.76v-74.59c0-22.99,18.7-41.69,41.69-41.69h235.8c22.99,0,41.69,18.7,41.69,41.69v74.59c0,.59-.01,1.19-.03,1.77-.43,11.54,4.01,22.85,12.18,31.02,7.76,7.76,18.51,12.21,29.48,12.21l3.31-.06h74.59c22.99,0,41.69,18.7,41.69,41.69v74.59c0,22.99-18.7,41.69-41.69,41.69h-74.59Z"
      />
    </svg>
  );
}

/**
 * Created by Enube credit badge
 * Fits Dulcitienda's design while maintaining Enube brand identity
 */
export function CreatedByEnube({ className = "" }: CreatedByEnubeProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="text-gray-500 text-xs">Creado por</span>
      <Link
        href="https://enube.net.co"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-800/50 hover:bg-gray-800 transition-colors"
      >
        <EnubeMark className="w-3.5 h-3.5 text-[#00E6E4]" />
        <span className="text-gray-300 text-xs font-medium group-hover:text-white transition-colors">
          Enube
        </span>
      </Link>
    </div>
  );
}
