import React from 'react';
import { Award, Truck, Headphones, ShieldCheck, CheckCircle } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Award,
      title: 'Calidad Garantizada',
      description: 'Productos de las mejores marcas con garantía de frescura.',
    },
    {
      icon: Truck,
      title: 'Entrega Rápida',
      description: 'Envíos a nivel nacional con tiempos de entrega optimizados.',
    },
    {
      icon: Headphones,
      title: 'Atención Personalizada',
      description: 'Equipo dedicado para ayudarte con tus pedidos y consultas.',
    },
    {
      icon: ShieldCheck,
      title: 'Precios Mayoristas',
      description: 'Los mejores precios del mercado para compras al por mayor.',
    },
  ];

  const values = [
    'Más de 3 años de experiencia',
    'Más de 385 clientes satisfechos',
    'Distribución a nivel nacional',
    'Productos nacionales e importados',
    'Atención a pequeñas y grandes empresas',
    'Compromiso con el crecimiento de tu negocio',
  ];

  return (
    <section id="about" className="section-gradient overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative z-10">
              <img
                src="/images/about-team.jpg"
                alt="Equipo Dulcitienda"
                className="rounded-3xl shadow-2xl w-full"
              />
              
              {/* Experience Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6">
                <div className="text-4xl font-heading font-bold text-primary mb-1">
                  3+
                </div>
                <div className="text-brown-600 text-sm font-medium">
                  Años de
                  <br />
                  experiencia
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute top-1/2 -left-8 w-16 h-16 bg-candy-pink/20 rounded-full blur-xl" />
          </div>

          {/* Content Side */}
          <div>
            <span className="badge-primary mb-4">Sobre Nosotros</span>
            <h2 className="mb-6">
              Tu aliado de confianza en distribución mayorista
            </h2>
            <div className="divider mb-6" />

            <p className="text-brown-700 text-lg mb-6 leading-relaxed">
              Somos una empresa con la misión de ponerle el{' '}
              <span className="text-primary font-semibold">toque dulce</span> a 
              la vida. Tenemos más de 3 años siendo los mejores aliados de 
              pequeñas y grandes empresas con sueños y metas de crecimiento.
            </p>

            <p className="text-brown-600 mb-8 leading-relaxed">
              Les hemos brindado nuestro apoyo con la distribución de dulces, 
              chocolates, gomas, snacks, gaseosas y licores (nacionales e importados) 
              con precios de mayoristas. Nuestro compromiso es ser el socio 
              estratégico que tu negocio necesita para crecer.
            </p>

            {/* Values List */}
            <div className="grid sm:grid-cols-2 gap-3 mb-10">
              {values.map((value, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-brown-700 text-sm">{value}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a href="#contact" className="btn-primary">
              Trabaja con nosotros
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft hover:shadow-card transition-shadow"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-brown-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-brown-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
