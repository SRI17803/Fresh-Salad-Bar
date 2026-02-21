import { getAdminDashboardData } from '@/app/actions';
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';

export default async function AdminDashboard() {
  const { todaySales, todayExpenses, todayProfit, chartData, recentOrders } = await getAdminDashboardData();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Dashboard</h1>
          <p className="text-stone-500 mt-1">Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/expenses"
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            <span>Add Expense</span>
          </Link>
        </div>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <div className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">Today&apos;s Sales</div>
          <div className="text-4xl font-bold text-stone-900">₹{todaySales.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <div className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">Today&apos;s Expenses</div>
          <div className="text-4xl font-bold text-red-600">₹{todayExpenses.toLocaleString()}</div>
        </div>
        <div className="bg-stone-900 p-6 rounded-2xl shadow-md border border-stone-800">
          <div className="text-sm font-medium text-stone-400 uppercase tracking-wider mb-2">Today&apos;s Profit</div>
          <div className="text-4xl font-bold text-emerald-400">₹{todayProfit.toLocaleString()}</div>
        </div>
      </div>

      {/* Profit Chart (Simple CSS Bars) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
        <h2 className="text-lg font-bold text-stone-900 mb-6">Last 7 Days Profit</h2>
        <div className="flex items-end justify-between h-48 gap-2">
          {chartData.map((data, i) => {
            const maxProfit = Math.max(...chartData.map(d => Math.abs(d.profit)), 1); // Avoid div by 0
            const height = `${(Math.abs(data.profit) / maxProfit) * 100}%`;
            const isPositive = data.profit >= 0;
            const dateStr = new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <div key={i} className="flex flex-col items-center flex-1 group relative">
                <div className="w-full max-w-[40px] flex flex-col justify-end h-full">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-300 ${isPositive ? 'bg-emerald-500 group-hover:bg-emerald-400' : 'bg-red-500 group-hover:bg-red-400'}`}
                    style={{ height }}
                  />
                </div>
                <div className="text-xs text-stone-500 mt-2 font-medium">{dateStr}</div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
                  ₹{data.profit.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="divide-y divide-stone-100">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-stone-500">No orders yet today.</div>
          ) : (
            recentOrders.map(order => (
              <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center justify-between p-4 hover:bg-stone-50 transition-colors group">
                <div>
                  <div className="font-medium text-stone-900 group-hover:text-emerald-700 transition-colors">{order.id}</div>
                  <div className="text-sm text-stone-500 mt-0.5">{order.customerPhone}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-stone-900">₹{order.totalAmount}</div>
                  <div className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full inline-block ${
                    order.status === 'Payment Submitted' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Received' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Preparing' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'Ready' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-stone-100 text-stone-800'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
