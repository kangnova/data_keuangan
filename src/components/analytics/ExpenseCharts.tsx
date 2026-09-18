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
  Legend,
} from 'recharts';
import { CategoryBreakdown, PeriodFilter, TrendDataPoint } from '@/lib/types';
import { formatCompactRupiah, formatRupiah } from '@/lib/formatters';
import { DynamicIcon } from '../ui/IconHelper';
import { PieChart as PieIcon, BarChart3, Calendar } from 'lucide-react';

interface ExpenseChartsProps {
  trendData: TrendDataPoint[];
  categoryBreakdown: CategoryBreakdown[];
  periodExpense: number;
  filter: PeriodFilter;
  onFilterChange: (filter: PeriodFilter) => void;
}

export function ExpenseCharts({
  trendData,
  categoryBreakdown,
  periodExpense,
  filter,
  onFilterChange,
}: ExpenseChartsProps) {
  const filterButtons: { key: PeriodFilter; label: string }[] = [
    { key: 'week', label: 'Mingguan (7 Hari)' },
    { key: 'month', label: 'Bulanan' },
    { key: 'year', label: 'Tahunan' },
    { key: 'all', label: 'Semua' },
  ];

  return (
    <div className="space-y-4">
      {/* Header with Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Analisis & Laporan Keuangan
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Pantau arus kas dan untuk apa saja uang Anda dibelanjakan
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex rounded-xl bg-zinc-100 dark:bg-zinc-800/80 p-1 border border-zinc-200 dark:border-zinc-700/50">
          {filterButtons.map((fb) => (
            <button
              key={fb.key}
              onClick={() => onFilterChange(fb.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                filter === fb.key
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {fb.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Cashflow Trend Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/50 p-2 text-indigo-600 dark:text-indigo-400">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Tren Pemasukan vs Pengeluaran
                </h3>
                <span className="text-[11px] text-zinc-400">
                  Perbandingan pemasukan & pengeluaran berkala
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-zinc-500 dark:text-zinc-400">Masuk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="text-zinc-500 dark:text-zinc-400">Keluar</span>
              </div>
            </div>
          </div>

          <div className="mt-4 h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="label"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => formatCompactRupiah(val)}
                />
                <Tooltip
                  formatter={(value: any) => [formatRupiah(Number(value)), '']}
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                  }}
                />
                <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Where Did the Money Go? (Category Breakdown) */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-rose-50 dark:bg-rose-950/50 p-2 text-rose-600 dark:text-rose-400">
                <PieIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Uang Digunakan Untuk Apa Saja?
                </h3>
                <span className="text-[11px] text-zinc-400">
                  Total: {formatRupiah(periodExpense)}
                </span>
              </div>
            </div>
          </div>

          {categoryBreakdown.length === 0 ? (
            <div className="my-auto flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-3 text-zinc-400">
                <Calendar className="h-6 w-6" />
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Belum ada pengeluaran pada periode ini.
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
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={3}
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [formatRupiah(Number(val)), 'Total']}
                      contentStyle={{
                        backgroundColor: '#18181b',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px',
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
                          className="flex h-6 w-6 items-center justify-center rounded-lg text-white text-[10px]"
                          style={{ backgroundColor: item.color }}
                        >
                          <DynamicIcon name={item.icon} className="h-3 w-3" />
                        </div>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">
                          {item.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-zinc-900 dark:text-white">
                          {formatRupiah(item.total)}
                        </span>
                        <span className="ml-1.5 text-[11px] text-zinc-400">
                          ({item.percentage}%)
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
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
