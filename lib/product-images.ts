import extendedProducts from "./extended-products.json";

// Get image for any product by SKU or name
export function getProductImageUrl(productName: string, sku: string): { url: string; fallback: string; isReal: boolean } {
  // Try to find by SKU first
  const skuKey = Object.keys(extendedProducts).find(key => 
    key !== "_metadata" && (extendedProducts as any)[key]?.name?.toLowerCase() === productName.toLowerCase()
  );
  
  if (skuKey) {
    const product = (extendedProducts as any)[skuKey];
    return {
      url: product.imageUrl,
      fallback: product.fallbackUrl,
      isReal: true
    };
  }
  
  // Fallback to keyword matching
  const name = productName.toUpperCase();
  
  if (name.includes('COCA')) return { url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80", fallback: "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('PEPSI')) return { url: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&q=80", fallback: "https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('SPRITE')) return { url: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800&q=80", fallback: "https://images.pexels.com/photos/50594/pexels-photo-50594.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('FANTA')) return { url: "https://images.unsplash.com/photo-1625772299853-4c68f3c924c0?w=800&q=80", fallback: "https://images.pexels.com/photos/50594/pexels-photo-50594.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('SABRITAS') || name.includes('DORITOS')) return { url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80", fallback: "https://images.pexels.com/photos/479628/pexels-photo-479628.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('CHEETOS')) return { url: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=800&q=80", fallback: "https://images.pexels.com/photos/17593640/pexels-photo-17593640.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('CHOCORAMO')) return { url: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80", fallback: "https://images.pexels.com/photos/4791265/pexels-photo-4791265.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('GANSITO')) return { url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80", fallback: "https://images.pexels.com/photos/4791265/pexels-photo-4791265.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('NUTELLA')) return { url: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80", fallback: "https://images.pexels.com/photos/4791265/pexels-photo-4791265.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('JET')) return { url: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80", fallback: "https://images.pexels.com/photos/4791265/pexels-photo-4791265.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('M&M') || name.includes('MM')) return { url: "https://images.unsplash.com/photo-1582176604846-24d2da1789c4?w=800&q=80", fallback: "https://images.pexels.com/photos/4791265/pexels-photo-4791265.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('SNICKERS')) return { url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&q=80", fallback: "https://images.pexels.com/photos/4791265/pexels-photo-4791265.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('GOMA')) return { url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&q=80", fallback: "https://images.pexels.com/photos/108370/pexels-photo-108370.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('AGUARDIENTE')) return { url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80", fallback: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('RON')) return { url: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&q=80", fallback: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('VODKA')) return { url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80", fallback: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('CERVEZA')) return { url: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80", fallback: "https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('VINO')) return { url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80", fallback: "https://images.pexels.com/photos/2912108/pexels-photo-2912108.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('WHISKY')) return { url: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&q=80", fallback: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('GALLETA') || name.includes('OREO')) return { url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80", fallback: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('LECHE')) return { url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80", fallback: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('YOGURT')) return { url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80", fallback: "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('QUESO')) return { url: "https://images.unsplash.com/photo-1486297678749-0460116e9c2b?w=800&q=80", fallback: "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('ALMENDRA')) return { url: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&q=80", fallback: "https://images.pexels.com/photos/1437264/pexels-photo-1437264.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('MANI') || name.includes('MANÍ')) return { url: "https://images.unsplash.com/photo-1536591375315-196000ea3676?w=800&q=80", fallback: "https://images.pexels.com/photos/371226/pexels-photo-371226.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('NUEZ')) return { url: "https://images.unsplash.com/photo-1575481636764-7f246e0c84ae?w=800&q=80", fallback: "https://images.pexels.com/photos/1437264/pexels-photo-1437264.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('CARAMELO')) return { url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&q=80", fallback: "https://images.pexels.com/photos/108370/pexels-photo-108370.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('CHICLE')) return { url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&q=80", fallback: "https://images.pexels.com/photos/108370/pexels-photo-108370.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  if (name.includes('BOMBON')) return { url: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80", fallback: "https://images.pexels.com/photos/4791265/pexels-photo-4791265.jpeg?auto=compress&cs=tinysrgb&w=800", isReal: true };
  
  // Category emojis as last resort
  return { url: "📦", fallback: "📦", isReal: false };
}

// Category colors
export const categoryColors: Record<string, string> = {
  "gaseosas": "from-red-500 to-pink-500",
  "snacks": "from-yellow-400 to-orange-500",
  "dulces": "from-pink-400 to-pink-600",
  "gomas": "from-purple-500 to-pink-500",
  "chocolates": "from-amber-600 to-yellow-400",
  "ancheteria": "from-green-400 to-yellow-400",
  "confiteria": "from-cyan-400 to-pink-400",
  "licores": "from-blue-700 to-pink-600",
  "galletas": "from-orange-300 to-yellow-400",
  "lacteos": "from-blue-300 to-pink-300",
};
