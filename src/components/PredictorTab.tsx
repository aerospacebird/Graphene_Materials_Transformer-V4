import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Layers,
  Activity,
  CheckCircle2,
  Atom,
  ArrowRight,
  RotateCcw,
  Box,
  Compass,
  AlertCircle
} from 'lucide-react';
import { predictMaterialProperties, PredictionResult, ELEMENT_DB } from '../utils/predictor';
import { TabId } from './Navbar';

interface PredictorTabProps {
  initialFormula?: string;
  onNavigateTab: (tab: TabId) => void;
}

export const PredictorTab: React.FC<PredictorTabProps> = ({
  initialFormula = 'Al2(CN2)3',
  onNavigateTab,
}) => {
  const [formulaInput, setFormulaInput] = useState(initialFormula);
  const [result, setResult] = useState<PredictionResult | null>(null);

  useEffect(() => {
    if (initialFormula) {
      setFormulaInput(initialFormula);
      const res = predictMaterialProperties(initialFormula);
      setResult(res);
    }
  }, [initialFormula]);

  const handlePredict = (f: string) => {
    setFormulaInput(f);
    const res = predictMaterialProperties(f);
    setResult(res);
  };

  const presetFormulas = [
    { label: 'Graphene (Pure)', formula: 'C', badge: '1.000 Sim' },
    { label: 'Al2(CN2)3', formula: 'Al2(CN2)3', badge: 'Top Candidate' },
    { label: 'Al4C3', formula: 'Al4C3', badge: 'Carbide Layer' },
    { label: 'h-BN (Boron Nitride)', formula: 'BN', badge: '0.942 Sim' },
    { label: 'BC3 (B-doped)', formula: 'BC3', badge: '0.950 Sim' },
    { label: 'C3N4 (Graphitic)', formula: 'C3N4', badge: '0.892 Sim' },
    { label: 'AlCr2C', formula: 'AlCr2C', badge: '0.913 Sim' },
    { label: 'AgMoPO6', formula: 'AgMoPO6', badge: '0.874 Sim' },
    { label: 'MoS2', formula: 'MoS2', badge: '2D TMD' },
    { label: 'SiC', formula: 'SiC', badge: '0.820 Sim' },
    { label: 'Ti3C2 (MXene)', formula: 'Ti3C2', badge: '2D Carbide' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span>신소재 특성 & 그래핀 유사도 예측기 (Inverse Discovery Tool)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            화학식을 입력하면 트랜스포머 V4 모델 기반으로 그래핀 코사인 유사도, 형성 에너지, 밴드갭, PCA 좌표를 실시간 추정합니다.
          </p>
        </div>
      </div>

      {/* Formula Input & Presets */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            화합물 화학식 입력 (Chemical Formula)
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={formulaInput}
                onChange={(e) => {
                  setFormulaInput(e.target.value);
                  const res = predictMaterialProperties(e.target.value);
                  setResult(res);
                }}
                placeholder="화학식 입력 (예: Al2(CN2)3, C, BN, MoS2, Al4C3, C3N4, BC3)..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
              />
            </div>
            <button
              onClick={() => handlePredict(formulaInput)}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>특성 실시간 예측</span>
            </button>
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">
            벤치마크 및 검증 후보 프리셋 클릭:
          </span>
          <div className="flex flex-wrap gap-2">
            {presetFormulas.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handlePredict(p.formula)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all flex items-center gap-2 ${
                  formulaInput === p.formula
                    ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-500 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                }`}
              >
                <span>{p.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${formulaInput === p.formula ? 'bg-slate-900 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                  {p.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prediction Output Results */}
      {result ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Predicted Gauges (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Recommendation Header Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">
                  AI 소재 분류 판정
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {result.recommendation}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">DFT 우선순위 점수</span>
                <span className="text-2xl font-black text-emerald-500 font-mono">
                  {result.dftPriorityScore.toFixed(1)}
                </span>
              </div>
            </div>

            {/* 4 Core Gauge Meters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Similarity Gauge */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  코사인 유사도
                </span>
                <div className="text-2xl font-black text-emerald-500 font-mono">
                  {result.similarity.toFixed(4)}
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, result.similarity * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500">
                  {result.similarity >= 0.85 ? '매우 높음' : '보통'}
                </span>
              </div>

              {/* Formation Energy */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  형성 에너지
                </span>
                <div className="text-2xl font-black text-blue-500 font-mono">
                  {result.formationEnergy.toFixed(2)}
                  <span className="text-xs font-normal text-slate-400 ml-1">eV</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.abs(result.formationEnergy) * 25)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500">
                  {result.formationEnergy < -1.0 ? '열역학적 고안정' : '안정'}
                </span>
              </div>

              {/* Band Gap */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  전자 밴드갭
                </span>
                <div className="text-2xl font-black text-purple-500 font-mono">
                  {result.bandGap.toFixed(2)}
                  <span className="text-xs font-normal text-slate-400 ml-1">eV</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (result.bandGap / 6.0) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500">
                  {result.bandGap === 0 ? '도체 / 디락 반금속' : result.bandGap > 2.5 ? '광대역 절연체' : '2D 반도체'}
                </span>
              </div>

              {/* Graphene Structure Score */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  구조 적합도
                </span>
                <div className="text-2xl font-black text-amber-500 font-mono">
                  {result.grapheneStructureScore.toFixed(3)}
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (result.grapheneStructureScore / 0.35) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-slate-500">
                  {result.grapheneStructureScore >= 0.25 ? '우수 (Top 구조)' : '적합'}
                </span>
              </div>
            </div>

            {/* PCA Space Projected Location */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-500" />
                  <span>예측 임베딩 PCA 공간 투영 위치 (Projected PCA Coordinates)</span>
                </h4>
                <button
                  onClick={() => onNavigateTab('pca')}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>전체 PCA 맵에서 보기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono">
                  <span className="text-slate-400 block text-[10px]">투영 PC1 (42.3% 분산)</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {result.pc1.toFixed(3)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono">
                  <span className="text-slate-400 block text-[10px]">투영 PC2 (17.5% 분산)</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {result.pc2.toFixed(3)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono">
                  <span className="text-slate-400 block text-[10px]">Convex Hull 에너지</span>
                  <span className="text-sm font-bold text-emerald-500">
                    {result.energyAboveHull.toFixed(3)} eV
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Elemental Composition Breakdown (1 col) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Atom className="w-4 h-4 text-emerald-500" />
              <span>화합물 원소 구성 분석 ({result.parsed.totalAtoms}개 원자 단위체)</span>
            </h4>

            {/* Elements List */}
            <div className="space-y-2">
              {result.parsed.elements.map((el, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center justify-center text-xs">
                      {el.element}
                    </span>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{el.data.name}</span>
                      <span className="text-[10px] text-slate-400 block">
                        Z={el.data.z} | {el.data.group}족 {el.data.period}주기
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{el.count}개</span>
                    <span className="text-[10px] text-slate-400 block">
                      {(el.fraction * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Derived Composition Descriptors */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">탄소 비율 (C Ratio)</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {(result.parsed.carbonRatio * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">14족(C,Si,Ge,Sn) 비율</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {(result.parsed.group14Ratio * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">금속 원소 비율</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {(result.parsed.metalRatio * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">평균 원자 번호 (Z Mean)</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {result.parsed.zMean.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">평균 전기음성도</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {result.parsed.meanEn.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('crystal3d')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Box className="w-4 h-4 text-emerald-500" />
              <span>3D 결정 구조 시각화 뷰어</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
          유효한 화학식을 입력하면 실시간 물성 예측이 나타납니다.
        </div>
      )}
    </div>
  );
};
