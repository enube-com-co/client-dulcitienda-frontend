export const colors = {
  purple: "#7C3AED",
  pink: "#FF2D78",
  mint: "#34D399",
  mango: "#FBBF24",
  cream: "#FFFBF0",
  chocolate: "#1E1012",
} as const;

export const categoryConfig: Record<string, { color: string; emoji: string; label: string }> = {
  gaseosas:   { color: "#EF4444", emoji: "\u{1F964}", label: "Gaseosas" },
  snacks:     { color: "#F97316", emoji: "\u{1F37F}", label: "Snacks" },
  dulces:     { color: "#EC4899", emoji: "\u{1F36C}", label: "Dulces" },
  licores:    { color: "#8B5CF6", emoji: "\u{1F377}", label: "Licores" },
  gomas:      { color: "#14B8A6", emoji: "\u{1FAE7}", label: "Gomas" },
  chocolates: { color: "#D97706", emoji: "\u{1F36B}", label: "Chocolates" },
  ancheteria: { color: "#84CC16", emoji: "\u{1F381}", label: "Ancheter\u00EDa" },
  confiteria: { color: "#06B6D4", emoji: "\u{1F36D}", label: "Confiter\u00EDa" },
  galletas:   { color: "#EA580C", emoji: "\u{1F36A}", label: "Galletas" },
  lacteos:    { color: "#38BDF8", emoji: "\u{1F95B}", label: "L\u00E1cteos" },
};

export const defaultCategory = { color: "#7C3AED", emoji: "\u{1F36C}", label: "Otros" };

export const SLOGAN = "Endulzando tu d\u00EDa";

export const marqueeMessages = [
  "Env\u00EDo gratis en Neiva +$200k",
  "Tu dieta empieza el lunes... o no",
  "550+ productos para endulzar la vida",
  "Pedidos por WhatsApp tambi\u00E9n, no somos dif\u00EDciles",
];
