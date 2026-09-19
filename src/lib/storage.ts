import { prisma, checkPostgresConnection } from './prisma';
import {
  Account,
  Category,
  Transaction,
  FinancialSummary,
  PeriodFilter,
  CategoryBreakdown,
  TrendDataPoint,
} from './types';
import { subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from 'date-fns';

// Initial default accounts
const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    name: 'Rekening BCA',
    type: 'BANK',
    initialBalance: 12000000,
    currentBalance: 14500000,
    color: '#0284c7',
    icon: 'building-2',
    accountNumber: '123-456-7890',
    createdAt: new Date(),
  },
  {
    id: 'acc-2',
    name: 'Bank Mandiri',
    type: 'BANK',
    initialBalance: 5000000,
    currentBalance: 5250000,
    color: '#1d4ed8',
    icon: 'landmark',
    accountNumber: '987-654-3210',
    createdAt: new Date(),
  },
  {
    id: 'acc-3',
    name: 'Dompet Tunai',
    type: 'CASH',
    initialBalance: 500000,
    currentBalance: 650000,
    color: '#16a34a',
    icon: 'wallet',
    accountNumber: null,
    createdAt: new Date(),
  },
  {
    id: 'acc-4',
    name: 'GoPay / OVO',
    type: 'EWALLET',
    initialBalance: 200000,
    currentBalance: 350000,
    color: '#06b6d4',
    icon: 'smartphone',
    accountNumber: '0812-3456-7890',
    createdAt: new Date(),
  },
  {
    id: 'acc-5',
    name: 'Bibit / Reksadana',
    type: 'INVESTMENT',
    initialBalance: 20000000,
    currentBalance: 25000000,
    color: '#9333ea',
    icon: 'trending-up',
    accountNumber: null,
    createdAt: new Date(),
  },
];

// Initial default categories
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Makanan & Minuman', type: 'EXPENSE', color: '#f59e0b', icon: 'utensils' },
  { id: 'cat-2', name: 'Transportasi & Bensin', type: 'EXPENSE', color: '#3b82f6', icon: 'car' },
  { id: 'cat-3', name: 'Belanja Kebutuhan', type: 'EXPENSE', color: '#ec4899', icon: 'shopping-bag' },
  { id: 'cat-4', name: 'Tagihan & Listrik', type: 'EXPENSE', color: '#ef4444', icon: 'receipt' },
  { id: 'cat-5', name: 'Hiburan & Liburan', type: 'EXPENSE', color: '#8b5cf6', icon: 'film' },
  { id: 'cat-6', name: 'Kesehatan & Medis', type: 'EXPENSE', color: '#10b981', icon: 'heart-pulse' },
  { id: 'cat-7', name: 'Gaji Pokok', type: 'INCOME', color: '#059669', icon: 'briefcase' },
  { id: 'cat-8', name: 'Bonus & Freelance', type: 'INCOME', color: '#d97706', icon: 'award' },
  { id: 'cat-9', name: 'Dividen & Investasi', type: 'INCOME', color: '#7c3aed', icon: 'badge-percent' },
];

// Generate dynamic initial transactions around the current date
const now = new Date();
const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'INCOME',
    amount: 15000000,
    date: subDays(now, 5).toISOString(),
    notes: 'Gaji Bulanan Masuk',
    accountId: 'acc-1',
    categoryId: 'cat-7',
    createdAt: subDays(now, 5),
  },
  {
    id: 'tx-2',
    type: 'EXPENSE',
    amount: 75000,
    date: now.toISOString(),
    notes: 'Makan siang ayam geprek + es teh',
    accountId: 'acc-3',
    categoryId: 'cat-1',
    createdAt: now,
  },
  {
    id: 'tx-3',
    type: 'EXPENSE',
    amount: 250000,
    date: subDays(now, 1).toISOString(),
    notes: 'Isi Bensin Pertamax mobil',
    accountId: 'acc-1',
    categoryId: 'cat-2',
    createdAt: subDays(now, 1),
  },
  {
    id: 'tx-4',
    type: 'EXPENSE',
    amount: 450000,
    date: subDays(now, 2).toISOString(),
    notes: 'Belanja bulanan supermarket',
    accountId: 'acc-1',
    categoryId: 'cat-3',
    createdAt: subDays(now, 2),
  },
  {
    id: 'tx-5',
    type: 'EXPENSE',
    amount: 120000,
    date: subDays(now, 3).toISOString(),
    notes: 'Tagihan internet Wifi',
    accountId: 'acc-4',
    categoryId: 'cat-4',
    createdAt: subDays(now, 3),
  },
  {
    id: 'tx-6',
    type: 'INCOME',
    amount: 2500000,
    date: subDays(now, 8).toISOString(),
    notes: 'Project Freelance Web Selesai',
    accountId: 'acc-2',
    categoryId: 'cat-8',
    createdAt: subDays(now, 8),
  },
  {
    id: 'tx-7',
    type: 'EXPENSE',
    amount: 60000,
    date: subDays(now, 4).toISOString(),
    notes: 'Nongkrong kopi susu',
    accountId: 'acc-4',
    categoryId: 'cat-1',
    createdAt: subDays(now, 4),
  },
  {
    id: 'tx-8',
    type: 'TRANSFER',
    amount: 500000,
    date: subDays(now, 2).toISOString(),
    notes: 'Tarik tunai dari BCA ke Dompet',
    accountId: 'acc-1',
    toAccountId: 'acc-3',
    createdAt: subDays(now, 2),
  },
];

// Fallback in-memory store in global scope (persists across hot reloads)
const globalStore = globalThis as unknown as {
  mockAccounts?: Account[];
  mockCategories?: Category[];
  mockTransactions?: Transaction[];
  hasSeededPostgres?: boolean;
};

if (!globalStore.mockAccounts) globalStore.mockAccounts = [...DEFAULT_ACCOUNTS];
if (!globalStore.mockCategories) globalStore.mockCategories = [...DEFAULT_CATEGORIES];
if (!globalStore.mockTransactions) globalStore.mockTransactions = [...DEFAULT_TRANSACTIONS];

// Helper to seed PostgreSQL if connected and empty
async function ensurePostgresSeeded() {
  if (globalStore.hasSeededPostgres) return;
  try {
    const catCount = await prisma.category.count();
    const accCount = await prisma.account.count();
    if (catCount === 0 && accCount === 0) {
      for (const a of DEFAULT_ACCOUNTS) {
        await prisma.account.create({
          data: {
            id: a.id,
            name: a.name,
            type: a.type as any,
            initialBalance: a.initialBalance,
            currentBalance: a.currentBalance,
            color: a.color,
            icon: a.icon,
            accountNumber: a.accountNumber,
          },
        });
      }
      for (const c of DEFAULT_CATEGORIES) {
        await prisma.category.create({
          data: {
            id: c.id,
            name: c.name,
            type: c.type as any,
            color: c.color,
            icon: c.icon,
          },
        });
      }
      for (const t of DEFAULT_TRANSACTIONS) {
        await prisma.transaction.create({
          data: {
            id: t.id,
            type: t.type as any,
            amount: t.amount,
            date: new Date(t.date),
            notes: t.notes,
            accountId: t.accountId,
            toAccountId: t.toAccountId || null,
            categoryId: t.categoryId || null,
          },
        });
      }
    }
    globalStore.hasSeededPostgres = true;
  } catch (err) {
    console.warn('PostgreSQL auto-seed skipped:', err);
  }
}

export async function getFinancialSummaryData(filter: PeriodFilter = 'month'): Promise<FinancialSummary> {
  const isDbConnected = await checkPostgresConnection();

  let accounts: Account[] = [];
  let categories: Category[] = [];
  let transactions: Transaction[] = [];

  if (isDbConnected) {
    try {
      await ensurePostgresSeeded();
      const rawAccounts = await prisma.account.findMany({ orderBy: { createdAt: 'asc' } });
      const rawCategories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
      const rawTransactions = await prisma.transaction.findMany({
        include: { account: true, toAccount: true, category: true },
        orderBy: { date: 'desc' },
      });

      accounts = rawAccounts.map((a: any) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
      }));
      categories = rawCategories;
      transactions = rawTransactions.map((t: any) => ({
        id: t.id,
        type: t.type as any,
        amount: t.amount,
        date: t.date.toISOString(),
        notes: t.notes,
        accountId: t.accountId,
        account: t.account ? { ...t.account, createdAt: t.account.createdAt.toISOString() } : undefined,
        toAccountId: t.toAccountId,
        toAccount: t.toAccount ? { ...t.toAccount, createdAt: t.toAccount.createdAt.toISOString() } : undefined,
        categoryId: t.categoryId,
        category: t.category,
        createdAt: t.createdAt.toISOString(),
      }));
    } catch {
      // Fallback to in-memory if query fails
      accounts = globalStore.mockAccounts!;
      categories = globalStore.mockCategories!;
      transactions = globalStore.mockTransactions!;
    }
  } else {
    accounts = globalStore.mockAccounts!;
    categories = globalStore.mockCategories!;
    transactions = globalStore.mockTransactions!;
  }

  // Populate relations for mock if needed
  transactions = transactions.map((t) => ({
    ...t,
    account: accounts.find((a) => a.id === t.accountId),
    toAccount: t.toAccountId ? accounts.find((a) => a.id === t.toAccountId) : null,
    category: t.categoryId ? categories.find((c) => c.id === t.categoryId) : null,
  }));

  // Calculate Total Net Worth (All money stored in all accounts)
  const totalNetWorth = accounts.reduce((acc, a) => acc + a.currentBalance, 0);

  // Date range filtering based on filter
  const today = new Date();
  let startDate: Date;
  let endDate: Date = today;

  if (filter === 'week') {
    startDate = startOfWeek(today, { weekStartsOn: 1 });
    endDate = endOfWeek(today, { weekStartsOn: 1 });
  } else if (filter === 'month') {
    startDate = startOfMonth(today);
    endDate = endOfMonth(today);
  } else if (filter === 'year') {
    startDate = startOfYear(today);
    endDate = endOfYear(today);
  } else {
    startDate = new Date(2000, 0, 1);
    endDate = new Date(2100, 11, 31);
  }

  // Filter transactions within the selected period
  const filteredTransactions = transactions.filter((t) => {
    const tDate = new Date(t.date);
    return tDate >= startDate && tDate <= endDate;
  });

  // Calculate period income and expense
  let periodIncome = 0;
  let periodExpense = 0;

  for (const t of filteredTransactions) {
    if (t.type === 'INCOME') periodIncome += t.amount;
    else if (t.type === 'EXPENSE') periodExpense += t.amount;
  }

  const netCashflow = periodIncome - periodExpense;

  // Calculate Category Breakdown (Where did the money go?)
  const categoryMap = new Map<string, number>();
  for (const t of filteredTransactions) {
    if (t.type === 'EXPENSE' && t.categoryId) {
      const current = categoryMap.get(t.categoryId) || 0;
      categoryMap.set(t.categoryId, current + t.amount);
    }
  }

  const categoryBreakdown: CategoryBreakdown[] = Array.from(categoryMap.entries()).map(([catId, total]) => {
    const cat = categories.find((c) => c.id === catId);
    return {
      id: catId,
      name: cat ? cat.name : 'Lainnya',
      color: cat ? cat.color : '#94a3b8',
      icon: cat ? cat.icon : 'tag',
      total,
      percentage: periodExpense > 0 ? Math.round((total / periodExpense) * 100) : 0,
    };
  }).sort((a, b) => b.total - a.total);

  // Build Trend Data Points for the selected period
  const trendData: TrendDataPoint[] = [];

  if (filter === 'week') {
    // 7 days
    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const label = format(d, 'EEE'); // Sen, Sel, Rab...
      const dayTx = transactions.filter((t) => format(new Date(t.date), 'yyyy-MM-dd') === dateStr);
      const inc = dayTx.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
      const exp = dayTx.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
      trendData.push({ label, date: dateStr, income: inc, expense: exp });
    }
  } else if (filter === 'month') {
    // 4 weeks / 10-day intervals or last 14 days
    for (let i = 13; i >= 0; i--) {
      const d = subDays(today, i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const label = format(d, 'd MMM');
      const dayTx = transactions.filter((t) => format(new Date(t.date), 'yyyy-MM-dd') === dateStr);
      const inc = dayTx.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
      const exp = dayTx.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
      trendData.push({ label, date: dateStr, income: inc, expense: exp });
    }
  } else {
    // Year: 12 months
    for (let m = 11; m >= 0; m--) {
      const d = new Date(today.getFullYear(), today.getMonth() - m, 1);
      const label = format(d, 'MMM');
      const monthTx = transactions.filter((t) => {
        const td = new Date(t.date);
        return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
      });
      const inc = monthTx.filter((t) => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
      const exp = monthTx.filter((t) => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
      trendData.push({ label, date: format(d, 'yyyy-MM'), income: inc, expense: exp });
    }
  }

  return {
    totalNetWorth,
    periodIncome,
    periodExpense,
    netCashflow,
    accounts,
    categories,
    recentTransactions: transactions.slice(0, 50),
    categoryBreakdown,
    trendData,
    isDbConnected,
  };
}

export async function addTransaction(data: {
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  date: string;
  notes?: string;
  accountId: string;
  toAccountId?: string;
  categoryId?: string;
}) {
  const isDbConnected = await checkPostgresConnection();

  if (isDbConnected) {
    try {
      // Execute in atomic transaction
      return await prisma.$transaction(async (tx: any) => {
        const created = await tx.transaction.create({
          data: {
            type: data.type,
            amount: data.amount,
            date: new Date(data.date),
            notes: data.notes || '',
            accountId: data.accountId,
            toAccountId: data.toAccountId || null,
            categoryId: data.categoryId || null,
          },
        });

        // Update account balances
        if (data.type === 'INCOME') {
          await tx.account.update({
            where: { id: data.accountId },
            data: { currentBalance: { increment: data.amount } },
          });
        } else if (data.type === 'EXPENSE') {
          await tx.account.update({
            where: { id: data.accountId },
            data: { currentBalance: { decrement: data.amount } },
          });
        } else if (data.type === 'TRANSFER' && data.toAccountId) {
          await tx.account.update({
            where: { id: data.accountId },
            data: { currentBalance: { decrement: data.amount } },
          });
          await tx.account.update({
            where: { id: data.toAccountId },
            data: { currentBalance: { increment: data.amount } },
          });
        }

        return created;
      });
    } catch (err) {
      console.error('Failed to create transaction in PostgreSQL:', err);
    }
  }

  // In-memory fallback
  const newTx: Transaction = {
    id: `tx-${Date.now()}`,
    type: data.type,
    amount: data.amount,
    date: data.date,
    notes: data.notes || '',
    accountId: data.accountId,
    toAccountId: data.toAccountId || null,
    categoryId: data.categoryId || null,
    createdAt: new Date(),
  };

  globalStore.mockTransactions!.unshift(newTx);

  // Update in-memory balances
  const acc = globalStore.mockAccounts!.find((a) => a.id === data.accountId);
  if (acc) {
    if (data.type === 'INCOME') acc.currentBalance += data.amount;
    else if (data.type === 'EXPENSE') acc.currentBalance -= data.amount;
    else if (data.type === 'TRANSFER') {
      acc.currentBalance -= data.amount;
      if (data.toAccountId) {
        const toAcc = globalStore.mockAccounts!.find((a) => a.id === data.toAccountId);
        if (toAcc) toAcc.currentBalance += data.amount;
      }
    }
  }

  return newTx;
}

export async function addAccount(data: {
  name: string;
  type: string;
  initialBalance: number;
  color: string;
  icon: string;
  accountNumber?: string;
}) {
  const isDbConnected = await checkPostgresConnection();

  if (isDbConnected) {
    try {
      return await prisma.account.create({
        data: {
          name: data.name,
          type: data.type as any,
          initialBalance: data.initialBalance,
          currentBalance: data.initialBalance,
          color: data.color,
          icon: data.icon,
          accountNumber: data.accountNumber || null,
        },
      });
    } catch (err) {
      console.error('Failed to create account in PostgreSQL:', err);
    }
  }

  const newAcc: Account = {
    id: `acc-${Date.now()}`,
    name: data.name,
    type: data.type as any,
    initialBalance: data.initialBalance,
    currentBalance: data.initialBalance,
    color: data.color,
    icon: data.icon,
    accountNumber: data.accountNumber || null,
    createdAt: new Date(),
  };
  globalStore.mockAccounts!.push(newAcc);
  return newAcc;
}

export async function deleteTransaction(id: string) {
  const isDbConnected = await checkPostgresConnection();

  if (isDbConnected) {
    try {
      return await prisma.$transaction(async (tx: any) => {
        const existing = await tx.transaction.findUnique({ where: { id } });
        if (!existing) return null;

        // Revert balance
        if (existing.type === 'INCOME') {
          await tx.account.update({
            where: { id: existing.accountId },
            data: { currentBalance: { decrement: existing.amount } },
          });
        } else if (existing.type === 'EXPENSE') {
          await tx.account.update({
            where: { id: existing.accountId },
            data: { currentBalance: { increment: existing.amount } },
          });
        } else if (existing.type === 'TRANSFER' && existing.toAccountId) {
          await tx.account.update({
            where: { id: existing.accountId },
            data: { currentBalance: { increment: existing.amount } },
          });
          await tx.account.update({
            where: { id: existing.toAccountId },
            data: { currentBalance: { decrement: existing.amount } },
          });
        }

        return await tx.transaction.delete({ where: { id } });
      });
    } catch (err) {
      console.error('Failed to delete transaction in PostgreSQL:', err);
    }
  }

  // Fallback in memory
  const idx = globalStore.mockTransactions!.findIndex((t) => t.id === id);
  if (idx !== -1) {
    const existing = globalStore.mockTransactions![idx];
    const acc = globalStore.mockAccounts!.find((a) => a.id === existing.accountId);
    if (acc) {
      if (existing.type === 'INCOME') acc.currentBalance -= existing.amount;
      else if (existing.type === 'EXPENSE') acc.currentBalance += existing.amount;
      else if (existing.type === 'TRANSFER' && existing.toAccountId) {
        acc.currentBalance += existing.amount;
        const toAcc = globalStore.mockAccounts!.find((a) => a.id === existing.toAccountId);
        if (toAcc) toAcc.currentBalance -= existing.amount;
      }
    }
    globalStore.mockTransactions!.splice(idx, 1);
  }
  return true;
}

export async function updateAccount(
  id: string,
  data: {
    name?: string;
    type?: string;
    currentBalance?: number;
    initialBalance?: number;
    color?: string;
    icon?: string;
    accountNumber?: string | null;
  }
) {
  const isDbConnected = await checkPostgresConnection();
  if (isDbConnected) {
    try {
      return await prisma.account.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.type && { type: data.type as any }),
          ...(data.currentBalance !== undefined && { currentBalance: data.currentBalance }),
          ...(data.initialBalance !== undefined && { initialBalance: data.initialBalance }),
          ...(data.color && { color: data.color }),
          ...(data.icon && { icon: data.icon }),
          ...(data.accountNumber !== undefined && { accountNumber: data.accountNumber }),
        },
      });
    } catch (err) {
      console.error('Failed to update account in PostgreSQL:', err);
    }
  }

  // Fallback in-memory
  const acc = globalStore.mockAccounts?.find((a) => a.id === id);
  if (acc) {
    if (data.name) acc.name = data.name;
    if (data.type) acc.type = data.type as any;
    if (data.currentBalance !== undefined) acc.currentBalance = data.currentBalance;
    if (data.initialBalance !== undefined) acc.initialBalance = data.initialBalance;
    if (data.color) acc.color = data.color;
    if (data.icon) acc.icon = data.icon;
    if (data.accountNumber !== undefined) acc.accountNumber = data.accountNumber;
  }
  return acc;
}

export async function deleteAccount(id: string) {
  const isDbConnected = await checkPostgresConnection();
  if (isDbConnected) {
    try {
      return await prisma.account.delete({
        where: { id },
      });
    } catch (err) {
      console.error('Failed to delete account in PostgreSQL:', err);
      throw err;
    }
  }

  // Fallback in-memory
  const idx = globalStore.mockAccounts?.findIndex((a) => a.id === id);
  if (idx !== undefined && idx !== -1) {
    globalStore.mockAccounts?.splice(idx, 1);
    if (globalStore.mockTransactions) {
      globalStore.mockTransactions = globalStore.mockTransactions.filter(
        (t) => t.accountId !== id && t.toAccountId !== id
      );
    }
  }
  return true;
}

export async function resetFinancialData() {
  const isDbConnected = await checkPostgresConnection();
  if (isDbConnected) {
    try {
      // 1. Delete all transactions
      await prisma.transaction.deleteMany();
      // 2. Reset all account balances to 0
      await prisma.account.updateMany({
        data: {
          currentBalance: 0,
          initialBalance: 0,
        },
      });
      globalStore.hasSeededPostgres = true;
      return true;
    } catch (err) {
      console.error('Failed to reset financial data in PostgreSQL:', err);
      throw err;
    }
  }

  // Fallback in-memory
  globalStore.mockTransactions = [];
  if (globalStore.mockAccounts) {
    globalStore.mockAccounts.forEach((acc) => {
      acc.currentBalance = 0;
      acc.initialBalance = 0;
    });
  }
  return true;
}

