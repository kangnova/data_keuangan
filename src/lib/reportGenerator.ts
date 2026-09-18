import { Account, FinancialSummary, PeriodFilter, Transaction } from './types';
import { formatDateIndo, formatRupiah } from './formatters';

const FILTER_LABELS: Record<PeriodFilter, string> = {
  week: 'Minggu Ini (7 Hari Terakhir)',
  month: 'Bulan Ini',
  year: 'Tahun Ini',
  all: 'Seluruh Periode (Semua Waktu)',
};

export function generateFinancialReportHtml(params: {
  summary: FinancialSummary;
  filter: PeriodFilter;
  userName?: string;
}): string {
  const { summary, filter, userName = 'Nova Suharyanto' } = params;
  const printDate = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeStyle: 'medium',
  }).format(new Date());

  const periodTitle = FILTER_LABELS[filter] || filter;

  const incomeTransactions = summary.recentTransactions.filter((t) => t.type === 'INCOME');
  const expenseTransactions = summary.recentTransactions.filter((t) => t.type === 'EXPENSE');

  const totalIncomeCalculated = summary.periodIncome;
  const totalExpenseCalculated = summary.periodExpense;
  const netCashflowCalculated = summary.netCashflow;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laporan Keuangan - ${periodTitle} - FinansialKu</title>
  <style>
    /* Reset & Dasar */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      background-color: #f8fafc;
      padding: 24px;
      line-height: 1.5;
    }

    .report-container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      padding: 36px 40px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }

    /* Action Toolbar (Tidak dicetak) */
    .toolbar {
      position: sticky;
      top: 16px;
      max-width: 900px;
      margin: 0 auto 20px auto;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      z-index: 999;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .btn-primary {
      background-color: #4f46e5;
      color: #ffffff;
    }
    .btn-primary:hover {
      background-color: #4338ca;
    }
    .btn-secondary {
      background-color: #0f172a;
      color: #ffffff;
    }
    .btn-secondary:hover {
      background-color: #1e293b;
    }

    /* Header Laporan */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 20px;
      border-bottom: 2px solid #4f46e5;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    .brand-subtitle {
      font-size: 12px;
      font-weight: 600;
      color: #4f46e5;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .report-meta {
      text-align: right;
      font-size: 12px;
      color: #64748b;
    }
    .report-meta strong {
      color: #0f172a;
    }

    .report-title-box {
      margin-bottom: 24px;
      text-align: center;
      background: #f1f5f9;
      padding: 16px;
      border-radius: 12px;
    }
    .report-title-box h1 {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .report-title-box p {
      font-size: 13px;
      color: #475569;
      margin-top: 4px;
    }

    /* Ringkasan Finansial Card */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 30px;
    }
    .summary-card {
      padding: 14px 16px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
    }
    .summary-card.income {
      border-color: #a7f3d0;
      background: #f0fdf4;
    }
    .summary-card.expense {
      border-color: #fecdd3;
      background: #fff1f2;
    }
    .summary-card.net {
      border-color: #bfdbfe;
      background: #eff6ff;
    }
    .summary-card.wealth {
      border-color: #ddd6fe;
      background: #f5f3ff;
    }
    .summary-card span {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
      color: #64748b;
    }
    .summary-card .value {
      font-size: 16px;
      font-weight: 800;
      margin-top: 6px;
      font-family: 'Courier New', Courier, monospace;
    }
    .summary-card.income .value { color: #059669; }
    .summary-card.expense .value { color: #e11d48; }
    .summary-card.net .value { color: #2563eb; }
    .summary-card.wealth .value { color: #6d28d9; }

    /* Section & Tabel */
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
    }
    .section-title span.badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 6px;
      text-transform: uppercase;
    }
    .badge-income { background: #dcfce7; color: #15803d; }
    .badge-expense { background: #ffe4e6; color: #be123c; }
    .badge-account { background: #f1f5f9; color: #334155; }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 12px;
    }
    th {
      background-color: #f8fafc;
      color: #475569;
      font-weight: 700;
      text-align: left;
      padding: 10px 12px;
      border-bottom: 2px solid #cbd5e1;
      border-top: 1px solid #e2e8f0;
    }
    td {
      padding: 9px 12px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }
    tr:nth-child(even) td {
      background-color: #fafbfc;
    }
    td.amount {
      text-align: right;
      font-family: 'Courier New', Courier, monospace;
      font-weight: 700;
    }
    td.amount.income { color: #059669; }
    td.amount.expense { color: #e11d48; }

    tfoot tr td {
      background: #f1f5f9;
      font-weight: 800;
      border-top: 2px solid #cbd5e1;
      color: #0f172a;
      padding: 10px 12px;
    }

    .empty-state {
      text-align: center;
      padding: 20px;
      color: #94a3b8;
      font-style: italic;
      font-size: 12px;
    }

    /* Footer Tanda Tangan */
    .footer-sign {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px dashed #cbd5e1;
      font-size: 12px;
      color: #475569;
    }
    .sign-box {
      text-align: center;
      min-width: 180px;
    }
    .sign-space {
      height: 60px;
    }
    .sign-name {
      font-weight: 700;
      color: #0f172a;
      text-decoration: underline;
    }

    /* Print CSS */
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .report-container {
        box-shadow: none;
        border: none;
        padding: 0;
        max-width: 100%;
      }
      .toolbar {
        display: none !important;
      }
      @page {
        margin: 1.5cm;
        size: A4 portrait;
      }
    }
  </style>
</head>
<body>

  <!-- Floating Toolbar Action -->
  <div class="toolbar">
    <button class="btn btn-primary" onclick="window.print()">
      🖨️ Cetak Dokumen / Simpan PDF
    </button>
    <button class="btn btn-secondary" onclick="downloadThisHtml()">
      ⬇️ Unduh Berkas .html
    </button>
  </div>

  <div class="report-container">
    <!-- Header -->
    <div class="header">
      <div>
        <div class="brand-title">FinansialKu</div>
        <div class="brand-subtitle">Personal Finance & Wealth Hub</div>
      </div>
      <div class="report-meta">
        <div>Pemilik: <strong>${userName}</strong></div>
        <div>Periode: <strong>${periodTitle}</strong></div>
        <div>Waktu Cetak: ${printDate}</div>
      </div>
    </div>

    <!-- Title Box -->
    <div class="report-title-box">
      <h1>Laporan Pemasukan & Pengeluaran Keuangan</h1>
      <p>Catatan rekapitulasi arus kas masuk dan belanja per pos periode ${periodTitle}</p>
    </div>

    <!-- Financial Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card income">
        <span>Total Pemasukan</span>
        <div class="value">+${formatRupiah(totalIncomeCalculated)}</div>
      </div>
      <div class="summary-card expense">
        <span>Total Pengeluaran</span>
        <div class="value">-${formatRupiah(totalExpenseCalculated)}</div>
      </div>
      <div class="summary-card net">
        <span>Arus Kas Bersih</span>
        <div class="value">${netCashflowCalculated >= 0 ? '+' : ''}${formatRupiah(netCashflowCalculated)}</div>
      </div>
      <div class="summary-card wealth">
        <span>Sisa Total Dana</span>
        <div class="value">${formatRupiah(summary.totalNetWorth)}</div>
      </div>
    </div>

    <!-- SECTION 1: PEMASUKAN -->
    <div class="section-title">
      <span>1. Rincian Pemasukan Dana</span>
      <span class="badge badge-income">${incomeTransactions.length} Transaksi</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 15%">Tanggal</th>
          <th style="width: 25%">Kategori / Sumber</th>
          <th style="width: 20%">Masuk ke Kantong</th>
          <th style="width: 22%">Catatan</th>
          <th style="width: 18%; text-align: right">Nominal</th>
        </tr>
      </thead>
      <tbody>
        ${
          incomeTransactions.length === 0
            ? '<tr><td colspan="5" class="empty-state">Tidak ada catatan pemasukan pada periode ini.</td></tr>'
            : incomeTransactions
                .map(
                  (t) => `
          <tr>
            <td>${formatDateIndo(t.date)}</td>
            <td><strong>${t.category?.name || 'Pemasukan Lainnya'}</strong></td>
            <td>${t.account?.name || '-'}</td>
            <td>${t.notes || '-'}</td>
            <td class="amount income">+${formatRupiah(t.amount)}</td>
          </tr>`
                )
                .join('')
        }
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4">TOTAL PEMASUKAN PERIODE INI</td>
          <td class="amount income">+${formatRupiah(totalIncomeCalculated)}</td>
        </tr>
      </tfoot>
    </table>

    <!-- SECTION 2: PENGELUARAN -->
    <div class="section-title">
      <span>2. Rincian Pengeluaran Belanja</span>
      <span class="badge badge-expense">${expenseTransactions.length} Transaksi</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 15%">Tanggal</th>
          <th style="width: 25%">Kategori Belanja</th>
          <th style="width: 20%">Sumber Kantong</th>
          <th style="width: 22%">Catatan</th>
          <th style="width: 18%; text-align: right">Nominal</th>
        </tr>
      </thead>
      <tbody>
        ${
          expenseTransactions.length === 0
            ? '<tr><td colspan="5" class="empty-state">Tidak ada catatan pengeluaran pada periode ini.</td></tr>'
            : expenseTransactions
                .map(
                  (t) => `
          <tr>
            <td>${formatDateIndo(t.date)}</td>
            <td><strong>${t.category?.name || 'Pengeluaran Umum'}</strong></td>
            <td>${t.account?.name || '-'}</td>
            <td>${t.notes || '-'}</td>
            <td class="amount expense">-${formatRupiah(t.amount)}</td>
          </tr>`
                )
                .join('')
        }
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4">TOTAL PENGELUARAN PERIODE INI</td>
          <td class="amount expense">-${formatRupiah(totalExpenseCalculated)}</td>
        </tr>
      </tfoot>
    </table>

    <!-- SECTION 3: REKAP KANTONG DANA -->
    <div class="section-title">
      <span>3. Status Saldo Kantong Dana Saat Ini</span>
      <span class="badge badge-account">${summary.accounts.length} Akun Terdaftar</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 30%">Nama Kantong Dana</th>
          <th style="width: 25%">Tipe Rekening</th>
          <th style="width: 25%">Nomor Rekening</th>
          <th style="width: 20%; text-align: right">Saldo Saat Ini</th>
        </tr>
      </thead>
      <tbody>
        ${summary.accounts
          .map(
            (acc) => `
          <tr>
            <td><strong>${acc.name}</strong></td>
            <td>${acc.type}</td>
            <td>${acc.accountNumber || '-'}</td>
            <td class="amount">${formatRupiah(acc.currentBalance)}</td>
          </tr>`
          )
          .join('')}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3">TOTAL KEKAYAAN BERSIH (NET WORTH)</td>
          <td class="amount">${formatRupiah(summary.totalNetWorth)}</td>
        </tr>
      </tfoot>
    </table>

    <!-- Sign footer -->
    <div class="footer-sign">
      <div>
        <p>Laporan ini digenerate secara otomatis oleh sistem <strong>FinansialKu</strong>.</p>
        <p style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Data valid sesuai mutasi transaksi yang tersimpan.</p>
      </div>
      <div class="sign-box">
        <p>Klaten, ${new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}</p>
        <div class="sign-space"></div>
        <p class="sign-name">${userName}</p>
      </div>
    </div>
  </div>

  <script>
    function downloadThisHtml() {
      const htmlContent = document.documentElement.outerHTML;
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'laporan-keuangan-' + new Date().toISOString().slice(0, 10) + '.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;
}

/**
 * Open HTML Report in a new window/tab for instant printing or preview
 */
export function openAndPrintReport(params: {
  summary: FinancialSummary;
  filter: PeriodFilter;
  userName?: string;
}) {
  const html = generateFinancialReportHtml(params);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

/**
 * Download HTML Report directly as .html file
 */
export function downloadReportHtmlFile(params: {
  summary: FinancialSummary;
  filter: PeriodFilter;
  userName?: string;
}) {
  const html = generateFinancialReportHtml(params);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const filterSlug = params.filter || 'periode';
  const dateSlug = new Date().toISOString().slice(0, 10);
  a.download = `laporan-keuangan-${filterSlug}-${dateSlug}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
