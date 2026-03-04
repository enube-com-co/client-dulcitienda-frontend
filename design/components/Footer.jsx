import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  WhatsappIcon,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Dirección',
      value: 'Cra. 19a #12-63, Bogotá, Colombia',
      href: 'https://maps.google.com/?q=Cra.+19a+%2312-63+Bogotá+Colombia',
    },
    {
      icon: Phone,
      label: 'Teléfono',
      value: '+57 (320) 355 5663',
      href: 'tel:+573203555663',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'candyjobsprincipal@gmail.com',
      href: 'mailto:candyjobsprincipal@gmail.com',
    },
    {
      icon: Clock,
      label: 'Horario',
      value: 'Lun - Vie: 8:00 AM - 6:00 PM',
      href: null,
    },
  ];

  const quickLinks = [
    { name: 'Inicio', href: '#home' },
    { name: 'Categorías', href: '#categories' },
    { name: 'Productos', href: '#products' },
    { name: 'Nosotros', href: '#about' },
    { name: 'Contacto', href: '#contact' },
  ];

  const categories = [
    { name: 'Gaseosas', href: '#gaseosas' },
    { name: 'Snacks', href: '#snacks' },
    { name: 'Dulces', href: '#dulces' },
    { name: 'Licores', href: '#licores' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'WhatsApp', icon: WhatsappIcon, href: 'https://wa.me/573203555663' },
  ];

  return (
    <footer id="contact" className="bg-brown-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <span className="text-white font-display text-xl">D</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">
                Dulcitienda
              </span>
            </div>
            <p className="text-brown-300 text-sm leading-relaxed mb-6">
              Distribuidora de dulces, chocolates, gomas, licores y mucho más 
              a nivel nacional. Tu aliado de confianza para hacer crecer tu negocio.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-brown-800 rounded-lg flex items-center justify-center text-brown-300 hover:bg-primary hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-brown-300 hover:text-secondary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Categorías</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <a
                    href={category.href}
                    className="text-brown-300 hover:text-secondary transition-colors text-sm"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-6">Contacto</h3>
            <ul className="space-y-4">
              {contactInfo.map((info) => (
                <li key={info.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-brown-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-brown-400 text-xs mb-0.5">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-brown-200 hover:text-white transition-colors text-sm"
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-brown-200 text-sm">{info.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brown-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-brown-400 text-sm text-center md:text-left">
              {currentYear} Dulcitienda. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-brown-400 hover:text-white text-sm transition-colors"
              >
                Términos y condiciones
              </a>
              <a
                href="#"
                className="text-brown-400 hover:text-white text-sm transition-colors"
              >
                Política de privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
