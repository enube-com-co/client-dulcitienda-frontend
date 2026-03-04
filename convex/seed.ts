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
      { name: "Gomas", slug: "gomas", sortOrder: 5, isActive: true },
      { name: "Chocolates", slug: "chocolates", sortOrder: 6, isActive: true },
      { name: "Ancheteía", slug: "ancheteria", sortOrder: 7, isActive: true },
      { name: "Confitería", slug: "confiteria", sortOrder: 8, isActive: true },
    ];

    for (const cat of categories) {
      await ctx.db.insert("categories", cat);
    }

    return { success: true, count: categories.length };
  },
});

// Seed products - Candyjobs style catalog
export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const cats = await ctx.db.query("categories").collect();
    const catMap = new Map(cats.map(c => [c.slug, c._id]));

    // Productos de candyjobs.com.co - Catálogo real
    const products = [
      // GASEOSAS
      { sku: "COCA-2L", name: "Coca-Cola 2L", categorySlug: "gaseosas", basePrice: 8500, packSize: 6, minQty: 6, isFeatured: true },
      { sku: "COCA-1.5L", name: "Coca-Cola 1.5L", categorySlug: "gaseosas", basePrice: 6200, packSize: 8, minQty: 8, isFeatured: false },
      { sku: "COCA-LATA", name: "Coca-Cola Lata 330ml", categorySlug: "gaseosas", basePrice: 3200, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "PEPSI-2L", name: "Pepsi 2L", categorySlug: "gaseosas", basePrice: 7800, packSize: 6, minQty: 6, isFeatured: true },
      { sku: "SPRITE-2L", name: "Sprite 2L", categorySlug: "gaseosas", basePrice: 8200, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "FANTA-NARANJA", name: "Fanta Naranja 2L", categorySlug: "gaseosas", basePrice: 7900, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "FANTA-UVA", name: "Fanta Uva 2L", categorySlug: "gaseosas", basePrice: 7900, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "QUATRO-2L", name: "Quatro 2L", categorySlug: "gaseosas", basePrice: 7500, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "COLOMBIANA-2L", name: "Colombiana 2L", categorySlug: "gaseosas", basePrice: 7200, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "MANZANA-2L", name: "Manzana Postobón 2L", categorySlug: "gaseosas", basePrice: 7000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "UVA-2L", name: "Uva Postobón 2L", categorySlug: "gaseosas", basePrice: 7000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "HIT-1L", name: "Hit Naranja 1L", categorySlug: "gaseosas", basePrice: 4500, packSize: 12, minQty: 12, isFeatured: false },
      
      // SNACKS
      { sku: "SABRITAS-200", name: "Sabritas Original 200g", categorySlug: "snacks", basePrice: 6500, packSize: 12, minQty: 12, isFeatured: true },
      { sku: "SABRITAS-LIMON", name: "Sabritas Limón 200g", categorySlug: "snacks", basePrice: 6500, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "DORITOS-NACHO", name: "Doritos Nacho 200g", categorySlug: "snacks", basePrice: 7200, packSize: 12, minQty: 12, isFeatured: true },
      { sku: "DORITOS-PICANTE", name: "Doritos Picante 200g", categorySlug: "snacks", basePrice: 7200, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "CHEETOS-200", name: "Cheetos 200g", categorySlug: "snacks", basePrice: 6800, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "RUFFLES-QUESO", name: "Ruffles Queso 200g", categorySlug: "snacks", basePrice: 7000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "TODITO-150", name: "Todito Natural 150g", categorySlug: "snacks", basePrice: 4800, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "NATUCHIPS-150", name: "Natuchips 150g", categorySlug: "snacks", basePrice: 5200, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "PRINGLES-120", name: "Pringles Original 120g", categorySlug: "snacks", basePrice: 15000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "MAIZITOS-150", name: "Maizitos 150g", categorySlug: "snacks", basePrice: 3800, packSize: 12, minQty: 12, isFeatured: false },
      
      // DULCES
      { sku: "GANSITO", name: "Gansito", categorySlug: "dulces", basePrice: 3500, packSize: 24, minQty: 24, isFeatured: true },
      { sku: "CHOCORAMO", name: "Chocoramo", categorySlug: "dulces", basePrice: 3200, packSize: 24, minQty: 24, isFeatured: true },
      { sku: "PINGUINO", name: "Pingüino", categorySlug: "dulces", basePrice: 3800, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "SUBMARINO", name: "Submarino", categorySlug: "dulces", basePrice: 3600, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "BONN-BONY", name: "Bonn Bony", categorySlug: "dulces", basePrice: 2800, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "ALFAJOR", name: "Alfajor Jumbo", categorySlug: "dulces", basePrice: 4500, packSize: 12, minQty: 12, isFeatured: false },
      
      // GOMAS (de candyjobs)
      { sku: "GOMAS-VIDAL-1KG", name: "Gomas Vidal Surtidas 1kg", categorySlug: "gomas", basePrice: 28000, packSize: 6, minQty: 6, isFeatured: true },
      { sku: "ANIMAL-POPS", name: "Animal Marshmallow Pops 36 uni", categorySlug: "gomas", basePrice: 52800, packSize: 1, minQty: 1, isFeatured: false },
      { sku: "BOLONCHO-30", name: "Bola Chicle Boloncho x 30 unid", categorySlug: "gomas", basePrice: 11500, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "CABLE-FINI", name: "Cable Rellepica Fini Surtido x 260 unds", categorySlug: "gomas", basePrice: 55000, packSize: 1, minQty: 1, isFeatured: false },
      { sku: "CAJA-MAGICA", name: "Caja Mágica Trululu 100gr", categorySlug: "gomas", basePrice: 6700, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "CORAZONES-3KG", name: "Corazones Frugomas x 3000gr", categorySlug: "gomas", basePrice: 85500, packSize: 1, minQty: 1, isFeatured: false },
      { sku: "FINI-BANANAS", name: "Fini Bananas Gigantes x kilo", categorySlug: "gomas", basePrice: 42000, packSize: 1, minQty: 1, isFeatured: false },
      { sku: "FINI-FRESAS", name: "Fini Fresas Salvajes kilo", categorySlug: "gomas", basePrice: 42000, packSize: 1, minQty: 1, isFeatured: false },
      { sku: "FINI-TIBURONES", name: "Fini Tiburones kilo", categorySlug: "gomas", basePrice: 42000, packSize: 1, minQty: 1, isFeatured: false },
      
      // CHOCOLATES
      { sku: "NUTELLA-350", name: "Nutella 350g", categorySlug: "chocolates", basePrice: 28000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "NUTELLA-750", name: "Nutella 750g", categorySlug: "chocolates", basePrice: 52000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "JET-CHOCO", name: "Jet Chocolate 12g", categorySlug: "chocolates", basePrice: 800, packSize: 48, minQty: 48, isFeatured: false },
      { sku: "JET-LECHE", name: "Jet Leche 12g", categorySlug: "chocolates", basePrice: 800, packSize: 48, minQty: 48, isFeatured: false },
      { sku: "MM-CHOCO", name: "M&M's Chocolate 100g", categorySlug: "chocolates", basePrice: 12000, packSize: 12, minQty: 12, isFeatured: true },
      { sku: "MM-MANI", name: "M&M's Maní 100g", categorySlug: "chocolates", basePrice: 12000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "SNICKERS", name: "Snickers 50g", categorySlug: "chocolates", basePrice: 4500, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "MILKY", name: "Milky Way 50g", categorySlug: "chocolates", basePrice: 4200, packSize: 24, minQty: 24, isFeatured: false },
      
      // ANCHETEÍA (de candyjobs)
      { sku: "ALMENDRA-500", name: "Almendra Francesa Dulcegal x 500g", categorySlug: "ancheteria", basePrice: 15500, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "ALMENDRA-250", name: "Almendra Francesa Dulcegal x 250g", categorySlug: "ancheteria", basePrice: 7800, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "ALMENDRAS-MOROS", name: "Almendras con Chocolate Moros 80g", categorySlug: "ancheteria", basePrice: 8300, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "BARQUILLO-ASTICK", name: "Barquillo Astick Mini x 12 x20gr", categorySlug: "ancheteria", basePrice: 18000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "BARQUILLO-TWISTIES", name: "Barquillo Twisties Fresa 400gr", categorySlug: "ancheteria", basePrice: 24000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "BARRILETE-40", name: "Barrilete Caramelo Masticable x 40und", categorySlug: "ancheteria", basePrice: 9000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "BEST-PLIERS", name: "Best Pliers x 12 und", categorySlug: "ancheteria", basePrice: 72000, packSize: 1, minQty: 1, isFeatured: false },
      { sku: "BIANCHI-BLANCO", name: "Bianchi Caramelo Chocolate Blanco x 100und", categorySlug: "ancheteria", basePrice: 13800, packSize: 6, minQty: 6, isFeatured: false },
      
      // CONFITERÍA
      { sku: "CHUPETES-50", name: "Chupetes Surtidos x 50 und", categorySlug: "confiteria", basePrice: 12000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "CARAMELOS-MENTA", name: "Caramelos Menta x 100 und", categorySlug: "confiteria", basePrice: 8500, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "BOMBONES-50", name: "Bombones Surtidos x 50 und", categorySlug: "confiteria", basePrice: 18000, packSize: 6, minQty: 6, isFeatured: false },
      
      // LICORES
      { sku: "AGUARDIENTE-375", name: "Aguardiente Antioqueño 375ml", categorySlug: "licores", basePrice: 28000, packSize: 12, minQty: 12, isFeatured: true },
      { sku: "AGUARDIENTE-750", name: "Aguardiente Antioqueño 750ml", categorySlug: "licores", basePrice: 48000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "RON-MEDELLIN-375", name: "Ron Medellín Añejo 375ml", categorySlug: "licores", basePrice: 32000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "RON-MEDELLIN-750", name: "Ron Medellín Añejo 750ml", categorySlug: "licores", basePrice: 52000, packSize: 6, minQty: 6, isFeatured: true },
      { sku: "CERVEZA-AGUILA", name: "Cerveza Águila Light 330ml", categorySlug: "licores", basePrice: 4200, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "CERVEZA-CLUB", name: "Cerveza Club Colombia 330ml", categorySlug: "licores", basePrice: 4800, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "VODKA-SMIRNOFF", name: "Vodka Smirnoff 750ml", categorySlug: "licores", basePrice: 65000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "WHISKY-JW", name: "Johnnie Walker Red Label 750ml", categorySlug: "licores", basePrice: 145000, packSize: 6, minQty: 6, isFeatured: false },
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

    return { success: true, count };
  },
});

// Run both seeds
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data first
    const existingProducts = await ctx.db.query("products").collect();
    for (const p of existingProducts) {
      await ctx.db.delete(p._id);
    }
    
    const existingCats = await ctx.db.query("categories").collect();
    for (const c of existingCats) {
      await ctx.db.delete(c._id);
    }

    // Seed categories
    const categories = [
      { name: "Gaseosas", slug: "gaseosas", sortOrder: 1, isActive: true },
      { name: "Snacks", slug: "snacks", sortOrder: 2, isActive: true },
      { name: "Dulces", slug: "dulces", sortOrder: 3, isActive: true },
      { name: "Licores", slug: "licores", sortOrder: 4, isActive: true },
      { name: "Gomas", slug: "gomas", sortOrder: 5, isActive: true },
      { name: "Chocolates", slug: "chocolates", sortOrder: 6, isActive: true },
      { name: "Ancheteía", slug: "ancheteria", sortOrder: 7, isActive: true },
      { name: "Confitería", slug: "confiteria", sortOrder: 8, isActive: true },
    ];

    for (const cat of categories) {
      await ctx.db.insert("categories", cat);
    }

    // Get category IDs
    const cats = await ctx.db.query("categories").collect();
    const catMap = new Map(cats.map(c => [c.slug, c._id]));

    // Seed products
    const products = [
      { sku: "COCA-2L", name: "Coca-Cola 2L", categorySlug: "gaseosas", basePrice: 8500, packSize: 6, minQty: 6, isFeatured: true },
      { sku: "COCA-1.5L", name: "Coca-Cola 1.5L", categorySlug: "gaseosas", basePrice: 6200, packSize: 8, minQty: 8, isFeatured: false },
      { sku: "PEPSI-2L", name: "Pepsi 2L", categorySlug: "gaseosas", basePrice: 7800, packSize: 6, minQty: 6, isFeatured: true },
      { sku: "SPRITE-2L", name: "Sprite 2L", categorySlug: "gaseosas", basePrice: 8200, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "FANTA-NARANJA", name: "Fanta Naranja 2L", categorySlug: "gaseosas", basePrice: 7900, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "QUATRO-2L", name: "Quatro 2L", categorySlug: "gaseosas", basePrice: 7500, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "COLOMBIANA-2L", name: "Colombiana 2L", categorySlug: "gaseosas", basePrice: 7200, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "MANZANA-2L", name: "Manzana Postobón 2L", categorySlug: "gaseosas", basePrice: 7000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "HIT-1L", name: "Hit Naranja 1L", categorySlug: "gaseosas", basePrice: 4500, packSize: 12, minQty: 12, isFeatured: false },
      
      { sku: "SABRITAS-200", name: "Sabritas Original 200g", categorySlug: "snacks", basePrice: 6500, packSize: 12, minQty: 12, isFeatured: true },
      { sku: "DORITOS-NACHO", name: "Doritos Nacho 200g", categorySlug: "snacks", basePrice: 7200, packSize: 12, minQty: 12, isFeatured: true },
      { sku: "CHEETOS-200", name: "Cheetos 200g", categorySlug: "snacks", basePrice: 6800, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "RUFFLES-QUESO", name: "Ruffles Queso 200g", categorySlug: "snacks", basePrice: 7000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "TODITO-150", name: "Todito Natural 150g", categorySlug: "snacks", basePrice: 4800, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "NATUCHIPS-150", name: "Natuchips 150g", categorySlug: "snacks", basePrice: 5200, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "PRINGLES-120", name: "Pringles Original 120g", categorySlug: "snacks", basePrice: 15000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "MAIZITOS-150", name: "Maizitos 150g", categorySlug: "snacks", basePrice: 3800, packSize: 12, minQty: 12, isFeatured: false },
      
      { sku: "GANSITO", name: "Gansito", categorySlug: "dulces", basePrice: 3500, packSize: 24, minQty: 24, isFeatured: true },
      { sku: "CHOCORAMO", name: "Chocoramo", categorySlug: "dulces", basePrice: 3200, packSize: 24, minQty: 24, isFeatured: true },
      { sku: "PINGUINO", name: "Pingüino", categorySlug: "dulces", basePrice: 3800, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "SUBMARINO", name: "Submarino", categorySlug: "dulces", basePrice: 3600, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "BONN-BONY", name: "Bonn Bony", categorySlug: "dulces", basePrice: 2800, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "ALFAJOR", name: "Alfajor Jumbo", categorySlug: "dulces", basePrice: 4500, packSize: 12, minQty: 12, isFeatured: false },
      
      { sku: "GOMAS-VIDAL-1KG", name: "Gomas Vidal Surtidas 1kg", categorySlug: "gomas", basePrice: 28000, packSize: 6, minQty: 6, isFeatured: true },
      { sku: "ANIMAL-POPS", name: "Animal Marshmallow Pops 36 uni", categorySlug: "gomas", basePrice: 52800, packSize: 1, minQty: 1, isFeatured: false },
      { sku: "BOLONCHO-30", name: "Bola Chicle Boloncho x 30 unid", categorySlug: "gomas", basePrice: 11500, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "CABLE-FINI", name: "Cable Rellepica Fini Surtido x 260 unds", categorySlug: "gomas", basePrice: 55000, packSize: 1, minQty: 1, isFeatured: false },
      { sku: "CAJA-MAGICA", name: "Caja Mágica Trululu 100gr", categorySlug: "gomas", basePrice: 6700, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "CORAZONES-3KG", name: "Corazones Frugomas x 3000gr", categorySlug: "gomas", basePrice: 85500, packSize: 1, minQty: 1, isFeatured: false },
      { sku: "FINI-BANANAS", name: "Fini Bananas Gigantes x kilo", categorySlug: "gomas", basePrice: 42000, packSize: 1, minQty: 1, isFeatured: false },
      { sku: "FINI-FRESAS", name: "Fini Fresas Salvajes kilo", categorySlug: "gomas", basePrice: 42000, packSize: 1, minQty: 1, isFeatured: false },
      
      { sku: "NUTELLA-350", name: "Nutella 350g", categorySlug: "chocolates", basePrice: 28000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "NUTELLA-750", name: "Nutella 750g", categorySlug: "chocolates", basePrice: 52000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "JET-CHOCO", name: "Jet Chocolate 12g", categorySlug: "chocolates", basePrice: 800, packSize: 48, minQty: 48, isFeatured: false },
      { sku: "JET-LECHE", name: "Jet Leche 12g", categorySlug: "chocolates", basePrice: 800, packSize: 48, minQty: 48, isFeatured: false },
      { sku: "MM-CHOCO", name: "M&M's Chocolate 100g", categorySlug: "chocolates", basePrice: 12000, packSize: 12, minQty: 12, isFeatured: true },
      { sku: "MM-MANI", name: "M&M's Maní 100g", categorySlug: "chocolates", basePrice: 12000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "SNICKERS", name: "Snickers 50g", categorySlug: "chocolates", basePrice: 4500, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "MILKY", name: "Milky Way 50g", categorySlug: "chocolates", basePrice: 4200, packSize: 24, minQty: 24, isFeatured: false },
      
      { sku: "ALMENDRA-500", name: "Almendra Francesa Dulcegal x 500g", categorySlug: "ancheteria", basePrice: 15500, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "ALMENDRA-250", name: "Almendra Francesa Dulcegal x 250g", categorySlug: "ancheteria", basePrice: 7800, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "ALMENDRAS-MOROS", name: "Almendras con Chocolate Moros 80g", categorySlug: "ancheteria", basePrice: 8300, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "BARQUILLO-ASTICK", name: "Barquillo Astick Mini x 12 x20gr", categorySlug: "ancheteria", basePrice: 18000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "BARQUILLO-TWISTIES", name: "Barquillo Twisties Fresa 400gr", categorySlug: "ancheteria", basePrice: 24000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "BARRILETE-40", name: "Barrilete Caramelo Masticable x 40und", categorySlug: "ancheteria", basePrice: 9000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "BEST-PLIERS", name: "Best Pliers x 12 und", categorySlug: "ancheteria", basePrice: 72000, packSize: 1, minQty: 1, isFeatured: false },
      { sku: "BIANCHI-BLANCO", name: "Bianchi Caramelo Chocolate Blanco x 100und", categorySlug: "ancheteria", basePrice: 13800, packSize: 6, minQty: 6, isFeatured: false },
      
      { sku: "CHUPETES-50", name: "Chupetes Surtidos x 50 und", categorySlug: "confiteria", basePrice: 12000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "CARAMELOS-MENTA", name: "Caramelos Menta x 100 und", categorySlug: "confiteria", basePrice: 8500, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "BOMBONES-50", name: "Bombones Surtidos x 50 und", categorySlug: "confiteria", basePrice: 18000, packSize: 6, minQty: 6, isFeatured: false },
      
      { sku: "AGUARDIENTE-375", name: "Aguardiente Antioqueño 375ml", categorySlug: "licores", basePrice: 28000, packSize: 12, minQty: 12, isFeatured: true },
      { sku: "AGUARDIENTE-750", name: "Aguardiente Antioqueño 750ml", categorySlug: "licores", basePrice: 48000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "RON-MEDELLIN-375", name: "Ron Medellín Añejo 375ml", categorySlug: "licores", basePrice: 32000, packSize: 12, minQty: 12, isFeatured: false },
      { sku: "RON-MEDELLIN-750", name: "Ron Medellín Añejo 750ml", categorySlug: "licores", basePrice: 52000, packSize: 6, minQty: 6, isFeatured: true },
      { sku: "CERVEZA-AGUILA", name: "Cerveza Águila Light 330ml", categorySlug: "licores", basePrice: 4200, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "CERVEZA-CLUB", name: "Cerveza Club Colombia 330ml", categorySlug: "licores", basePrice: 4800, packSize: 24, minQty: 24, isFeatured: false },
      { sku: "VODKA-SMIRNOFF", name: "Vodka Smirnoff 750ml", categorySlug: "licores", basePrice: 65000, packSize: 6, minQty: 6, isFeatured: false },
      { sku: "WHISKY-JW", name: "Johnnie Walker Red Label 750ml", categorySlug: "licores", basePrice: 145000, packSize: 6, minQty: 6, isFeatured: false },
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
