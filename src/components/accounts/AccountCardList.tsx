'use client';

import React, { useState } from 'react';
import { Account, AccountType } from '@/lib/types';
import { formatRupiah } from '@/lib/formatters';
import { DynamicIcon } from '../ui/IconHelper';
import { Plus, CreditCard, Sparkles, X } from 'lucide-react';
import { createAccountAction } from '@/app/actions/finance';

interface AccountCardListProps {
  accounts: Account[];
  onSelectAccount?: (account: Account) => void;
  onRefresh: () => void;
}

const TYPE_LABELS: Record<AccountType, string> = {
  BANK: 'Rekening Bank',
  CASH: 'Dompet Tunai',
  EWALLET: 'E-Wallet',
  INVESTMENT: 'Investasi',
  OTHER: 'Lainnya',
};

export function AccountCardList({ accounts, onRefresh }: AccountCardListProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'BANK' as AccountType,
    initialBalance: '',
    color: '#0284c7',
    icon: 'building-2',
    accountNumber: '',
  });

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setIsSubmitting(true);
    try {
      await createAccountAction({
        name: formData.name,
        type: formData.type,
        initialBalance: parseFloat(formData.initialBalance) || 0,
        color: formData.color,
        icon: formData.icon,
        accountNumber: formData.accountNumber,
      });
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        type: 'BANK',
        initialBalance: '',
        color: '#0284c7',
        icon: 'building-2',
        accountNumber: '',
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Kantong Dana Tersimpan
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Lokasi dan saldo uang Anda saat ini ({accounts.length} Akun)
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Akun</span>
        </button>
      </div>

      {/* Cards List: Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:overflow-visible scrollbar-none">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="group relative flex-shrink-0 w-[240px] sm:w-auto rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                style={{ backgroundColor: acc.color }}
              >
                <DynamicIcon name={acc.icon} className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                {TYPE_LABELS[acc.type] || acc.type}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                {acc.name}
              </h3>
              {acc.accountNumber && (
                <p className="text-[11px] text-zinc-400 font-mono">
                  {acc.accountNumber}
                </p>
              )}
              <div className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {formatRupiah(acc.currentBalance)}
              </div>
            </div>

            {/* Color accent bar at bottom */}
            <div
              className="absolute bottom-0 left-4 right-4 h-1 rounded-t-full opacity-60 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: acc.color }}
            />
          </div>
        ))}
      </div>

      {/* Modal Tambah Akun */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-zinc-900 dark:text-white">
                  Tambah Kantong Dana Baru
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Nama Akun / Dompet
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Bank Mandiri, Dompet Tunai, GoPay..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Tipe Kantong
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const t = e.target.value as AccountType;
                      let icon = 'wallet';
                      if (t === 'BANK') icon = 'building-2';
                      if (t === 'EWALLET') icon = 'smartphone';
                      if (t === 'INVESTMENT') icon = 'trending-up';
                      setFormData({ ...formData, type: t, icon });
                    }}
                    className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="BANK">Rekening Bank</option>
                    <option value="CASH">Dompet Tunai</option>
                    <option value="EWALLET">E-Wallet</option>
                    <option value="INVESTMENT">Investasi</option>
                    <option value="OTHER">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Saldo Awal (Rp)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.initialBalance}
                    onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Nomor Rekening / Catatan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: 123-456-789"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Warna Aksen
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-9 w-12 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    />
                    <span className="text-xs font-mono text-zinc-500">{formData.color}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Ikon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="building-2">Bank Gedung</option>
                    <option value="landmark">Landmark / Bank</option>
                    <option value="wallet">Dompet</option>
                    <option value="smartphone">HP / E-Wallet</option>
                    <option value="trending-up">Investasi</option>
                    <option value="credit-card">Kartu Kredit</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 rounded-xl border border-zinc-200 dark:border-zinc-700 py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 text-xs font-semibold text-white shadow-md transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
