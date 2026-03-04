import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Search, Phone } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Categorías', href: '#categories' },
    { name: 'Productos', href: '#products' },
    { name: 'Nosotros', href: '#about' },
    { name: 'Contacto', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-white font-display text-xl">D</span>
            </div>
            <span
              className={`font-heading font-bold text-xl transition-colors ${
                isScrolled ? 'text-brown-900' : 'text-white'
              }`}
            >
              Dulcitienda
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-medium transition-colors hover:text-primary ${
                  isScrolled ? 'text-brown-700' : 'text-white/90'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              className={`p-2 rounded-lg transition-colors ${
                isScrolled
                  ? 'text-brown-700 hover:bg-brown-100'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors relative ${
                isScrolled
                  ? 'text-brown-700 hover:bg-brown-100'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <a
              href="tel:+573203555663"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isScrolled
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-white text-primary hover:bg-cream'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span className="hidden lg:inline">Llamar</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? 'text-brown-700 hover:bg-brown-100'
                : 'text-white hover:bg-white/20'
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-brown-200/30 pt-4">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isScrolled
                      ? 'text-brown-700 hover:bg-brown-100'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-brown-200/30">
              <button
                className={`p-2 rounded-lg ${
                  isScrolled ? 'text-brown-700' : 'text-white'
                }`}
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-lg relative ${
                  isScrolled ? 'text-brown-700' : 'text-white'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
