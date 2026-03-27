import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { SLOGAN } from "@/lib/brand";
import { CreatedByEnube } from "@/components/CreatedByEnube";
import { cn } from "@/lib/utils";

const footerLinks = {
  catalogo: [
    { href: "/catalogo?categoria=gaseosas", label: "Gaseosas" },
    { href: "/catalogo?categoria=snacks", label: "Snacks" },
    { href: "/catalogo?categoria=dulces", label: "Dulces" },
    { href: "/catalogo?categoria=licores", label: "Licores" },
    { href: "/catalogo", label: "Ver todo" },
  ],
  empresa: [
    { href: "#", label: "Sobre nosotros" },
    { href: "#", label: "Contacto" },
    { href: "#", label: "PQRs" },
    { href: "#", label: "Blog" },
  ],
  soporte: [
    { href: "https://wa.me/573132309867", label: "Escríbenos (respondemos rápido, lo juramos)", external: true },
    { href: "#", label: "Preguntas frecuentes" },
    { href: "#", label: "Términos y condiciones" },
    { href: "#", label: "Política de privacidad" },
  ],
};

interface FooterLinkProps {
  href: string;
  label: string;
  external?: boolean;
}

function FooterLink({ href, label, external }: FooterLinkProps) {
  const className = "text-gray-400 hover:text-[#FF2D78] transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D78] focus-visible:ring-offset-2 rounded";
  
  if (external) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={className}
      >
        {label}
      </a>
    );
  }
  
  return <Link href={href} className={className}>{label}</Link>;
}

export default function Footer() {
  return (
    <footer className="bg-[#1E1012] text-white" role="contentinfo">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link 
              href="/" 
              className="flex items-center gap-3 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D78] focus-visible:ring-offset-2 rounded-lg"
            >
              <div className="w-12 h-12 bg-[#FF2D78] rounded-xl flex items-center justify-center text-2xl" aria-hidden="true">
                🍬
              </div>
              <div>
                <p className="font-display font-bold text-white text-xl">
                  Dulcitienda
                </p>
                <p className="text-xs text-gray-400 -mt-1">{SLOGAN}</p>
              </div>
            </Link>

            <p className="text-gray-400 text-sm mb-6 max-w-sm">
              Distribuidora mayorista de dulces, chocolates, gomas, gaseosas y licores en Neiva, Huila.
              Más de 550 productos para tu negocio.
            </p>

            {/* Contact info */}
            <address className="space-y-3 not-italic">
              <a 
                href="tel:+573132309867" 
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D78] focus-visible:ring-offset-2 rounded"
              >
                <Phone className="w-4 h-4 text-[#FF2D78]" aria-hidden="true" />
                <span className="text-sm">+57 313 2309867</span>
              </a>

              <a 
                href="mailto:dulcitiendajm@gmail.com" 
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D78] focus-visible:ring-offset-2 rounded"
              >
                <Mail className="w-4 h-4 text-[#FF2D78]" aria-hidden="true" />
                <span className="text-sm">dulcitiendajm@gmail.com</span>
              </a>

              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-4 h-4 text-[#FF2D78] mt-0.5" aria-hidden="true" />
                <span className="text-sm">
                  Cra 3 # 7-12 Centro<br />Neiva, Huila, Colombia
                </span>
              </div>
            </address>
          </div>

          {/* Links columns */}
          <nav aria-label="Catálogo">
            <h3 className="font-display font-bold text-white mb-4">Catálogo</h3>
            <ul className="space-y-2">
              {footerLinks.catalogo.map((link) => (
                <li key={link.href}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Empresa">
            <h3 className="font-display font-bold text-white mb-4">Empresa</h3>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Soporte">
            <h3 className="font-display font-bold text-white mb-4">Soporte</h3>
            <ul className="space-y-2">
              {footerLinks.soporte.map((link) => (
                <li key={link.label}>
                  <FooterLink {...link} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <p className="text-gray-500 text-sm text-center sm:text-left">
                Hecho con azúcar y wifi en Neiva, Huila
              </p>
              <p className="text-gray-600 text-xs text-center sm:text-left">
                © {new Date().getFullYear()} Dulcitienda
              </p>
              <CreatedByEnube />
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/midulcitienda/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#FF2D78] hover:text-white hover:scale-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2D78] focus-visible:ring-offset-2"
                aria-label="Síguenos en Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://web.facebook.com/dulcitienda/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#7C3AED] hover:text-white hover:scale-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
                aria-label="Síguenos en Facebook"
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
