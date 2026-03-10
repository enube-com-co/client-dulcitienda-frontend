import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { cronJobs } from "convex/server";

// Define crons
const crons = cronJobs();

// Run every 5 minutes to check for new events
crons.interval(
  "check new events every 5 minutes",
  { minutes: 5 },
  api.crons.checkNewEvents,
  {}
);

export default crons;

// Check for new events (called by cron)
export const checkNewEvents = action({
  args: {},
  handler: async (ctx) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const settings = await ctx.runQuery(api.notifications.getSettings);
    
    if (!settings) return;

    // 1. Check for new orders
    if (settings.notifyOnNewOrder !== false) {
      const newOrders = await ctx.runQuery(api.orders.getRecentOrders, { since: fiveMinutesAgo });
      
      for (const order of newOrders) {
        const customer = await ctx.runQuery(api.users.getById, { userId: order.customerId });
        
        // Format items list
        const itemsList = order.items.map((item: any) => 
          `• ${item.quantity}x ${item.name} - $${item.totalPrice.toLocaleString()}`
        ).join('\n');
        
        const message = `🛒 NUEVO PEDIDO\n\n` +
          `Orden: ${order.orderNumber}\n` +
          `Cliente: ${customer?.name || 'N/A'}\n` +
          `Tel: ${customer?.phone || order.whatsappPhone || 'N/A'}\n\n` +
          `📦 PRODUCTOS:\n${itemsList}\n\n` +
          `💰 TOTAL: $${order.totalAmount.toLocaleString()}`;

        // Create notification
        await ctx.runMutation(api.notifications.createNotification, {
          type: "new_order",
          title: `Nuevo pedido: ${order.orderNumber}`,
          message,
          orderId: order._id,
          customerEmail: customer?.email,
          customerPhone: customer?.phone || order.whatsappPhone,
          read: false,
        });

        // Send email if enabled
        if (settings.emailEnabled && settings.email && settings.resendApiKey) {
          try {
            await sendEmail({
              to: settings.email,
              subject: `Nuevo pedido: ${order.orderNumber}`,
              text: message,
              apiKey: settings.resendApiKey,
            });
          } catch (error) {
            console.error("Failed to send email:", error);
          }
        }

        // Send WhatsApp if enabled
        if (settings.whatsappEnabled && settings.whatsappNumber && settings.metaApiKey && settings.metaPhoneNumberId) {
          try {
            await sendWhatsAppMeta({
              to: settings.whatsappNumber,
              message,
              apiKey: settings.metaApiKey,
              phoneNumberId: settings.metaPhoneNumberId,
            });
          } catch (error) {
            console.error("Failed to send WhatsApp:", error);
          }
        }
      }
    }

    // 2. Check for low stock
    if (settings.notifyOnLowStock !== false) {
      const lowStockItems = await ctx.runQuery(api.inventory.getLowStock, { threshold: 10 });
      
      for (const item of lowStockItems) {
        // Check if we already notified about this product recently (last hour)
        const recentNotifications = await ctx.runQuery(api.notifications.getRecentByType, {
          type: "low_stock",
          since: Date.now() - 60 * 60 * 1000,
        });
        
        const alreadyNotified = recentNotifications.some(
          (n: any) => n.productId === item.productId
        );
        
        if (!alreadyNotified) {
          const product = await ctx.runQuery(api.products.getById, { id: item.productId });
          
          const message = `⚠️ STOCK BAJO\n\n` +
            `Producto: ${product?.name || 'N/A'}\n` +
            `SKU: ${product?.sku || 'N/A'}\n` +
            `Stock actual: ${item.quantityAvailable} unidades\n` +
            `Umbral mínimo: 10 unidades\n\n` +
            `📦 Reabastecer urgentemente`;

          // Create notification
          await ctx.runMutation(api.notifications.createNotification, {
            type: "low_stock",
            title: `Stock bajo: ${product?.name}`,
            message,
            productId: item.productId,
            read: false,
          });

          // Send email if enabled
          if (settings.emailEnabled && settings.email && settings.resendApiKey) {
            try {
              await sendEmail({
                to: settings.email,
                subject: `Stock bajo: ${product?.name}`,
                text: message,
                apiKey: settings.resendApiKey,
              });
            } catch (error) {
              console.error("Failed to send email:", error);
            }
          }

          // Send WhatsApp if enabled
          if (settings.whatsappEnabled && settings.whatsappNumber && settings.metaApiKey && settings.metaPhoneNumberId) {
            try {
              await sendWhatsAppMeta({
                to: settings.whatsappNumber,
                message,
                apiKey: settings.metaApiKey,
                phoneNumberId: settings.metaPhoneNumberId,
              });
            } catch (error) {
              console.error("Failed to send WhatsApp:", error);
            }
          }
        }
      }
    }

    // 3. Check for new customers
    if (settings.notifyOnNewCustomer !== false) {
      const newCustomers = await ctx.runQuery(api.users.getRecentUsers, { since: fiveMinutesAgo });
      
      for (const customer of newCustomers) {
        const message = `👤 NUEVO CLIENTE REGISTRADO\n\n` +
          `Nombre: ${customer.name}\n` +
          `Email: ${customer.email}\n` +
          `Empresa: ${customer.company || 'No especificada'}\n` +
          `Tel: ${customer.phone || 'No proporcionado'}\n\n` +
          `Tier: ${customer.customerTier || 'Bronce'} (auto-asignado)`;

        // Create notification
        await ctx.runMutation(api.notifications.createNotification, {
          type: "new_customer",
          title: `Nuevo cliente: ${customer.name}`,
          message,
          customerId: customer._id,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          read: false,
        });

        // Send email if enabled
        if (settings.emailEnabled && settings.email && settings.resendApiKey) {
          try {
            await sendEmail({
              to: settings.email,
              subject: `Nuevo cliente: ${customer.name}`,
              text: message,
              apiKey: settings.resendApiKey,
            });
          } catch (error) {
            console.error("Failed to send email:", error);
          }
        }

        // Send WhatsApp if enabled
        if (settings.whatsappEnabled && settings.whatsappNumber && settings.metaApiKey && settings.metaPhoneNumberId) {
          try {
            await sendWhatsAppMeta({
              to: settings.whatsappNumber,
              message,
              apiKey: settings.metaApiKey,
              phoneNumberId: settings.metaPhoneNumberId,
            });
          } catch (error) {
            console.error("Failed to send WhatsApp:", error);
          }
        }
      }
    }
  },
});

// Helper: Send email via Resend
async function sendEmail({ to, subject, text, apiKey }: { 
  to: string; 
  subject: string; 
  text: string; 
  apiKey: string;
}) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Dulcitienda <notificaciones@dulcitienda.com>',
      to,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return await response.json();
}

// Helper: Send WhatsApp via Meta Business API
async function sendWhatsAppMeta({ 
  to, 
  message, 
  apiKey,
  phoneNumberId,
}: { 
  to: string; 
  message: string; 
  apiKey: string;
  phoneNumberId: string;
}) {
  // Format phone number (remove + and spaces)
  const formattedPhone = to.replace(/\+/g, '').replace(/\s/g, '');
  
  const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'text',
      text: {
        body: message,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Meta WhatsApp API error: ${error}`);
  }

  return await response.json();
}
