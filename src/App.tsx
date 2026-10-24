/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, TabId } from './components/Navbar';
import { ShareUrlModal } from './components/ShareUrlModal';
import { OverviewTab } from './components/OverviewTab';
import { CandidatesTab } from './components/CandidatesTab';
import { PcaTab } from './components/PcaTab';
import { DftTab } from './components/DftTab';
import { PredictorTab } from './components/PredictorTab';
import { Crystal3DViewer } from './components/Crystal3DViewer';
import { ExplorerTab } from './components/ExplorerTab';
import { DownloadsTab } from './components/DownloadsTab';
import { ExternalLink, Share2, Sparkles, Heart } from 'lucide-react';

const SHARED_APP_URL = 'https://ais-pre-fhmdywc77c7anvjmi6fi36-11187936285.asia-northeast1.run.app';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [selectedFormulaForPrediction, setSelectedFormulaForPrediction] = useState<string>('Al2(CN2)3');

  const handleSelectCandidateForPrediction = (formula: string) => {
    setSelectedFormulaForPrediction(formula);
    setActiveTab('predictor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar with live Share App URL Display */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sharedUrl={SHARED_APP_URL}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            onNavigateTab={setActiveTab}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}

        {activeTab === 'candidates' && (
          <CandidatesTab
            onSelectCandidateForPrediction={handleSelectCandidateForPrediction}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'pca' && (
          <PcaTab
            onSelectCandidateForPrediction={handleSelectCandidateForPrediction}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'dft' && (
          <DftTab
            onSelectCandidateForPrediction={handleSelectCandidateForPrediction}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'predictor' && (
          <PredictorTab
            initialFormula={selectedFormulaForPrediction}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'crystal3d' && <Crystal3DViewer />}

        {activeTab === 'explorer' && (
          <ExplorerTab
            onSelectCandidateForPrediction={handleSelectCandidateForPrediction}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'downloads' && (
          <DownloadsTab sharedUrl={SHARED_APP_URL} />
        )}
      </main>

      {/* Shared App URL Floating Quick Action (Mobile/Tablet Friendly) */}
      <aside aria-label="Quick Share Widget" className="fixed bottom-6 right-6 z-30 flex items-center gap-2">
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all active:scale-95 group"
        >
          <Share2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
          <span>앱 공유하기 (Share URL)</span>
        </button>
      </aside>

      {/* Share URL Modal with QR Code, Clipboard, and Social Links */}
      <ShareUrlModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        sharedUrl={SHARED_APP_URL}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">Graphene Materials Transformer V4</span>
            <span className="text-slate-600">•</span>
            <span>Materials Project API & Pymatgen & PyTorch</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a
              href={SHARED_APP_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <span>배포된 공유 앱 링크</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              QR 코드 스캔
            </button>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500">aerospacebird@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
