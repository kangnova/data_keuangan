'use client';

import React, { ReactNode, useState } from 'react';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PieChart,
  Plus,
  Database,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  User,
  Settings,
  Globe,
} from 'lucide-react';
import { Language, translations } from '@/lib/i18n';
import { SettingsModal } from './SettingsModal';

interface AppShellProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTransactionModal: () => void;
  isDbConnected: boolean;
  isPrivacyMode: boolean;
  onTogglePrivacyMode: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  onToggleLanguage: () => void;
  ownerName: string;
  ownerUsername: string;
  onSaveOwnerName: (name: string, username: string) => void;
}

export function AppShell({
  children,
  activeTab,
  setActiveTab,
  onOpenTransactionModal,
  isDbConnected,
  isPrivacyMode,
  onTogglePrivacyMode,
  theme,
  onToggleTheme,
  language,
  onSelectLanguage,
  onToggleLanguage,
  ownerName,
  ownerUsername,
  onSaveOwnerName,
}: AppShellProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const t = translations[language];

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'accounts', label: t.accounts, icon: Wallet },
    { id: 'transactions', label: t.transactions, icon: ArrowLeftRight },
    { id: 'analytics', label: t.analytics, icon: PieChart },
  ];

  const initials = ownerName
    ? ownerName
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'NS';

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#080d1a] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row antialiased transition-colors duration-300">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-30 shadow-sm">
        <div className="flex flex-col flex-1 p-5">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-2 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-500 text-white shadow-md shadow-indigo-500/25">
              <Wallet className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold tracking-tight text-base text-slate-900 dark:text-white">
                  {t.appName}
                </h1>
                <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                  PRO
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-400 tracking-wider">
                {t.appSubtitle}
              </span>
            </div>
          </div>

          {/* Quick Add Button */}
          <div className="mt-5">
            <button
              onClick={onOpenTransactionModal}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-600 py-3 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/20">
                <Plus className="h-3.5 w-3.5 text-white" />
              </div>
              <span>{t.newTransaction}</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex-1 space-y-1">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              {t.menuTitle}
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-50 to-blue-50/50 dark:from-indigo-950/60 dark:to-blue-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs border border-indigo-100/50 dark:border-indigo-800/40'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600 dark:text-indigo-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile & Database Status Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {/* Database Connection Pill */}
            <div className="flex items-center gap-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 p-2.5 border border-slate-200/50 dark:border-slate-700/40">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                  isDbConnected
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400'
                }`}
              >
                <Database className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                    {isDbConnected ? t.databaseActive : t.databaseOffline}
                  </p>
                </div>
                <p className="text-[9px] text-slate-400 truncate">
                  {isDbConnected ? 'Supabase PostgreSQL' : 'Fallback in-memory'}
                </p>
              </div>
            </div>

            {/* Profile badge (Clickable to open Settings Modal) */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition-all text-left group cursor-pointer border border-transparent hover:border-slate-200/70 dark:hover:border-slate-700/50"
              title={t.profileSettings}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-slate-700 to-indigo-600 text-white text-xs font-bold shadow-xs group-hover:scale-105 transition-transform">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {ownerName}
                </p>
                <p className="text-[10px] text-slate-400 truncate font-mono">@{ownerUsername}</p>
              </div>
              <Settings className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE TOP BAR ================= */}
      <header className="sticky top-0 z-30 flex md:hidden items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-xs">
            <Wallet className="h-4 w-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">FinansialKu</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
            className="flex items-center gap-1 px-2 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
          >
            <span>{language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
          </button>

          {/* Privacy Toggle */}
          <button
            onClick={onTogglePrivacyMode}
            title={isPrivacyMode ? 'Tampilkan Saldo' : 'Sembunyikan Saldo'}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            {isPrivacyMode ? <EyeOff className="h-4 w-4 text-amber-500" /> : <Eye className="h-4 w-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title="Ganti Tema"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          {/* Settings / Profile button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white text-[10px] font-bold shadow-xs"
          >
            {initials}
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 md:pl-64 pb-24 md:pb-12 min-h-screen">
        {/* Desktop Top Header Bar */}
        <div className="hidden md:flex items-center justify-between px-6 lg:px-8 py-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Personal Financial Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language Switcher Button */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all shadow-2xs cursor-pointer"
              title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
            >
              <Globe className="h-3.5 w-3.5 text-indigo-500" />
              <span>{language === 'id' ? '🇮🇩 Bahasa' : '🇬🇧 English'}</span>
            </button>

            {/* Privacy Mode Button */}
            <button
              onClick={onTogglePrivacyMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isPrivacyMode
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              {isPrivacyMode ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-amber-500" />
                  <span>{t.privacyActive}</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5" />
                  <span>{t.privacySensor}</span>
                </>
              )}
            </button>

            {/* Dark/Light Switcher Button */}
            <button
              onClick={onToggleTheme}
              className="flex items-center justify-center h-8 w-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs cursor-pointer"
              title={theme === 'dark' ? t.toggleThemeLight : t.toggleThemeDark}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400 animate-in fade-in" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600 animate-in fade-in" />
              )}
            </button>

            {/* Quick Profile / Settings Button */}
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 cursor-pointer group"
              title={t.profileSettings}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white text-xs font-bold shadow-xs group-hover:ring-2 group-hover:ring-indigo-500/50 transition-all">
                {initials}
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">
                {ownerName}
              </span>
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* ================= MOBILE FLOATING BOTTOM DOCK ================= */}
      <div className="fixed bottom-3 inset-x-3 z-40 md:hidden flex items-center justify-center pointer-events-none">
        <nav className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl px-3 py-2 shadow-2xl shadow-slate-900/10 dark:shadow-black/50">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[9px] mt-0.5">{item.label}</span>
              </button>
            );
          })}

          {/* Center Floating Action Button (FAB) */}
          <button
            onClick={onOpenTransactionModal}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30 mx-1.5 transition-transform active:scale-95"
            title={t.newTransaction}
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </button>

          {navItems.slice(2, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[9px] mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        ownerName={ownerName}
        ownerUsername={ownerUsername}
        onSaveOwnerName={onSaveOwnerName}
        language={language}
        onSelectLanguage={onSelectLanguage}
      />
    </div>
  );
}
