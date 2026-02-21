'use server';

import { getDB, saveDB } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { Order, Expense, MenuItem, Category, Settings, OrderStatus } from '@/lib/types';

export async function getMenuData() {
  const db = await getDB();
  return { categories: db.categories, menuItems: db.menuItems, settings: db.settings };
}

export async function placeOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) {
  const db = await getDB();
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    status: 'Payment Submitted',
    createdAt: new Date().toISOString(),
  };
  db.orders.push(newOrder);
  await saveDB(db);
  revalidatePath('/admin');
  revalidatePath('/admin/orders');
  return newOrder;
}

export async function getOrder(id: string) {
  const db = await getDB();
  return db.orders.find(o => o.id === id);
}

export async function getAdminDashboardData() {
  const db = await getDB();
  const today = new Date().toISOString().split('T')[0];
  
  const todayOrders = db.orders.filter(o => o.createdAt.startsWith(today) && o.status !== 'Cancelled');
  const todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  
  const todayExpenses = db.expenses.filter(e => e.date === today);
  const todayExpensesTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const todayProfit = todaySales - todayExpensesTotal;

  // Last 7 days profit
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const chartData = last7Days.map(date => {
    const sales = db.orders.filter(o => o.createdAt.startsWith(date) && o.status !== 'Cancelled').reduce((sum, o) => sum + o.totalAmount, 0);
    const expenses = db.expenses.filter(e => e.date === date).reduce((sum, e) => sum + e.amount, 0);
    return { date, profit: sales - expenses };
  });

  return {
    todaySales,
    todayExpenses: todayExpensesTotal,
    todayProfit,
    chartData,
    recentOrders: db.orders.slice(-5).reverse()
  };
}

export async function getOrders() {
  const db = await getDB();
  return db.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const db = await getDB();
  const order = db.orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    await saveDB(db);
    revalidatePath('/admin/orders');
    revalidatePath(`/order/${id}`);
  }
}

export async function getExpenses() {
  const db = await getDB();
  return db.expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addExpense(expenseData: Omit<Expense, 'id' | 'createdAt'>) {
  const db = await getDB();
  const newExpense: Expense = {
    ...expenseData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
  };
  db.expenses.push(newExpense);
  await saveDB(db);
  revalidatePath('/admin');
  revalidatePath('/admin/expenses');
  return newExpense;
}

export async function updateExpense(id: string, expenseData: Partial<Expense>) {
  const db = await getDB();
  const index = db.expenses.findIndex(e => e.id === id);
  if (index !== -1) {
    db.expenses[index] = { ...db.expenses[index], ...expenseData };
    await saveDB(db);
    revalidatePath('/admin');
    revalidatePath('/admin/expenses');
  }
}

export async function deleteExpense(id: string) {
  const db = await getDB();
  db.expenses = db.expenses.filter(e => e.id !== id);
  await saveDB(db);
  revalidatePath('/admin');
  revalidatePath('/admin/expenses');
}

export async function getSettings() {
  const db = await getDB();
  return db.settings;
}

export async function updateSettings(settings: Settings) {
  const db = await getDB();
  db.settings = settings;
  await saveDB(db);
  revalidatePath('/admin/settings');
  revalidatePath('/');
}

export async function addCategory(name: string) {
  const db = await getDB();
  const newCategory = { id: uuidv4(), name };
  db.categories.push(newCategory);
  await saveDB(db);
  revalidatePath('/admin/menu');
  revalidatePath('/');
}

export async function addMenuItem(item: Omit<MenuItem, 'id'>) {
  const db = await getDB();
  const newItem = { ...item, id: uuidv4() };
  db.menuItems.push(newItem);
  await saveDB(db);
  revalidatePath('/admin/menu');
  revalidatePath('/');
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>) {
  const db = await getDB();
  const index = db.menuItems.findIndex(m => m.id === id);
  if (index !== -1) {
    db.menuItems[index] = { ...db.menuItems[index], ...updates };
    await saveDB(db);
    revalidatePath('/admin/menu');
    revalidatePath('/');
  }
}
