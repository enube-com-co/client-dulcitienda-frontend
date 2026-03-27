"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import SearchDropdown from "@/components/SearchDropdown";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { marqueeMessages } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserData {
  email: string;
  name: string;
}

const navLinks = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo?categoria=gaseosas", label: "Gaseosas" },
  { href: "/catalogo?categoria=snacks", label: "Snacks" },
  { href: "/catalogo?categoria=dulces", label: "Dulces" },
  { href: "/catalogo?categoria=licores", label: "Licores" },
];

export default function Header() {
  const [user, setUser] = useState<UserData | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  if (!mounted) {
    return (
      <>
        <div className="bg-[#FF2D78] text-white text-center py-1.5 text-xs sm:text-sm overflow-hidden">
          <div className="animate-pulse">Cargando...</div>
        </div>
        <header className="bg-white shadow-sm sticky top-0 z-50 h-16 sm:h-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full" />
        </header>
      </>
    );
  }

  return (
    <>
      <MarqueeTicker messages={marqueeMessages} />

      <header className="bg-white shadow-sm sticky top-0 z-50" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 sm:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 rounded-lg"
              aria-label="Dulcitienda - Inicio"
            >
              <span className="text-2xl sm:text-3xl" aria-hidden="true">
                🍬
              </span>
              <span className="font-display font-bold text-[#1E1012] text-xl sm:text-2xl">
                Dulcitienda
              </span>
            </Link>

            {/* Desktop search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <SearchDropdown />
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search button (mobile) */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Buscar productos"
                aria-expanded={searchOpen}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Link
                href="/carrito"
                className="relative flex items-center justify-center w-10 h-10 text-[#1E1012]/70 hover:text-[#7C3AED] hover:bg-gray-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
                aria-label={`Carrito de compras${cartCount > 0 ? `, ${cartCount} productos` : ''}`}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span
                    key={cartCount}
                    className="absolute -top-0.5 -right-0.5 bg-[#FF2D78] text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 animate-cart-bounce"
                    aria-hidden="true"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* User / Login */}
              {user ? (
                <Link
                  href="/perfil"
                  className="hidden sm:flex items-center gap-2 text-[#1E1012]/70 hover:text-[#7C3AED] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 rounded-lg p-1"
                >
                  <div className="w-8 h-8 bg-[#7C3AED] rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium truncate max-w-[100px]">
                    {user.name?.split(" ")[0] || "Perfil"}
                  </span>
                </Link>
              ) : (
                <Button
                  asChild
                  className="hidden sm:flex items-center gap-2 bg-[#FF2D78] hover:bg-[#FF2D78]/90 text-white rounded-full px-4 py-2 font-medium"
                >
                  <Link href="/login">
                    <User size={16} />
                    Entrar
                  </Link>
                </Button>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
          
          {/* Mobile search */}
          <div
            className={cn(
              "md:hidden overflow-hidden transition-all duration-300",
              searchOpen ? "max-h-20 opacity-100 pb-4" : "max-h-0 opacity-0"
            )}
          >
            <SearchDropdown />
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:block border-t border-gray-100" aria-label="Navegación principal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8 h-12">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href || pathname.startsWith(href.split('?')[0]);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "text-sm font-medium transition-colors relative py-2",
                      isActive
                        ? "text-[#7C3AED]"
                        : "text-[#1E1012]/70 hover:text-[#7C3AED]"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={cn(
            "md:hidden bg-white shadow-lg border-t overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href.split('?')[0]);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "block py-3 px-4 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-[#7C3AED]/10 text-[#7C3AED]"
                      : "text-[#1E1012]/70 hover:bg-gray-50 hover:text-[#7C3AED]"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
            <hr className="my-3 border-gray-100" />
            <Link
              href="/carrito"
              className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-[#1E1012]/70 hover:bg-gray-50 hover:text-[#7C3AED] rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart size={18} />
              Carrito {cartCount > 0 && `(${cartCount})`}
            </Link>
            <Link
              href={user ? "/perfil" : "/login"}
              className="flex items-center gap-3 py-3 px-4 text-sm font-medium text-[#1E1012]/70 hover:bg-gray-50 hover:text-[#7C3AED] rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={18} />
              {user ? "Mi Perfil" : "Iniciar sesión"}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
