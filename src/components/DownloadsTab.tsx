import React, { useState } from 'react';
import {
  Download,
  FileCode,
  Check,
  Copy,
  ExternalLink,
  Code2,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  MonitorCheck,
  Terminal
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DownloadsTabProps {
  sharedUrl: string;
}

export const DownloadsTab: React.FC<DownloadsTabProps> = ({ sharedUrl }) => {
  const [copiedCell, setCopiedCell] = useState(false);
  const [copiedSidebar, setCopiedSidebar] = useState(false);

  const finalCellCode = `# 25. Download Streamlit App & Updated Colab Notebook (.ipynb) with Shared App URL
import os, shutil, json

SHARED_APP_URL = "${sharedUrl}"

print("=" * 80)
print("[Download Options] Graphene Materials Transformer V4")
print("=" * 80)
print(f"배포 앱 공유 URL (Streamlit 좌측 하단 추가됨): {SHARED_APP_URL}")

# 1. Ensure updated Streamlit app.py exists
os.makedirs("streamlit_app", exist_ok=True)
app_py_path = "streamlit_app/app.py"
if 'app_code' in globals():
    with open(app_py_path, "w", encoding="utf-8") as f:
        f.write(app_code)
    print(f"✓ Updated {app_py_path} created successfully.")

# 2. Package all results into ZIP archive
zip_base = "/content/graphene_transformer_v4_web_results"
try:
    shutil.make_archive(
        base_name=zip_base,
        format="zip",
        root_dir="/content",
        base_dir="output"
    )
    print(f"✓ Results archive created: {zip_base}.zip")
except Exception as e:
    print(f"Note on zip creation: {e}")

# 3. Google Colab direct download options
try:
    from google.colab import files
    print("\\n[Colab File Downloads]")
    
    # Download updated Streamlit app.py
    if os.path.exists(app_py_path):
        print("-> Downloading updated Streamlit app.py (with bottom-left shared URL)...")
        files.download(app_py_path)
    
    # Download updated Colab Notebook
    notebook_name = "Graphene_Materials_Transformer_V4_WebDashboard.ipynb"
    if os.path.exists(notebook_name):
        print(f"-> Downloading updated Colab notebook {notebook_name}...")
        files.download(notebook_name)
    elif os.path.exists("/content/" + notebook_name):
        files.download("/content/" + notebook_name)
    
    # Download full results zip
    if os.path.exists(f"{zip_base}.zip"):
        print("-> Downloading complete results zip archive...")
        files.download(f"{zip_base}.zip")
        
except ImportError:
    print("Not running inside Google Colab interactive kernel. Direct file paths are available in workspace.")

# 4. Interactive HTML display
try:
    from IPython.display import display, HTML
    display(HTML(f"""
    <div style="padding:20px;border-radius:14px;background:linear-gradient(135deg,#064e3b,#0f2027);border:1px solid #10b981;color:white;font-family:Arial,sans-serif;margin-top:12px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span style="font-size:24px">📥</span>
        <div>
          <h3 style="margin:0;color:#34d399;font-size:18px">Colab 코드 & Streamlit 앱 다운로드 완료</h3>
          <p style="margin:2px 0 0 0;font-size:12px;color:#94a3b8">Streamlit WEB 화면 좌측 하단에 공유 URL이 추가된 코드 및 Colab 노트북 다운로드</p>
        </div>
      </div>
      <div style="background:#090d16;padding:12px;border-radius:10px;border:1px solid #1e293b;margin-bottom:14px">
        <span style="font-size:11px;color:#94a3b8;display:block;margin-bottom:4px">🌐 좌측 하단에 추가된 공유 URL:</span>
        <a href="{SHARED_APP_URL}" target="_blank" style="color:#38bdf8;font-family:monospace;font-size:13px;text-decoration:none;font-weight:bold;word-break:break-all">{SHARED_APP_URL}</a>
      </div>
      <a href="{SHARED_APP_URL}" target="_blank" style="display:inline-block;padding:10px 20px;background:#10b981;color:#022c22;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px">🚀 새 창에서 배포 웹 열기</a>
    </div>
    """))
except Exception:
    pass`;

  const streamlitSidebarCode = `# --- WEB 화면 좌측 하단 앱 공유 URL 추가 섹션 (Streamlit Sidebar Bottom-Left) ---
SHARED_APP_URL = "${sharedUrl}"

st.sidebar.markdown("---")
st.sidebar.markdown(f'''<div style="padding:14px;border-radius:12px;background:linear-gradient(135deg,#064e3b,#0f2027);border:1px solid #10b981;color:white;text-align:center;box-shadow:0 4px 12px rgba(16,185,129,0.25)">
<span style="display:inline-block;padding:3px 8px;border-radius:6px;background:rgba(16,185,129,0.25);color:#34d399;font-size:11px;font-weight:bold;margin-bottom:6px">🟢 LIVE SHARED URL</span><br>
<b style="font-size:13px;color:#f8fafc">🌐 배포 앱 공유 URL</b><br>
<div style="margin:8px 0;padding:8px;background:#090d16;border-radius:8px;border:1px solid #1e293b;word-break:break-all;font-family:monospace;font-size:10.5px;color:#7dd3fc">
{SHARED_APP_URL}
</div>
<a href="{SHARED_APP_URL}" target="_blank" style="display:inline-block;width:100%;padding:8px 0;background:#10b981;color:#022c22;border-radius:8px;text-decoration:none;font-weight:bold;font-size:12px;margin-bottom:6px">🚀 새 창에서 열기</a>
<span style="font-size:10px;color:#94a3b8">Google Cloud Run 실시간 배포 링크</span>
</div>''', unsafe_allow_html=True)`;

  const handleCopy = (code: string, type: 'cell' | 'sidebar') => {
    navigator.clipboard.writeText(code);
    if (type === 'cell') setCopiedCell(true);
    else setCopiedSidebar(true);
    confetti({ particleCount: 35, spread: 45 });
    setTimeout(() => {
      setCopiedCell(false);
      setCopiedSidebar(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-semibold mb-2">
            <MonitorCheck className="w-3.5 h-3.5" />
            <span>Colab 코드 업데이트 완료</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>📥 Colab 코드 & Streamlit 앱 다운로드 센터</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Streamlit WEB 화면 좌측 하단에 공유 URL이 추가된 상태로 구성된 <strong>Colab Notebook (.ipynb)</strong> 및 <strong>Streamlit app.py</strong> 다운로드 옵션
          </p>
        </div>

        {/* Live Shared URL quick link */}
        <div className="flex items-center gap-2">
          <a
            href={sharedUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <span>배포 앱 열기</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 3 Main Direct Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Colab Notebook */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-emerald-500/40 text-white shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <FileCode className="w-6 h-6" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                마지막 CELL 포함
              </span>
            </div>
            <h3 className="text-lg font-bold">Colab 노트북 (.ipynb)</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              마지막 CELL(# 25)에 Streamlit 좌측 하단 공유 URL 탑재 코드 및 다운로드 옵션이 포함된 전체 노트북 파일
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href="/Graphene_Materials_Transformer_V4_WebDashboard.ipynb"
              download="Graphene_Materials_Transformer_V4_WebDashboard.ipynb"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>노트북 다운로드 (.ipynb)</span>
            </a>
            <span className="text-[10px] text-center block text-slate-500">
              Google Colab에서 바로 열기 가능한 원본 포맷
            </span>
          </div>
        </div>

        {/* Card 2: Streamlit app.py */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/30">
                <Code2 className="w-6 h-6" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-500">
                좌측 하단 URL 포함
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Streamlit app.py</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Streamlit 사이드바 좌측 하단에 실시간 공유 URL 위젯이 적용된 단독 파이썬 실행 스크립트
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href="/app.py"
              download="app.py"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>app.py 단독 다운로드</span>
            </a>
            <span className="text-[10px] text-center block text-slate-400 font-mono">
              streamlit run app.py 명령어로 로컬 실행
            </span>
          </div>
        </div>

        {/* Card 3: Complete Results ZIP */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/30">
                <Package className="w-6 h-6" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500">
                전체 결과 통합본
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">전체 결과 ZIP 아카이브</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              수정된 Colab 노트북, Streamlit app.py, PCA 시각화 이미지, 학습 곡선, 50개 DFT 후보 CSV 전체 압축
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <a
              href="/graphene_transformer_v4_web_results.zip"
              download="graphene_transformer_v4_web_results.zip"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>통합 ZIP 패키지 다운로드</span>
            </a>
            <span className="text-[10px] text-center block text-slate-400 font-mono">
              graphene_transformer_v4_web_results.zip (426 KB)
            </span>
          </div>
        </div>
      </div>

      {/* Code Snippet Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview 1: Final Cell Download Code */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Colab 마지막 CELL (# 25) 소스 코드
              </h4>
            </div>
            <button
              onClick={() => handleCopy(finalCellCode, 'cell')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              {copiedCell ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCell ? '복사완료' : '코드 복사'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-72 overflow-y-auto">
            {finalCellCode}
          </pre>
          <span className="text-[11px] text-slate-500 block">
            *Colab에서 실행 시 `files.download()`를 통해 노트북, app.py, zip 파일이 브라우저로 자동 다운로드됩니다.
          </span>
        </div>

        {/* Preview 2: Streamlit Bottom-Left Sidebar Shared URL Code */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Streamlit 좌측 하단 공유 URL 추가 코드 (Cell # 18)
              </h4>
            </div>
            <button
              onClick={() => handleCopy(streamlitSidebarCode, 'sidebar')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              {copiedSidebar ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSidebar ? '복사완료' : '코드 복사'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-slate-950 text-cyan-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-72 overflow-y-auto">
            {streamlitSidebarCode}
          </pre>
          <span className="text-[11px] text-slate-500 block">
            *Streamlit 사이드바 좌측 하단에 고정 표시되며, 모바일 및 PC 브라우저에서 모두 원클릭 접속 가능합니다.
          </span>
        </div>
      </div>
    </div>
  );
};
