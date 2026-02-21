'use client';

import { useCartStore } from '@/lib/store';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSettings } from '@/app/actions';
import { Settings } from '@/lib/types';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const subtotal = getTotal();
  let deliveryFee = settings?.deliveryFee || 0;
  
  if (settings?.isFreeDeliveryEnabled && subtotal >= settings.freeDeliveryThreshold) {
    deliveryFee = 0;
  }

  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Your cart is empty</h2>
          <p className="text-stone-500 mb-8">Add some fresh salads to get started.</p>
          <Link
            href="/"
            className="bg-emerald-600 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-700 transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-stone-600 hover:text-stone-900">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-stone-900">Your Cart</h1>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          {items.map((item, index) => (
            <div key={item.id} className={`p-4 flex gap-4 ${index !== items.length - 1 ? 'border-b border-stone-100' : ''}`}>
              <div className="flex-1">
                <h3 className="font-medium text-stone-900">{item.name}</h3>
                <div className="text-emerald-700 font-medium mt-1">₹{item.price}</div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-stone-400 hover:text-red-500 p-1"
                >
                  <Trash2 size={18} />
                </button>
                <div className="flex items-center gap-3 bg-stone-50 rounded-full px-2 py-1 border border-stone-200 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center text-stone-600 font-medium"
                  >
                    -
                  </button>
                  <span className="w-4 text-center text-sm font-medium text-stone-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-stone-600 font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 space-y-3">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Delivery</span>
            <span>{deliveryFee === 0 ? <span className="text-emerald-600 font-medium">Free</span> : `₹${deliveryFee}`}</span>
          </div>
          <div className="pt-3 border-t border-stone-100 flex justify-between items-center">
            <span className="font-bold text-stone-900 text-lg">Total</span>
            <span className="font-bold text-stone-900 text-xl">₹{total}</span>
          </div>
        </div>

        <Link
          href="/checkout"
          className="block w-full bg-emerald-600 text-white text-center py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-sm"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
