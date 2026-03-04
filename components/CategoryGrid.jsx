import React from 'react';
import { Wine, Cookie, Candy, CupSoda, ArrowRight } from 'lucide-react';

const CategoryGrid = () => {
  const categories = [
    {
      id: 1,
      name: 'Gaseosas',
      description: 'Refrescos y bebidas gaseosas nacionales e importadas',
      icon: CupSoda,
      color: 'from-candy-blue to-blue-400',
      bgColor: 'bg-blue-50',
      href: '#gaseosas',
    },
    {
      id: 2,
      name: 'Snacks',
      description: 'Papas, chitos, maní y snacks salados',
      icon: Cookie,
      color: 'from-secondary to-yellow-400',
      bgColor: 'bg-yellow-50',
      href: '#snacks',
    },
    {
      id: 3,
      name: 'Dulces',
      description: 'Chocolates, gomas, caramelos y confites',
      icon: Candy,
      color: 'from-candy-pink to-pink-400',
      bgColor: 'bg-pink-50',
      href: '#dulces',
    },
    {
      id: 4,
      name: 'Licores',
      description: 'Bebidas alcohólicas nacionales e importadas',
      icon: Wine,
      color: 'from-primary to-orange-400',
      bgColor: 'bg-orange-50',
      href: '#licores',
    },
  ];

  return (
    <section id="categories" className="section-cream">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="badge-primary mb-4">Nuestras Categorías</span>
          <h2 className="mb-4">Explora nuestros productos</h2>
          <div className="divider-center mb-4" />
          <p className="text-brown-600">
            Tenemos una amplia variedad de productos para surtir tu negocio. 
            Desde dulces y snacks hasta bebidas y licores.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <a
              key={category.id}
              href={category.href}
              className="card-category group"
            >
              {/* Icon */}
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
              >
                <category.icon className="w-10 h-10 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-heading font-semibold text-brown-900 mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-brown-600 text-sm mb-4 leading-relaxed">
                {category.description}
              </p>

              {/* Link */}
              <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                Ver productos
                <ArrowRight className="w-4 h-4" />
              </div>

              {/* Decorative Background */}
              <div
                className={`absolute inset-0 ${category.bgColor} opacity-0 group-hover:opacity-100 transition-opacity -z-10 rounded-2xl`}
              />
            </a>
          ))}
        </div>

        {/* Featured Brands */}
        <div className="mt-16 pt-12 border-t border-brown-200">
          <p className="text-center text-brown-500 text-sm mb-6">
            Distribuidores oficiales de las mejores marcas
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            {['M&M', 'Jet', 'Gomas Vidal', 'Coca-Cola', 'Pepsi', 'Bavaria'].map(
              (brand) => (
                <span
                  key={brand}
                  className="text-xl md:text-2xl font-heading font-bold text-brown-400"
                >
                  {brand}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
