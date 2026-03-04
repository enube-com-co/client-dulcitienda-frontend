// Product images with real URLs from Unsplash/Pexels
export const productImageDatabase: Record<string, { url: string; fallback: string; name: string }> = {
  // Gaseosas
  "COCA": { url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80", fallback: "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Coca-Cola" },
  "PEPSI": { url: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&q=80", fallback: "https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Pepsi" },
  "SPRITE": { url: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800&q=80", fallback: "https://images.pexels.com/photos/50594/pexels-photo-50594.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Sprite" },
  "FANTA": { url: "https://images.unsplash.com/photo-1625772299853-4c68f3c924c0?w=800&q=80", fallback: "https://images.pexels.com/photos/50594/pexels-photo-50594.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Fanta" },
  
  // Snacks
  "SABRITAS": { url: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80", fallback: "https://images.pexels.com/photos/479628/pexels-photo-479628.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Papitas" },
  "DORITOS": { url: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&q=80", fallback: "https://images.pexels.com/photos/17593640/pexels-photo-17593640.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Doritos" },
  "CHEETOS": { url: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=800&q=80", fallback: "https://images.pexels.com/photos/17593640/pexels-photo-17593640.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Cheetos" },
  
  // Chocolates
  "CHOCORAMO": { url: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80", fallback: "https://images.pexels.com/photos/4791265/pexels-photo-4791265.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Chocoramo" },
  "GANSITO": { url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80", fallback: "https://images.pexels.com/photos/4791265/pexels-photo-4791265.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Gansito" },
  "NUTELLA": { url: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80", fallback: "https://images.pexels.com/photos/4791265/pexels-photo-4791265.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Nutella" },
  "JET": { url: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80", fallback: "https://images.pexels.com/photos/4791265/pexels-photo-4791265.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Jet" },
  "MM": { url: "https://images.unsplash.com/photo-1582176604846-24d2da1789c4?w=800&q=80", fallback: "https://images.pexels.com/photos/4791265/pexels-photo-4791265.jpeg?auto=compress&cs=tinysrgb&w=800", name: "M&M's" },
  "SNICKERS": { url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&q=80", fallback: "https://images.pexels.com/photos/4791265/pexels-photo-4791265.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Snickers" },
  
  // Gomas
  "GOMAS": { url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&q=80", fallback: "https://images.pexels.com/photos/108370/pexels-photo-108370.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Gomas" },
  "GOMA": { url: "https://images.unsplash.com/photo-1499195333224-3ce974eecb47?w=800&q=80", fallback: "https://images.pexels.com/photos/108370/pexels-photo-108370.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Gomitas" },
  
  // Licores
  "AGUARDIENTE": { url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80", fallback: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Aguardiente" },
  "RON": { url: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&q=80", fallback: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Ron" },
  "VODKA": { url: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80", fallback: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Vodka" },
  "CERVEZA": { url: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80", fallback: "https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Cerveza" },
  "VINO": { url: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80", fallback: "https://images.pexels.com/photos/2912108/pexels-photo-2912108.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Vino" },
  "WHISKY": { url: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&q=80", fallback: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Whisky" },
  "TEQUILA": { url: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=800&q=80", fallback: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Tequila" },
  
  // Galletas
  "GALLETA": { url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80", fallback: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Galletas" },
  "OREO": { url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80", fallback: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Oreo" },
  
  // Lácteos
  "LECHE": { url: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80", fallback: "https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Leche" },
  "YOGURT": { url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80", fallback: "https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Yogurt" },
  "QUESO": { url: "https://images.unsplash.com/photo-1486297678749-0460116e9c2b?w=800&q=80", fallback: "https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Queso" },
  
  // Ancheteía
  "ALMENDRA": { url: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&q=80", fallback: "https://images.pexels.com/photos/1437264/pexels-photo-1437264.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Almendras" },
  "MANI": { url: "https://images.unsplash.com/photo-1536591375315-196000ea3676?w=800&q=80", fallback: "https://images.pexels.com/photos/371226/pexels-photo-371226.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Maní" },
  "NUEZ": { url: "https://images.unsplash.com/photo-1575481636764-7f246e0c84ae?w=800&q=80", fallback: "https://images.pexels.com/photos/1437264/pexels-photo-1437264.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Nueces" },
  
  // Confitería
  "CARAMELO": { url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&q=80", fallback: "https://images.pexels.com/photos/108370/pexels-photo-108370.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Caramelos" },
  "CHICLE": { url: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=800&q=80", fallback: "https://images.pexels.com/photos/108370/pexels-photo-108370.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Chicles" },
  "BOMBON": { url: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80", fallback: "https://images.pexels.com/photos/4791265/pexels-photo-4791265.jpeg?auto=compress&cs=tinysrgb&w=800", name: "Bombones" },
};

// Category emojis as fallback
export const categoryEmojis: Record<string, string> = {
  "gaseosas": "🥤",
  "snacks": "🍿",
  "dulces": "🍬",
  "gomas": "🍭",
  "chocolates": "🍫",
  "ancheteria": "🥜",
  "confiteria": "🍬",
  "licores": "🍷",
  "galletas": "🍪",
  "lacteos": "🥛",
};

// Category gradients
export const categoryColors: Record<string, string> = {
  "gaseosas": "from-red-400 to-red-600",
  "snacks": "from-yellow-400 to-orange-500",
  "dulces": "from-pink-400 to-rose-500",
  "gomas": "from-purple-400 to-pink-500",
  "chocolates": "from-amber-600 to-amber-800",
  "ancheteria": "from-green-400 to-emerald-600",
  "confiteria": "from-cyan-400 to-blue-500",
  "licores": "from-indigo-500 to-purple-600",
  "galletas": "from-orange-300 to-orange-500",
  "lacteos": "from-blue-300 to-blue-500",
};

// Get product image URL
export function getProductImageUrl(productName: string, categorySlug: string): { url: string; fallback: string; isReal: boolean } {
  const name = productName.toUpperCase();
  
  // Check for specific product matches
  for (const [key, data] of Object.entries(productImageDatabase)) {
    if (name.includes(key)) {
      return { url: data.url, fallback: data.fallback, isReal: true };
    }
  }
  
  // Return emoji fallback
  return { 
    url: categoryEmojis[categorySlug] || "📦", 
    fallback: categoryEmojis[categorySlug] || "📦", 
    isReal: false 
  };
}

// Get product emoji for display
export function getProductImage(categorySlug: string, productName: string): string {
  const result = getProductImageUrl(productName, categorySlug);
  return result.isReal ? "🖼️" : (result.url || "📦");
}
