'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const PROMOTION_TYPES = [
  { value: "PERCENTAGE", label: "Porcentaje %" },
  { value: "FIXED_AMOUNT", label: "Monto fijo $" },
  { value: "FREE_SHIPPING", label: "Envío gratis" },
] as const;

const SCOPES = [
  { value: "GLOBAL", label: "Toda la tienda" },
  { value: "CATEGORY", label: "Categorías específicas" },
  { value: "PRODUCT", label: "Productos específicos" },
  { value: "USER", label: "Usuarios específicos" },
] as const;

export function PromotionAdmin() {
  const promotions = useQuery(api.promotions.getAll);
  const createPromotion = useMutation(api.promotions.create);
  const updatePromotion = useMutation(api.promotions.update);
  const deletePromotion = useMutation(api.promotions.remove);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"promotions"> | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "PERCENTAGE" as const,
    scope: "GLOBAL" as const,
    value: 0,
    maxDiscount: "",
    minPurchase: "",
    usageLimit: "",
    perUserLimit: "",
    startDate: "",
    endDate: "",
    isExclusive: false,
    priority: 10,
  });

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      type: "PERCENTAGE",
      scope: "GLOBAL",
      value: 0,
      maxDiscount: "",
      minPurchase: "",
      usageLimit: "",
      perUserLimit: "",
      startDate: "",
      endDate: "",
      isExclusive: false,
      priority: 10,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      code: formData.code,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      scope: formData.scope,
      value: formData.value,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      minPurchase: formData.minPurchase ? Number(formData.minPurchase) : undefined,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
      perUserLimit: formData.perUserLimit ? Number(formData.perUserLimit) : undefined,
      startDate: new Date(formData.startDate).getTime(),
      endDate: new Date(formData.endDate).getTime(),
      isExclusive: formData.isExclusive,
      priority: formData.priority,
    };

    try {
      if (editingId) {
        await updatePromotion({ id: editingId, ...payload });
      } else {
        await createPromotion(payload);
      }
      resetForm();
      setShowForm(false);
    } catch (error: any) {
      alert(error.message || "Error guardando promoción");
    }
  };

  const handleEdit = (promo: any) => {
    setEditingId(promo._id);
    setFormData({
      code: promo.code,
      name: promo.name,
      description: promo.description,
      type: promo.type,
      scope: promo.scope,
      value: promo.value,
      maxDiscount: promo.maxDiscount?.toString() || "",
      minPurchase: promo.minPurchase?.toString() || "",
      usageLimit: promo.usageLimit?.toString() || "",
      perUserLimit: promo.perUserLimit?.toString() || "",
      startDate: new Date(promo.startDate).toISOString().split('T')[0],
      endDate: new Date(promo.endDate).toISOString().split('T')[0],
      isExclusive: promo.isExclusive,
      priority: promo.priority,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: Id<"promotions">) => {
    if (!confirm("¿Eliminar esta promoción?")) return;
    try {
      await deletePromotion({ id });
    } catch (error) {
      alert("Error eliminando promoción");
    }
  };

  const handleToggleStatus = async (promo: any) => {
    try {
      await updatePromotion({
        id: promo._id,
        isActive: !promo.isActive,
      });
    } catch (error) {
      alert("Error actualizando estado");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-CO');
  };

  return (
    <div className="promotion-admin p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Promociones</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : '+ Nueva Promoción'}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
          <h3 className="font-semibold text-lg">{editingId ? 'Editar' : 'Nueva'} Promoción</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Código *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border rounded"
                placeholder="VERANO20"
                required
                disabled={!!editingId}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Nombre interno *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="Campaña Verano 2026"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded"
              placeholder="20% de descuento en toda la tienda"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tipo *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border rounded"
              >
                {PROMOTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Alcance</label>
              <select
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value as any })}
                className="w-full px-3 py-2 border rounded"
              >
                {SCOPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Valor {formData.type === 'PERCENTAGE' ? '(%)' : '($)'}</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded"
                min="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Descuento máximo ($)</label>
              <input
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="Sin límite"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Compra mínima ($)</label>
              <input
                type="number"
                value={formData.minPurchase}
                onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="Sin mínimo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Límite de usos</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="Ilimitado"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha inicio *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fecha fin *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isExclusive}
                onChange={(e) => setFormData({ ...formData, isExclusive: e.target.checked })}
              />
              Exclusiva (no combinable)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {editingId ? 'Actualizar' : 'Guardar'} Promoción
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Limpiar
            </button>
          </div>
        </form>
      )}

      {/* Lista de promociones */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Código</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Valor</th>
              <th className="px-4 py-3 text-left">Vigencia</th>
              <th className="px-4 py-3 text-left">Usos</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {promotions?.map((promo) => (
              <tr key={promo._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-bold">{promo.code}</td>
                <td className="px-4 py-3">{promo.name}</td>
                <td className="px-4 py-3">{PROMOTION_TYPES.find(t => t.value === promo.type)?.label}</td>
                <td className="px-4 py-3">
                  {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `$${promo.value.toLocaleString()}`}
                </td>
                <td className="px-4 py-3 text-sm">
                  {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                </td>
                <td className="px-4 py-3">
                  {promo.usageCount}
                  {promo.usageLimit && ` / ${promo.usageLimit}`}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleStatus(promo)}
                    className={`px-2 py-1 rounded-full text-xs ${
                      promo.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {promo.isActive ? 'Activa' : 'Inactiva'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(promo)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(promo._id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!promotions?.length && (
          <div className="p-8 text-center text-gray-500">
            No hay promociones creadas aún.
          </div>
        )}
      </div>
    </div>
  );
}
