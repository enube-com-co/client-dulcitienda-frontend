import { z } from 'zod';

// Search query validation
export const SearchQuerySchema = z.string()
  .min(2, 'La búsqueda debe tener al menos 2 caracteres')
  .max(100, 'La búsqueda no puede exceder 100 caracteres')
  .regex(/^[\w\s\-áéíóúÁÉÍÓÚñÑ]+$/, 'Caracteres no permitidos');

// Cart item validation
export const CartItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1).max(200),
  sku: z.string().min(1).max(50),
  price: z.number().positive(),
  quantity: z.number().int().positive().max(10000),
  packSize: z.number().int().positive(),
});

// Quantity validation
export const QuantitySchema = z.number()
  .int()
  .positive()
  .max(10000, 'Cantidad máxima excedida');

// SKU validation
export const SkuSchema = z.string()
  .min(1)
  .max(50)
  .regex(/^[A-Z0-9\-]+$/, 'SKU inválido');

// Phone validation (Colombian format)
export const PhoneSchema = z.string()
  .regex(/^\+57\s?3\d{9}$/, 'Número de teléfono inválido');

// Email validation
export const EmailSchema = z.string()
  .email('Correo electrónico inválido')
  .max(100);

// Sanitize string for display
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Validate and sanitize search query
export function validateSearchQuery(query: string): { valid: boolean; error?: string; sanitized?: string } {
  try {
    const sanitized = sanitizeString(query);
    SearchQuerySchema.parse(sanitized);
    return { valid: true, sanitized };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.issues[0]?.message || 'Error de validación' };
    }
    return { valid: false, error: 'Error de validación' };
  }
}

// Validate cart item
export function validateCartItem(item: unknown): { valid: boolean; error?: string; data?: z.infer<typeof CartItemSchema> } {
  try {
    const data = CartItemSchema.parse(item);
    return { valid: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.issues[0]?.message || 'Error de validación' };
    }
    return { valid: false, error: 'Error de validación' };
  }
}
