import React, { useState } from 'react';
import { useMachine } from '../context/MachineContext';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  ReferenceArea, 
  ReferenceLine 
} from 'recharts';
import { 
  Scale, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Sparkles, 
  Filter, 
  TrendingDown, 
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const WeightAnalysis = ({ onOpenWeightModal }) => {
  const { stickWeights, batchSummary, thresholds, addStickWeightRecord } = useMachine();

  // Quick inline form state
  const [inlineBefore, setInlineBefore] = useState('');
  const [inlineAfter, setInlineAfter] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleInlineSubmit = (e) => {
    e.preventDefault();
    if (!inlineBefore || !inlineAfter) return;
    const res = addStickWeightRecord(inlineBefore, inlineAfter);
    if (res) {
      setFeedback(`Recorded Stick ${res.id}: ${res.lossPercent}% loss (${res.status})`);
      setInlineBefore('');
      setInlineAfter('');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const chartData = stickWeights.map(s => ({
    name: s.id,
    before: s.beforeWeight,
    after: s.afterWeight,
    loss: s.lossWeight,
    lossPercent: s.lossPercent,
    status: s.status
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Header with Batch Summary Callout */}
      <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">Stick Weight & Moisture Loss Analysis</h2>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                {batchSummary.qualityTag}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Target Moisture Loss: 20.0% to 25.0% (Infrared 60-70°C Drying Standard)
            </p>
          </div>
        </div>

        <button
          onClick={onOpenWeightModal}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center space-x-2 shadow-lg glow-green"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Stick Weight</span>
        </button>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Batch Weight Before */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Weight Before</span>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-white font-mono">{batchSummary.totalWeightBefore}</span>
            <span className="text-xs font-bold text-slate-400">grams</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-mono">
            {batchSummary.totalSticks} Agarbatti Sticks Loaded
          </div>
        </div>

        {/* Total Batch Weight After */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Weight After</span>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-emerald-400 font-mono">{batchSummary.totalWeightAfter}</span>
            <span className="text-xs font-bold text-slate-400">grams</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-mono">
            Finished Dried Sticks
          </div>
        </div>

        {/* Total Moisture Loss */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Net Moisture Loss</span>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-amber-400 font-mono">{batchSummary.totalWeightLoss}</span>
            <span className="text-xs font-bold text-slate-400">grams ({batchSummary.lossPercentage}%)</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-300 font-mono">
            Optimal 20-25% Target Band
          </div>
        </div>

        {/* Quality Certification */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Quality Grade</span>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-xl font-black text-emerald-300">Grade A Premium</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ready for Fragrance Dosing</span>
          </div>
        </div>

      </div>

      {/* 3. Bar Chart Comparing Before vs After Weight per Stick */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Stick-by-Stick Weight Comparison (g)
              </h3>
              <p className="text-xs text-slate-400">Before drying vs After drying across test batch</p>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                <XAxis dataKey="name" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} domain={[0, 2.5]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="before" name="Before Drying (g)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" name="After Drying (g)" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Inline Add Form */}
        <div className="lg:col-span-4 bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Quick Stick Weight Entry</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter individual stick test weights to auto-calculate moisture loss & update batch quality.
            </p>

            {feedback && (
              <div className="p-3 mb-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{feedback}</span>
              </div>
            )}

            <form onSubmit={handleInlineSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Before Drying Weight (g)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 1.89"
                  value={inlineBefore}
                  onChange={(e) => setInlineBefore(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  After Drying Weight (g)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 1.45"
                  value={inlineAfter}
                  onChange={(e) => setInlineAfter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md flex items-center justify-center space-x-1.5 mt-2"
              >
                <span>Calculate & Add to Batch</span>
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Rule: 20-25% loss is tagged <b>Properly Dried</b>. &lt;20% is <b>Under-dried</b>, &gt;25% is <b>Over-dried</b>.
          </div>
        </div>

      </div>

      {/* 4. Complete Per-Stick Weights Table */}
      <div className="bg-slate-900/80 dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Sample 5-Stick Test Batch Weight Registry
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {stickWeights.length} Sticks Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Stick ID</th>
                <th className="py-2.5 px-3">Before (g)</th>
                <th className="py-2.5 px-3">After (g)</th>
                <th className="py-2.5 px-3">Loss (g)</th>
                <th className="py-2.5 px-3">Loss (%)</th>
                <th className="py-2.5 px-3">Target Range</th>
                <th className="py-2.5 px-3">Quality Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {stickWeights.map((stick) => {
                const isOptimal = stick.lossPercent >= 20.0 && stick.lossPercent <= 25.0;
                return (
                  <tr key={stick.id} className="hover:bg-slate-950/40 transition">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">{stick.id}</td>
                    <td className="py-2.5 px-3 font-semibold">{stick.beforeWeight.toFixed(2)} g</td>
                    <td className="py-2.5 px-3 font-semibold">{stick.afterWeight.toFixed(2)} g</td>
                    <td className="py-2.5 px-3 text-amber-400 font-bold">-{stick.lossWeight.toFixed(2)} g</td>
                    <td className="py-2.5 px-3 font-extrabold text-white">{stick.lossPercent.toFixed(2)}%</td>
                    <td className="py-2.5 px-3 text-slate-400">20.0 - 25.0%</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isOptimal 
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' 
                          : stick.lossPercent < 20.0 
                          ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                          : 'bg-red-950 text-red-300 border-red-500/40'
                      }`}>
                        {stick.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Totals Row */}
            <tfoot className="bg-slate-950 text-slate-100 font-bold border-t-2 border-slate-700">
              <tr>
                <td className="py-3 px-3 text-amber-400 font-black">TOTALS</td>
                <td className="py-3 px-3">{batchSummary.totalWeightBefore} g</td>
                <td className="py-3 px-3 text-emerald-400">{batchSummary.totalWeightAfter} g</td>
                <td className="py-3 px-3 text-amber-400">-{batchSummary.totalWeightLoss} g</td>
                <td className="py-3 px-3 text-emerald-400">{batchSummary.lossPercentage}% Avg</td>
                <td className="py-3 px-3 text-slate-400">20.0 - 25.0%</td>
                <td className="py-3 px-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-900 text-emerald-200 border border-emerald-400">
                    {batchSummary.qualityTag} (23.1%)
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
};
