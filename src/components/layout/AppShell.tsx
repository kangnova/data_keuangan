'use client';

import React, { ReactNode } from 'react';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PieChart,
  Plus,
  Database,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTransactionModal: () => void;
  isDbConnected: boolean;
}

export function AppShell({
  children,
  activeTab,
  setActiveTab,
  onOpenTransactionModal,
  isDbConnected,
}: AppShellProps) {
  const navItems = [
    { id: 'dashboard', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'accounts', label: 'Kantong Dana', icon: Wallet },
    { id: 'transactions', label: 'Transaksi', icon: ArrowLeftRight },
    { id: 'analytics', label: 'Laporan & Grafik', icon: PieChart },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col md:flex-row antialiased">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 backdrop-blur-md z-30">
        <div className="flex flex-col flex-1 p-5">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-2 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/25">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-black tracking-tight text-base text-zinc-900 dark:text-white">
                FinansialKu
              </h1>
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Personal Finance
              </span>
            </div>
          </div>

          {/* Quick Add Button */}
          <div className="mt-5">
            <button
              onClick={onOpenTransactionModal}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 py-3 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              <span>Catat Transaksi</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex-1 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Database Connection Status Pill */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-3">
              <Database
                className={`h-4 w-4 shrink-0 ${
                  isDbConnected ? 'text-emerald-500' : 'text-amber-500'
                }`}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 truncate">
                    {isDbConnected ? 'PostgreSQL Aktif' : 'Mode Offline / Mock'}
                  </p>
                </div>
                <p className="text-[10px] text-zinc-400 truncate">
                  {isDbConnected ? 'Tersambung ke database' : 'Data di memori lokal'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE TOP BAR ================= */}
      <header className="sticky top-0 z-30 flex md:hidden items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-xs">
            <Wallet className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-sm text-zinc-900 dark:text-white">FinansialKu</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              isDbConnected
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isDbConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{isDbConnected ? 'Postgres' : 'Demo'}</span>
          </div>

          <button
            onClick={onOpenTransactionModal}
            className="flex items-center gap-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 text-xs font-bold text-white shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Catat</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 md:pl-64 pb-20 md:pb-8">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* ================= MOBILE BOTTOM NAVIGATION BAR ================= */}
      <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
