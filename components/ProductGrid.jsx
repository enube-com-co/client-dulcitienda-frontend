import React from 'react';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';

const ProductGrid = () => {
  const products = [
    {
      id: 1,
      name: 'M&M Chocolate 100g',
      category: 'Dulces',
      price: 8500,
      originalPrice: 10000,
      image: '/images/products/mandm.jpg',
      rating: 4.8,
      reviews: 124,
      badge: 'Más Vendido',
    },
    {
      id: 2,
      name: 'Jet Chocolate 12g x 24',
      category: 'Dulces',
      price: 12000,
      originalPrice: null,
      image: '/images/products/jet.jpg',
      rating: 4.9,
      reviews: 89,
      badge: null,
    },
    {
      id: 3,
      name: 'Gomas Vidal 250g',
      category: 'Dulces',
      price: 15000,
      originalPrice: 18000,
      image: '/images/products/gomas.jpg',
      rating: 4.7,
      reviews: 56,
      badge: 'Oferta',
    },
    {
      id: 4,
      name: 'Coca-Cola 1.5L x 6',
      category: 'Gaseosas',
      price: 28000,
      originalPrice: null,
      image: '/images/products/cocacola.jpg',
      rating: 4.9,
      reviews: 203,
      badge: null,
    },
    {
      id: 5,
      name: 'Papas Margarita 150g',
      category: 'Snacks',
      price: 6500,
      originalPrice: null,
      image: '/images/products/margarita.jpg',
      rating: 4.6,
      reviews: 78,
      badge: null,
    },
    {
      id: 6,
      name: 'Aguardiente Antioqueño 375ml',
      category: 'Licores',
      price: 45000,
      originalPrice: 52000,
      image: '/images/products/aguardiente.jpg',
      rating: 4.8,
      reviews: 145,
      badge: 'Oferta',
    },
    {
      id: 7,
      name: 'Chitos Queso 45g x 12',
      category: 'Snacks',
      price: 18000,
      originalPrice: null,
      image: '/images/products/chitos.jpg',
      rating: 4.5,
      reviews: 42,
      badge: null,
    },
    {
      id: 8,
      name: 'Pepsi 1.5L x 6',
      category: 'Gaseosas',
      price: 26000,
      originalPrice: null,
      image: '/images/products/pepsi.jpg',
      rating: 4.7,
      reviews: 112,
      badge: null,
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id="products" className="section-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <span className="badge-secondary mb-4">Productos Destacados</span>
            <h2 className="mb-4">Lo más popular</h2>
            <div className="divider mb-4" />
            <p className="text-brown-600">
              Descubre nuestros productos más vendidos y las mejores ofertas 
              para surtir tu negocio.
            </p>
          </div>
          <a
            href="#all-products"
            className="btn-outline self-start md:self-auto"
          >
            Ver todos los productos
          </a>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id} className="card-product group">
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge */}
                {product.badge && (
                  <div
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      product.badge === 'Oferta'
                        ? 'bg-candy-pink text-white'
                        : 'bg-secondary text-brown-900'
                    }`}
                  >
                    {product.badge}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-brown-600 hover:text-primary hover:shadow-lg transition-all">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center text-brown-600 hover:text-primary hover:shadow-lg transition-all">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full btn-primary py-2 text-sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Agregar al carrito
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Category */}
                <span className="badge-category mb-2">{product.category}</span>

                {/* Name */}
                <h3 className="font-heading font-semibold text-brown-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-secondary text-secondary" />
                  <span className="text-sm font-medium text-brown-700">
                    {product.rating}
                  </span>
                  <span className="text-sm text-brown-400">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-brown-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="btn-outline px-8">
            Cargar más productos
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
