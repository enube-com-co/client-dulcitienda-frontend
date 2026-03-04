import { mutation } from "./_generated/server";

// Seed massive product catalog (500+ products)
export const seedMassive = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing
    const existingProducts = await ctx.db.query("products").collect();
    for (const p of existingProducts) await ctx.db.delete(p._id);
    
    const existingCats = await ctx.db.query("categories").collect();
    for (const c of existingCats) await ctx.db.delete(c._id);

    // Categories
    const categories = [
      { name: "Gaseosas", slug: "gaseosas", sortOrder: 1, isActive: true },
      { name: "Snacks", slug: "snacks", sortOrder: 2, isActive: true },
      { name: "Dulces", slug: "dulces", sortOrder: 3, isActive: true },
      { name: "Gomas", slug: "gomas", sortOrder: 4, isActive: true },
      { name: "Chocolates", slug: "chocolates", sortOrder: 5, isActive: true },
      { name: "Ancheteía", slug: "ancheteria", sortOrder: 6, isActive: true },
      { name: "Confitería", slug: "confiteria", sortOrder: 7, isActive: true },
      { name: "Licores", slug: "licores", sortOrder: 8, isActive: true },
      { name: "Galletas", slug: "galletas", sortOrder: 9, isActive: true },
      { name: "Lácteos", slug: "lacteos", sortOrder: 10, isActive: true },
    ];

    for (const cat of categories) {
      await ctx.db.insert("categories", cat);
    }

    const cats = await ctx.db.query("categories").collect();
    const catMap = new Map(cats.map(c => [c.slug, c._id]));

    // Generate 500+ products
    const products = [];
    
    // GASEOSAS (60 productos)
    const gaseosasNombres = [
      "Coca-Cola", "Pepsi", "Sprite", "Fanta", "Quatro", "Colombiana", "Manzana", "Uva", "Naranja", "Limón",
      "7UP", "Mountain Dew", "Dr Pepper", "Canada Dry", "H2O", "Brisa", "Tropical", "Hit", "Zuko", "Tang"
    ];
    const gaseosasPresentaciones = ["2L", "1.5L", "1L", "500ml", "Lata 330ml", "Lata 250ml", "Botella 400ml", "Botella 250ml"];
    
    for (let i = 0; i < 60; i++) {
      const nombre = gaseosasNombres[Math.floor(Math.random() * gaseosasNombres.length)];
      const pres = gaseosasPresentaciones[Math.floor(Math.random() * gaseosasPresentaciones.length)];
      products.push({
        sku: `GAS-${String(i+1).padStart(4, '0')}`,
        name: `${nombre} ${pres}`,
        categorySlug: "gaseosas",
        basePrice: Math.floor(Math.random() * 8000) + 3000,
        packSize: [6, 8, 12, 24][Math.floor(Math.random() * 4)],
        minQty: [6, 12, 24][Math.floor(Math.random() * 3)],
        isFeatured: i < 10
      });
    }

    // SNACKS (60 productos)
    const snacksMarcas = ["Sabritas", "Doritos", "Cheetos", "Ruffles", "Todito", "Natuchips", "Super Ricas", "Frito Lay", "Maizitos", "Yupi"];
    const snacksSabores = ["Natural", "Limón", "Pollo", "Queso", "Picante", "BBQ", "Ranch", "Cheddar", "Crema y Cebolla", "Mantequilla"];
    const snacksTamanos = ["150g", "200g", "250g", "300g", "500g", "35g", "45g"];
    
    for (let i = 0; i < 60; i++) {
      const marca = snacksMarcas[Math.floor(Math.random() * snacksMarcas.length)];
      const sabor = snacksSabores[Math.floor(Math.random() * snacksSabores.length)];
      const tamano = snacksTamanos[Math.floor(Math.random() * snacksTamanos.length)];
      products.push({
        sku: `SNK-${String(i+1).padStart(4, '0')}`,
        name: `${marca} ${sabor} ${tamano}`,
        categorySlug: "snacks",
        basePrice: Math.floor(Math.random() * 10000) + 3000,
        packSize: [12, 24, 36][Math.floor(Math.random() * 3)],
        minQty: [12, 24][Math.floor(Math.random() * 2)],
        isFeatured: i < 10
      });
    }

    // DULCES (50 productos)
    const dulcesNombres = [
      "Gansito", "Chocoramo", "Pingüino", "Submarino", "Bonn Bony", "Alfajor", "Chocolatina Jet", "Jet Leche",
      "Coffe Leche", "Arequipe", "Dulce de Leche", "Bocadillo", "Panelita", "Cocada", "Turrón", "Milky Way",
      "Snickers", "Mars", "Twix", "Bounty", "Galaxy", "Milka", "Ferrero Rocher", "Lindt", "Hershey's"
    ];
    
    for (let i = 0; i < 50; i++) {
      const nombre = dulcesNombres[Math.floor(Math.random() * dulcesNombres.length)];
      const peso = ["12g", "18g", "24g", "30g", "50g", "100g", "200g", "500g"][Math.floor(Math.random() * 8)];
      products.push({
        sku: `DUL-${String(i+1).padStart(4, '0')}`,
        name: `${nombre} ${peso}`,
        categorySlug: "dulces",
        basePrice: Math.floor(Math.random() * 15000) + 1000,
        packSize: [12, 24, 48][Math.floor(Math.random() * 3)],
        minQty: [12, 24][Math.floor(Math.random() * 2)],
        isFeatured: i < 8
      });
    }

    // GOMAS (60 productos)
    const gomasMarcas = ["Fini", "Vidal", "Trululu", "Frugomas", "Dulceplus", "Morinaga", "Trolli", "Haribo"];
    const gomasTipos = ["Tiburones", "Fresas", "Bananas", "Ositos", "Anillos", "Cocodrilos", "Lombrices", "Huevos", "Corazones", "Estrellas"];
    
    for (let i = 0; i < 60; i++) {
      const marca = gomasMarcas[Math.floor(Math.random() * gomasMarcas.length)];
      const tipo = gomasTipos[Math.floor(Math.random() * gomasTipos.length)];
      const peso = ["100g", "250g", "500g", "1kg", "2kg", "3kg"][Math.floor(Math.random() * 6)];
      products.push({
        sku: `GOM-${String(i+1).padStart(4, '0')}`,
        name: `${marca} ${tipo} ${peso}`,
        categorySlug: "gomas",
        basePrice: Math.floor(Math.random() * 80000) + 5000,
        packSize: [1, 6, 12][Math.floor(Math.random() * 3)],
        minQty: [1, 6][Math.floor(Math.random() * 2)],
        isFeatured: i < 10
      });
    }

    // CHOCOLATES (50 productos)
    const chocoMarcas = ["Nutella", "Milka", "Lindt", "Ferrero", "Hershey's", "Nestle", "Cadbury", "Toblerone", "Godiva"];
    const chocoProductos = ["Crema de Avellanas", "Barra", "Bombones", "Trufas", "Tableta", "Huevo", "Colección"];
    
    for (let i = 0; i < 50; i++) {
      const marca = chocoMarcas[Math.floor(Math.random() * chocoMarcas.length)];
      const prod = chocoProductos[Math.floor(Math.random() * chocoProductos.length)];
      const peso = ["100g", "200g", "350g", "500g", "750g", "1kg"][Math.floor(Math.random() * 6)];
      products.push({
        sku: `CHO-${String(i+1).padStart(4, '0')}`,
        name: `${marca} ${prod} ${peso}`,
        categorySlug: "chocolates",
        basePrice: Math.floor(Math.random() * 100000) + 8000,
        packSize: [6, 12][Math.floor(Math.random() * 2)],
        minQty: [6, 12][Math.floor(Math.random() * 2)],
        isFeatured: i < 8
      });
    }

    // ANCHETEÍA (60 productos)
    const ancheNombres = [
      "Almendra Francesa", "Nuez", "Mani Salado", "Mani Japonés", "Pistacho", "Anacardo", "Pasas", "Ciruela",
      "Albaricoque", "Higo", "Dátil", "Mix de Frutos Secos", "Cocktail", "Barquillo", "Oblea", "Wafer"
    ];
    
    for (let i = 0; i < 60; i++) {
      const nombre = ancheNombres[Math.floor(Math.random() * ancheNombres.length)];
      const peso = ["100g", "250g", "500g", "1kg"][Math.floor(Math.random() * 4)];
      products.push({
        sku: `ANC-${String(i+1).padStart(4, '0')}`,
        name: `${nombre} ${peso}`,
        categorySlug: "ancheteria",
        basePrice: Math.floor(Math.random() * 50000) + 5000,
        packSize: [6, 12, 24][Math.floor(Math.random() * 3)],
        minQty: [6, 12][Math.floor(Math.random() * 2)],
        isFeatured: i < 10
      });
    }

    // CONFITERÍA (50 productos)
    const confNombres = [
      "Chupete", "Paletas", "Caramelo", "Menta", "Eucalipto", "Fruta", "Acido", "Chocolate", "Café",
      "Bombón", "Marshmallow", "Piruleta", "Chicle", "Burbuja", "Globo"
    ];
    
    for (let i = 0; i < 50; i++) {
      const nombre = confNombres[Math.floor(Math.random() * confNombres.length)];
      const und = ["x 50", "x 100", "x 200", "x 500"][Math.floor(Math.random() * 4)];
      products.push({
        sku: `CON-${String(i+1).padStart(4, '0')}`,
        name: `${nombre} ${und} und`,
        categorySlug: "confiteria",
        basePrice: Math.floor(Math.random() * 25000) + 5000,
        packSize: [6, 12][Math.floor(Math.random() * 2)],
        minQty: [6, 12][Math.floor(Math.random() * 2)],
        isFeatured: i < 8
      });
    }

    // LICORES (60 productos)
    const licoresTipos = ["Aguardiente", "Ron", "Vodka", "Whisky", "Tequila", "Ginebra", "Brandy", "Vino"];
    const licoresMarcas = ["Antioqueño", "Medellín", "Viejo de Caldas", "Smirnoff", "Absolut", "Johnnie Walker", "Jack Daniels", "Chivas", "Buchanans", "José Cuervo", "Don Julio", "Tanqueray", "Beefeater"];
    const licoresPresentaciones = ["375ml", "750ml", "1L", "1.75L"];
    
    for (let i = 0; i < 60; i++) {
      const tipo = licoresTipos[Math.floor(Math.random() * licoresTipos.length)];
      const marca = licoresMarcas[Math.floor(Math.random() * licoresMarcas.length)];
      const pres = licoresPresentaciones[Math.floor(Math.random() * licoresPresentaciones.length)];
      products.push({
        sku: `LIC-${String(i+1).padStart(4, '0')}`,
        name: `${tipo} ${marca} ${pres}`,
        categorySlug: "licores",
        basePrice: Math.floor(Math.random() * 200000) + 25000,
        packSize: [6, 12][Math.floor(Math.random() * 2)],
        minQty: [6, 12][Math.floor(Math.random() * 2)],
        isFeatured: i < 10
      });
    }

    // GALLETAS (50 productos)
    const galletasMarcas = ["Festival", "Galletas Noel", "Galletas Ducales", "Galletas Don", "Galletas Ramo", "Oreo", "Chips Ahoy", "Galletas Saltín"];
    const galletasTipos = ["Chocolate", "Vainilla", "Fresa", "Limón", "Naranja", "Mantequilla", "Integral", "Dietética"];
    
    for (let i = 0; i < 50; i++) {
      const marca = galletasMarcas[Math.floor(Math.random() * galletasMarcas.length)];
      const tipo = galletasTipos[Math.floor(Math.random() * galletasTipos.length)];
      const peso = ["150g", "200g", "300g", "500g"][Math.floor(Math.random() * 4)];
      products.push({
        sku: `GAL-${String(i+1).padStart(4, '0')}`,
        name: `${marca} ${tipo} ${peso}`,
        categorySlug: "galletas",
        basePrice: Math.floor(Math.random() * 15000) + 3000,
        packSize: [12, 24][Math.floor(Math.random() * 2)],
        minQty: [12, 24][Math.floor(Math.random() * 2)],
        isFeatured: i < 8
      });
    }

    // LÁCTEOS (50 productos)
    const lacteosNombres = ["Leche Entera", "Leche Descremada", "Yogurt", "Kumis", "Queso", "Mantequilla", "Crema de Leche", "Leche Condensada"];
    const lacteosMarcas = ["Algarra", "Colanta", "Algarrobo", "Alpina", "Algarra", "Parmalat"];
    
    for (let i = 0; i < 50; i++) {
      const nombre = lacteosNombres[Math.floor(Math.random() * lacteosNombres.length)];
      const marca = lacteosMarcas[Math.floor(Math.random() * lacteosMarcas.length)];
      const pres = ["250ml", "500ml", "1L", "100g", "250g", "500g"][Math.floor(Math.random() * 6)];
      products.push({
        sku: `LAC-${String(i+1).padStart(4, '0')}`,
        name: `${marca} ${nombre} ${pres}`,
        categorySlug: "lacteos",
        basePrice: Math.floor(Math.random() * 20000) + 3000,
        packSize: [6, 12, 24][Math.floor(Math.random() * 3)],
        minQty: [6, 12][Math.floor(Math.random() * 2)],
        isFeatured: i < 8
      });
    }

    // Insert all products
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
        quantityAvailable: Math.floor(Math.random() * 1000) + 100,
        quantityReserved: 0,
        reorderLevel: 50,
        lastUpdated: Date.now(),
      });

      count++;
    }

    return { success: true, count, categories: categories.length };
  },
});
