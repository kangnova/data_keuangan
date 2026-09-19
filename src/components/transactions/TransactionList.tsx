'use client';

import React, { useState } from 'react';
import { Transaction, TransactionType } from '@/lib/types';
import { formatDateIndo, formatRupiah } from '@/lib/formatters';
import { DynamicIcon } from '../ui/IconHelper';
import {
  ArrowDownRight,
  ArrowUpRight,
  ArrowRightLeft,
  Search,
  Trash2,
  Filter,
  Calendar,
  History,
  Tag,
} from 'lucide-react';
import { deleteTransactionAction } from '@/app/actions/finance';
import { Language, translations } from '@/lib/i18n';

interface TransactionListProps {
  transactions: Transaction[];
  onRefresh: () => void;
  isPrivacyMode?: boolean;
  language?: Language;
}

export function TransactionList({
  transactions,
  onRefresh,
  isPrivacyMode = false,
  language = 'id',
}: TransactionListProps) {
  const t = translations[language];
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = transactions.filter((item) => {
    if (filterType !== 'ALL' && item.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNote = item.notes?.toLowerCase().includes(q);
      const matchCat = item.category?.name.toLowerCase().includes(q);
      const matchAcc = item.account?.name.toLowerCase().includes(q);
      return matchNote || matchCat || matchAcc;
    }
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!confirm(t.deleteTxConfirm)) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteTransactionAction(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>{t.txHistoryTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.txHistorySubtitle}
          </p>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-52">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs backdrop-blur-xs"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="inline-flex rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 p-1 border border-slate-200/60 dark:border-slate-700/50">
            {[
              { key: 'ALL', label: t.filterAllTypes },
              { key: 'EXPENSE', label: t.filterExpense },
              { key: 'INCOME', label: t.filterIncome },
              { key: 'TRANSFER', label: t.filterTransfer },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                  filterType === f.key
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Items */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-10 text-center backdrop-blur-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
            <Calendar className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-300">
            Tidak ada transaksi ditemukan
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Belum ada catatan mutasi yang cocok dengan filter atau kata kunci pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 divide-y divide-slate-100 dark:divide-slate-800/80 shadow-sm overflow-hidden backdrop-blur-md">
          {filtered.map((t) => {
            const isExpense = t.type === 'EXPENSE';
            const isIncome = t.type === 'INCOME';
            const isTransfer = t.type === 'TRANSFER';

            return (
              <div
                key={t.id}
                className="group flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Left: Icon & Description */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Category / Type Icon */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-xs transition-transform group-hover:scale-105 ${
                      isExpense
                        ? 'bg-gradient-to-tr from-rose-500 to-rose-600'
                        : isIncome
                        ? 'bg-gradient-to-tr from-emerald-500 to-emerald-600'
                        : 'bg-gradient-to-tr from-blue-500 to-indigo-600'
                    }`}
                  >
                    {isExpense && (
                      t.category ? (
                        <DynamicIcon name={t.category.icon} className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )
                    )}
                    {isIncome && (
                      t.category ? (
                        <DynamicIcon name={t.category.icon} className="h-5 w-5" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5" />
                      )
                    )}
                    {isTransfer && <ArrowRightLeft className="h-5 w-5" />}
                  </div>

                  {/* Title and details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {isTransfer
                          ? `Transfer Antar Kantong`
                          : t.category?.name || (isIncome ? 'Pemasukan' : 'Pengeluaran')}
                      </span>
                      {t.notes && (
                        <span className="hidden sm:inline-block text-xs text-slate-400 truncate max-w-xs">
                          • {t.notes}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-medium">{formatDateIndo(t.date)}</span>
                      <span>•</span>
                      <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-semibold text-slate-700 dark:text-slate-300">
                        {isTransfer
                          ? `${t.account?.name || 'Akun'} → ${t.toAccount?.name || 'Akun'}`
                          : t.account?.name || 'Akun'}
                      </span>
                      {t.notes && (
                        <span className="sm:hidden text-slate-400 truncate max-w-[140px]">
                          • {t.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Delete button */}
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <div className="text-right font-mono">
                    <div
                      className={`text-sm sm:text-base font-black ${
                        isExpense
                          ? 'text-rose-600 dark:text-rose-400'
                          : isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {isPrivacyMode
                        ? 'Rp ••••••••'
                        : `${isExpense ? '-' : isIncome ? '+' : ''}${formatRupiah(t.amount)}`}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                    title="Hapus transaksi"
                    className="opacity-20 group-hover:opacity-100 hover:text-rose-600 dark:hover:text-rose-400 p-2 rounded-xl text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
