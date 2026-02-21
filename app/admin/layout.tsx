import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Receipt, UtensilsCrossed, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-stone-900 text-stone-300 flex-shrink-0 md:min-h-screen sticky top-0 md:sticky md:top-0 z-20">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white tracking-tight">FRESH SALAD BAR</h1>
          <p className="text-xs text-stone-500 mt-1 uppercase tracking-wider font-semibold">Admin Panel</p>
        </div>
        <nav className="px-4 pb-6 space-y-1 overflow-x-auto md:overflow-x-visible flex md:block hide-scrollbar">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-800 hover:text-white transition-colors whitespace-nowrap">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-800 hover:text-white transition-colors whitespace-nowrap">
            <ShoppingBag size={20} />
            <span className="font-medium">Orders</span>
          </Link>
          <Link href="/admin/expenses" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-800 hover:text-white transition-colors whitespace-nowrap">
            <Receipt size={20} />
            <span className="font-medium">Expenses</span>
          </Link>
          <Link href="/admin/menu" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-800 hover:text-white transition-colors whitespace-nowrap">
            <UtensilsCrossed size={20} />
            <span className="font-medium">Menu</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-800 hover:text-white transition-colors whitespace-nowrap">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
