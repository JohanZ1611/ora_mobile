export type TransactionType = "INCOME" | "EXPENSE";
export type Frequency = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface Transaction {
  id: string;
  userId: string;
  groupId: string | null;
  type: TransactionType;
  frequency: Frequency;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  dueDate: string | null;
  reminderOn: boolean;
  receiptUrl: string | null;
  createdAt: string;
  updatedAt: string;
  group?: { id: string; name: string; category: string } | null;
}

export interface Group {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
  category: string;
  dueDate: string | null;
  reminderOn: boolean;
  description: string | null;
  totalAmount: number;
  createdAt: string;
  transactions: Transaction[];
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limitAmount: number;
  spentAmount: number;
  percentage: number;
  month: number;
  year: number;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  percentage: number;
  remaining: number;
  deadline: string | null;
}

export interface Debt {
  id: string;
  userId: string;
  name: string;
  totalAmount: number;
  paidAmount: number;
  percentage: number;
  remaining: number;
  dueDate: string | null;
  reminderOn: boolean;
}

export interface Todo {
  id: string;
  userId: string;
  title: string;
  date: string;
  done: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  currency: string;
  themeConfig: Record<string, unknown> | null;
}

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  ok: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}