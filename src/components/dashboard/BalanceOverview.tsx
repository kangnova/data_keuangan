'use client';

import React from 'react';
import { formatRupiah } from '@/lib/formatters';
import { TrendingDown, TrendingUp, Wallet, ArrowDownRight, ArrowUpRight, Scale } from 'lucide-react';
import { PeriodFilter } from '@/lib/types';

interface BalanceOverviewProps {
  totalNetWorth: number;
  periodIncome: number;
  periodExpense: number;
  netCashflow: number;
  filter: PeriodFilter;
}

export function BalanceOverview({
  totalNetWorth,
  periodIncome,
  periodExpense,
  netCashflow,
  filter,
}: BalanceOverviewProps) {
  const filterLabelMap: Record<PeriodFilter, string> = {
    week: 'Minggu Ini',
    month: 'Bulan Ini',
    year: 'Tahun Ini',
    all: 'Semua Periode',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Sisa Uang / Net Worth */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800 p-5 text-white shadow-lg shadow-indigo-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-indigo-200">
            Sisa Total Uang (Net Worth)
          </span>
          <div className="rounded-xl bg-white/20 p-2 backdrop-blur-md">
            <Wallet className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight">
            {formatRupiah(totalNetWorth)}
          </div>
          <p className="mt-1 text-xs text-indigo-200">
            Saldo akumulasi dari seluruh kantong dana
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
      </div>

      {/* Pemasukan Periode Ini */}
      <div className="rounded-2xl border border-emerald-100 dark:border-emerald-950/40 bg-white dark:bg-zinc-900 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Pemasukan ({filterLabelMap[filter]})
          </span>
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-2 text-emerald-600 dark:text-emerald-400">
            <ArrowDownRight className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            +{formatRupiah(periodIncome)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Dana masuk tercatat</span>
          </div>
        </div>
      </div>

      {/* Pengeluaran Periode Ini */}
      <div className="rounded-2xl border border-rose-100 dark:border-rose-950/40 bg-white dark:bg-zinc-900 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Pengeluaran ({filterLabelMap[filter]})
          </span>
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/50 p-2 text-rose-600 dark:text-rose-400">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            -{formatRupiah(periodExpense)}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Uang yang dibelanjakan</span>
          </div>
        </div>
      </div>

      {/* Sisa Arus Kas Bersih */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Arus Kas Bersih ({filterLabelMap[filter]})
          </span>
          <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800 p-2 text-zinc-700 dark:text-zinc-300">
            <Scale className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div
            className={`text-2xl font-bold ${
              netCashflow >= 0
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {netCashflow >= 0 ? '+' : ''}
            {formatRupiah(netCashflow)}
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {netCashflow >= 0 ? 'Surplus (Pemasukan > Pengeluaran)' : 'Defisit pada periode ini'}
          </p>
        </div>
      </div>
    </div>
  );
}
