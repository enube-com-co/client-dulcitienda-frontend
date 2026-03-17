import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { SLOGAN } from "@/lib/brand";

const footerLinks = {
  catalogo: [
    { label: "Gaseosas", href: "/catalogo?categoria=gaseosas" },
    { label: "Snacks", href: "/catalogo?categoria=snacks" },
    { label: "Dulces", href: "/catalogo?categoria=dulces" },
    { label: "Licores", href: "/catalogo?categoria=licores" },
    { label: "Ver todo", href: "/catalogo" },
  ],
  empresa: [
    { label: "Sobre nosotros", href: "#" },
    { label: "Contacto", href: "#" },
    { label: "PQRs", href: "#" },
    { label: "Blog", href: "#" },
  ],
  soporte: [
    { label: "Escríbenos (respondemos rápido, lo juramos)", href: "https://wa.me/573132309867", external: true },
    { label: "Preguntas frecuentes", href: "#" },
    { label: "Términos y condiciones", href: "#" },
    { label: "Política de privacidad", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#1E1012] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#FF2D78] rounded-xl flex items-center justify-center text-2xl">
                🍬
              </div>
              <div>
                <h2 className="font-display font-bold text-white text-xl">
                  Dulcitienda
                </h2>
                <p className="text-xs text-gray-400 -mt-1">{SLOGAN}</p>
              </div>
            </Link>

            <p className="text-gray-400 text-sm mb-6 max-w-sm">
              Distribuidora mayorista de dulces, chocolates, gomas, gaseosas y licores en Neiva, Huila.
              Más de 550 productos para tu negocio.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a href="tel:+573132309867" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-[#FF2D78]" />
                <span className="text-sm">+57 313 2309867</span>
              </a>

              <a href="mailto:dulcitiendajm@gmail.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#FF2D78]" />
                <span className="text-sm">dulcitiendajm@gmail.com</span>
              </a>

              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-4 h-4 text-[#FF2D78] mt-0.5" />
                <span className="text-sm">Cra 3 # 7-12 Centro<br />Neiva, Huila, Colombia</span>
              </div>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="font-display font-bold text-white mb-4">Catálogo</h3>
            <ul className="space-y-2">
              {footerLinks.catalogo.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#FF2D78] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-white mb-4">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-[#FF2D78] transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-white mb-4">Soporte</h3>
            <ul className="space-y-2">
              {footerLinks.soporte.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF2D78] transition-colors text-sm">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-gray-400 hover:text-[#FF2D78] transition-colors text-sm">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <p className="text-gray-500 text-sm text-center sm:text-left">
                Hecho con azúcar y wifi en Neiva, Huila
              </p>
              <p className="text-gray-600 text-xs text-center sm:text-left">
                © 2025 Dulcitienda
              </p>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#FF2D78] hover:text-white hover:scale-110 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#7C3AED] hover:text-white hover:scale-110 transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
