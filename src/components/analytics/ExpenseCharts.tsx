'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CategoryBreakdown, PeriodFilter, TrendDataPoint } from '@/lib/types';
import { formatCompactRupiah, formatRupiah } from '@/lib/formatters';
import { DynamicIcon } from '../ui/IconHelper';
import { PieChart as PieIcon, BarChart3, Calendar, Sparkles } from 'lucide-react';

interface ExpenseChartsProps {
  trendData: TrendDataPoint[];
  categoryBreakdown: CategoryBreakdown[];
  periodExpense: number;
  filter: PeriodFilter;
  onFilterChange: (filter: PeriodFilter) => void;
  isPrivacyMode?: boolean;
}

export function ExpenseCharts({
  trendData,
  categoryBreakdown,
  periodExpense,
  filter,
  onFilterChange,
  isPrivacyMode = false,
}: ExpenseChartsProps) {
  const filterButtons: { key: PeriodFilter; label: string }[] = [
    { key: 'week', label: '7 Hari' },
    { key: 'month', label: 'Bulan Ini' },
    { key: 'year', label: 'Tahun Ini' },
    { key: 'all', label: 'Semua' },
  ];

  return (
    <div className="space-y-4">
      {/* Header with Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Analisis & Laporan Arus Kas</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Visualisasi pemasukan vs pengeluaran dan kategori belanja terbesar
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 p-1 border border-slate-200/60 dark:border-slate-700/50 backdrop-blur-xs">
          {filterButtons.map((fb) => (
            <button
              key={fb.key}
              onClick={() => onFilterChange(fb.key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                filter === fb.key
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {fb.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ================= BAR CHART: CASHFLOW TREND ================= */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-sm backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Perbandingan Pemasukan & Pengeluaran
                </h3>
                <span className="text-[10px] text-slate-400">
                  Arus uang masuk vs keluar harian / berkala
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300">Masuk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-slate-600 dark:text-slate-300">Keluar</span>
              </div>
            </div>
          </div>

          <div className="mt-4 h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => (isPrivacyMode ? '•••' : formatCompactRupiah(val))}
                />
                <Tooltip
                  formatter={(value: any) => [
                    isPrivacyMode ? 'Rp ••••••••' : formatRupiah(Number(value)),
                    '',
                  ]}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 600,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
                  }}
                />
                <Bar dataKey="income" name="Pemasukan" fill="url(#incomeGrad)" radius={[6, 6, 0, 0]} maxBarSize={24} />
                <Bar dataKey="expense" name="Pengeluaran" fill="url(#expenseGrad)" radius={[6, 6, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= DONUT CHART: CATEGORY BREAKDOWN ================= */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-5 shadow-sm backdrop-blur-md flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <PieIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Kategori Pengeluaran Terbesar
                </h3>
                <span className="text-[10px] text-slate-400">
                  Total: {isPrivacyMode ? 'Rp ••••••••' : formatRupiah(periodExpense)}
                </span>
              </div>
            </div>
          </div>

          {categoryBreakdown.length === 0 ? (
            <div className="my-auto flex flex-col items-center justify-center p-8 text-center min-h-[220px]">
              <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-3.5 text-slate-400">
                <Calendar className="h-6 w-6" />
              </div>
              <p className="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Belum ada pengeluaran pada periode ini
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Pengeluaran yang Anda catat akan otomatis dikelompokkan di sini.
              </p>
            </div>
          ) : (
            <div className="mt-4 flex flex-col justify-between flex-1 space-y-4">
              {/* Mini Donut Chart */}
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={65}
                      paddingAngle={3}
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [
                        isPrivacyMode ? 'Rp ••••••••' : formatRupiah(Number(val)),
                        'Total',
                      ]}
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.92)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '14px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category List Breakdown with Progress Bars */}
              <div className="space-y-2.5 overflow-y-auto max-h-[160px] pr-1 scrollbar-thin">
                {categoryBreakdown.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-lg text-white text-[10px] shadow-2xs"
                          style={{ backgroundColor: item.color }}
                        >
                          <DynamicIcon name={item.icon} className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {isPrivacyMode ? '••••••' : formatRupiah(item.total)}
                        </span>
                        <span className="ml-1.5 text-[10px] font-bold text-slate-400">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
