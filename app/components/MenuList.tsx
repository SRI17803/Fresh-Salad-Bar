'use client';

import { useState } from 'react';
import { Category, MenuItem } from '@/lib/types';
import Image from 'next/image';
import { useCartStore } from '@/lib/store';
import { motion, AnimatePresence } from 'motion/react';

export default function MenuList({ categories, menuItems }: { categories: Category[], menuItems: MenuItem[] }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore(state => state.addItem);

  const filteredItems = menuItems.filter(item => item.categoryId === activeCategory);

  const handleAddToCart = () => {
    if (selectedItem) {
      addItem(selectedItem, quantity);
      setSelectedItem(null);
      setQuantity(1);
    }
  };

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar px-4 py-4 gap-3">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-4 px-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedItem(item);
              setQuantity(1);
            }}
            className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 cursor-pointer transition-transform active:scale-95 ${!item.available ? 'opacity-50' : ''}`}
          >
            <div className="relative h-32 w-full bg-stone-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-3">
              <h3 className="font-medium text-stone-900 text-sm leading-tight line-clamp-2">{item.name}</h3>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-semibold text-emerald-700">₹{item.price}</span>
                {item.available ? (
                  <button className="bg-stone-900 text-white text-xs px-3 py-1.5 rounded-full font-medium">ADD</button>
                ) : (
                  <span className="text-xs text-red-500 font-medium">Sold Out</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="bg-white w-full max-w-md sm:rounded-2xl rounded-t-3xl overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-64 w-full">
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 left-4 bg-white/80 backdrop-blur-md p-2 rounded-full text-stone-900 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-stone-900">{selectedItem.name}</h2>
                <p className="text-stone-500 mt-2 text-sm leading-relaxed">{selectedItem.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-2xl font-semibold text-emerald-700">₹{selectedItem.price}</span>
                  <div className="flex items-center gap-4 bg-stone-100 rounded-full px-4 py-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-stone-500 hover:text-stone-900 text-xl font-medium w-6 h-6 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-semibold text-stone-900 w-4 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-stone-500 hover:text-stone-900 text-xl font-medium w-6 h-6 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedItem.available}
                  className="w-full mt-8 bg-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {selectedItem.available ? `Add to Cart - ₹${selectedItem.price * quantity}` : 'Sold Out'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
