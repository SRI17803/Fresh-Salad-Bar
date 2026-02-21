import { getOrder } from '@/app/actions';
import { notFound } from 'next/navigation';
import { CheckCircle2, Circle, Clock, Package, Check } from 'lucide-react';
import Link from 'next/link';

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  const statuses = ['Payment Submitted', 'Received', 'Preparing', 'Ready'];
  const currentStatusIndex = statuses.indexOf(order.status);

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <header className="bg-white px-4 py-6 shadow-sm sticky top-0 z-10 text-center">
        <h1 className="text-xl font-bold text-stone-900">Order Status</h1>
        <p className="text-sm text-stone-500 mt-1">{order.id}</p>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6 mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <h2 className="text-lg font-bold text-stone-900 mb-6 text-center">Track Your Order</h2>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-200 before:to-transparent">
            {statuses.map((status, index) => {
              const isCompleted = currentStatusIndex >= index;
              const isCurrent = currentStatusIndex === index;
              
              return (
                <div key={status} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${
                    isCompleted ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-stone-400'
                  }`}>
                    {isCompleted ? <Check size={16} strokeWidth={3} /> : <Circle size={16} />}
                  </div>
                  
                  <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border ${
                    isCurrent ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-stone-100 bg-white'
                  }`}>
                    <div className="flex items-center justify-between space-x-2 mb-1">
                      <div className={`font-bold ${isCurrent ? 'text-emerald-700' : isCompleted ? 'text-stone-900' : 'text-stone-400'}`}>
                        {status}
                      </div>
                    </div>
                    <div className={`text-sm ${isCurrent ? 'text-emerald-600/80' : 'text-stone-500'}`}>
                      {status === 'Payment Submitted' && 'We are verifying your payment.'}
                      {status === 'Received' && 'Your order has been confirmed.'}
                      {status === 'Preparing' && 'Our chefs are preparing your food.'}
                      {status === 'Ready' && 'Your order is ready for pickup/delivery!'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <h3 className="font-bold text-stone-900 mb-4">Order Details</h3>
          <div className="space-y-3 mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-stone-600">
                <span>{item.name} x {item.quantity}</span>
                <span className="font-medium text-stone-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between text-stone-600 pt-3 border-t border-stone-100">
              <span>Delivery Fee</span>
              <span className="font-medium text-stone-900">₹{order.deliveryFee}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-stone-100">
              <span className="font-bold text-stone-900">Total</span>
              <span className="font-bold text-emerald-700 text-lg">₹{order.totalAmount}</span>
            </div>
          </div>
          
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
            <div className="text-sm text-stone-500 mb-1">Delivery Address</div>
            <div className="text-stone-900 font-medium">{order.customerAddress}</div>
            
            <div className="text-sm text-stone-500 mt-4 mb-1">Phone Number</div>
            <div className="text-stone-900 font-medium">{order.customerPhone}</div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
            Return to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
