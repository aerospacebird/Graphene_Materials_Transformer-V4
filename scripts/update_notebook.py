import json
import os
import shutil

nb_path = 'public/assets/aistudio/Graphene_Materials_Transformer_V4_WebDashboard_89e25792.ipynb'
with open(nb_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

SHARED_APP_URL = "https://ais-pre-fhmdywc77c7anvjmi6fi36-11187936285.asia-northeast1.run.app"

# 1. Update Cell 19 (Streamlit app creation)
updated_streamlit_code = '''# 18. Create Streamlit web dashboard
app_code = """import os, json
import pandas as pd
import numpy as np
import streamlit as st
import plotly.express as px

st.set_page_config(page_title="Graphene Materials Transformer V4", page_icon="🧪", layout="wide")
OUTPUT_DIR = "../output"
APP_DIR = "streamlit_app"

SHARED_APP_URL = "https://ais-pre-fhmdywc77c7anvjmi6fi36-11187936285.asia-northeast1.run.app"

@st.cache_data
def load_csv(path):
    return pd.read_csv(path) if os.path.exists(path) else pd.DataFrame()

@st.cache_data
def load_json(path):
    return json.load(open(path, encoding="utf-8")) if os.path.exists(path) else {}

candidates = load_csv(os.path.join(OUTPUT_DIR, "graphene_like_candidates_ranked.csv"))
embedding = load_csv(os.path.join(OUTPUT_DIR, "graphene_embedding_pca.csv"))
dft = load_csv(os.path.join(OUTPUT_DIR, "dft_validation_candidates.csv"))
materials = load_csv(os.path.join(OUTPUT_DIR, "materials_with_graphene_scores.csv"))
metadata = load_json(os.path.join(OUTPUT_DIR, "run_metadata.json"))
pca_metadata = load_json(os.path.join(OUTPUT_DIR, "pca_metadata.json"))

st.title("🧪 Graphene Materials Transformer V4")
st.markdown("**Structure-aware graphene-like material discovery dashboard**")

try:
    public_url = open(os.path.join("public_url.txt")).read().strip()
except Exception:
    public_url = None

if public_url:
    st.sidebar.markdown(f'<div style="padding:14px;border-radius:12px;background:#0f2027;color:white;text-align:center"><b>🚀 Cloudflare Tunnel</b><br><br><a href="{public_url}" target="_blank" style="display:inline-block;padding:10px 18px;background:#00d1b2;color:#002;border-radius:10px;text-decoration:none;font-weight:bold">Open Tunnel</a><br><br><span style="font-size:12px">{public_url}</span></div>', unsafe_allow_html=True)

# --- WEB 화면 좌측 하단 앱 공유 URL 추가 섹션 (Bottom-Left Sidebar Shared App URL) ---
st.sidebar.markdown("---")
st.sidebar.markdown(f\'\'\'<div style="padding:14px;border-radius:12px;background:linear-gradient(135deg,#064e3b,#0f2027);border:1px solid #10b981;color:white;text-align:center;box-shadow:0 4px 12px rgba(16,185,129,0.25)">
<span style="display:inline-block;padding:3px 8px;border-radius:6px;background:rgba(16,185,129,0.25);color:#34d399;font-size:11px;font-weight:bold;margin-bottom:6px">🟢 LIVE SHARED URL</span><br>
<b style="font-size:13px;color:#f8fafc">🌐 배포 앱 공유 URL</b><br>
<div style="margin:8px 0;padding:8px;background:#090d16;border-radius:8px;border:1px solid #1e293b;word-break:break-all;font-family:monospace;font-size:10.5px;color:#7dd3fc">
{SHARED_APP_URL}
</div>
<a href="{SHARED_APP_URL}" target="_blank" style="display:inline-block;width:100%;padding:8px 0;background:#10b981;color:#022c22;border-radius:8px;text-decoration:none;font-weight:bold;font-size:12px;margin-bottom:6px">🚀 새 창에서 열기</a>
<span style="font-size:10px;color:#94a3b8">Google Cloud Run 실시간 배포 링크</span>
</div>\'\'\', unsafe_allow_html=True)

tab1, tab2, tab3, tab4, tab5 = st.tabs(["📌 Overview", "🧲 Graphene-like Candidates", "🗺️ Embedding PCA", "🧪 DFT Candidates", "📁 Material Explorer"])

with tab1:
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Materials", f"{len(materials):,}" if not materials.empty else "N/A")
    c2.metric("Graphene-like candidates", f"{len(candidates):,}" if not candidates.empty else "N/A")
    c3.metric("DFT candidates", f"{len(dft):,}" if not dft.empty else "N/A")
    c4.metric("Best val loss", f"{metadata.get(\'best_validation_loss\', 0):.4f}" if metadata else "N/A")
    st.markdown("""```text\\nMaterials Project API → Preprocessing → Structure Features → Transformer V4 → Graphene Similarity → PCA → DFT Candidates```""")
    if os.path.exists(os.path.join(OUTPUT_DIR, "training_curve.png")):
        st.image(os.path.join(OUTPUT_DIR, "training_curve.png"), use_container_width=True)

with tab2:
    st.subheader("🧲 Graphene-like Candidate Ranking")
    if candidates.empty: st.warning("No candidate file found.")
    else:
        cols = [c for c in [\'formula\', \'similarity\', \'carbon_ratio\', \'formation_energy\', \'energy_above_hull\', \'band_gap\', \'composite_score\'] if c in candidates]
        st.dataframe(candidates.head(20)[cols], use_container_width=True, hide_index=True)
        st.download_button("⬇️ Download candidates CSV", candidates.to_csv(index=False).encode(\'utf-8-sig\'), "graphene_like_candidates_ranked.csv", "text/csv")
        if \'similarity\' in candidates and \'composite_score\' in candidates:
            fig = px.scatter(candidates.head(20), x=\'similarity\', y=\'composite_score\', hover_name=\'formula\', title=\'Graphene Similarity vs Composite Ranking Score\')
            st.plotly_chart(fig, use_container_width=True)

with tab3:
    st.subheader("🗺️ Transformer Embedding PCA")
    if embedding.empty: st.warning("No PCA file found.")
    else:
        min_sim = st.slider("Minimum cosine similarity", float(embedding[\'similarity\'].min()), float(embedding[\'similarity\'].max()), float(embedding[\'similarity\'].min()))
        filtered = embedding[embedding[\'similarity\'] >= min_sim]
        fig = px.scatter(filtered, x=\'PC1\', y=\'PC2\', color=\'similarity\', hover_name=\'formula\', color_continuous_scale=\'Viridis\', title=\'Transformer Embedding PCA: Graphene-like Material Space\')
        fig.update_traces(marker=dict(size=7, opacity=.8))
        st.plotly_chart(fig, use_container_width=True)
        st.download_button("⬇️ Download PCA CSV", embedding.to_csv(index=False).encode(\'utf-8-sig\'), "graphene_embedding_pca.csv", "text/csv")

with tab4:
    st.subheader("🧪 DFT Validation Candidates")
    if dft.empty: st.warning("No DFT candidate file found.")
    else:
        cols = [c for c in [\'material_id\', \'formula\', \'similarity\', \'graphene_structure_score\', \'carbon_fraction\', \'mean_coordination_number\', \'cc_bond_length_deviation\', \'estimated_dimensionality\', \'formation_energy\', \'energy_above_hull\', \'band_gap\', \'dft_priority_score\'] if c in dft]
        st.dataframe(dft[cols], use_container_width=True, hide_index=True)
        st.download_button("⬇️ Download DFT candidates CSV", dft.to_csv(index=False).encode(\'utf-8-sig\'), "dft_validation_candidates.csv", "text/csv")

with tab5:
    st.subheader("📁 Material Explorer")
    if materials.empty: st.warning("No material file found.")
    else:
        q = st.text_input("Search formula", placeholder="Example: C, BN, MoS2")
        filtered = materials[materials[\'formula\'].str.contains(q, case=False, na=False)] if q else materials
        st.dataframe(filtered.head(200), use_container_width=True, hide_index=True)
        st.download_button("⬇️ Download filtered materials", filtered.to_csv(index=False).encode(\'utf-8-sig\'), "filtered_materials.csv", "text/csv")

st.divider()
st.caption("Graphene Materials Transformer V4 | Materials Project data | PCA is used for interpretation and visualization only.")
"""

app_path = os.path.join(APP_DIR, 'app.py')
with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_code)
print(f'Streamlit app created with bottom-left Shared URL: {app_path}')
'''

nb['cells'][19]['source'] = [updated_streamlit_code]

# 2. Add or update the final cell with the download option
download_cell_source = '''# 25. Download Streamlit App & Updated Colab Notebook (.ipynb) with Shared App URL
import os, shutil, json

SHARED_APP_URL = "https://ais-pre-fhmdywc77c7anvjmi6fi36-11187936285.asia-northeast1.run.app"

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
    pass
'''

new_cell = {
    'cell_type': 'code',
    'execution_count': None,
    'metadata': {'id': 'download_final_cell'},
    'outputs': [],
    'source': [download_cell_source]
}

if len(nb['cells']) > 26:
    nb['cells'][-1] = new_cell
else:
    nb['cells'].append(new_cell)

with open(nb_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2, ensure_ascii=False)

print('Updated notebook saved to:', nb_path)

# Also save standalone notebook to public root
with open('public/Graphene_Materials_Transformer_V4_WebDashboard.ipynb', 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2, ensure_ascii=False)

# Standalone Streamlit app.py
clean_app_py = """import os, json
import pandas as pd
import numpy as np
import streamlit as st
import plotly.express as px

st.set_page_config(page_title="Graphene Materials Transformer V4", page_icon="🧪", layout="wide")
OUTPUT_DIR = "../output"
APP_DIR = "streamlit_app"

SHARED_APP_URL = "https://ais-pre-fhmdywc77c7anvjmi6fi36-11187936285.asia-northeast1.run.app"

@st.cache_data
def load_csv(path):
    return pd.read_csv(path) if os.path.exists(path) else pd.DataFrame()

@st.cache_data
def load_json(path):
    return json.load(open(path, encoding="utf-8")) if os.path.exists(path) else {}

candidates = load_csv(os.path.join(OUTPUT_DIR, "graphene_like_candidates_ranked.csv"))
embedding = load_csv(os.path.join(OUTPUT_DIR, "graphene_embedding_pca.csv"))
dft = load_csv(os.path.join(OUTPUT_DIR, "dft_validation_candidates.csv"))
materials = load_csv(os.path.join(OUTPUT_DIR, "materials_with_graphene_scores.csv"))
metadata = load_json(os.path.join(OUTPUT_DIR, "run_metadata.json"))
pca_metadata = load_json(os.path.join(OUTPUT_DIR, "pca_metadata.json"))

st.title("🧪 Graphene Materials Transformer V4")
st.markdown("**Structure-aware graphene-like material discovery dashboard**")

try:
    public_url = open(os.path.join("public_url.txt")).read().strip()
except Exception:
    public_url = None

if public_url:
    st.sidebar.markdown(f'<div style="padding:14px;border-radius:12px;background:#0f2027;color:white;text-align:center"><b>🚀 Cloudflare Tunnel</b><br><br><a href="{public_url}" target="_blank" style="display:inline-block;padding:10px 18px;background:#00d1b2;color:#002;border-radius:10px;text-decoration:none;font-weight:bold">Open Tunnel</a><br><br><span style="font-size:12px">{public_url}</span></div>', unsafe_allow_html=True)

# --- WEB 화면 좌측 하단 앱 공유 URL 추가 섹션 (Bottom-Left Sidebar Shared App URL) ---
st.sidebar.markdown("---")
st.sidebar.markdown(f'''<div style="padding:14px;border-radius:12px;background:linear-gradient(135deg,#064e3b,#0f2027);border:1px solid #10b981;color:white;text-align:center;box-shadow:0 4px 12px rgba(16,185,129,0.25)">
<span style="display:inline-block;padding:3px 8px;border-radius:6px;background:rgba(16,185,129,0.25);color:#34d399;font-size:11px;font-weight:bold;margin-bottom:6px">🟢 LIVE SHARED URL</span><br>
<b style="font-size:13px;color:#f8fafc">🌐 배포 앱 공유 URL</b><br>
<div style="margin:8px 0;padding:8px;background:#090d16;border-radius:8px;border:1px solid #1e293b;word-break:break-all;font-family:monospace;font-size:10.5px;color:#7dd3fc">
{SHARED_APP_URL}
</div>
<a href="{SHARED_APP_URL}" target="_blank" style="display:inline-block;width:100%;padding:8px 0;background:#10b981;color:#022c22;border-radius:8px;text-decoration:none;font-weight:bold;font-size:12px;margin-bottom:6px">🚀 새 창에서 열기</a>
<span style="font-size:10px;color:#94a3b8">Google Cloud Run 실시간 배포 링크</span>
</div>''', unsafe_allow_html=True)

tab1, tab2, tab3, tab4, tab5 = st.tabs(["📌 Overview", "🧲 Graphene-like Candidates", "🗺️ Embedding PCA", "🧪 DFT Candidates", "📁 Material Explorer"])

with tab1:
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Materials", f"{len(materials):,}" if not materials.empty else "N/A")
    c2.metric("Graphene-like candidates", f"{len(candidates):,}" if not candidates.empty else "N/A")
    c3.metric("DFT candidates", f"{len(dft):,}" if not dft.empty else "N/A")
    c4.metric("Best val loss", f"{metadata.get('best_validation_loss', 0):.4f}" if metadata else "N/A")
    st.markdown('''```text\\nMaterials Project API → Preprocessing → Structure Features → Transformer V4 → Graphene Similarity → PCA → DFT Candidates```''')
    if os.path.exists(os.path.join(OUTPUT_DIR, "training_curve.png")):
        st.image(os.path.join(OUTPUT_DIR, "training_curve.png"), use_container_width=True)

with tab2:
    st.subheader("🧲 Graphene-like Candidate Ranking")
    if candidates.empty: st.warning("No candidate file found.")
    else:
        cols = [c for c in ['formula', 'similarity', 'carbon_ratio', 'formation_energy', 'energy_above_hull', 'band_gap', 'composite_score'] if c in candidates]
        st.dataframe(candidates.head(20)[cols], use_container_width=True, hide_index=True)
        st.download_button("⬇️ Download candidates CSV", candidates.to_csv(index=False).encode('utf-8-sig'), "graphene_like_candidates_ranked.csv", "text/csv")
        if 'similarity' in candidates and 'composite_score' in candidates:
            fig = px.scatter(candidates.head(20), x='similarity', y='composite_score', hover_name='formula', title='Graphene Similarity vs Composite Ranking Score')
            st.plotly_chart(fig, use_container_width=True)

with tab3:
    st.subheader("🗺️ Transformer Embedding PCA")
    if embedding.empty: st.warning("No PCA file found.")
    else:
        min_sim = st.slider("Minimum cosine similarity", float(embedding['similarity'].min()), float(embedding['similarity'].max()), float(embedding['similarity'].min()))
        filtered = embedding[embedding['similarity'] >= min_sim]
        fig = px.scatter(filtered, x='PC1', y='PC2', color='similarity', hover_name='formula', color_continuous_scale='Viridis', title='Transformer Embedding PCA: Graphene-like Material Space')
        fig.update_traces(marker=dict(size=7, opacity=.8))
        st.plotly_chart(fig, use_container_width=True)
        st.download_button("⬇️ Download PCA CSV", embedding.to_csv(index=False).encode('utf-8-sig'), "graphene_embedding_pca.csv", "text/csv")

with tab4:
    st.subheader("🧪 DFT Validation Candidates")
    if dft.empty: st.warning("No DFT candidate file found.")
    else:
        cols = [c for c in ['material_id', 'formula', 'similarity', 'graphene_structure_score', 'carbon_fraction', 'mean_coordination_number', 'cc_bond_length_deviation', 'estimated_dimensionality', 'formation_energy', 'energy_above_hull', 'band_gap', 'dft_priority_score'] if c in dft]
        st.dataframe(dft[cols], use_container_width=True, hide_index=True)
        st.download_button("⬇️ Download DFT candidates CSV", dft.to_csv(index=False).encode('utf-8-sig'), "dft_validation_candidates.csv", "text/csv")

with tab5:
    st.subheader("📁 Material Explorer")
    if materials.empty: st.warning("No material file found.")
    else:
        q = st.text_input("Search formula", placeholder="Example: C, BN, MoS2")
        filtered = materials[materials['formula'].str.contains(q, case=False, na=False)] if q else materials
        st.dataframe(filtered.head(200), use_container_width=True, hide_index=True)
        st.download_button("⬇️ Download filtered materials", filtered.to_csv(index=False).encode('utf-8-sig'), "filtered_materials.csv", "text/csv")

st.divider()
st.caption("Graphene Materials Transformer V4 | Materials Project data | PCA is used for interpretation and visualization only.")
"""

with open('public/app.py', 'w', encoding='utf-8') as f:
    f.write(clean_app_py)

with open('public/data/streamlit_app.py', 'w', encoding='utf-8') as f:
    f.write(clean_app_py)

print('Generated standalone files: public/Graphene_Materials_Transformer_V4_WebDashboard.ipynb, public/app.py, and public/data/streamlit_app.py')
