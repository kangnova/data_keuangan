'use client';

import React, { useState } from 'react';
import { Account, AccountType } from '@/lib/types';
import { formatRupiah } from '@/lib/formatters';
import { DynamicIcon } from '../ui/IconHelper';
import { Plus, CreditCard, Sparkles, X, Layers, Landmark } from 'lucide-react';
import { createAccountAction } from '@/app/actions/finance';

interface AccountCardListProps {
  accounts: Account[];
  onSelectAccount?: (account: Account) => void;
  onRefresh: () => void;
  isPrivacyMode?: boolean;
}

const TYPE_LABELS: Record<AccountType, string> = {
  BANK: 'Bank',
  CASH: 'Tunai',
  EWALLET: 'E-Wallet',
  INVESTMENT: 'Investasi',
  OTHER: 'Lainnya',
};

const PRESET_ACCOUNTS = [
  { name: 'Bank BCA', type: 'BANK' as AccountType, color: '#00529B', icon: 'building-2' },
  { name: 'Bank Mandiri', type: 'BANK' as AccountType, color: '#003d79', icon: 'building-2' },
  { name: 'Bank BRI', type: 'BANK' as AccountType, color: '#00529C', icon: 'building-2' },
  { name: 'GoPay', type: 'EWALLET' as AccountType, color: '#00AED6', icon: 'smartphone' },
  { name: 'OVO', type: 'EWALLET' as AccountType, color: '#4C3494', icon: 'smartphone' },
  { name: 'DANA', type: 'EWALLET' as AccountType, color: '#118EEA', icon: 'smartphone' },
  { name: 'Dompet Tunai', type: 'CASH' as AccountType, color: '#059669', icon: 'wallet' },
  { name: 'Bibit / Reksa Dana', type: 'INVESTMENT' as AccountType, color: '#F59E0B', icon: 'trending-up' },
];

export function AccountCardList({ accounts, onRefresh, isPrivacyMode = false }: AccountCardListProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'BANK' as AccountType,
    initialBalance: '',
    color: '#4f46e5',
    icon: 'building-2',
    accountNumber: '',
  });

  const totalBalance = accounts.reduce((acc, a) => acc + a.currentBalance, 0);

  const handleSelectPreset = (preset: typeof PRESET_ACCOUNTS[0]) => {
    setFormData({
      ...formData,
      name: preset.name,
      type: preset.type,
      color: preset.color,
      icon: preset.icon,
    });
  };

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
        color: '#4f46e5',
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
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Kantong Dana Tersimpan</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sebaran dana di {accounts.length} rekening, dompet fisik, & e-wallet
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 transition-all active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Kantong</span>
        </button>
      </div>

      {/* Cards Grid: Scrollable on mobile, responsive grid on desktop */}
      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:overflow-visible scrollbar-none">
        {accounts.map((acc) => {
          const percentage = totalBalance > 0 ? Math.max(0, Math.min(100, Math.round((acc.currentBalance / totalBalance) * 100))) : 0;
          return (
            <div
              key={acc.id}
              className="group relative flex-shrink-0 w-[260px] sm:w-auto rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 backdrop-blur-md flex flex-col justify-between"
            >
              <div>
                {/* Header card: Icon + Type Badge */}
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-md transition-transform group-hover:scale-105"
                    style={{ backgroundColor: acc.color }}
                  >
                    <DynamicIcon name={acc.icon} className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {TYPE_LABELS[acc.type] || acc.type}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 font-mono">
                      {percentage}% dari total
                    </span>
                  </div>
                </div>

                {/* Account Name & Number */}
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {acc.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {acc.accountNumber ? `•••• ${acc.accountNumber.slice(-4)}` : 'Kantong Standar'}
                  </p>
                </div>
              </div>

              {/* Balance & Distribution Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight font-mono">
                  {isPrivacyMode ? 'Rp ••••••••' : formatRupiah(acc.currentBalance)}
                </div>

                {/* Mini distribution progress bar */}
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: acc.color }}
                  />
                </div>
              </div>

              {/* Bottom Subtle Glowing accent bar */}
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-t-full opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: acc.color }}
              />
            </div>
          );
        })}
      </div>

      {/* Modal Tambah Akun */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Tambah Kantong Dana Baru
                  </h3>
                  <p className="text-[11px] text-slate-400">Rekening bank, tunai, atau dompet digital</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="mt-4">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Pilih Cepat (Preset Bank & Dompet):
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {PRESET_ACCOUNTS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-2 py-1 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateAccount} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nama Akun / Dompet
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Bank BCA, Dompet Tunai..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
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
                    className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="BANK">Rekening Bank</option>
                    <option value="CASH">Dompet Tunai</option>
                    <option value="EWALLET">E-Wallet (GoPay/OVO)</option>
                    <option value="INVESTMENT">Investasi (Reksadana/Saham)</option>
                    <option value="OTHER">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Warna Label
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-8 w-10 cursor-pointer rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent p-0"
                    />
                    <span className="font-mono text-xs text-slate-500">{formData.color}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nomor Rekening / Catatan Nomor (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: 5410xxxx (atau nomor HP e-wallet)"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Saldo Awal (Rp)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.initialBalance}
                  onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mt-5 flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Kantong'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
