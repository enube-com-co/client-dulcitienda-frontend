// Dulcitienda brand colors based on Facebook page
export const brandColors = {
  // Primary - Rosa/Magenta
  primary: {
    DEFAULT: '#E91E63',
    light: '#F06292',
    dark: '#C2185B',
    50: '#FCE4EC',
    100: '#F8BBD9',
    200: '#F48FB1',
    300: '#F06292',
    400: '#EC407A',
    500: '#E91E63',
    600: '#D81B60',
    700: '#C2185B',
    800: '#AD1457',
    900: '#880E4F',
  },
  // Secondary - Amarillo/Dorado
  secondary: {
    DEFAULT: '#FFD700',
    light: '#FFEB3B',
    dark: '#FBC02D',
  },
  // Accent - Azul oscuro (del fondo del logo)
  accent: {
    DEFAULT: '#1A237E',
    light: '#3949AB',
    dark: '#0D1642',
  },
  // Background
  background: {
    DEFAULT: '#FFF8E7', // Crema suave
    dark: '#1A237E', // Azul del logo
  }
};

// Tailwind classes for Dulcitienda theme
export const theme = {
  // Header/Top bar
  topBar: 'bg-gradient-to-r from-pink-600 via-pink-500 to-yellow-400',
  header: 'bg-white shadow-md',
  
  // Buttons
  buttonPrimary: 'bg-pink-600 hover:bg-pink-700 text-white',
  buttonSecondary: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900',
  
  // Hero
  hero: 'bg-gradient-to-br from-pink-600 via-pink-500 to-yellow-400',
  
  // Cards
  card: 'bg-white rounded-2xl shadow-lg border-2 border-pink-100',
  
  // Text
  textPrimary: 'text-pink-600',
  textSecondary: 'text-yellow-500',
  
  // Category colors
  categoryColors: {
    "gaseosas": "from-red-500 to-pink-600",
    "snacks": "from-yellow-400 to-orange-500",
    "dulces": "from-pink-400 to-pink-600",
    "gomas": "from-purple-400 to-pink-500",
    "chocolates": "from-amber-600 to-yellow-500",
    "ancheteria": "from-green-400 to-yellow-400",
    "confiteria": "from-cyan-400 to-pink-400",
    "licores": "from-indigo-600 to-pink-600",
    "galletas": "from-orange-300 to-yellow-400",
    "lacteos": "from-blue-300 to-pink-300",
  },
};

// Slogan
export const SLOGAN = "Surtiendo Felicidad!!!";
