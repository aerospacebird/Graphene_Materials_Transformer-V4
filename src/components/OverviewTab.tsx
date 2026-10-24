import React, { useState } from 'react';
import {
  Database,
  Layers,
  Award,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Cpu,
  Compass,
  FileSpreadsheet,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import statsSummary from '../data/stats_summary.json';
import trainingHistory from '../data/training_history.json';
import { TabId } from './Navbar';

interface OverviewTabProps {
  onNavigateTab: (tab: TabId) => void;
  onOpenShareModal: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateTab, onOpenShareModal }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const [selectedLossMetric, setSelectedLossMetric] = useState<'both' | 'val' | 'train'>('both');

  const maxLoss = 1.0;
  const epochs = trainingHistory.slice(0, 48);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-8 sm:p-10 border border-slate-700/60 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Materials Project API & Pymatgen Structure Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Graphene Materials{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Transformer V4
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            결정 구조 특징(배위수, 결합각, C-C 결합 편차, 2D 차원도)과 9차원 원소 화학 물성을
            결합한 <strong>Self-Attention 트랜스포머 V4 모델</strong>을 통해 32,534개 Materials Project
            데이터셋에서 그래핀 유사 2차원/벌크 신소재를 스크리닝하고 DFT 검증 후보를 도출합니다.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('candidates')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
            >
              <span>그래핀 유사 후보 순위 보기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('predictor')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs sm:text-sm border border-slate-600 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>신소재 특성 예측기 실행</span>
            </button>
            <button
              onClick={onOpenShareModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-xs sm:text-sm border border-cyan-500/30 transition-all"
            >
              <span>앱 공유 URL 복사</span>
            </button>
            <button
              onClick={() => onNavigateTab('downloads')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/40 transition-all"
            >
              <span>📥 Colab 코드/노트북 다운로드</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">학습/검증 소재</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {statsSummary.total_materials.toLocaleString()}
            <span className="text-xs font-normal text-slate-500 ml-1.5">개 화합물</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Train {statsSummary.train_samples} / Val {statsSummary.val_samples} (구조 특징 100% 추출)
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">최적 검증 손실 (Val Loss)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {statsSummary.best_val_loss.toFixed(4)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Epoch 38 조기 종료 (Weighted MSE Loss 0.8713 → 0.3122)
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">PCA 설명 분산</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {statsSummary.pca_variance_total.toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            PC1: {statsSummary.pca_variance_pc1}% | PC2: {statsSummary.pca_variance_pc2}%
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-all group">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">DFT 우선 검증 후보</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-500">
            50
            <span className="text-xs font-normal text-slate-500 ml-1.5">개 신소재</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            구조/물성 다차원 스코어링 우선순위 부여
          </p>
        </div>
      </div>

      {/* End-to-End Pipeline Interactive Architecture */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-500" />
              <span>엔드투엔드 파이프라인 (End-to-End Workflow)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Materials Project 데이터 수집부터 트랜스포머 인코더 임베딩, PCA 공간 해석 및 DFT 후보 선정까지
            </p>
          </div>
          <span className="hidden sm:inline-flex text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            PyTorch + Pymatgen
          </span>
        </div>

        {/* Flow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            {
              step: '01',
              title: 'MP API 확장 수집',
              desc: 'num_elements (1~6), E_hull ≤ 0.1 eV, 안정상 결정 구조',
              color: 'border-blue-500/40 bg-blue-500/5 text-blue-600 dark:text-blue-400'
            },
            {
              step: '02',
              title: '결정 구조 특징 추출',
              desc: '배위수, 결합길이, 120° 결합각, C-C 편차, 2D 차원도',
              color: 'border-cyan-500/40 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400'
            },
            {
              step: '03',
              title: '9차원 원소 화학 물성',
              desc: '전기음성도, 원자반경, 이온화 E, 밀도, 원자량, 족, 주기',
              color: 'border-teal-500/40 bg-teal-500/5 text-teal-600 dark:text-teal-400'
            },
            {
              step: '04',
              title: 'Transformer V4',
              desc: 'Embedding (32d) + Proj (32d) → Self-Attention (64d, 3L)',
              color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
            },
            {
              step: '05',
              title: '그래핀 코사인 유사도',
              desc: '순수 C4 그래핀 벡터 기준 64차원 임베딩 코사인 유사도 산출',
              color: 'border-violet-500/40 bg-violet-500/5 text-violet-600 dark:text-violet-400'
            },
            {
              step: '06',
              title: '임베딩 공간 PCA',
              desc: '해석 및 시각화 전용 2차원 투영 (PC1 42.3%, PC2 17.5%)',
              color: 'border-purple-500/40 bg-purple-500/5 text-purple-600 dark:text-purple-400'
            },
            {
              step: '07',
              title: 'DFT 검증 후보군',
              desc: '유사도 + 구조 스코어 + 형성 E + 안정성 종합 랭킹 (Top 50)',
              color: 'border-amber-500/40 bg-amber-500/5 text-amber-600 dark:text-amber-400'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex flex-col justify-between ${item.color}`}
            >
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase opacity-75">
                  STEP {item.step}
                </span>
                <h4 className="font-bold text-xs mt-1 text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Training History & Model Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Interactive Loss & Training Curves */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                학습 곡선 (Training & Validation Loss)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                CosineAnnealingLR 스케줄러 적용 (3.0e-4 → 2.9e-5), 48 에포크 수렴
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedLossMetric('both')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  selectedLossMetric === 'both'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setSelectedLossMetric('val')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  selectedLossMetric === 'val'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                Val Loss
              </button>
            </div>
          </div>

          {/* SVG Loss Curve */}
          <div className="h-56 w-full pt-2">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="currentColor" className="text-slate-300 dark:text-slate-700" />
              <line x1="40" y1="20" x2="40" y2="170" stroke="currentColor" className="text-slate-300 dark:text-slate-700" />

              {/* Y Axis labels */}
              <text x="32" y="24" className="text-[10px] fill-slate-400" textAnchor="end">0.9</text>
              <text x="32" y="74" className="text-[10px] fill-slate-400" textAnchor="end">0.6</text>
              <text x="32" y="124" className="text-[10px] fill-slate-400" textAnchor="end">0.4</text>
              <text x="32" y="174" className="text-[10px] fill-slate-400" textAnchor="end">0.2</text>

              {/* X Axis labels */}
              <text x="40" y="188" className="text-[10px] fill-slate-400" textAnchor="middle">1</text>
              <text x="150" y="188" className="text-[10px] fill-slate-400" textAnchor="middle">12</text>
              <text x="260" y="188" className="text-[10px] fill-slate-400" textAnchor="middle">24</text>
              <text x="370" y="188" className="text-[10px] fill-slate-400" textAnchor="middle">36</text>
              <text x="480" y="188" className="text-[10px] fill-slate-400" textAnchor="middle">48</text>

              {/* Train Loss Path */}
              {(selectedLossMetric === 'both' || selectedLossMetric === 'train') && (
                <path
                  d={epochs
                    .map((d, i) => {
                      const x = 40 + (i / (epochs.length - 1)) * 440;
                      const y = 170 - ((d.train_loss - 0.2) / (maxLoss - 0.2)) * 150;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                />
              )}

              {/* Val Loss Path */}
              {(selectedLossMetric === 'both' || selectedLossMetric === 'val') && (
                <path
                  d={epochs
                    .map((d, i) => {
                      const x = 40 + (i / (epochs.length - 1)) * 440;
                      const y = 170 - ((d.val_loss - 0.2) / (maxLoss - 0.2)) * 150;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
              )}

              {/* Best Epoch Marker (Epoch 38: Val 0.3122) */}
              {(() => {
                const bestIdx = 37;
                const x = 40 + (bestIdx / (epochs.length - 1)) * 440;
                const y = 170 - ((0.3122 - 0.2) / (maxLoss - 0.2)) * 150;
                return (
                  <g>
                    <circle cx={x} cy={y} r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                    <text x={x} y={y - 10} className="text-[10px] font-bold fill-amber-500" textAnchor="middle">
                      Best: 0.3122
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-blue-500">
                <span className="w-3 h-1 bg-blue-500 rounded"></span> Train Loss (0.871 → 0.232)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-500">
                <span className="w-3 h-1 bg-emerald-500 rounded"></span> Val Loss (0.768 → 0.312)
              </span>
            </div>
            <button
              onClick={() => setShowFullImage(true)}
              className="text-xs text-slate-500 hover:text-emerald-500 flex items-center gap-1 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>원본 그래프 보기</span>
            </button>
          </div>
        </div>

        {/* Column 2: Transformer V4 Model Specifications */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-500" />
              <span>모델 하이퍼파라미터 사양 (Model Specs)</span>
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
              PyTorch 2.4.0
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px]">원자 번호 임베딩</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                nn.Embedding(119, 32)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px]">9D 원소 물성 프로젝션</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Linear(9 → 32) + GELU
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px]">트랜스포머 인코더</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                d_model=64, 4-Heads, 3 Layers
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block text-[11px]">풀링 & 임베딩 차원</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Attention Pooling (64-dim)
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-slate-700 dark:text-slate-300">
              다중 타겟 예측 헤드 (Multi-head Regression)
            </h4>
            <div className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>형성 에너지 (Formation Energy per atom)</span>
                </span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">손실 가중치 1.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>밴드갭 (Band Gap eV)</span>
                </span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">손실 가중치 1.2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Convex Hull 에너지 (Energy Above Hull)</span>
                </span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">손실 가중치 0.2</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-500">
              옵티마이저: AdamW (lr=3e-4, wd=0.03)
            </span>
            <button
              onClick={() => onNavigateTab('candidates')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>후보 순위 탐색하기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal for full size training image */}
      {showFullImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden p-4 border border-slate-700">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
              <h4 className="font-bold text-white text-sm">
                Colab 원본 학습 곡선 및 Learning Rate 스케줄러 (training_curve.png)
              </h4>
              <button 
                onClick={() => setShowFullImage(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded bg-slate-800"
              >
                닫기
              </button>
            </div>
            <img 
              src="/data/training_curve.png" 
              alt="Training Curve" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
