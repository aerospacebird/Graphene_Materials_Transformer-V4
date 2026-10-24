import React, { useState, useMemo } from 'react';
import {
  FolderSearch,
  Search,
  Filter,
  Download,
  ArrowUpDown,
  Sparkles,
  Sliders,
  CheckSquare,
  Square,
  Scale,
  X,
  Layers,
  ChevronRight
} from 'lucide-react';
import materialsData from '../data/materials_explorer.json';
import { MaterialExplorerItem } from '../types';
import { TabId } from './Navbar';

interface ExplorerTabProps {
  onSelectCandidateForPrediction: (formula: string) => void;
  onNavigateTab: (tab: TabId) => void;
}

export const ExplorerTab: React.FC<ExplorerTabProps> = ({
  onSelectCandidateForPrediction,
  onNavigateTab,
}) => {
  const [search, setSearch] = useState('');
  const [minSimilarity, setMinSimilarity] = useState(0.40);
  const [maxFormationEnergy, setMaxFormationEnergy] = useState(0.0);
  const [only2D, setOnly2D] = useState(false);
  const [sortKey, setSortKey] = useState<keyof MaterialExplorerItem>('similarity');
  const [sortAsc, setSortAsc] = useState(false);

  // Compare mode state
  const [compareList, setCompareList] = useState<MaterialExplorerItem[]>([
    materialsData[0], // Graphene or top
    materialsData[1]
  ].filter(Boolean));

  const filteredMaterials = useMemo(() => {
    return (materialsData as MaterialExplorerItem[])
      .filter((m) => {
        const matchesSearch =
          m.formula.toLowerCase().includes(search.toLowerCase()) ||
          m.material_id.toLowerCase().includes(search.toLowerCase());
        const matchesSim = m.similarity >= minSimilarity;
        const matchesEf = m.formation_energy <= maxFormationEnergy;
        const matches2D = only2D ? m.dimensionality === 2 : true;
        return matchesSearch && matchesSim && matchesEf && matches2D;
      })
      .sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
      });
  }, [search, minSimilarity, maxFormationEnergy, only2D, sortKey, sortAsc]);

  const toggleCompare = (item: MaterialExplorerItem) => {
    if (compareList.some((c) => c.material_id === item.material_id)) {
      setCompareList(compareList.filter((c) => c.material_id !== item.material_id));
    } else {
      if (compareList.length < 4) {
        setCompareList([...compareList, item]);
      }
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'Material ID,Formula,Similarity,Formation Energy (eV),Energy Above Hull (eV),Band Gap (eV),Carbon Fraction,Coordination Number,Graphene Score,Dimensionality,Status'
    ];
    const rows = filteredMaterials.map(
      (m) =>
        `${m.material_id},${m.formula},${m.similarity},${m.formation_energy},${m.energy_above_hull},${m.band_gap},${m.carbon_fraction},${m.coordination_number},${m.graphene_score},${m.dimensionality},${m.status}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'filtered_materials_explorer.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderSearch className="w-5 h-5 text-emerald-500" />
            <span>소재 전주기 탐색기 (Material Explorer & Benchmark Library)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Materials Project 데이터베이스 기반 전체 화합물 탐색, 다속성 필터링 및 2~4개 후보 나란히 비교(Compare Mode)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>필터 결과 CSV 다운로드</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparison Hub (if items selected) */}
      {compareList.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/40 text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-base text-white">
                후보 다각 비교 스튜디오 (Side-by-Side Comparison: {compareList.length}/4)
              </h3>
            </div>
            <button
              onClick={() => setCompareList([])}
              className="text-xs text-slate-400 hover:text-white"
            >
              선택 모두 취소
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {compareList.map((item) => (
              <div
                key={item.material_id}
                className="relative p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3"
              >
                <button
                  onClick={() => toggleCompare(item)}
                  className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-white"
                  title="제거"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div>
                  <span className="text-[10px] text-emerald-400 font-mono block">
                    {item.material_id}
                  </span>
                  <h4 className="text-lg font-black text-white font-mono mt-0.5">
                    {item.formula}
                  </h4>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {item.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] pt-2 border-t border-slate-700/60 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">유사도:</span>
                    <span className="font-bold text-emerald-400">{item.similarity.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">형성 E:</span>
                    <span>{item.formation_energy.toFixed(2)} eV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">밴드갭:</span>
                    <span>{item.band_gap.toFixed(2)} eV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">배위수:</span>
                    <span>{item.coordination_number.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">탄소분율:</span>
                    <span>{(item.carbon_fraction * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCandidateForPrediction(item.formula)}
                  className="w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors"
                >
                  예측기에서 분석
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Sliders Box */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <Sliders className="w-4 h-4 text-emerald-500" />
          <span>다차원 필터링 조건</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Similarity Filter */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">최소 유사도:</span>
              <span className="font-mono font-bold text-emerald-600">≥ {minSimilarity.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.95"
              step="0.05"
              value={minSimilarity}
              onChange={(e) => setMinSimilarity(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Formation Energy Filter */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">최대 형성 에너지:</span>
              <span className="font-mono font-bold text-blue-600">≤ {maxFormationEnergy.toFixed(1)} eV</span>
            </div>
            <input
              type="range"
              min="-3.5"
              max="0.0"
              step="0.1"
              value={maxFormationEnergy}
              onChange={(e) => setMaxFormationEnergy(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* 2D dimensionality toggle */}
          <div className="flex items-center gap-3 pt-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={only2D}
                onChange={(e) => setOnly2D(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                2D 층상 구조만 표시 (Estimated 2D)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="화학식 또는 MP ID 검색 (예: C, BN, MoS2, Al4C3, mp-)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
            총 {filteredMaterials.length}개 표시
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 max-h-[600px] overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800/90 backdrop-blur text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold z-10">
              <tr>
                <th className="py-3 px-3 text-center">비교</th>
                <th className="py-3 px-3">#</th>
                <th onClick={() => setSortKey('formula')} className="py-3 px-3 cursor-pointer">
                  <span>화학식</span>
                </th>
                <th className="py-3 px-3">소재 ID</th>
                <th onClick={() => setSortKey('similarity')} className="py-3 px-3 cursor-pointer">
                  <span>유사도</span>
                </th>
                <th onClick={() => setSortKey('formation_energy')} className="py-3 px-3 cursor-pointer">
                  <span>형성 E (eV)</span>
                </th>
                <th onClick={() => setSortKey('band_gap')} className="py-3 px-3 cursor-pointer">
                  <span>밴드갭 (eV)</span>
                </th>
                <th className="py-3 px-3">배위수</th>
                <th className="py-3 px-3">차원도</th>
                <th className="py-3 px-3">상태 분류</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {filteredMaterials.map((m, i) => {
                const isCompared = compareList.some((c) => c.material_id === m.material_id);
                return (
                  <tr
                    key={m.material_id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-700 dark:text-slate-300"
                  >
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => toggleCompare(m)}
                        className="text-slate-400 hover:text-emerald-500"
                        title={isCompared ? '비교 해제' : '비교 추가'}
                      >
                        {isCompared ? (
                          <CheckSquare className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans text-[10px]">{i + 1}</td>
                    <td 
                      onClick={() => onSelectCandidateForPrediction(m.formula)}
                      className="py-2.5 px-3 font-bold text-slate-900 dark:text-white cursor-pointer hover:text-emerald-500 hover:underline"
                    >
                      {m.formula}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[10px]">{m.material_id}</td>
                    <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                      {m.similarity.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3">{m.formation_energy.toFixed(2)}</td>
                    <td className="py-2.5 px-3">
                      {m.band_gap === 0 ? <span className="text-amber-500">0.0 (M)</span> : m.band_gap.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">{m.coordination_number.toFixed(1)}</td>
                    <td className="py-2.5 px-3 font-sans">
                      {m.dimensionality === 2 ? (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">
                          2D
                        </span>
                      ) : (
                        'Bulk'
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-sans text-[10px] text-slate-500">
                      {m.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
