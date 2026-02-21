import { getOrders } from '@/app/actions';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function AdminOrders() {
  const orders = await getOrders();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Orders</h1>
        <p className="text-stone-500 mt-1">Manage all customer orders.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-sm font-medium text-stone-500 uppercase tracking-wider">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-500">No orders found.</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors group">
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-emerald-600 hover:text-emerald-700">
                        {order.id}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-stone-900">{order.customerPhone}</div>
                      <div className="text-sm text-stone-500 truncate max-w-[200px]">{order.customerAddress}</div>
                    </td>
                    <td className="p-4 font-bold text-stone-900">₹{order.totalAmount}</td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full inline-block ${
                        order.status === 'Payment Submitted' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Received' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Preparing' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'Ready' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-stone-100 text-stone-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-stone-500">
                      {format(new Date(order.createdAt), 'MMM d, h:mm a')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
