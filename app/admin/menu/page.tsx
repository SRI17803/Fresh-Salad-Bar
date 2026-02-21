import { getMenuData, addCategory, addMenuItem, updateMenuItem } from '@/app/actions';
import { Plus } from 'lucide-react';
import Image from 'next/image';

export default async function AdminMenu() {
  const { categories, menuItems } = await getMenuData();

  const handleAddCategory = async (formData: FormData) => {
    'use server';
    const name = formData.get('name') as string;
    if (name) {
      await addCategory(name);
    }
  };

  const handleAddItem = async (formData: FormData) => {
    'use server';
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const categoryId = formData.get('categoryId') as string;
    const image = formData.get('image') as string || `https://picsum.photos/seed/${Math.random()}/400/300`;

    if (name && price && categoryId) {
      await addMenuItem({ name, description, price, categoryId, image, available: true });
    }
  };

  const handleToggleAvailability = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    const available = formData.get('available') === 'true';
    await updateMenuItem(id, { available: !available });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Menu Management</h1>
          <p className="text-stone-500 mt-1">Manage categories and items.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Plus size={20} className="text-emerald-600" />
              Add Category
            </h2>
            <form action={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Category Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="e.g. Summer Specials"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-stone-900 text-white py-3 rounded-xl font-semibold hover:bg-stone-800 transition-colors shadow-sm"
              >
                Add Category
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Plus size={20} className="text-emerald-600" />
              Add Menu Item
            </h2>
            <form action={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                <select
                  name="categoryId"
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Item Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="e.g. Greek Salad"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                  placeholder="e.g. Fresh lettuce, olives..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="e.g. 350"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  name="image"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="https://..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Add Item
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {categories.map(category => {
            const items = menuItems.filter(i => i.categoryId === category.id);
            return (
              <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="p-4 border-b border-stone-100 bg-stone-50">
                  <h2 className="text-lg font-bold text-stone-900">{category.name}</h2>
                </div>
                <div className="divide-y divide-stone-100">
                  {items.length === 0 ? (
                    <div className="p-6 text-center text-stone-500">No items in this category.</div>
                  ) : (
                    items.map(item => (
                      <div key={item.id} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-stone-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-stone-200 shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <div className="font-bold text-stone-900">{item.name}</div>
                            <div className="text-sm text-stone-500 line-clamp-1">{item.description}</div>
                            <div className="font-semibold text-emerald-700 mt-1">₹{item.price}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                          <form action={handleToggleAvailability}>
                            <input type="hidden" name="id" value={item.id} />
                            <input type="hidden" name="available" value={item.available.toString()} />
                            <button
                              type="submit"
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                item.available 
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {item.available ? 'In Stock ✓' : 'Out of Stock ✗'}
                            </button>
                          </form>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
