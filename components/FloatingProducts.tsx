"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { StickerBadge } from "@/components/StickerBadge";

interface FloatingProductsProps {
  products: Array<{ images: string[]; name: string }>;
}

const positions = [
  { top: "5%", left: "5%", size: 120, rotation: -4 },
  { top: "15%", right: "8%", size: 100, rotation: 3 },
  { bottom: "20%", left: "15%", size: 90, rotation: -2 },
  { bottom: "10%", right: "12%", size: 130, rotation: 5 },
  { top: "40%", left: "45%", size: 80, rotation: -5 },
];

const badges: Record<number, { text: string; color: string; rotation: number }> = {
  0: { text: "NUEVO!", color: "#34D399", rotation: -3 },
  1: { text: "El más vendido", color: "#FF2D78", rotation: 2 },
};

export function FloatingProducts({ products }: FloatingProductsProps) {
  const items = products.slice(0, 5);

  if (items.length === 0) return null;

  return (
    <div className="relative h-64 sm:h-80 lg:h-96">
      {items.map((product, index) => {
        const pos = positions[index];
        const hasImage = product.images && product.images.length > 0;
        if (!hasImage) return null;

        const badge = badges[index];

        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              top: pos.top,
              bottom: (pos as Record<string, unknown>).bottom as string | undefined,
              left: pos.left,
              right: (pos as Record<string, unknown>).right as string | undefined,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { delay: index * 0.15, duration: 0.5 },
              scale: { delay: index * 0.15, duration: 0.5 },
              y: {
                delay: index * 0.15 + 0.5,
                repeat: Infinity,
                duration: 3 + index * 0.5,
                ease: "easeInOut",
              },
            }}
          >
            <div className="relative">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={pos.size}
                height={pos.size}
                loading="lazy"
                className="rounded-xl shadow-lg object-cover"
                style={{
                  transform: `rotate(${pos.rotation}deg)`,
                  width: pos.size,
                  height: pos.size,
                }}
              />
              {badge && (
                <div className="absolute -top-2 -right-2">
                  <StickerBadge
                    text={badge.text}
                    color={badge.color}
                    rotation={badge.rotation}
                  />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
