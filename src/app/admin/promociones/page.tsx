import { PromotionAdmin } from "@/components/admin/PromotionAdmin";

export default function PromotionsAdminPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-gray-600 hover:text-gray-900">← Admin</a>
            <h1 className="text-xl font-semibold">Promociones</h1>
          </div>
        </div>
      </header>

      <PromotionAdmin />
    </main>
  );
}
