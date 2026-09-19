'use client';

import React from 'react';
import { formatRupiah } from '@/lib/formatters';
import {
  TrendingDown,
  TrendingUp,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Scale,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { PeriodFilter } from '@/lib/types';
import { Language, translations } from '@/lib/i18n';

interface BalanceOverviewProps {
  totalNetWorth: number;
  periodIncome: number;
  periodExpense: number;
  netCashflow: number;
  filter: PeriodFilter;
  isPrivacyMode?: boolean;
  onTogglePrivacyMode?: () => void;
  language?: Language;
  ownerName?: string;
}

export function BalanceOverview({
  totalNetWorth,
  periodIncome,
  periodExpense,
  netCashflow,
  filter,
  isPrivacyMode = false,
  onTogglePrivacyMode,
  language = 'id',
  ownerName = 'Nova Suharyanto',
}: BalanceOverviewProps) {
  const t = translations[language];

  const filterLabelMap: Record<PeriodFilter, string> = {
    week: t.filter7Days,
    month: t.filterMonth,
    year: t.filterYear,
    all: t.filterAll,
  };

  const renderValue = (val: number, prefix: string = '') => {
    if (isPrivacyMode) {
      return 'Rp ••••••••';
    }
    return `${prefix}${formatRupiah(val)}`;
  };

  const savingsRate = periodIncome > 0 ? Math.round(((periodIncome - periodExpense) / periodIncome) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* ================= KARTU 1: ELITE DIGITAL CARD (NET WORTH) ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#0f172a] p-6 text-white shadow-xl shadow-indigo-950/20 border border-indigo-500/20 flex flex-col justify-between min-h-[190px] group transition-all duration-300 hover:shadow-indigo-500/20 hover:-translate-y-0.5">
        {/* Background Holographic Glow Circles */}
        <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-500/15 blur-2xl pointer-events-none" />
        
        {/* Top Header Card */}
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                {t.netWorth}
              </span>
              <span className="rounded bg-indigo-400/20 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-200">
                PLATINUM
              </span>
            </div>
            <p className="text-[11px] text-indigo-200/70 mt-0.5">{t.totalAssets}</p>
          </div>

          {/* Eye privacy toggle on card */}
          {onTogglePrivacyMode && (
            <button
              onClick={onTogglePrivacyMode}
              className="rounded-xl bg-white/10 p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
              title={isPrivacyMode ? t.privacyActive : t.privacySensor}
            >
              {isPrivacyMode ? <EyeOff className="h-4 w-4 text-amber-400" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Center: Saldo Net Worth */}
        <div className="relative z-10 my-3">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-sm font-mono">
            {renderValue(totalNetWorth)}
          </div>
        </div>

        {/* Bottom Card: Realistic Chip & Cardholder */}
        <div className="relative z-10 flex items-end justify-between pt-2 border-t border-white/10 text-xs text-indigo-200/90">
          <div className="flex items-center gap-2">
            {/* Realistic Golden Microchip */}
            <div className="w-7 h-5 rounded bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border border-amber-300/60 flex items-center justify-center shadow-xs">
              <div className="w-5 h-3 border border-amber-700/30 rounded-xs" />
            </div>
            <span className="font-mono text-[11px] tracking-widest text-slate-300">
              •••• 8821
            </span>
          </div>
          <span className="font-bold tracking-wider text-[10px] uppercase text-white/90 truncate max-w-[150px]">
            {ownerName.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ================= KARTU 2: PEMASUKAN ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-sm backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.periodIncome}
            </span>
            <span className="ml-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full">
              {filterLabelMap[filter]}
            </span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
            <ArrowDownRight className="h-4 w-4" />
          </div>
        </div>

        <div className="my-3">
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
            {renderValue(periodIncome, '+')}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <TrendingUp className="h-3.5 w-3.5 shrink-0" />
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {language === 'id' ? 'Total dana masuk periode ini' : 'Total incoming funds in this period'}
          </span>
        </div>
      </div>

      {/* ================= KARTU 3: PENGELUARAN ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-sm backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-rose-200 dark:hover:border-rose-900">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.periodExpense}
            </span>
            <span className="ml-1 text-[10px] font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded-full">
              {filterLabelMap[filter]}
            </span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <div className="my-3">
          <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight font-mono">
            {renderValue(periodExpense, '-')}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <TrendingDown className="h-3.5 w-3.5 shrink-0" />
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {language === 'id' ? 'Total dana dibelanjakan' : 'Total funds spent in this period'}
          </span>
        </div>
      </div>

      {/* ================= KARTU 4: ARUS KAS BERSIH ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-sm backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.netCashflow}
            </span>
            <span className="ml-1 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded-full">
              {filterLabelMap[filter]}
            </span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Scale className="h-4 w-4" />
          </div>
        </div>

        <div className="my-3">
          <div
            className={`text-xl sm:text-2xl font-black tracking-tight font-mono ${
              netCashflow >= 0
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {renderValue(netCashflow, netCashflow > 0 ? '+' : '')}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              netCashflow >= 0
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
            }`}
          >
            {netCashflow >= 0 ? `${t.surplus} (${language === 'id' ? 'Hemat' : 'Saved'})` : `${t.deficit} (${language === 'id' ? 'Boros' : 'Overspent'})`}
          </span>
          {periodIncome > 0 && (
            <span className="text-[10px] text-slate-400 font-medium">
              {language === 'id' ? 'Simpan' : 'Saved'}: {savingsRate}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
