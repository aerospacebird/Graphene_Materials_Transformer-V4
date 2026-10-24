import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  LayoutDashboard,
  Award,
  Compass,
  FlaskConical,
  Sparkles,
  Box,
  FolderSearch,
  Download,
  Menu,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type TabId = 'overview' | 'candidates' | 'pca' | 'dft' | 'predictor' | 'crystal3d' | 'explorer' | 'downloads';

interface NavbarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  sharedUrl: string;
  onOpenShareModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  sharedUrl,
  onOpenShareModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sharedUrl);
    setCopied(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.15 }
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const navItems: { id: TabId; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: '개요 및 파이프라인', icon: LayoutDashboard },
    { id: 'candidates', label: '그래핀 유사 후보', icon: Award },
    { id: 'pca', label: '임베딩 PCA 탐색', icon: Compass },
    { id: 'dft', label: 'DFT 검증 후보군', icon: FlaskConical },
    { id: 'predictor', label: '신소재 특성 예측기', icon: Sparkles },
    { id: 'crystal3d', label: '3D 결정 구조 시각화', icon: Box },
    { id: 'explorer', label: '소재 탐색기', icon: FolderSearch },
    { id: 'downloads', label: 'Colab/앱 다운로드', icon: Download },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      {/* Top Banner & Menu Bar with Shared App URL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-teal-300 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                  Graphene Materials Transformer V4
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AI Discovery
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                구조 인지 트랜스포머 & DFT 검증 스크리닝 대시보드
              </p>
            </div>
          </div>

          {/* CRITICAL USER REQUIREMENT: Menu Bar Shared App URL Display */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-emerald-500/30 hover:border-emerald-500/60 transition-all shadow-inner">
            {/* Live Indicator */}
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-semibold text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              공유 URL
            </span>

            {/* Truncated / Monospace Link */}
            <span 
              onClick={onOpenShareModal}
              title={sharedUrl}
              className="font-mono text-xs text-slate-300 max-w-[280px] truncate cursor-pointer hover:text-emerald-300 transition-colors select-all"
            >
              {sharedUrl.replace('https://', '')}
            </span>

            {/* Quick Actions */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-700">
              <button
                onClick={handleCopyUrl}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                  copied
                    ? 'bg-emerald-500 text-slate-950 font-bold px-2'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title="공유 URL 복사"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>복사됨!</span>
                  </>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={onOpenShareModal}
                className="p-1.5 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-700 transition-colors"
                title="QR 코드 및 공유 옵션 보기"
              >
                <QrCode className="w-3.5 h-3.5" />
              </button>

              <a
                href={sharedUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-700 transition-colors"
                title="새 탭에서 열기"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Mobile / Compact Share Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenShareModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold hover:bg-emerald-500/30 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>공유 URL</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Tab Navigation Row */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1.5 border-t border-slate-800/80 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-4 space-y-2 bg-slate-900 border-b border-slate-800">
          {/* Mobile Share URL Display */}
          <div className="p-3 rounded-xl bg-slate-800 border border-emerald-500/30 mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-emerald-400">앱 공유 URL</span>
              <button
                onClick={handleCopyUrl}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '복사됨' : '복사'}</span>
              </button>
            </div>
            <div 
              onClick={onOpenShareModal}
              className="text-[11px] font-mono text-slate-300 break-all select-all p-2 rounded bg-slate-950/60"
            >
              {sharedUrl}
            </div>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
