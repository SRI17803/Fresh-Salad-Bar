import { getMenuData } from '@/app/actions';
import MenuList from './components/MenuList';
import CartButton from './components/CartButton';

export default async function Home() {
  const { categories, menuItems } = await getMenuData();

  return (
    <main className="min-h-screen bg-stone-50 pb-24">
      <header className="bg-white px-4 py-6 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">FRESH SALAD BAR</h1>
        <p className="text-sm text-stone-500 mt-1">Fresh, Fast, Healthy</p>
      </header>

      <div className="max-w-md mx-auto">
        <MenuList categories={categories} menuItems={menuItems} />
      </div>

      <CartButton />
    </main>
  );
}
