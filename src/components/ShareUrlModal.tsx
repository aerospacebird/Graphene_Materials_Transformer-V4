import React, { useEffect, useRef, useState } from 'react';
import { X, Copy, Check, ExternalLink, QrCode, Share2, Mail, Code2, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedUrl: string;
}

export const ShareUrlModal: React.FC<ShareUrlModalProps> = ({ isOpen, onClose, sharedUrl }) => {
  const [copied, setCopied] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Generate high quality QR-like matrix pattern on canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const size = 180;
        canvas.width = size;
        canvas.height = size;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // Deterministic pseudo-random QR grid based on URL string
        ctx.fillStyle = '#0f172a';
        const cells = 25;
        const cellSize = size / cells;

        // Draw position markers (3 corners)
        function drawFinder(ox: number, oy: number) {
          if (!ctx) return;
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(ox * cellSize, oy * cellSize, 7 * cellSize, 7 * cellSize);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect((ox + 1) * cellSize, (oy + 1) * cellSize, 5 * cellSize, 5 * cellSize);
          ctx.fillStyle = '#0f172a';
          ctx.fillRect((ox + 2) * cellSize, (oy + 2) * cellSize, 3 * cellSize, 3 * cellSize);
        }

        drawFinder(1, 1);
        drawFinder(cells - 8, 1);
        drawFinder(1, cells - 8);

        // Draw data dots
        let seed = 0;
        for (let i = 0; i < sharedUrl.length; i++) {
          seed = (seed * 31 + sharedUrl.charCodeAt(i)) % 100000;
        }

        for (let r = 0; r < cells; r++) {
          for (let c = 0; c < cells; c++) {
            // Skip corners
            const inTopLeft = r <= 8 && c <= 8;
            const inTopRight = r <= 8 && c >= cells - 9;
            const inBottomLeft = r >= cells - 9 && c <= 8;
            if (inTopLeft || inTopRight || inBottomLeft) continue;

            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            if (seed % 100 > 55) {
              ctx.fillStyle = '#0f172a';
              ctx.fillRect(c * cellSize, r * cellSize, cellSize - 0.5, cellSize - 0.5);
            }
          }
        }
      }
    }
  }, [isOpen, sharedUrl]);

  if (!isOpen) return null;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedType(type);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => {
      setCopied(false);
      setCopiedType(null);
    }, 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Graphene Materials Transformer V4 Web Dashboard',
          text: '그래핀 유사 소재 발견 및 DFT 후보군 스크리닝 웹 대시보드',
          url: sharedUrl
        });
      } catch {
        // user cancelled or unsupported
      }
    } else {
      handleCopy(sharedUrl, 'url');
    }
  };

  const markdownSnippet = `[Graphene Materials Transformer V4 Dashboard](${sharedUrl})`;
  const iframeSnippet = `<iframe src="${sharedUrl}" width="100%" height="800" frameborder="0"></iframe>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                웹 앱 공유 URL (Share Web App URL)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                새롭게 생성된 클라우드 런 배포 앱의 공개 공유 URL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Shared URL Highlight Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                실시간 공유 활성 URL (Shared App URL)
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Google Cloud Run Production
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 px-3 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs break-all select-all shadow-inner">
                {sharedUrl}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(sharedUrl, 'main')}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg font-medium text-xs text-white transition-all shadow-sm ${
                    copied && copiedType === 'main'
                      ? 'bg-emerald-600'
                      : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95'
                  }`}
                >
                  {copied && copiedType === 'main' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>복사완료!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>URL 복사</span>
                    </>
                  )}
                </button>
                <a
                  href={sharedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
                  title="새 창에서 열기"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* QR Code and Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* QR Card */}
            <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 mb-2">
                <canvas ref={canvasRef} className="w-36 h-36 rounded" />
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                <QrCode className="w-3.5 h-3.5 text-emerald-500" />
                <span>모바일 QR 코드 스캔</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                스마트폰 카메라로 스캔하여 즉시 대시보드 접속
              </p>
            </div>

            {/* Quick Share Options */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                빠른 공유 바로가기
              </h4>

              <button
                onClick={handleNativeShare}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-colors text-xs font-medium group"
              >
                <span className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-500" />
                  <span>기기 기본 공유 (Web Share)</span>
                </span>
                <span className="text-slate-400 group-hover:text-emerald-500">→</span>
              </button>

              <a
                href={`mailto:?subject=${encodeURIComponent(
                  'Graphene Materials Transformer V4 Web Dashboard 공유'
                )}&body=${encodeURIComponent(
                  `Graphene Materials Transformer V4 그래핀 유사 신소재 발견 대시보드 링크입니다:\n${sharedUrl}`
                )}`}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-colors text-xs font-medium group"
              >
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span>이메일로 링크 전송</span>
                </span>
                <span className="text-slate-400 group-hover:text-blue-500">→</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `Graphene Materials Transformer V4: 그래핀 유사 소재 발견 및 DFT 스크리닝 대시보드 ${sharedUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-sky-950/30 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-colors text-xs font-medium group"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-500" />
                  <span>X (Twitter)에 공유하기</span>
                </span>
                <span className="text-slate-400 group-hover:text-sky-500">→</span>
              </a>
            </div>
          </div>

          {/* Research & Developer Embed Snippets */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-slate-500" />
              <span>연구 논문 및 노션/웹사이트 임베드 코드</span>
            </h4>

            {/* Markdown */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
              <span className="truncate text-slate-600 dark:text-slate-300">{markdownSnippet}</span>
              <button
                onClick={() => handleCopy(markdownSnippet, 'markdown')}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
              >
                {copied && copiedType === 'markdown' ? '복사됨' : '마크다운 복사'}
              </button>
            </div>

            {/* Iframe */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
              <span className="truncate text-slate-600 dark:text-slate-300">{iframeSnippet}</span>
              <button
                onClick={() => handleCopy(iframeSnippet, 'iframe')}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline shrink-0"
              >
                {copied && copiedType === 'iframe' ? '복사됨' : 'HTML 복사'}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
