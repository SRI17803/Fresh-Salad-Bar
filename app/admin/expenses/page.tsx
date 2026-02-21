import { getExpenses } from '@/app/actions';
import ExpenseManager from './ExpenseManager';

export default async function AdminExpenses() {
  const expenses = await getExpenses();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Expenses</h1>
          <p className="text-stone-500 mt-1">Track your daily costs.</p>
        </div>
      </header>

      <ExpenseManager initialExpenses={expenses} />
    </div>
  );
}
