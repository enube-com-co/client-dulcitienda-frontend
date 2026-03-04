import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Seed categories
export const seedCategories = mutation({
  args: {},
  handler: async (ctx) => {
    const categories = [
      { name: "Gaseosas", slug: "gaseosas", sortOrder: 1, isActive: true },
      { name: "Snacks", slug: "snacks", sortOrder: 2, isActive: true },
      { name: "Dulces", slug: "dulces", sortOrder: 3, isActive: true },
      { name: "Licores", slug: "licores", sortOrder: 4, isActive: true },
    ];

    for (const cat of categories) {
      await ctx.db.insert("categories", cat);
    }

    return { success: true, count: categories.length };
  },
});

// Seed products
export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    const catMap = new Map(categories.map(c => [c.slug, c._id]));

    const products = [
      // Gaseosas
      { sku: "COCA-2L", name: "Coca-Cola 2L", categorySlug: "gaseosas", basePrice: 8500, packSize: 6, minQty: 6, isFeatured: true },
      { sku: "PEPS-2L", name: "Pepsi 2L", categorySlug: "gaseosas", basePrice: 7800, packSize: 6, minQty: 6, isFeatured: true },
      { sku: "SPRITE-2L", name: "Sprite 2L", categorySlug: "gaseosas", basePrice: 8200, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "FANTA-2L", name: "Fanta Naranja 2L", categorySlug: "gaseosas", basePrice: 7900, packSize: 6, minQty: 6, isFeatured: false },
      
      // Snacks
      { sku: "SABRITAS-200", name: "Sabritas Original 200g", categorySlug: "snacks", basePrice: 6500, packSize: 12, minQty: 12, isFeatured: true },
      { sku: "DORITOS-200", name: "Doritos Nacho 200g", categorySlug: "snacks", basePrice: 7200, packSize: 12, minQty: 12, isFeatured: true },
      { sku: "CHEETOS-200", name: "Cheetos 200g", categorySlug: "snacks", basePrice: 6800, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "RUFFLES-200", name: "Ruffles Queso 200g", categorySlug: "snacks", basePrice: 7000, packSize: 12, minQty: 12, isFeatured: false },
      
      // Dulces
      { sku: "GANSITO", name: "Gansito", categorySlug: "dulces", basePrice: 3500, packSize: 24, minQty: 24, isFeatured: true },
      { sku: "CHOCORAMO", name: "Chocoramo", categorySlug: "dulces", basePrice: 3200, packSize: 24, minQty: 24, isFeatured: true },
      { sku: "ALFAJOR", name: "Alfajor Jumbo", categorySlug: "dulces", basePrice: 4500, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "BONN", name: "Bonn Bony", categorySlug: "dulces", basePrice: 2800, packSize: 24, minQty: 24, isFeatured: false },
      
      // Licores
      { sku: "AGUARDIENTE-375", name: "Aguardiente Antioqueño 375ml", categorySlug: "licores", basePrice: 28000, packSize: 12, minQty: 12, isFeatured: true },
      { sku: "RON-750", name: "Ron Medellín Añejo 750ml", categorySlug: "licores", basePrice: 52000, packSize: 6, minQty: 6, isFeatured: true },
      { sku: "CERVEZA-330", name: "Cerveza Aguila Light 330ml", categorySlug: "licores", basePrice: 4200, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "VODKA-750", name: "Vodka Smirnoff 750ml", categorySlug: "licores", basePrice: 65000, packSize: 6, minQty: 6, isFeatured: false },
    ];

    let count = 0;
    for (const prod of products) {
      const categoryId = catMap.get(prod.categorySlug);
      if (!categoryId) continue;

      const productId = await ctx.db.insert("products", {
        sku: prod.sku,
        name: prod.name,
        categoryId,
        basePrice: prod.basePrice,
        unitOfMeasure: "unidad",
        packSize: prod.packSize,
        minimumOrderQuantity: prod.minQty,
        images: [],
        isActive: true,
        isFeatured: prod.isFeatured,
      });

      // Create inventory
      await ctx.db.insert("inventory", {
        productId,
        warehouseId: (await ctx.db.insert("warehouses", {
          name: "Bodega Principal",
          code: "BDG-001",
          address: { street: "Calle 123", city: "Bogotá", state: "Cundinamarca", zip: "110111" },
          isActive: true,
        })),
        quantityAvailable: Math.floor(Math.random() * 500) + 100,
        quantityReserved: 0,
        reorderLevel: 50,
        lastUpdated: Date.now(),
      });

      count++;
    }

    return { success: true, count };
  },
});

// Run both seeds
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Seed categories
    const categories = [
      { name: "Gaseosas", slug: "gaseosas", sortOrder: 1, isActive: true },
      { name: "Snacks", slug: "snacks", sortOrder: 2, isActive: true },
      { name: "Dulces", slug: "dulces", sortOrder: 3, isActive: true },
      { name: "Licores", slug: "licores", sortOrder: 4, isActive: true },
    ];

    for (const cat of categories) {
      await ctx.db.insert("categories", cat);
    }

    // Get category IDs
    const cats = await ctx.db.query("categories").collect();
    const catMap = new Map(cats.map(c => [c.slug, c._id]));

    // Seed products - Extended catalog (similar to candyjobs)
    const products = [
      // GASEOSAS (16 productos)
      { sku: "COCA-2L", name: "Coca-Cola 2L", categorySlug: "gaseosas", basePrice: 8500, packSize: 6, minQty: 6, isFeatured: true },
      { sku: "COCA-1.5L", name: "Coca-Cola 1.5L", categorySlug: "gaseosas", basePrice: 6200, packSize: 8, minQty: 8, isFeatured: false },
      { sku: "COCA-LATA", name: "Coca-Cola Lata 330ml", categorySlug: "gaseosas", basePrice: 3200, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "PEPSI-2L", name: "Pepsi 2L", categorySlug: "gaseosas", basePrice: 7800, packSize: 6, minQty: 6, isFeatured: true },
      { sku: "PEPSI-1.5L", name: "Pepsi 1.5L", categorySlug: "gaseosas", basePrice: 5800, packSize: 8, minQty: 8, isFeatured: false },
      { sku: "SPRITE-2L", name: "Sprite 2L", categorySlug: "gaseosas", basePrice: 8200, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "FANTA-2L", name: "Fanta Naranja 2L", categorySlug: "gaseosas", basePrice: 7900, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "FANTA-UVA", name: "Fanta Uva 2L", categorySlug: "gaseosas", basePrice: 7900, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "QUATRO-2L", name: "Quatro 2L", categorySlug: "gaseosas", basePrice: 7500, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "COLOMBIANA-2L", name: "Colombiana 2L", categorySlug: "gaseosas", basePrice: 7200, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "SEVEN-2L", name: "7UP 2L", categorySlug: "gaseosas", basePrice: 7600, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "MANZANA-2L", name: "Manzana Postobón 2L", categorySlug: "gaseosas", basePrice: 7000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "UVA-2L", name: "Uva Postobón 2L", categorySlug: "gaseosas", basePrice: 7000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "NARANJA-2L", name: "Naranja Postobón 2L", categorySlug: "gaseosas", basePrice: 7000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "LIMON-2L", name: "Limón Postobón 2L", categorySlug: "gaseosas", basePrice: 7000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "HIT-1L", name: "Hit Naranja 1L", categorySlug: "gaseosas", basePrice: 4500, packSize: 12, minQty: 12, isFeatured: false },
      
      // SNACKS (16 productos)
      { sku: "SABRITAS-200", name: "Sabritas Original 200g", categorySlug: "snacks", basePrice: 6500, packSize: 12, minQty: 12, isFeatured: true },
      { sku: "SABRITAS-LIMON", name: "Sabritas Limón 200g", categorySlug: "snacks", basePrice: 6500, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "SABRITAS-POLLO", name: "Sabritas Pollo 200g", categorySlug: "snacks", basePrice: 6500, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "DORITOS-200", name: "Doritos Nacho 200g", categorySlug: "snacks", basePrice: 7200, packSize: 12, minQty: 12, isFeatured: true },
      { sku: "DORITOS-PICANTE", name: "Doritos Picante 200g", categorySlug: "snacks", basePrice: 7200, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "CHEETOS-200", name: "Cheetos 200g", categorySlug: "snacks", basePrice: 6800, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "CHEETOS-BOLA", name: "Cheetos Bola 150g", categorySlug: "snacks", basePrice: 5500, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "RUFFLES-200", name: "Ruffles Queso 200g", categorySlug: "snacks", basePrice: 7000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "RUFFLES-CREMA", name: "Ruffles Crema y Cebolla 200g", categorySlug: "snacks", basePrice: 7000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "TODITO-150", name: "Todito Natural 150g", categorySlug: "snacks", basePrice: 4800, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "TODITO-LIMON", name: "Todito Limón 150g", categorySlug: "snacks", basePrice: 4800, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "NATUCHIPS-150", name: "Natuchips 150g", categorySlug: "snacks", basePrice: 5200, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "CHOCOLISTO", name: "Chocolisto 120g", categorySlug: "snacks", basePrice: 4200, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "FRITO-LAY", name: "Frito Lay 150g", categorySlug: "snacks", basePrice: 4500, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "MAIZITOS", name: "Maizitos 150g", categorySlug: "snacks", basePrice: 3800, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "SUPER-RICAS", name: "Super Ricas 150g", categorySlug: "snacks", basePrice: 4000, packSize: 12, minQty: 12, isFeatured: false },
      
      // DULCES (16 productos)
      { sku: "GANSITO", name: "Gansito", categorySlug: "dulces", basePrice: 3500, packSize: 24, minQty: 24, isFeatured: true },
      { sku: "CHOCORAMO", name: "Chocoramo", categorySlug: "dulces", basePrice: 3200, packSize: 24, minQty: 24, isFeatured: true },
      { sku: "ALFAJOR", name: "Alfajor Jumbo", categorySlug: "dulces", basePrice: 4500, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "BONN-BONY", name: "Bonn Bony", categorySlug: "dulces", basePrice: 2800, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "PINGUINO", name: "Pingüino", categorySlug: "dulces", basePrice: 3800, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "SUBMARINO", name: "Submarino", categorySlug: "dulces", basePrice: 3600, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "NUTELLA-350", name: "Nutella 350g", categorySlug: "dulces", basePrice: 28000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "NUTELLA-750", name: "Nutella 750g", categorySlug: "dulces", basePrice: 52000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "JET-CHOCO", name: "Jet Chocolate 12g", categorySlug: "dulces", basePrice: 800, packSize: 48, minQty: 48, isFeatured: false },
      { sku: "JET-LECHE", name: "Jet Leche 12g", categorySlug: "dulces", basePrice: 800, packSize: 48, minQty: 48, isFeatured: false },
      { sku: "MM-CHOCO", name: "M&M's Chocolate 100g", categorySlug: "dulces", basePrice: 12000, packSize: 12, minQty: 12, isFeatured: true },
      { sku: "MM-MANI", name: "M&M's Maní 100g", categorySlug: "dulces", basePrice: 12000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "SNICKERS", name: "Snickers 50g", categorySlug: "dulces", basePrice: 4500, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "MILKY", name: "Milky Way 50g", categorySlug: "dulces", basePrice: 4200, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "PRINGLES-120", name: "Pringles Original 120g", categorySlug: "snacks", basePrice: 15000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "GOMAS-VIDAL", name: "Gomas Vidal Surtidas 1kg", categorySlug: "dulces", basePrice: 28000, packSize: 6, minQty: 6, isFeatured: true },
      
      // LICORES (16 productos)
      { sku: "AGUARDIENTE-375", name: "Aguardiente Antioqueño 375ml", categorySlug: "licores", basePrice: 28000, packSize: 12, minQty: 12, isFeatured: true },
      { sku: "AGUARDIENTE-750", name: "Aguardiente Antioqueño 750ml", categorySlug: "licores", basePrice: 48000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "AGUARDIENTE-LITRO", name: "Aguardiente Antioqueño 1L", categorySlug: "licores", basePrice: 58000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "RON-MEDELLIN-375", name: "Ron Medellín Añejo 375ml", categorySlug: "licores", basePrice: 32000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "RON-MEDELLIN-750", name: "Ron Medellín Añejo 750ml", categorySlug: "licores", basePrice: 52000, packSize: 6, minQty: 6, isFeatured: true },
      { sku: "CERVEZA-AGUILA", name: "Cerveza Águila Light 330ml", categorySlug: "licores", basePrice: 4200, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "CERVEZA-CLUB", name: "Cerveza Club Colombia 330ml", categorySlug: "licores", basePrice: 4800, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "CERVEZA-CORONA", name: "Cerveza Corona 355ml", categorySlug: "licores", basePrice: 6500, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "VODKA-SMIRNOFF", name: "Vodka Smirnoff 750ml", categorySlug: "licores", basePrice: 65000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "VODKA-ABSOLUT", name: "Vodka Absolut 750ml", categorySlug: "licores", basePrice: 125000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "WHISKY-JW", name: "Johnnie Walker Red Label 750ml", categorySlug: "licores", basePrice: 145000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "WHISKY-OLD-PARR", name: "Old Parr 750ml", categorySlug: "licores", basePrice: 185000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "TEQUILA-JOSE", name: "Tequila José Cuervo 750ml", categorySlug: "licores", basePrice: 95000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "VINO-CASILLERO", name: "Vino Casillero del Diablo 750ml", categorySlug: "licores", basePrice: 58000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "VINO-SANTA-CAROLINA", name: "Vino Santa Carolina 750ml", categorySlug: "licores", basePrice: 48000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "LICOR-CREMA", name: "Licor de Crema Bailey's 750ml", categorySlug: "licores", basePrice: 115000, packSize: 6, minQty: 6, isFeatured: false },
    ];

    let count = 0;
    for (const prod of products) {
      const categoryId = catMap.get(prod.categorySlug);
      if (!categoryId) continue;

      const productId = await ctx.db.insert("products", {
        sku: prod.sku,
        name: prod.name,
        categoryId,
        basePrice: prod.basePrice,
        unitOfMeasure: "unidad",
        packSize: prod.packSize,
        minimumOrderQuantity: prod.minQty,
        images: [],
        isActive: true,
        isFeatured: prod.isFeatured,
      });

      await ctx.db.insert("inventory", {
        productId,
        warehouseId: (await ctx.db.insert("warehouses", {
          name: "Bodega Principal",
          code: "BDG-001",
          address: { street: "Calle 123", city: "Bogotá", state: "Cundinamarca", zip: "110111" },
          isActive: true,
        })),
        quantityAvailable: Math.floor(Math.random() * 500) + 100,
        quantityReserved: 0,
        reorderLevel: 50,
        lastUpdated: Date.now(),
      });

      count++;
    }

    return { success: true, message: "Database seeded successfully", count };
  },
});
