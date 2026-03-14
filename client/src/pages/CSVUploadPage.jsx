import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Check,
  Download,
  FileSpreadsheet,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import Papa from 'papaparse';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../services/api';

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899', '#f97316'];

const CSVUploadPage = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [parsing, setParsing] = useState(false);
  const [imported, setImported] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadStats, setUploadStats] = useState(null);
  const [error, setError] = useState('');

  const parseCSV = useCallback((text) => {
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors?.length) {
      setError(parsed.errors[0].message || 'CSV parsing failed');
      return;
    }

    const rows = Array.isArray(parsed.data) ? parsed.data : [];
    const heads = parsed.meta?.fields || Object.keys(rows[0] || {});
    setHeaders(heads);
    setData(rows);
    setError('');
  }, []);

  const handleFile = useCallback((f) => {
    if (!f || !f.name.endsWith('.csv')) return;
    setFile(f);
    setParsing(true);
    setImported(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      parseCSV(e.target.result);
      setParsing(false);
    };
    reader.readAsText(f);
  }, [parseCSV]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleImport = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    api
      .post('/upload/csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        setImported(true);
        setUploadStats(res.data || null);
        setError('');
      })
      .catch((err) => {
        setImported(false);
        setError(err.response?.data?.message || 'Unable to upload CSV.');
      });
  };

  const handleClear = () => {
    setFile(null);
    setData([]);
    setHeaders([]);
    setImported(false);
    setUploadStats(null);
    setError('');
  };

  // Analytics from parsed data
  const analytics = (() => {
    if (!data.length || !headers.length) return null;
    // Find a categorical column and a numeric column
    const numCol = headers.find((h) => data.every((r) => !isNaN(Number(r[h])) && r[h] !== ''));
    const catCol = headers.find((h) => h !== numCol);
    if (!catCol) return null;

    // Count by category
    const counts = {};
    data.forEach((row) => {
      const key = row[catCol] || 'Unknown';
      counts[key] = (counts[key] || 0) + 1;
    });
    const chartData = Object.entries(counts).slice(0, 8).map(([name, value]) => ({ name, value }));

    // Sum numeric if available
    let numericData = [];
    if (numCol) {
      const sums = {};
      data.forEach((row) => {
        const key = row[catCol] || 'Unknown';
        sums[key] = (sums[key] || 0) + Number(row[numCol] || 0);
      });
      numericData = Object.entries(sums).slice(0, 8).map(([name, value]) => ({ name, value: Math.round(value) }));
    }

    return { chartData, numericData, catCol, numCol, total: data.length };
  })();

  return (
    <section className="space-y-5 pb-10">
      <PageHeader title="CSV Upload" subtitle="Import volunteer data, resources, and event records from CSV files" />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      {/* Upload Zone */}
      {!file && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`glass cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
            dragOver
              ? 'border-emerald-400/60 bg-emerald-500/5 shadow-[0_0_40px_-8px_rgba(16,185,129,0.15)]'
              : 'border-[var(--border-muted)] hover:border-[var(--text-muted)]'
          }`}
          onClick={() => document.getElementById('csv-input').click()}
        >
          <motion.div
            animate={dragOver ? { scale: 1.1, y: -8 } : { scale: 1, y: 0 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 text-emerald-400"
          >
            <Upload className="h-7 w-7" />
          </motion.div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            {dragOver ? 'Drop your CSV file here' : 'Drag & drop your CSV file'}
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">or click to browse • Supports .csv files</p>
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
        </motion.div>
      )}

      {/* Parsing State */}
      {parsing && (
        <div className="glass flex items-center justify-center rounded-xl p-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <span className="ml-3 text-sm text-[var(--text-secondary)]">Parsing CSV file...</span>
        </div>
      )}

      {/* Preview Table */}
      {data.length > 0 && !parsing && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {/* File Info Bar */}
          <div className="glass mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border-muted)] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/15 p-2.5">
                <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{file?.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{data.length} rows • {headers.length} columns</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!imported ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleImport}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #3a916d, #1a6b42)' }}
                >
                  <Download className="h-3.5 w-3.5" />
                  Import Data
                </motion.button>
              ) : (
                <span className="flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-400">
                  <Check className="h-4 w-4" />
                  Imported Successfully
                </span>
              )}
              <button
                onClick={handleClear}
                className="cursor-pointer rounded-xl border border-[var(--border-muted)] p-2 text-[var(--text-muted)] transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                aria-label="Clear file"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="glass overflow-hidden rounded-xl border border-[var(--border-muted)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-muted)] bg-[var(--card-elevated)]">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">#</th>
                    {headers.map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 20).map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-[var(--border-muted)]/50 transition-colors hover:bg-[var(--surface-hover)]"
                    >
                      <td className="px-4 py-2.5 text-[var(--text-muted)]">{i + 1}</td>
                      {headers.map((h) => (
                        <td key={h} className="px-4 py-2.5 text-[var(--text-primary)]">{row[h]}</td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.length > 20 && (
              <p className="border-t border-[var(--border-muted)] px-4 py-2 text-center text-xs text-[var(--text-muted)]">
                Showing 20 of {data.length} rows
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Analytics from CSV */}
      <AnimatePresence>
        {imported && analytics && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {/* Summary Cards */}
            <div className="glass rounded-xl border border-[var(--border-muted)] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" />
                <h3 className="font-['Outfit'] text-lg font-semibold">Import Summary</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/20 p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{uploadStats?.counts?.totalRows ?? analytics.total}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Total Records</p>
                </div>
                <div className="rounded-xl bg-blue-500/10 border border-blue-400/20 p-3 text-center">
                  <p className="text-2xl font-bold text-blue-400">{uploadStats?.counts?.volunteers ?? headers.length}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Data Fields</p>
                </div>
                <div className="rounded-xl bg-amber-500/10 border border-amber-400/20 p-3 text-center">
                  <p className="text-2xl font-bold text-amber-400">{uploadStats?.counts?.events ?? analytics.chartData.length}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Events</p>
                </div>
                <div className="rounded-xl bg-purple-500/10 border border-purple-400/20 p-3 text-center">
                  <p className="text-2xl font-bold text-purple-400">{uploadStats?.counts?.resources ?? 0}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Resources</p>
                </div>
              </div>
            </div>

            {/* Pie Chart — Distribution by category */}
            <div className="glass rounded-xl border border-[var(--border-muted)] p-5">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                <h3 className="font-['Outfit'] text-lg font-semibold">Distribution by {analytics.catCol}</h3>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      innerRadius={45}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="var(--bg-elevated)"
                      animationDuration={800}
                    >
                      {analytics.chartData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid var(--border-muted)',
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--text-primary)',
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {analytics.chartData.map((item, i) => (
                  <span key={item.name} className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    {item.name} ({item.value})
                  </span>
                ))}
              </div>
            </div>

            {/* Bar Chart — Numeric data if available */}
            {analytics.numCol && analytics.numericData.length > 0 && (
              <div className="glass col-span-full rounded-xl border border-[var(--border-muted)] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-amber-400" />
                  <h3 className="font-['Outfit'] text-lg font-semibold">{analytics.numCol} by {analytics.catCol}</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.numericData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.22)" />
                      <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                      <YAxis stroke="var(--text-muted)" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: '1px solid var(--border-muted)',
                          backgroundColor: 'var(--bg-elevated)',
                          color: 'var(--text-primary)',
                        }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={900}>
                        {analytics.numericData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CSVUploadPage;
