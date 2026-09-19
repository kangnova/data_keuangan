'use server';

import {
  getFinancialSummaryData,
  addTransaction,
  addAccount,
  deleteTransaction,
  updateAccount,
  deleteAccount,
  resetFinancialData,
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

export async function updateAccountAction(
  id: string,
  formData: {
    name?: string;
    type?: string;
    currentBalance?: number;
    initialBalance?: number;
    color?: string;
    icon?: string;
    accountNumber?: string;
  }
) {
  const result = await updateAccount(id, formData);
  revalidatePath('/');
  return { success: true, data: result };
}

export async function deleteAccountAction(id: string) {
  const result = await deleteAccount(id);
  revalidatePath('/');
  return { success: true, data: result };
}

export async function deleteTransactionAction(id: string) {
  const result = await deleteTransaction(id);
  revalidatePath('/');
  return { success: true, data: result };
}

export async function resetFinancialDataAction() {
  const result = await resetFinancialData();
  revalidatePath('/');
  return { success: true, data: result };
}

