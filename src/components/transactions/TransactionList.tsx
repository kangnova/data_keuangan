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
} from 'lucide-react';
import { deleteTransactionAction } from '@/app/actions/finance';

interface TransactionListProps {
  transactions: Transaction[];
  onRefresh: () => void;
}

export function TransactionList({ transactions, onRefresh }: TransactionListProps) {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = transactions.filter((t) => {
    if (filterType !== 'ALL' && t.type !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNote = t.notes?.toLowerCase().includes(q);
      const matchCat = t.category?.name.toLowerCase().includes(q);
      const matchAcc = t.account?.name.toLowerCase().includes(q);
      return matchNote || matchCat || matchAcc;
    }
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini? Saldo akun akan dikembalikan.')) {
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
    <div className="space-y-3">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Riwayat Transaksi Terakhir
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Daftar mutasi pemasukan, pengeluaran harian, dan transfer
          </p>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-1.5 pl-8 pr-3 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="inline-flex rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1">
            {[
              { key: 'ALL', label: 'Semua' },
              { key: 'EXPENSE', label: 'Keluar' },
              { key: 'INCOME', label: 'Masuk' },
              { key: 'TRANSFER', label: 'Transfer' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  filterType === f.key
                    ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
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
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center">
          <Calendar className="mx-auto h-8 w-8 text-zinc-400" />
          <p className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            Tidak ada transaksi ditemukan
          </p>
          <p className="text-xs text-zinc-400">
            Coba ubah kata kunci pencarian atau klik &quot;+ Catat Transaksi&quot;.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800/80 shadow-sm overflow-hidden">
          {filtered.map((t) => {
            const isExpense = t.type === 'EXPENSE';
            const isIncome = t.type === 'INCOME';
            const isTransfer = t.type === 'TRANSFER';

            return (
              <div
                key={t.id}
                className="group flex items-center justify-between p-3.5 sm:p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
              >
                {/* Left: Icon & Description */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Category / Type Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-xs ${
                      isExpense
                        ? 'bg-rose-500'
                        : isIncome
                        ? 'bg-emerald-500'
                        : 'bg-blue-600'
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
                      <span className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-white truncate">
                        {isTransfer
                          ? `Transfer Antar Kantong`
                          : t.category?.name || (isIncome ? 'Pemasukan' : 'Pengeluaran')}
                      </span>
                      {t.notes && (
                        <span className="hidden sm:inline-block text-xs text-zinc-400 truncate max-w-xs">
                          • {t.notes}
                        </span>
                      )}
                    </div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <span>{formatDateIndo(t.date)}</span>
                      <span>•</span>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        {isTransfer
                          ? `${t.account?.name || 'Akun'} → ${t.toAccount?.name || 'Akun'}`
                          : t.account?.name || 'Akun'}
                      </span>
                      {t.notes && (
                        <span className="sm:hidden text-zinc-400 truncate max-w-[150px]">
                          • {t.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Delete button */}
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <div className="text-right">
                    <div
                      className={`text-sm sm:text-base font-bold ${
                        isExpense
                          ? 'text-rose-600 dark:text-rose-400'
                          : isIncome
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      {isExpense ? '-' : isIncome ? '+' : ''}
                      {formatRupiah(t.amount)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                    title="Hapus transaksi"
                    className="opacity-40 group-hover:opacity-100 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg text-zinc-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
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
