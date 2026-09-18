export type AccountType = 'BANK' | 'CASH' | 'EWALLET' | 'INVESTMENT' | 'OTHER';
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';
export type CategoryType = 'INCOME' | 'EXPENSE';
export type PeriodFilter = 'week' | 'month' | 'year' | 'all';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  currentBalance: number;
  color: string;
  icon: string;
  accountNumber?: string | null;
  createdAt: string | Date;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  notes?: string | null;
  accountId: string;
  account?: Account;
  toAccountId?: string | null;
  toAccount?: Account | null;
  categoryId?: string | null;
  category?: Category | null;
  createdAt?: string | Date;
}

export interface CategoryBreakdown {
  id: string;
  name: string;
  color: string;
  icon: string;
  total: number;
  percentage: number;
}

export interface TrendDataPoint {
  label: string;
  date: string;
  income: number;
  expense: number;
}

export interface FinancialSummary {
  totalNetWorth: number;
  periodIncome: number;
  periodExpense: number;
  netCashflow: number;
  accounts: Account[];
  categories: Category[];
  recentTransactions: Transaction[];
  categoryBreakdown: CategoryBreakdown[];
  trendData: TrendDataPoint[];
  isDbConnected: boolean;
}
