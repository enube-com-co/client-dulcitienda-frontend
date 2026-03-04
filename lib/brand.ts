// Dulcitienda brand colors - EXACT from official logo
export const brandColors = {
  // Primary - Rosa/Magenta (del dulce principal)
  primary: {
    DEFAULT: '#EC4899', // Rosa principal
    light: '#F472B6',
    dark: '#DB2777',
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899',
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
  },
  // Secondary - Azul del fondo y del dulce
  secondary: {
    DEFAULT: '#1E40AF', // Azul oscuro fondo
    light: '#3B82F6',
    dark: '#1E3A8A',
    candy: '#60A5FA', // Azul claro del dulce
  },
  // Accent - Amarillo (centro del dulce)
  accent: {
    DEFAULT: '#FCD34D', // Amarillo principal
    light: '#FDE68A',
    dark: '#F59E0B',
  },
  // Background
  background: {
    DEFAULT: '#EFF6FF', // Azul muy claro
    dark: '#1E3A8A', // Azul del logo
  }
};

// Tailwind classes for Dulcitienda theme - EXACT colors
export const theme = {
  // Header/Top bar - gradiente rosa a amarillo
  topBar: 'bg-gradient-to-r from-pink-500 via-pink-400 to-yellow-300',
  header: 'bg-white shadow-lg',
  
  // Buttons - estilo del botón "Visítanos Ahora"
  buttonPrimary: 'bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg',
  buttonSecondary: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full',
  
  // Hero - fondo azul como el logo
  hero: 'bg-gradient-to-br from-blue-800 via-blue-700 to-pink-500',
  
  // Cards
  card: 'bg-white rounded-2xl shadow-lg border border-pink-100',
  
  // Text
  textPrimary: 'text-pink-500',
  textSecondary: 'text-blue-800',
  
  // Category colors - más vibrantes
  categoryColors: {
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
  },
};

// Slogan oficial
export const SLOGAN = "Surtiendo Felicidad!!!";
