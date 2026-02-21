import { getOrder, updateOrderStatus } from '@/app/actions';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { OrderStatus } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  const handleStatusChange = async (formData: FormData) => {
    'use server';
    const newStatus = formData.get('status') as OrderStatus;
    await updateOrderStatus(id, newStatus);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 -ml-2 text-stone-600 hover:text-stone-900 bg-white rounded-full shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Order {order.id}</h1>
          <p className="text-stone-500 mt-1">Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy h:mm a')}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Items Ordered</h2>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-stone-50 last:border-0">
                  <div>
                    <div className="font-medium text-stone-900">{item.name}</div>
                    <div className="text-sm text-stone-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-bold text-stone-900">₹{item.price * item.quantity}</div>
                </div>
              ))}
              <div className="flex justify-between items-center py-2 border-t border-stone-100 text-stone-600">
                <span>Delivery Fee</span>
                <span className="font-medium">₹{order.deliveryFee}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-stone-100">
                <span className="font-bold text-stone-900 text-lg">Total</span>
                <span className="font-bold text-emerald-700 text-xl">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Payment Details</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-stone-500 uppercase tracking-wider font-medium mb-1">UTR Number</div>
                <div className="font-mono bg-stone-50 p-3 rounded-xl border border-stone-200 text-stone-900">{order.utr}</div>
              </div>
              {order.screenshot && (
                <div>
                  <div className="text-sm text-stone-500 uppercase tracking-wider font-medium mb-2">Screenshot</div>
                  <div className="relative h-64 w-full rounded-xl overflow-hidden border border-stone-200">
                    <Image src={order.screenshot} alt="Payment Screenshot" fill className="object-contain bg-stone-50" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Update Status</h2>
            <form action={handleStatusChange} className="space-y-4">
              <select
                name="status"
                defaultValue={order.status}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium"
              >
                <option value="Payment Submitted">Payment Submitted</option>
                <option value="Received">Received</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready">Ready</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Update Status
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-4">Customer Info</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-stone-500 uppercase tracking-wider font-medium mb-1">Phone</div>
                <div className="font-medium text-stone-900">{order.customerPhone}</div>
              </div>
              <div>
                <div className="text-sm text-stone-500 uppercase tracking-wider font-medium mb-1">Address</div>
                <div className="font-medium text-stone-900 whitespace-pre-wrap">{order.customerAddress}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
