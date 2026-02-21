'use client';

import { useCartStore } from '@/lib/store';
import { ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSettings, placeOrder } from '@/app/actions';
import { Settings } from '@/lib/types';
import { motion, AnimatePresence } from 'motion/react';

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [utr, setUtr] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const subtotal = getTotal();
  let deliveryFee = settings?.deliveryFee || 0;
  
  if (settings?.isFreeDeliveryEnabled && subtotal >= settings.freeDeliveryThreshold) {
    deliveryFee = 0;
  }

  const total = subtotal + deliveryFee;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!phone || !address || !utr) return;
    
    setIsSubmitting(true);
    try {
      const order = await placeOrder({
        customerPhone: phone,
        customerAddress: address,
        items: items.map(i => ({
          id: Math.random().toString(36).substr(2, 9),
          menuItemId: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price
        })),
        totalAmount: total,
        deliveryFee,
        utr,
        screenshot: screenshot || undefined
      });
      
      clearCart();
      router.push(`/order/${order.id}`);
    } catch (error) {
      console.error('Failed to place order', error);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && step === 1) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <header className="bg-white px-4 py-4 shadow-sm sticky top-0 z-10 flex items-center gap-4">
        <button onClick={() => step > 1 ? setStep(step - 1) : router.back()} className="p-2 -ml-2 text-stone-600 hover:text-stone-900">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-stone-900">Checkout</h1>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= s ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-500'
              }`}>
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
              <span className={`text-xs font-medium ${step >= s ? 'text-emerald-700' : 'text-stone-400'}`}>
                {s === 1 ? 'Details' : s === 2 ? 'Address' : 'Payment'}
              </span>
            </div>
          ))}
          <div className="absolute top-[88px] left-12 right-12 h-0.5 bg-stone-200 -z-10">
            <div 
              className="h-full bg-emerald-600 transition-all duration-300" 
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <h2 className="text-lg font-bold text-stone-900 mb-4">Your Phone Number</h2>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  autoFocus
                />
                <button
                  onClick={() => setStep(2)}
                  disabled={phone.length < 10}
                  className="w-full mt-6 bg-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <h2 className="text-lg font-bold text-stone-900 mb-4">Delivery Address</h2>
                <textarea
                  placeholder="Enter your full address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={4}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                  autoFocus
                />
                <button
                  onClick={() => setStep(3)}
                  disabled={address.length < 10}
                  className="w-full mt-6 bg-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  Continue to Payment
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 text-center">
                <h2 className="text-lg font-bold text-stone-900 mb-2">Payment Instructions</h2>
                <p className="text-stone-500 text-sm mb-6">Please pay the exact amount to confirm your order.</p>
                
                <div className="bg-stone-50 rounded-xl p-4 mb-6 border border-stone-200">
                  <div className="text-sm text-stone-500 mb-1">Amount to Pay</div>
                  <div className="text-3xl font-bold text-emerald-700 mb-4">₹{total}</div>
                  
                  <div className="text-sm text-stone-500 mb-1">UPI ID</div>
                  <div className="font-mono text-lg font-medium text-stone-900 bg-white py-2 px-4 rounded-lg border border-stone-200 inline-block">
                    freshsalad@bank
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">UTR Number (Required)</label>
                    <input
                      type="text"
                      placeholder="Enter 12-digit UTR number"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Payment Screenshot (Optional)</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="screenshot-upload"
                      />
                      <label
                        htmlFor="screenshot-upload"
                        className="flex items-center justify-center gap-2 w-full bg-stone-50 border border-stone-200 border-dashed rounded-xl px-4 py-4 text-stone-600 cursor-pointer hover:bg-stone-100 transition-colors"
                      >
                        <Upload size={20} />
                        <span className="font-medium">{screenshot ? 'Screenshot Selected' : 'Upload Screenshot'}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={utr.length < 6 || isSubmitting}
                  className="w-full mt-8 bg-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
