"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { categoryConfig, defaultCategory } from "@/lib/brand";
import { StickerBadge } from "@/components/StickerBadge";

interface CategoryShelfProps {
  category: { _id: string; name: string; slug: string };
  productCount?: number;
}

export function CategoryShelf({ category, productCount }: CategoryShelfProps) {
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);

  const config = categoryConfig[category.slug] ?? defaultCategory;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const newRotY = ((x - centerX) / centerX) * 5;
      const newRotX = ((centerY - y) / centerY) * 5;

      setRotX(newRotX);
      setRotY(newRotY);
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setRotX(0);
    setRotY(0);
  }, []);

  return (
    <Link href={`/catalogo?categoria=${category.slug}`} className="block">
      <div
        className="relative rounded-2xl p-6 text-white overflow-hidden hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
        style={{
          backgroundColor: config.color,
          transform: `perspective(500px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: "transform 0.15s ease-out",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {productCount != null && (
          <div className="absolute top-2 right-2">
            <StickerBadge
              text={`${productCount}`}
              color="rgba(255,255,255,0.3)"
              rotation={3}
            />
          </div>
        )}

        <div className="text-4xl hover:animate-bounce mb-2">
          {config.emoji}
        </div>
        <h3 className="font-display font-bold text-lg">{category.name}</h3>
      </div>
    </Link>
  );
}
