# 🛠️ Guía de Contribución - Dulcitienda

Gracias por querer contribuir a Dulcitienda. Esta guía te ayudará a empezar.

---

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Estándares de Código](#estándares-de-código)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Features](#sugerir-features)

---

## 📜 Código de Conducta

### Nuestros valores

- **Respeto**: Trata a todos con respeto y profesionalismo
- **Colaboración**: Construimos juntos, no en silencio
- **Calidad**: Código limpio, documentado y testeado
- **Transparencia**: Comunicación clara y honesta

### Comportamiento inaceptable

- Acoso o discriminación de cualquier tipo
- Trolling o comentarios despectivos
- Spam o publicidad no solicitada
- Compartir información privada sin consentimiento

---

## 🚀 Cómo Contribuir

### ¿Qué necesitamos?

| Tipo | Descripción | Nivel |
|------|-------------|-------|
| 🐛 **Bugs** | Reportar o fixear bugs | Todos |
| ✨ **Features** | Nuevas funcionalidades | Intermedio |
| 📚 **Docs** | Mejorar documentación | Todos |
| 🎨 **UI/UX** | Mejoras de diseño | Intermedio |
| ⚡ **Performance** | Optimizaciones | Avanzado |
| 🔒 **Security** | Reportes de seguridad | Avanzado |

### Primeros pasos

1. **Fork** el repositorio
2. **Clone** tu fork localmente
3. **Setup** el proyecto (ver [README](./README.md))
4. **Crea una branch** para tu contribución
5. **Haz los cambios** siguiendo los estándares
6. **Testea** localmente
7. **Commit** con mensaje descriptivo
8. **Push** a tu fork
9. **Crea un Pull Request**

---

## 🔄 Flujo de Trabajo

### Branches

```bash
# Formato: tipo/descripcion-corta

# Features
feature/admin-login
feature/search-filters

# Bug fixes
fix/cart-empty-state
fix/mobile-navigation

# Hotfixes (producción)
hotfix/csp-headers

# Documentation
docs/api-examples

# Refactoring
refactor/product-hooks
```

### Comandos útiles

```bash
# 1. Actualizar main
git checkout main
git pull origin main

# 2. Crear feature branch
git checkout -b feature/nombre-feature

# 3. Hacer cambios y commit
git add .
git commit -m "feat: agregar login de admin"

# 4. Push a tu fork
git push origin feature/nombre-feature

# 5. Crear Pull Request en GitHub
```

---

## 📝 Estándares de Código

### TypeScript

```typescript
// ✅ BIEN: Tipos explícitos, nombres descriptivos
interface ProductProps {
  sku: string;
  name: string;
  price: number;
}

function ProductCard({ sku, name, price }: ProductProps): JSX.Element {
  const formattedPrice = useMemo(() => {
    return formatCurrency(price);
  }, [price]);

  return (
    <div className="product-card">
      <h3>{name}</h3>
      <p>{formattedPrice}</p>
    </div>
  );
}

// ❌ MAL: Tipos implícitos, nombres cortos
function p(data: any) {
  return <div>{data.n}: {data.p}</div>;
}
```

### React Components

```typescript
// ✅ BIEN: Componentes funcionales con hooks
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface CounterProps {
  initialValue?: number;
  onChange?: (value: number) => void;
}

export function Counter({ initialValue = 0, onChange }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    const newValue = count + 1;
    setCount(newValue);
    onChange?.(newValue);
  }, [count, onChange]);

  return (
    <div className="flex items-center gap-4">
      <span className="text-2xl font-bold">{count}</span>
      <Button onClick={increment}>Incrementar</Button>
    </div>
  );
}

// ❌ MAL: Clases sin necesidad, no memoizado
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  render() {
    return <button onClick={() => this.setState({ count: this.state.count + 1 })}>+</button>;
  }
}
```

### CSS/Tailwind

```typescript
// ✅ BIEN: Clases Tailwind organizadas
function ProductCard() {
  return (
    <div className="
      bg-white rounded-xl shadow-sm 
      hover:shadow-lg transition-shadow
      p-4 border border-gray-100
    ">
      {/* contenido */}
    </div>
  );
}

// ❌ MAL: Inline styles, clases desorganizadas
function ProductCard() {
  return (
    <div style={{ background: 'white', padding: '16px' }} className="rounded shadow p-4 border">
      {/* contenido */}
    </div>
  );
}
```

### Convex (Backend)

```typescript
// ✅ BIEN: Validación con Zod, errores claros
import { z } from "zod";

const createProductSchema = z.object({
  sku: z.string().min(3).max(20),
  name: z.string().min(2).max(200),
  price: z.number().positive(),
});

export const createProduct = mutation({
  args: { ...createProductSchema.shape },
  handler: async (ctx, args) => {
    const data = createProductSchema.parse(args);
    
    // Check if SKU exists
    const existing = await ctx.db
      .query("products")
      .withIndex("by_sku", (q) => q.eq("sku", data.sku))
      .first();
    
    if (existing) {
      throw new Error(`SKU ${data.sku} already exists`);
    }
    
    return await ctx.db.insert("products", data);
  },
});

// ❌ MAL: Sin validación, sin manejo de errores
export const createProduct = mutation({
  args: { sku: v.string(), name: v.string(), price: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});
```

---

## 💬 Commits

### Formato (Conventional Commits)

```
tipo(ámbito): descripción

[cuerpo opcional]

[footer opcional]
```

### Tipos

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat` | Nueva funcionalidad | `feat: agregar login de admin` |
| `fix` | Bug fix | `fix: corregir cálculo de envío` |
| `docs` | Documentación | `docs: actualizar README` |
| `style` | Formato (sin cambios de código) | `style: formatear con prettier` |
| `refactor` | Refactorización | `refactor: simplificar hook useCart` |
| `test` | Tests | `test: agregar tests para checkout` |
| `chore` | Tareas de mantenimiento | `chore: actualizar dependencias` |

### Ejemplos

```bash
# Feature simple
feat: agregar búsqueda por categoría

# Feature con ámbito
feat(products): agregar filtros de precio

# Fix con descripción detallada
fix(cart): corregir cálculo de total

El total no incluía el envío cuando el subtotal
era exactamente $50,000.

Closes #123

# Breaking change
feat(api): cambiar formato de respuesta

BREAKING CHANGE: El campo 'price' ahora es un objeto
con 'value' y 'currency' en lugar de un número.
```

---

## 🔀 Pull Requests

### Checklist antes de crear PR

- [ ] Código funciona localmente
- [ ] `npm run build` pasa sin errores
- [ ] No hay console.logs de debug
- [ ] Código sigue los estándares
- [ ] Commits siguen conventional commits
- [ ] Branch está actualizada con main

### Template de PR

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Documentación

## Cómo probar
1. Paso 1
2. Paso 2
3. Resultado esperado

## Screenshots (si aplica)
[Adjuntar imágenes]

## Checklist
- [ ] Código testeado localmente
- [ ] Build exitoso
- [ ] Sin errores de TypeScript
```

### Proceso de Review

1. **Automated checks** (CI/CD)
2. **Code review** (mínimo 1 aprobación)
3. **Testing** (si aplica)
4. **Merge** (squash and merge)

---

## 🐛 Reportar Bugs

### Template

```markdown
**Descripción**
Descripción clara del bug

**Pasos para reproducir**
1. Ir a '...'
2. Click en '....'
3. Scroll down to '....'
4. Ver error

**Comportamiento esperado**
Lo que debería pasar

**Screenshots**
Si aplica

**Entorno:**
 - OS: [e.g. iOS]
 - Browser: [e.g. chrome, safari]
 - Version: [e.g. 22]

**Contexto adicional**
Cualquier otro detalle
```

---

## 💡 Sugerir Features

### Template

```markdown
**¿Tu feature está relacionada con un problema?**
Descripción clara del problema

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que pase

**Describe alternativas que hayas considerado**
Otras soluciones o features consideradas

**Contexto adicional**
Screenshots, mockups, ejemplos de otros sitios
```

---

## 🆘 Necesitas Ayuda?

| Canal | Cómo contactar |
|-------|----------------|
| **Issues** | [GitHub Issues](https://github.com/enube-com-co/client-dulcitienda-frontend/issues) |
| **Email** | dulcitiendajm@gmail.com |
| **WhatsApp** | [313 2309867](https://wa.me/573132309867) |

---

## 🙏 Agradecimientos

Gracias a todos los contribuidores que hacen Dulcitienda mejor cada día.

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

---

<p align="center">
  <strong>¡Gracias por contribuir! 🍬</strong>
</p>
