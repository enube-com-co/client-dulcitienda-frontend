"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, MessageCircle, BellRing, ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NotificationSettingsPage() {
  const settings = useQuery(api.notifications.getSettings);
  const updateSettings = useMutation(api.notifications.updateSettings);
  
  const [formData, setFormData] = useState({
    email: "",
    whatsappNumber: "",
    emailEnabled: false,
    whatsappEnabled: false,
    webNotificationsEnabled: true,
    notifyOnNewOrder: true,
    notifyOnStatusChange: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        email: settings.email || "",
        whatsappNumber: settings.whatsappNumber || "",
        emailEnabled: settings.emailEnabled || false,
        whatsappEnabled: settings.whatsappEnabled || false,
        webNotificationsEnabled: settings.webNotificationsEnabled ?? true,
        notifyOnNewOrder: settings.notifyOnNewOrder ?? true,
        notifyOnStatusChange: settings.notifyOnStatusChange ?? true,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    await updateSettings(formData);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="outline" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuración de Notificaciones</h1>
            <p className="text-gray-500">Administra cómo recibes las alertas de la tienda</p>
          </div>
        </div>

        {/* Web Notifications */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <BellRing className="text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-lg font-semibold">Notificaciones en la Web</h2>
                  <p className="text-gray-500">Badge de notificaciones en el panel de administración</p>
                </div>
                <Switch
                  checked={formData.webNotificationsEnabled}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, webNotificationsEnabled: checked })
                  }
                />
              </div>
              <p className="text-sm text-gray-500">
                Muestra un contador de notificaciones no leídas en la barra superior del panel de admin.
              </p>
            </div>
          </div>
        </Card>

        {/* Email Notifications */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Notificaciones por Email</h2>
                  <p className="text-gray-500">Recibe alertas en tu correo electrónico</p>
                </div>
                <Switch
                  checked={formData.emailEnabled}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, emailEnabled: checked })
                  }
                />
              </div>
              
              {formData.emailEnabled && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email donde recibirás las notificaciones *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="max-w-md"
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* WhatsApp Notifications */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Notificaciones por WhatsApp</h2>
                  <p className="text-gray-500">Recibe alertas en tu número de WhatsApp</p>
                </div>
                <Switch
                  checked={formData.whatsappEnabled}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, whatsappEnabled: checked })
                  }
                />
              </div>
              
              {formData.whatsappEnabled && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de WhatsApp donde recibirás las notificaciones *
                  </label>
                  <Input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="+57 313 230 9867"
                    className="max-w-md"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Incluye el código de país (+57 para Colombia)
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Notification Events */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="text-pink-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-4">Eventos de Notificación</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Nuevo pedido recibido</p>
                    <p className="text-sm text-gray-500">Cuando un cliente completa una compra</p>
                  </div>
                  <Switch
                    checked={formData.notifyOnNewOrder}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, notifyOnNewOrder: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Cambio de estado de pedido</p>
                    <p className="text-sm text-gray-500">Cuando actualizas el estado de un pedido</p>
                  </div>
                  <Switch
                    checked={formData.notifyOnStatusChange}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, notifyOnStatusChange: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white px-8"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={18} />
                Guardando...
              </>
            ) : saved ? (
              <>
                <Save className="mr-2" size={18} />
                ¡Guardado!
              </>
            ) : (
              <>
                <Save className="mr-2" size={18} />
                Guardar configuración
              </>
            )}
          </Button>
          
          {saved && (
            <p className="text-green-600 font-medium">Configuración guardada exitosamente</p>
          )}
        </div>
      </div>
    </div>
  );
}
