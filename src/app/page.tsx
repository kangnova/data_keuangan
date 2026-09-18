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
import { Sparkles, Loader2, Wallet, ArrowRight, ShieldCheck, PieChart, ArrowLeftRight } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PeriodFilter>('month');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Load theme and privacy preferences on client mount
  useEffect(() => {
    try {
      const storedPrivacy = localStorage.getItem('finansialku-privacy');
      if (storedPrivacy === 'true') {
        setIsPrivacyMode(true);
      }

      const storedTheme = localStorage.getItem('finansialku-theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme);
        if (storedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleTogglePrivacyMode = () => {
    setIsPrivacyMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('finansialku-privacy', String(next));
      } catch (e) {}
      return next;
    });
  };

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('finansialku-theme', next);
        if (next === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {}
      return next;
    });
  };

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
      isPrivacyMode={isPrivacyMode}
      onTogglePrivacyMode={handleTogglePrivacyMode}
      theme={theme}
      onToggleTheme={handleToggleTheme}
    >
      {/* Top Banner Greeting */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-3 w-3" />
              <span>{formatDateWithDay(new Date())}</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Ringkasan Keuangan Pribadi
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pantau arus kas masuk, pengeluaran harian, dan saldo tersimpan Anda secara real-time
          </p>
        </div>

        {/* Quick Summary Pill on Header */}
        {data && (
          <div className="hidden sm:flex items-center gap-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-2.5 px-4 shadow-sm backdrop-blur-md">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Total Kantong Aktif
              </span>
              <p className="text-sm font-black text-slate-900 dark:text-white font-mono">
                {data.accounts.length} Akun Terdaftar
              </p>
            </div>
            <div className="h-7 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Total Mutasi
              </span>
              <p className="text-sm font-black text-slate-900 dark:text-white font-mono">
                {data.recentTransactions.length} Transaksi
              </p>
            </div>
          </div>
        )}
      </div>

      {loading && !data ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="text-xs font-medium text-slate-400">Memuat data keuangan...</span>
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
                isPrivacyMode={isPrivacyMode}
                onTogglePrivacyMode={handleTogglePrivacyMode}
              />

              {/* Accounts: Where is the money stored? */}
              <AccountCardList
                accounts={data.accounts}
                onRefresh={handleRefresh}
                isPrivacyMode={isPrivacyMode}
              />

              {/* Analytics: Trends and Category Breakdown (Where did money go?) */}
              <ExpenseCharts
                trendData={data.trendData}
                categoryBreakdown={data.categoryBreakdown}
                periodExpense={data.periodExpense}
                filter={filter}
                onFilterChange={handleFilterChange}
                isPrivacyMode={isPrivacyMode}
              />

              {/* Transaction History */}
              <TransactionList
                transactions={data.recentTransactions}
                onRefresh={handleRefresh}
                isPrivacyMode={isPrivacyMode}
              />
            </>
          )}

          {/* TAB 2: KANTONG DANA (AKUN) */}
          {activeTab === 'accounts' && (
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-800 p-6 text-white shadow-xl shadow-indigo-600/20">
                <div className="relative z-10">
                  <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-100">
                    Manajemen Kantong Dana
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black mt-2">
                    Kelola Rekening Bank, Dompet Fisik, & E-Wallet
                  </h2>
                  <p className="mt-1 text-xs text-indigo-100/80 max-w-xl">
                    Semua saldo tercatat terpisah per pos keuangan untuk memudahkan pengawasan arus kas Anda sehari-hari.
                  </p>
                </div>
                <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              </div>

              <AccountCardList
                accounts={data.accounts}
                onRefresh={handleRefresh}
                isPrivacyMode={isPrivacyMode}
              />
            </div>
          )}

          {/* TAB 3: RIWAYAT TRANSAKSI */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-800 p-6 text-white shadow-xl shadow-emerald-600/20">
                <div className="relative z-10">
                  <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                    Buku Kas Harian
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black mt-2">
                    Riwayat Seluruh Mutasi Dana
                  </h2>
                  <p className="mt-1 text-xs text-emerald-100/80 max-w-xl">
                    Pantau jejak pemasukan, pembelanjaan barang/jasa, serta mutasi transfer antar rekening Anda secara kronologis.
                  </p>
                </div>
                <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              </div>

              <TransactionList
                transactions={data.recentTransactions}
                onRefresh={handleRefresh}
                isPrivacyMode={isPrivacyMode}
              />
            </div>
          )}

          {/* TAB 4: LAPORAN & ANALITIK */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-800 p-6 text-white shadow-xl shadow-purple-600/20">
                <div className="relative z-10">
                  <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-100">
                    Financial Intelligence
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black mt-2">
                    Laporan Grafik & Proporsi Pengeluaran
                  </h2>
                  <p className="mt-1 text-xs text-purple-100/80 max-w-xl">
                    Evaluasi kebiasaan belanja Anda berdasarkan kategori dan tren mingguan/bulanan agar finansial tetap sehat.
                  </p>
                </div>
                <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              </div>

              <ExpenseCharts
                trendData={data.trendData}
                categoryBreakdown={data.categoryBreakdown}
                periodExpense={data.periodExpense}
                filter={filter}
                onFilterChange={handleFilterChange}
                isPrivacyMode={isPrivacyMode}
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
