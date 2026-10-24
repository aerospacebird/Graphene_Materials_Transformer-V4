import React, { useState, useMemo } from 'react';
import {
  Compass,
  Download,
  Sliders,
  Sparkles,
  Maximize2,
  Info,
  ChevronRight,
  Star
} from 'lucide-react';
import pcaDataset from '../data/pca_dataset.json';
import { PcaPoint } from '../types';
import { TabId } from './Navbar';

interface PcaTabProps {
  onSelectCandidateForPrediction: (formula: string) => void;
  onNavigateTab: (tab: TabId) => void;
}

export const PcaTab: React.FC<PcaTabProps> = ({
  onSelectCandidateForPrediction,
  onNavigateTab,
}) => {
  const [minSimilarity, setMinSimilarity] = useState<number>(0.50);
  const [selectedPoint, setSelectedPoint] = useState<PcaPoint | null>(pcaDataset.points[0] || null);
  const [showOriginalPlot, setShowOriginalPlot] = useState(false);

  const filteredPoints = useMemo(() => {
    return pcaDataset.points.filter((p) => p.similarity >= minSimilarity);
  }, [minSimilarity]);

  // Coordinate ranges for SVG canvas (PC1 from -6 to +10, PC2 from -8 to +8)
  const minPC1 = -6;
  const maxPC1 = 10;
  const minPC2 = -8;
  const maxPC2 = 8;
  const svgWidth = 650;
  const svgHeight = 420;
  const padX = 50;
  const padY = 30;

  const toSvgX = (pc1: number) => {
    const norm = (pc1 - minPC1) / (maxPC1 - minPC1);
    return padX + norm * (svgWidth - padX * 2);
  };

  const toSvgY = (pc2: number) => {
    const norm = (pc2 - minPC2) / (maxPC2 - minPC2);
    return svgHeight - padY - norm * (svgHeight - padY * 2);
  };

  const getSimilarityColor = (sim: number) => {
    // Viridis-like color gradient
    if (sim >= 0.88) return '#10b981'; // bright emerald
    if (sim >= 0.80) return '#06b6d4'; // cyan
    if (sim >= 0.70) return '#3b82f6'; // blue
    if (sim >= 0.60) return '#6366f1'; // indigo
    return '#8b5cf6'; // purple
  };

  const handleExportCsv = () => {
    const headers = ['Material ID,Formula,Similarity,PC1,PC2'];
    const rows = filteredPoints.map((p) => `${p.material_id},${p.formula},${p.similarity},${p.PC1},${p.PC2}`);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'graphene_embedding_pca.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const grapheneRef = pcaDataset.graphene_reference;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-500" />
            <span>임베딩 PCA 공간 해석 (Transformer Embedding PCA)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            트랜스포머 V4의 64차원 은닉 표현을 2차원으로 주성분 분석(PCA) 투영한 신소재 분포 맵 (누적 설명 분산: {pcaDataset.explained_variance.cumulative}%)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowOriginalPlot(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Colab 원본 플롯</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>PCA CSV 내보내기</span>
          </button>
        </div>
      </div>

      {/* Main PCA Map and Point Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Scatter SVG (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          {/* Slider Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <Sliders className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                최소 코사인 유사도 필터:
              </span>
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-emerald-500/30">
                ≥ {minSimilarity.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-1 sm:max-w-xs">
              <input
                type="range"
                min="0.35"
                max="0.90"
                step="0.01"
                value={minSimilarity}
                onChange={(e) => setMinSimilarity(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-400 shrink-0">
                {filteredPoints.length}개 표시
              </span>
            </div>
          </div>

          {/* SVG Map */}
          <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
              {/* Axes and Grid Lines */}
              <line x1={padX} y1={svgHeight / 2} x2={svgWidth - padX} y2={svgHeight / 2} stroke="#334155" strokeDasharray="3 3" />
              <line x1={svgWidth / 2} y1={padY} x2={svgWidth / 2} y2={svgHeight - padY} stroke="#334155" strokeDasharray="3 3" />

              {/* Axis Labels */}
              <text x={svgWidth - padX} y={svgHeight / 2 - 8} className="text-[10px] fill-slate-400 font-mono" textAnchor="end">
                PC1 ({pcaDataset.explained_variance.PC1}% variance) →
              </text>
              <text x={svgWidth / 2 + 8} y={padY + 12} className="text-[10px] fill-slate-400 font-mono">
                ↑ PC2 ({pcaDataset.explained_variance.PC2}% variance)
              </text>

              {/* Data Points */}
              {filteredPoints.map((p, idx) => {
                const cx = toSvgX(p.PC1);
                const cy = toSvgY(p.PC2);
                const isSelected = selectedPoint?.material_id === p.material_id;
                const color = getSimilarityColor(p.similarity);

                return (
                  <g key={idx} className="cursor-pointer" onClick={() => setSelectedPoint(p)}>
                    {p.is_top && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 11 : 8}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.8"
                        strokeDasharray="2 2"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 7 : 4.5}
                      fill={color}
                      stroke={isSelected ? '#ffffff' : '#0f172a'}
                      strokeWidth={isSelected ? 2 : 1}
                      className="transition-all hover:scale-150"
                    />
                    {p.similarity > 0.875 && (
                      <text
                        x={cx + 6}
                        y={cy + 3}
                        className="text-[9px] font-mono font-bold fill-slate-300 pointer-events-none select-none"
                      >
                        {p.formula}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Graphene Reference Star Marker */}
              {(() => {
                const gx = toSvgX(grapheneRef.PC1);
                const gy = toSvgY(grapheneRef.PC2);
                return (
                  <g className="cursor-pointer" onClick={() => setSelectedPoint({ material_id: 'REF', formula: 'Graphene Reference (C)', similarity: 1.0, PC1: grapheneRef.PC1, PC2: grapheneRef.PC2 })}>
                    <circle cx={gx} cy={gy} r="18" fill="rgba(239, 68, 68, 0.25)" className="animate-pulse" />
                    <polygon
                      points={`${gx},${gy - 12} ${gx + 3.5},${gy - 3.5} ${gx + 12},${gy - 3.5} ${gx + 5},${gy + 2.5} ${gx + 8},${gy + 11} ${gx},${gy + 5.5} ${gx - 8},${gy + 11} ${gx - 5},${gy + 2.5} ${gx - 12},${gy - 3.5} ${gx - 3.5},${gy - 3.5}`}
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text x={gx + 16} y={gy + 4} className="text-[11px] font-black fill-red-400 font-mono select-none">
                      Graphene Reference ★
                    </text>
                  </g>
                );
              })()}
            </svg>

            {/* Inset Colorbar Legend */}
            <div className="absolute bottom-3 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur border border-slate-800 text-[10px] text-slate-300 font-mono">
              <span>Similarity:</span>
              <div className="w-24 h-2.5 rounded bg-gradient-to-r from-purple-500 via-blue-500 via-cyan-400 to-emerald-400"></div>
              <span>0.50 → 1.00</span>
            </div>
          </div>
        </div>

        {/* Selected Point Inspector & PCA Statistics (1 col) */}
        <div className="space-y-4">
          {/* Selected Material Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                선택 소재 PCA 좌표
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
                {selectedPoint ? selectedPoint.formula : '소재를 선택해주세요'}
              </h3>
              {selectedPoint?.material_id && (
                <span className="text-xs font-mono text-slate-400">
                  ID: {selectedPoint.material_id}
                </span>
              )}
            </div>

            {selectedPoint && (
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-500">코사인 유사도 (Cosine Sim)</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {selectedPoint.similarity.toFixed(4)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-500">주성분 1 (PC1)</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                    {selectedPoint.PC1.toFixed(4)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-500">주성분 2 (PC2)</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                    {selectedPoint.PC2.toFixed(4)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-slate-500">그래핀 기준점 거리 (Euclidean)</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                    {Math.sqrt(
                      Math.pow(selectedPoint.PC1 - grapheneRef.PC1, 2) +
                      Math.pow(selectedPoint.PC2 - grapheneRef.PC2, 2)
                    ).toFixed(3)}
                  </span>
                </div>

                <button
                  onClick={() => onSelectCandidateForPrediction(selectedPoint.formula.replace(' (Graphene)', ''))}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>특성 예측기에서 분석</span>
                </button>
              </div>
            )}
          </div>

          {/* PCA Methodological Note */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-500" />
              <span>PCA 분석 원리 및 주의사항</span>
            </h4>
            <p className="leading-relaxed text-[11px]">
              주성분 분석(PCA)은 모델 입력 특성이 아닌, 트랜스포머의 <strong>은닉 임베딩 벡터 해석 및 시각화 전용</strong>으로
              사용됩니다. PC1은 전이 금속 및 배위 다면체 밀도를 주로 반영하며, PC2는 sp2 탄소 결합 및 평면성을 강하게 반영합니다.
            </p>
          </div>
        </div>
      </div>

      {/* Modal for full size Colab PCA Plot */}
      {showOriginalPlot && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowOriginalPlot(false)}
        >
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden p-4 border border-slate-700">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
              <h4 className="font-bold text-white text-sm">
                Colab 원본 고해상도 임베딩 PCA 산점도 (graphene_embedding_pca.png)
              </h4>
              <button 
                onClick={() => setShowOriginalPlot(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded bg-slate-800"
              >
                닫기
              </button>
            </div>
            <img 
              src="/data/graphene_embedding_pca.png" 
              alt="Graphene Embedding PCA" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
