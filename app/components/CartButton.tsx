'use client';

import { useCartStore } from '@/lib/store';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CartButton() {
  const items = useCartStore(state => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        >
          <Link
            href="/cart"
            className="bg-stone-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 font-medium hover:bg-stone-800 transition-colors"
          >
            <ShoppingCart size={20} />
            <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
