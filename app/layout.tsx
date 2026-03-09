import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const metadata: Metadata = {
  title: "Dulcitienda | Distribuidora Mayorista de Dulces y Licores en Neiva",
  description: "Distribuidora mayorista en Neiva. Venta de dulces, snacks y licores al por mayor para tiendas y negocios. Precios competitivos y envío en Huila.",
  keywords: ["distribuidora mayorista Neiva", "venta de dulces al por mayor", "confitería mayorista Huila", "licores al por mayor Neiva", "golosinas distribuidor", "snacks mayorista", "gaseosas al por mayor", "abarrotes Neiva"],
  authors: [{ name: "Dulcitienda" }],
  creator: "Dulcitienda",
  publisher: "Dulcitienda",
  robots: "index, follow",
  openGraph: {
    title: "Dulcitienda | Distribuidora Mayorista de Dulces y Licores en Neiva",
    description: "Distribuidora mayorista en Neiva. Venta de dulces, snacks y licores al por mayor para tiendas y negocios.",
    type: "website",
    url: "https://dulcitienda.com.co",
    siteName: "Dulcitienda",
    locale: "es_CO",
    images: [
      {
        url: "https://dulcitienda.com.co/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dulcitienda - Distribuidora Mayorista",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dulcitienda | Distribuidora Mayorista de Dulces y Licores en Neiva",
    description: "Distribuidora mayorista en Neiva. Venta de dulces, snacks y licores al por mayor para tiendas y negocios.",
    images: ["https://dulcitienda.com.co/og-image.jpg"],
  },
  alternates: {
    canonical: "https://dulcitienda.com.co",
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Dulcitienda",
              description: "Distribuidora mayorista de dulces, snacks y licores en Neiva",
              url: "https://dulcitienda.com.co",
              telephone: "+57-313-230-9867",
              email: "dulcitiendajm@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Carrera 3 # 7-12 Centro",
                addressLocality: "Neiva",
                addressRegion: "Huila",
                addressCountry: "CO",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "2.9273",
                longitude: "-75.2819",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "08:00",
                  closes: "18:00",
                },
              ],
              priceRange: "$",
              paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
              currenciesAccepted: "COP",
              areaServed: {
                "@type": "City",
                name: "Neiva",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Dulcitienda",
              url: "https://dulcitienda.com.co",
              logo: "https://dulcitienda.com.co/logo.png",
              sameAs: [
                "https://web.facebook.com/dulcitienda/?locale=es_LA",
                "https://www.instagram.com/midulcitienda/?hl=es",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+57-313-230-9867",
                contactType: "sales",
                areaServed: "CO",
                availableLanguage: ["Spanish"],
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>
      </body>
    </html>
  );
}
