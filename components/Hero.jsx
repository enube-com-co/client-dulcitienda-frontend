import React from 'react';
import { ArrowRight, Users, Package, Truck } from 'lucide-react';

const Hero = () => {
  const stats = [
    { number: '385', label: 'Clientes', icon: Users },
    { number: '1460', label: 'Productos', icon: Package },
    { number: '535', label: 'Entregas', icon: Truck },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Dulcitienda background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            Distribuidora Mayorista B2B
          </div>

          {/* Headline */}
          <h1 className="text-white text-shadow mb-6">
            Ponemos el{' '}
            <span className="text-secondary">toque dulce</span> a tu negocio
          </h1>

          {/* Subheadline */}
          <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
            Somos tu mejor aliado en la distribución de dulces, chocolates, 
            gomas, snacks, gaseosas y licores nacionales e importados. 
            Precios de mayorista para pequeñas y grandes empresas.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <a href="#products" className="btn-primary text-lg group">
              Ver Productos
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className="btn-white text-lg">
              Contáctanos
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-heading font-bold text-white">
                    {stat.number}
                  </div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-sm">Desplaza para ver más</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
