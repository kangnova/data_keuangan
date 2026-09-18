'use server';

import {
  getFinancialSummaryData,
  addTransaction,
  addAccount,
  deleteTransaction,
} from '@/lib/storage';
import { PeriodFilter } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getFinancialSummaryAction(filter: PeriodFilter = 'month') {
  return await getFinancialSummaryData(filter);
}

export async function createTransactionAction(formData: {
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  amount: number;
  date: string;
  notes?: string;
  accountId: string;
  toAccountId?: string;
  categoryId?: string;
}) {
  const result = await addTransaction(formData);
  revalidatePath('/');
  return { success: true, data: result };
}

export async function createAccountAction(formData: {
  name: string;
  type: string;
  initialBalance: number;
  color: string;
  icon: string;
  accountNumber?: string;
}) {
  const result = await addAccount(formData);
  revalidatePath('/');
  return { success: true, data: result };
}

export async function deleteTransactionAction(id: string) {
  const result = await deleteTransaction(id);
  revalidatePath('/');
  return { success: true, data: result };
}
