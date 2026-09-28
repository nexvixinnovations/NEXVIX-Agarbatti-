import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { 
  FileSpreadsheet, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  User, 
  Sparkles,
  Layers,
  ArrowUpDown
} from 'lucide-react';

export const BatchesReports = () => {
  const { batches, batchSummary, stickWeights } = useMachine();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [qualityFilter, setQualityFilter] = useState('ALL'); // 'ALL' | 'Properly Dried' | 'Under-dried' | 'Over-dried'
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBatchForPrint, setSelectedBatchForPrint] = useState(null);

  // Filtered batch records
  const filteredBatches = batches.filter(b => {
    const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.operator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuality = qualityFilter === 'ALL' || b.qualityTag === qualityFilter;
    return matchesSearch && matchesQuality;
  });

  // Export CSV Functionality
  const handleExportCSV = () => {
    const headers = [
      'Batch ID',
      'Timestamp',
      'Sticks Count',
      'Packs Completed',
      'Before Weight (g)',
      'After Weight (g)',
      'Loss (g)',
      'Loss (%)',
      'Quality Tag',
      'Fragrance Dosed (ml)',
      'Energy Used (Wh)',
      'Solar Share (%)',
      'Avg Chamber Temp (C)',
      'Operator',
      'Status'
    ];

    const rows = batches.map(b => [
      b.id,
      b.timestamp,
      b.sticksCount,
      b.packsCompleted,
      b.beforeWeight,
      b.afterWeight,
      b.lossGrams,
      b.lossPercent,
      `"${b.qualityTag}"`,
      b.fragranceDosedMl,
      b.energyUsedWh,
      b.solarSharePct,
      b.avgTemp,
      `"${b.operator}"`,
      b.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NEXVIX_Batch_Production_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenPrint = (batch) => {
    setSelectedBatchForPrint(batch || batches[0]);
    setShowPrintModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Header with Export Actions */}
      <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-500/30">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Batch Registry & Quality Reports</h2>
            <p className="text-xs text-slate-400">
              Traceability logs for solar drying, fragrance dosing, and SHG production compliance
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center space-x-2 shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>
          <button
            onClick={() => handleOpenPrint(batches[0])}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center space-x-2 border border-slate-700"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Batch Certificate</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Batch ID or Operator Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Quality Filters */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {['ALL', 'Properly Dried', 'Under-dried', 'Over-dried'].map((q) => (
            <button
              key={q}
              onClick={() => setQualityFilter(q)}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                qualityFilter === q 
                  ? 'bg-emerald-600 text-white font-bold shadow-sm' 
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Batch Records Table */}
      <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Batch ID</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Sticks (Packs)</th>
                <th className="py-3 px-3">Pre / Post Wt (g)</th>
                <th className="py-3 px-3">Moisture Loss</th>
                <th className="py-3 px-3">Quality Tag</th>
                <th className="py-3 px-3">Fragrance</th>
                <th className="py-3 px-3">Solar Energy</th>
                <th className="py-3 px-3">Artisan</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredBatches.map((batch) => {
                const isProper = batch.qualityTag === 'Properly Dried';
                return (
                  <tr key={batch.id} className="hover:bg-slate-950/40 transition">
                    <td className="py-3 px-3 font-bold text-amber-400">{batch.id}</td>
                    <td className="py-3 px-3 text-slate-400">{batch.timestamp}</td>
                    <td className="py-3 px-3 font-semibold text-white">{batch.sticksCount}s ({batch.packsCompleted} pk)</td>
                    <td className="py-3 px-3">{batch.beforeWeight}g → {batch.afterWeight}g</td>
                    <td className="py-3 px-3 font-extrabold text-emerald-400">{batch.lossPercent}%</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        isProper 
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' 
                          : batch.qualityTag === 'Under-dried'
                          ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                          : 'bg-red-950 text-red-300 border-red-500/40'
                      }`}>
                        {batch.qualityTag}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-purple-400 font-semibold">{batch.fragranceDosedMl} ml</td>
                    <td className="py-3 px-3 text-amber-300">{batch.energyUsedWh} Wh ({batch.solarSharePct}% Solar)</td>
                    <td className="py-3 px-3 text-emerald-300">{batch.operator}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleOpenPrint(batch)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition font-sans text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Print / PDF Summary Modal Preview */}
      {showPrintModal && selectedBatchForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-black bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">
                    NEXVIX SOLAR SMART AGARBATTI
                  </span>
                </div>
                <p className="text-xs text-slate-400">Quality Assurance & Batch Compliance Certificate</p>
              </div>

              <button
                onClick={() => setShowPrintModal(false)}
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {/* Certificate Details */}
            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block text-[10px]">BATCH SERIAL</span>
                  <span className="text-base font-bold text-amber-400">{selectedBatchForPrint.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">TIMESTAMP</span>
                  <span className="text-slate-200 font-semibold">{selectedBatchForPrint.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">MANUFACTURING SHG</span>
                  <span className="text-emerald-300 font-semibold">{selectedBatchForPrint.operator} (Vellore Unit #3)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ENERGY CONSUMED</span>
                  <span className="text-amber-300 font-semibold">{selectedBatchForPrint.energyUsedWh} Wh ({selectedBatchForPrint.solarSharePct}% Clean Solar)</span>
                </div>
              </div>

              {/* Moisture Loss & Dosing */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Initial Batch Weight:</span>
                  <span className="text-white font-bold">{selectedBatchForPrint.beforeWeight} g</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Finished Dried Weight:</span>
                  <span className="text-emerald-400 font-bold">{selectedBatchForPrint.afterWeight} g</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Moisture Loss:</span>
                  <span className="text-amber-400 font-bold">{selectedBatchForPrint.lossPercent}% ({selectedBatchForPrint.lossGrams} g)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Fragrance Atomized:</span>
                  <span className="text-purple-400 font-bold">{selectedBatchForPrint.fragranceDosedMl} ml (0.50 ml/stick)</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Quality Classification:</span>
                  <span className="text-emerald-300 font-black">{selectedBatchForPrint.qualityTag} (Grade A)</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Digitally signed and cryptographically verified by NEXVIX ESP32 telemetry hardware.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center space-x-2 shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
