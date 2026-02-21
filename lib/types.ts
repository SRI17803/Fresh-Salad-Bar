export type Category = { id: string; name: string };
export type MenuItem = { id: string; categoryId: string; name: string; description: string; price: number; image: string; available: boolean };
export type OrderStatus = 'Payment Submitted' | 'Received' | 'Preparing' | 'Ready' | 'Cancelled';
export type OrderItem = { id: string; menuItemId: string; name: string; quantity: number; price: number };
export type Order = { id: string; customerPhone: string; customerAddress: string; items: OrderItem[]; totalAmount: number; deliveryFee: number; status: OrderStatus; utr: string; screenshot?: string; createdAt: string };
export type ExpenseCategory = 'Vegetables' | 'Packaging' | 'Staff Salary' | 'Rent' | 'Electricity' | 'Gas' | 'Other';
export type Expense = { id: string; amount: number; category: string; note: string; date: string; createdAt: string };
export type Settings = { deliveryFee: number; freeDeliveryThreshold: number; isFreeDeliveryEnabled: boolean };

export type DBData = {
  categories: Category[];
  menuItems: MenuItem[];
  orders: Order[];
  expenses: Expense[];
  settings: Settings;
};
