'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { BalanceOverview } from '@/components/dashboard/BalanceOverview';
import { AccountCardList } from '@/components/accounts/AccountCardList';
import { ExpenseCharts } from '@/components/analytics/ExpenseCharts';
import { TransactionList } from '@/components/transactions/TransactionList';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { FinancialSummary, PeriodFilter } from '@/lib/types';
import { getFinancialSummaryAction } from './actions/finance';
import { formatDateWithDay } from '@/lib/formatters';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PeriodFilter>('month');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);

  const loadData = useCallback(async (currentFilter: PeriodFilter) => {
    try {
      setLoading(true);
      const res = await getFinancialSummaryAction(currentFilter);
      setData(res);
    } catch (err) {
      console.error('Failed to load finance data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(filter);
  }, [filter, loadData]);

  const handleFilterChange = (newFilter: PeriodFilter) => {
    setFilter(newFilter);
  };

  const handleRefresh = () => {
    loadData(filter);
  };

  return (
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenTransactionModal={() => setIsTxModalOpen(true)}
      isDbConnected={data?.isDbConnected ?? false}
    >
      {/* Top Banner Greeting */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {formatDateWithDay(new Date())}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Ringkasan Keuangan Pribadi
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Pantau saldo tersimpan, pemasukan, dan pengeluaran harian Anda
          </p>
        </div>
      </div>

      {loading && !data ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* TAB 1: DASHBOARD / RINGKASAN UTAMA */}
          {activeTab === 'dashboard' && (
            <>
              {/* Balance cards: Net Worth, Income, Expense, Net */}
              <BalanceOverview
                totalNetWorth={data.totalNetWorth}
                periodIncome={data.periodIncome}
                periodExpense={data.periodExpense}
                netCashflow={data.netCashflow}
                filter={filter}
              />

              {/* Accounts: Where is the money stored? */}
              <AccountCardList accounts={data.accounts} onRefresh={handleRefresh} />

              {/* Analytics: Trends and Category Breakdown (Where did money go?) */}
              <ExpenseCharts
                trendData={data.trendData}
                categoryBreakdown={data.categoryBreakdown}
                periodExpense={data.periodExpense}
                filter={filter}
                onFilterChange={handleFilterChange}
              />

              {/* Transaction History */}
              <TransactionList
                transactions={data.recentTransactions}
                onRefresh={handleRefresh}
              />
            </>
          )}

          {/* TAB 2: KANTONG DANA (AKUN) */}
          {activeTab === 'accounts' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-indigo-600 p-6 text-white shadow-lg shadow-indigo-500/20">
                <h2 className="text-xl font-bold">Kelola Kantong Dana</h2>
                <p className="mt-1 text-xs text-indigo-100">
                  Semua rekening bank, dompet tunai, dan e-wallet tempat dana Anda tersimpan.
                </p>
              </div>
              <AccountCardList accounts={data.accounts} onRefresh={handleRefresh} />
            </div>
          )}

          {/* TAB 3: RIWAYAT TRANSAKSI */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <TransactionList
                transactions={data.recentTransactions}
                onRefresh={handleRefresh}
              />
            </div>
          )}

          {/* TAB 4: LAPORAN & ANALITIK */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <ExpenseCharts
                trendData={data.trendData}
                categoryBreakdown={data.categoryBreakdown}
                periodExpense={data.periodExpense}
                filter={filter}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}
        </div>
      ) : null}

      {/* Transaction Modal */}
      {data && (
        <TransactionModal
          isOpen={isTxModalOpen}
          onClose={() => setIsTxModalOpen(false)}
          accounts={data.accounts}
          categories={data.categories}
          onSuccess={handleRefresh}
        />
      )}
    </AppShell>
  );
}
