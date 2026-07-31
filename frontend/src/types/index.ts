export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export type TransactionType = "INCOME" | "EXPENSE";

export interface Category {
  id: string;
  title: string;
  description?: string | null;
  icon: string;
  color: string;
  transactionsCount: number;
  totalAmount: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: string;
  category: Category;
}

export interface DashboardSummary {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  recentTransactions: Transaction[];
}

export interface TransactionsPage {
  items: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}
