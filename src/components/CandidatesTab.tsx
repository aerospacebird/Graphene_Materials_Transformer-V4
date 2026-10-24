import React, { useState, useMemo } from 'react';
import {
  Download,
  Search,
  ArrowUpDown,
  Filter,
  Sparkles,
  ExternalLink,
  Layers,
  ChevronRight,
  TrendingUp,
  Activity,
  Box
} from 'lucide-react';
import candidatesData from '../data/candidates.json';
import { Candidate } from '../types';
import { TabId } from './Navbar';

interface CandidatesTabProps {
  onSelectCandidateForPrediction: (formula: string) => void;
  onNavigateTab: (tab: TabId) => void;
}

export const CandidatesTab: React.FC<CandidatesTabProps> = ({
  onSelectCandidateForPrediction,
  onNavigateTab,
}) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof Candidate>('composite_score');
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(candidatesData[0] || null);

  const filteredCandidates = useMemo(() => {
    return candidatesData
      .filter((c) => c.formula.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [search, sortKey, sortAsc]);

  const handleSort = (key: keyof Candidate) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === 'composite_score');
    }
  };

  const handleExportCsv = () => {
    const headers = ['Formula,Similarity,Carbon Ratio,Formation Energy (eV),Energy Above Hull (eV),Band Gap (eV),Composite Score'];
    const rows = candidatesData.map(
      (c) => `${c.formula},${c.similarity},${c.carbon_ratio},${c.formation_energy},${c.energy_above_hull},${c.band_gap},${c.composite_score}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'graphene_like_candidates_ranked.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Highlights */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🧲 그래핀 유사 후보 순위 (Graphene-like Candidate Ranking)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            트랜스포머 V4 64차원 임베딩 코사인 유사도(50%), 열역학적 형성 에너지(30%), 안정성(20%) 가중치 종합 순위
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>CSV 다운로드</span>
          </button>
        </div>
      </div>

      {/* Top 3 Featured Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {candidatesData.slice(0, 3).map((item, idx) => {
          const rankBadges = ['bg-amber-500 text-slate-950', 'bg-slate-300 text-slate-900', 'bg-amber-700 text-white'];
          return (
            <div
              key={idx}
              onClick={() => setSelectedCandidate(item)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedCandidate?.formula === item.formula
                  ? 'bg-emerald-500/10 border-emerald-500 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${rankBadges[idx]}`}>
                  TOP {idx + 1}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  스코어 {item.composite_score.toFixed(1)}
                </span>
              </div>

              <div className="text-xl font-black text-slate-900 dark:text-white font-mono">
                {item.formula}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block">코사인 유사도</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {item.similarity.toFixed(4)}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block">형성 에너지</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {item.formation_energy.toFixed(2)} eV
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block">밴드갭 (Band Gap)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {item.band_gap.toFixed(2)} eV
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-400 block">탄소 분율</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {(item.carbon_ratio * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                <span className="text-[11px] font-medium">상세 특성 분석</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Similarity vs Composite Score Scatter Visualization */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>코사인 유사도 vs 종합 순위 스코어 분포 (Similarity vs Composite Score)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              상위 20개 후보 화합물의 그래핀 유사도 분포 (스코어가 낮을수록 종합 우선순위 우수)
            </p>
          </div>
        </div>

        {/* Custom SVG Scatter Plot */}
        <div className="h-64 w-full pt-2">
          <svg viewBox="0 0 600 220" className="w-full h-full overflow-visible">
            {/* Grid Lines */}
            <line x1="50" y1="20" x2="570" y2="20" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
            <line x1="50" y1="75" x2="570" y2="75" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
            <line x1="50" y1="130" x2="570" y2="130" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
            <line x1="50" y1="185" x2="570" y2="185" stroke="currentColor" className="text-slate-300 dark:text-slate-700" />
            <line x1="50" y1="20" x2="50" y2="185" stroke="currentColor" className="text-slate-300 dark:text-slate-700" />

            {/* Axis Labels */}
            <text x="50" y="205" className="text-[10px] fill-slate-400" textAnchor="middle">0.78</text>
            <text x="180" y="205" className="text-[10px] fill-slate-400" textAnchor="middle">0.81</text>
            <text x="310" y="205" className="text-[10px] fill-slate-400" textAnchor="middle">0.84</text>
            <text x="440" y="205" className="text-[10px] fill-slate-400" textAnchor="middle">0.87</text>
            <text x="570" y="205" className="text-[10px] fill-slate-400" textAnchor="middle">0.90</text>

            <text x="42" y="25" className="text-[10px] fill-slate-400" textAnchor="end">150</text>
            <text x="42" y="80" className="text-[10px] fill-slate-400" textAnchor="end">120</text>
            <text x="42" y="135" className="text-[10px] fill-slate-400" textAnchor="end">90</text>
            <text x="42" y="188" className="text-[10px] fill-slate-400" textAnchor="end">70</text>

            {/* Scatter Circles */}
            {candidatesData.map((c, i) => {
              // x mapping: 0.78 to 0.90 -> 50 to 570
              const normX = Math.max(0, Math.min(1, (c.similarity - 0.77) / 0.12));
              const x = 50 + normX * 520;
              // y mapping: 70 to 150 -> 185 to 20
              const normY = Math.max(0, Math.min(1, (c.composite_score - 70) / 80));
              const y = 185 - normY * 165;
              const isSelected = selectedCandidate?.formula === c.formula;

              return (
                <g key={i} className="cursor-pointer" onClick={() => setSelectedCandidate(c)}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 8 : 5.5}
                    fill={isSelected ? '#10b981' : '#3b82f6'}
                    stroke={isSelected ? '#ffffff' : '#1e3a8a'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all hover:scale-125"
                  />
                  {i < 5 && (
                    <text
                      x={x + 8}
                      y={y + 4}
                      className="text-[9px] font-mono font-bold fill-slate-700 dark:fill-slate-300 pointer-events-none"
                    >
                      {c.formula}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Main Table and Detail Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Candidates Table (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="화합물 화학식 검색 (예: Al, Ag, C, Mo)..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
              총 {filteredCandidates.length}개 후보 표시
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th 
                    onClick={() => handleSort('formula')}
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>화학식</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('similarity')}
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>코사인 유사도</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('formation_energy')}
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>형성 E (eV)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('band_gap')}
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>밴드갭 (eV)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('composite_score')}
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <div className="flex items-center gap-1 text-emerald-500">
                      <span>종합 스코어</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                {filteredCandidates.map((c, i) => {
                  const isSelected = selectedCandidate?.formula === c.formula;
                  return (
                    <tr
                      key={i}
                      onClick={() => setSelectedCandidate(c)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-emerald-500/10 dark:bg-emerald-500/15 font-semibold text-emerald-700 dark:text-emerald-300'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 px-3 text-slate-400 font-sans text-[10px]">{i + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{c.formula}</td>
                      <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                        {c.similarity.toFixed(4)}
                      </td>
                      <td className="py-2.5 px-3">{c.formation_energy.toFixed(3)}</td>
                      <td className="py-2.5 px-3">
                        {c.band_gap === 0 ? (
                          <span className="text-amber-500 font-semibold">0.0 (Metal)</span>
                        ) : (
                          c.band_gap.toFixed(3)
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-500">{c.composite_score.toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Candidate Inspector (1 col) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {selectedCandidate ? (
            <>
              <div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                  후보 상세 프로필
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
                  {selectedCandidate.formula}
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-500">그래핀 코사인 유사도</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {selectedCandidate.similarity.toFixed(6)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-500">종합 우선순위 스코어</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                    {selectedCandidate.composite_score.toFixed(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-500">원자당 형성 에너지</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                    {selectedCandidate.formation_energy.toFixed(4)} eV/atom
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-500">Convex Hull 에너지</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedCandidate.energy_above_hull.toFixed(4)} eV (안정상)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-500">전자 밴드갭</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                    {selectedCandidate.band_gap.toFixed(4)} eV
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-500">탄소 원자 분율</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                    {(selectedCandidate.carbon_ratio * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => onSelectCandidateForPrediction(selectedCandidate.formula)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>특성 예측기에서 분석하기</span>
                </button>

                <button
                  onClick={() => onNavigateTab('crystal3d')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Box className="w-4 h-4 text-emerald-500" />
                  <span>3D 결정 구조 뷰어로 이동</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              테이블에서 후보를 선택해주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
