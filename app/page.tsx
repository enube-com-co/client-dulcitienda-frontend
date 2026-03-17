"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";
import { CandyCard, CandyCardSkeleton } from "@/components/CandyCard";
import { CategoryShelf } from "@/components/CategoryShelf";
import { FloatingProducts } from "@/components/FloatingProducts";
import { ScrollReveal } from "@/components/ScrollReveal";
import { WaveDivider } from "@/components/WaveDivider";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const [mounted, setMounted] = useState(false);

  const products = useQuery(api.products.getFeaturedProducts, { limit: 8 });
  const categories = useQuery(api.products.getCategories);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showLoading =
    !mounted || products === undefined || categories === undefined;

  if (showLoading) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl animate-spin inline-block">🍬</div>
        <p className="font-handwritten text-[#1E1012]/60 mt-2 text-xl">
          Cargando cositas ricas...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Section 1: Hero — Split Personality */}
      <section className="bg-[#FFFBF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left column — Typography stack */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-1"
            >
              <motion.span
                variants={item}
                className="text-5xl lg:text-7xl font-display font-bold text-[#7C3AED]"
              >
                Dulces,
              </motion.span>
              <motion.span
                variants={item}
                className="text-5xl lg:text-7xl font-display font-bold text-[#FF2D78]"
              >
                licores
              </motion.span>
              <motion.span
                variants={item}
                className="text-xl lg:text-2xl text-[#1E1012]"
              >
                y todo lo que
              </motion.span>
              <motion.span
                variants={item}
                className="text-xl lg:text-2xl text-[#1E1012]"
              >
                tu negocio
              </motion.span>
              <motion.span
                variants={item}
                className="text-5xl lg:text-7xl font-handwritten text-[#34D399]"
              >
                necesita.
              </motion.span>

              <motion.div
                variants={item}
                className="flex flex-col sm:flex-row gap-3 mt-6"
              >
                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center gap-2 bg-[#FF2D78] text-white px-6 py-3.5 rounded-full font-bold hover:brightness-110 transition-all"
                >
                  Ver catálogo
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="https://wa.me/573132309867"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#1E1012] text-[#1E1012] px-6 py-3.5 rounded-full font-semibold hover:bg-[#1E1012] hover:text-white transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Pedir por WhatsApp
                </a>
              </motion.div>

              <motion.p
                variants={item}
                className="text-sm text-[#1E1012]/60 mt-3"
              >
                Envío gratis en Neiva. Sí, en serio.
              </motion.p>
            </motion.div>

            {/* Right column — Floating products */}
            <div className="hidden md:block">
              <FloatingProducts products={products?.slice(0, 5) || []} />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: WaveDivider */}
      <WaveDivider color="#FFFBF0" />

      {/* Section 3: Categories */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-[#1E1012] mb-6 sm:mb-8">
            Explora por categoría
          </h2>

          {categories ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((cat, i) => (
                <ScrollReveal key={cat._id} delay={i * 0.1}>
                  <CategoryShelf category={cat} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 4: WaveDivider (flip) */}
      <WaveDivider flip />

      {/* Section 5: Featured Products */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="font-handwritten text-3xl text-[#1E1012]">
              Lo que se está llevando la gente
            </h2>
            <Link
              href="/catalogo"
              className="text-[#7C3AED] font-medium flex items-center gap-1"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {products ? (
            <>
              {/* Desktop: 4-column grid */}
              <div className="hidden md:grid grid-cols-4 gap-6">
                {products.map((p, i) => (
                  <ScrollReveal key={p._id} delay={i * 0.1}>
                    <CandyCard product={p} priority={i < 4} />
                  </ScrollReveal>
                ))}
              </div>

              {/* Mobile: Horizontal scroll with snap */}
              <div className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {products.map((p, i) => (
                  <div key={p._id} className="snap-start shrink-0 w-[70vw]">
                    <CandyCard product={p} priority={i < 4} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <CandyCardSkeleton key={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 6: Social Proof Banner */}
      <section className="py-16 bg-[#34D399]/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <p className="text-3xl lg:text-5xl font-handwritten text-[#1E1012]">
              200+ negocios en Neiva ya compran aquí. Falta el tuyo.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 7: CTA — The Closer */}
      <section className="py-16 bg-[#1E1012] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
            Deja de buscar. Aquí está todo.
          </h2>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-[#FF2D78] text-white font-bold px-8 py-4 rounded-full hover:brightness-110 transition-all mt-4"
          >
            Crear cuenta gratis
            <span className="text-xs font-normal text-white/70">
              (2 minutos, lo prometemos)
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
