"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import SearchDropdown from "@/components/SearchDropdown";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { marqueeMessages } from "@/lib/brand";

export default function Header() {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedUser = localStorage.getItem("dulcitienda_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // ignore malformed data
      }
    }

    const handleCartUpdate = () => {
      const savedCart = localStorage.getItem("dulcitienda-cart");
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          const count = cart.reduce(
            (sum: number, item: { quantity: number }) => sum + item.quantity,
            0,
          );
          setCartCount(count);
        } catch {
          // ignore malformed data
        }
      } else {
        setCartCount(0);
      }
    };

    handleCartUpdate();
    window.addEventListener("storage", handleCartUpdate);
    window.addEventListener("cart-updated", handleCartUpdate);

    return () => {
      window.removeEventListener("storage", handleCartUpdate);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <MarqueeTicker messages={marqueeMessages} />

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl" aria-hidden>
                🍬
              </span>
              <span className="font-display font-bold text-[#1E1012] text-2xl">
                Dulcitienda
              </span>
            </Link>

            {/* Desktop search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <SearchDropdown />
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Cart */}
              <Link
                href="/carrito"
                className="relative flex items-center gap-1.5 sm:gap-2 text-[#1E1012]/70 hover:text-[#7C3AED] transition-colors p-2"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span
                    key={cartCount}
                    className="absolute -top-0.5 -right-0.5 bg-[#FF2D78] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-cart-bounce"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* User / Login */}
              {user ? (
                <Link
                  href="/perfil"
                  className="hidden sm:flex items-center gap-2 text-[#1E1012]/70 hover:text-[#7C3AED] transition-colors"
                >
                  <div className="w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium truncate max-w-[80px]">
                    {user.name?.split(" ")[0] || "Perfil"}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 bg-[#FF2D78] text-white rounded-full px-4 py-2 font-medium hover:opacity-90 transition-opacity text-sm"
                >
                  <User size={16} />
                  Entrar
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 -mr-2"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8 h-12">
              {[
                { href: "/catalogo", label: "Catálogo" },
                { href: "/catalogo?categoria=gaseosas", label: "Gaseosas" },
                { href: "/catalogo?categoria=snacks", label: "Snacks" },
                { href: "/catalogo?categoria=dulces", label: "Dulces" },
                { href: "/catalogo?categoria=licores", label: "Licores" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm font-medium text-[#1E1012]/70 hover:text-[#7C3AED] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg border-t">
            <div className="px-4 py-4 space-y-3">
              <div className="mb-4">
                <SearchDropdown />
              </div>
              {[
                { href: "/catalogo", label: "Catálogo" },
                { href: "/catalogo?categoria=gaseosas", label: "Gaseosas" },
                { href: "/catalogo?categoria=snacks", label: "Snacks" },
                { href: "/catalogo?categoria=dulces", label: "Dulces" },
                { href: "/catalogo?categoria=licores", label: "Licores" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block py-2 text-sm font-medium text-[#1E1012]/70 hover:text-[#7C3AED] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <hr className="my-3" />
              <Link
                href="/carrito"
                className="block py-2 text-sm font-medium text-[#1E1012]/70 hover:text-[#7C3AED]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Carrito ({cartCount})
              </Link>
              <Link
                href={user ? "/perfil" : "/login"}
                className="block py-2 text-sm font-medium text-[#1E1012]/70 hover:text-[#7C3AED]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {user ? "Mi Perfil" : "Iniciar sesión"}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
