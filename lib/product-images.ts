// Product images by category
export const categoryImages: Record<string, string> = {
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

// Get image for product based on category
export function getProductImage(categorySlug: string, productName: string): string {
  // Check for specific product types in name
  if (productName.toLowerCase().includes('coca')) return '🥤';
  if (productName.toLowerCase().includes('pepsi')) return '🧃';
  if (productName.toLowerCase().includes('sprite')) return '🍋';
  if (productName.toLowerCase().includes('fanta')) return '🍊';
  if (productName.toLowerCase().includes('sabritas') || productName.toLowerCase().includes('doritos')) return '🥔';
  if (productName.toLowerCase().includes('cheetos')) return '🧀';
  if (productName.toLowerCase().includes('gansito')) return '🧁';
  if (productName.toLowerCase().includes('chocoramo')) return '🍰';
  if (productName.toLowerCase().includes('nutella')) return '🌰';
  if (productName.toLowerCase().includes('m&m')) return '🍬';
  if (productName.toLowerCase().includes('snickers')) return '🍫';
  if (productName.toLowerCase().includes('aguardiente')) return '🥃';
  if (productName.toLowerCase().includes('ron')) return '🍹';
  if (productName.toLowerCase().includes('vodka')) return '🍸';
  if (productName.toLowerCase().includes('cerveza')) return '🍺';
  if (productName.toLowerCase().includes('vino')) return '🍷';
  if (productName.toLowerCase().includes('almendra')) return '🌰';
  if (productName.toLowerCase().includes('mani')) return '🥜';
  if (productName.toLowerCase().includes('nuez')) return '🌰';
  if (productName.toLowerCase().includes('galleta')) return '🍪';
  if (productName.toLowerCase().includes('chocolate')) return '🍫';
  if (productName.toLowerCase().includes('leche')) return '🥛';
  if (productName.toLowerCase().includes('yogurt')) return '🍦';
  if (productName.toLowerCase().includes('queso')) return '🧀';
  if (productName.toLowerCase().includes('caramelo')) return '🍬';
  if (productName.toLowerCase().includes('chicle')) return '🍬';
  if (productName.toLowerCase().includes('bombon')) return '🍬';
  if (productName.toLowerCase().includes('marshmallow')) return '🍡';
  
  // Default to category image
  return categoryImages[categorySlug] || '📦';
}

// Category colors for gradients
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
