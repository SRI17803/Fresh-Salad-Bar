'use client';

import { useState } from 'react';
import { Expense } from '@/lib/types';
import { format } from 'date-fns';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { addExpense, updateExpense, deleteExpense } from '@/app/actions';

export default function ExpenseManager({ initialExpenses }: { initialExpenses: Expense[] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get('amount'));
    const category = formData.get('category') as string;
    const note = formData.get('note') as string;
    const date = formData.get('date') as string;

    try {
      if (currentExpense) {
        await updateExpense(currentExpense.id, { amount, category, note, date });
      } else {
        await addExpense({ amount, category, note, date });
      }
      setIsEditing(false);
      setCurrentExpense(null);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Failed to save expense', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (expense: Expense) => {
    setCurrentExpense(expense);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentExpense(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              {isEditing ? <Edit2 size={20} className="text-emerald-600" /> : <Plus size={20} className="text-emerald-600" />}
              {isEditing ? 'Edit Expense' : 'Add Expense'}
            </h2>
            {isEditing && (
              <button onClick={handleCancel} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                required
                min="0"
                step="1"
                defaultValue={currentExpense?.amount || ''}
                key={currentExpense?.id || 'new'}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="e.g. 500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
              <select
                name="category"
                required
                defaultValue={currentExpense?.category || 'Vegetables'}
                key={currentExpense?.id ? `cat-${currentExpense.id}` : 'cat-new'}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Packaging">Packaging</option>
                <option value="Staff Salary">Staff Salary</option>
                <option value="Rent">Rent</option>
                <option value="Electricity">Electricity</option>
                <option value="Gas">Gas</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Date</label>
              <input
                type="date"
                name="date"
                defaultValue={currentExpense?.date || new Date().toISOString().split('T')[0]}
                key={currentExpense?.id ? `date-${currentExpense.id}` : 'date-new'}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Note (Optional)</label>
              <input
                type="text"
                name="note"
                defaultValue={currentExpense?.note || ''}
                key={currentExpense?.id ? `note-${currentExpense.id}` : 'note-new'}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="e.g. bought tomatoes"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 bg-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                isEditing ? 'Update Expense' : 'Save Expense'
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-6 border-b border-stone-100">
            <h2 className="text-lg font-bold text-stone-900">Recent Expenses</h2>
          </div>
          <div className="divide-y divide-stone-100">
            {initialExpenses.length === 0 ? (
              <div className="p-8 text-center text-stone-500">No expenses recorded yet.</div>
            ) : (
              initialExpenses.map(expense => (
                <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-stone-50 transition-colors group">
                  <div className="flex-1">
                    <div className="font-bold text-stone-900">{expense.category}</div>
                    <div className="text-sm text-stone-500 mt-0.5">{expense.note || 'No note'}</div>
                    <div className="text-xs text-stone-400 mt-1">{format(new Date(expense.date), 'MMM d, yyyy')}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-bold text-red-600 text-lg">
                      -₹{expense.amount}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
