import streamlit as st
import pickle
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from nltk.stem.porter import PorterStemmer
import requests

# ── Config ─────────────────────────────────────────────────────────────────────
TMDB_API_KEY  = "f1c323decd3cf277ae5aef408b4ebe54"
TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w500"
TMDB_SEARCH   = "https://api.themoviedb.org/3/search/movie"
PLACEHOLDER   = "https://placehold.co/500x750/1a1a2e/ffffff?text=No+Poster"

st.set_page_config(page_title="FLIXORA", page_icon="🎬",
                   layout="wide", initial_sidebar_state="collapsed")

# ── CSS ────────────────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Outfit:wght@300;400;500;600&display=swap');
html, body, .stApp { background:#0f0f1a; font-family:'Outfit',sans-serif; color:#e8e8f0; }
#MainMenu, footer, header { visibility:hidden; }
.block-container { padding:0 2rem 4rem !important; max-width:1300px !important; }
.hero { text-align:center; padding:52px 0 28px; }
.hero-badge {
    display:inline-block; background:linear-gradient(135deg,#667eea,#764ba2);
    color:#fff; font-size:11px; font-weight:700; letter-spacing:3px;
    text-transform:uppercase; padding:6px 18px; border-radius:20px; margin-bottom:20px;
}
.hero-title {
    font-family:'Nunito',sans-serif; font-size:clamp(52px,9vw,96px);
    font-weight:900; line-height:1; margin:0 0 14px;
    background:linear-gradient(135deg,#f093fb 0%,#f5576c 25%,#fda085 50%,#f6d365 75%,#96fbc4 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.hero-sub { color:#8888aa; font-size:16px; font-weight:300; }
.stats-row { display:flex; justify-content:center; gap:20px; margin:24px auto; max-width:500px; }
.stat-pill {
    background:linear-gradient(135deg,#1a1a35,#252545); border:1px solid #333366;
    border-radius:16px; padding:14px 28px; text-align:center; flex:1;
}
.stat-num {
    font-family:'Nunito',sans-serif; font-size:24px; font-weight:900;
    background:linear-gradient(135deg,#667eea,#f093fb);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.stat-lbl { font-size:11px; color:#666688; letter-spacing:1px; text-transform:uppercase; margin-top:2px; }
.stTextInput > div > div > input {
    background:#16162a !important; border:2px solid #2a2a4a !important;
    border-radius:16px !important; color:#e8e8f0 !important;
    font-family:'Outfit',sans-serif !important; font-size:17px !important;
    padding:18px 24px !important; caret-color:#f093fb !important;
}
.stTextInput > div > div > input:focus {
    border-color:#667eea !important; box-shadow:0 0 0 3px #667eea22 !important;
}
.stTextInput > div > div > input::placeholder { color:#44446a !important; }
.stTextInput label { display:none !important; }
.stSelectbox > div > div {
    background:#16162a !important; border:2px solid #2a2a4a !important;
    border-radius:12px !important; color:#e8e8f0 !important;
}
.stSelectbox label { color:#8888aa !important; font-size:13px !important; font-weight:600 !important; }
.stButton > button {
    background:#16162a !important; border:2px solid #2a2a4a !important;
    border-radius:24px !important; color:#aaaacc !important;
    font-family:'Outfit',sans-serif !important; font-size:13px !important;
    font-weight:600 !important; padding:8px 4px !important; transition:all 0.15s !important;
}
.stButton > button:hover {
    border-color:#667eea !important; color:#fff !important;
    background:linear-gradient(135deg,#667eea22,#f093fb22) !important;
    transform:translateY(-1px) !important;
}
.result-header {
    display:flex; align-items:center; justify-content:space-between;
    margin:20px 0 16px; padding-bottom:14px; border-bottom:1px solid #2a2a4a;
}
.result-query {
    font-family:'Nunito',sans-serif; font-size:22px; font-weight:800;
    background:linear-gradient(135deg,#f093fb,#f5576c);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
}
.result-count { font-size:13px; color:#55557a; }
.movie-card {
    background:linear-gradient(160deg,#16162e,#1a1a35); border:1px solid #2a2a4a;
    border-radius:20px; overflow:hidden; margin-bottom:20px;
    transition:transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.movie-card:hover { transform:translateY(-4px); border-color:#667eea66; box-shadow:0 12px 40px #667eea22; }
.movie-card img { width:100%; aspect-ratio:2/3; object-fit:cover; display:block; }
.card-body { padding:16px; }
.card-title { font-family:'Nunito',sans-serif; font-size:15px; font-weight:800; color:#e8e8f8; line-height:1.3; margin-bottom:10px; }
.card-meta { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; }
.badge { font-size:11px; font-weight:700; padding:3px 9px; border-radius:8px; }
.badge-star { background:#2a2000; color:#ffd700; border:1px solid #ffd70033; }
.badge-match { background:#002a1a; color:#00e676; border:1px solid #00e67633; }
.badge-year { background:#1a1a35; color:#8888cc; border:1px solid #33336633; }
.card-overview { font-size:12px; color:#66668a; line-height:1.6; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
.score-bar-wrap { margin-top:12px; }
.score-bar-label { font-size:10px; color:#44446a; margin-bottom:5px; }
.score-bar-bg { background:#1a1a35; border-radius:4px; height:4px; overflow:hidden; }
.score-bar-fill { height:100%; border-radius:4px; background:linear-gradient(90deg,#667eea,#f093fb); }
.empty-state { text-align:center; padding:80px 0; color:#33334a; }
.empty-icon { font-size:56px; margin-bottom:16px; opacity:0.4; }
.empty-text { font-size:15px; font-weight:300; }
.stSlider label { color:#8888aa !important; font-size:13px !important; }
.footer { text-align:center; margin-top:60px; padding-top:24px; border-top:1px solid #1e1e35; color:#333355; font-size:12px; letter-spacing:1px; }
</style>
""", unsafe_allow_html=True)

# ── STEP 1: Init PorterStemmer FIRST before anything else ─────────────────────
ps = PorterStemmer()   # ← must be before load_models and search functions

# ── STEP 2: Load models ────────────────────────────────────────────────────────
@st.cache_resource
def load_models():
    with open('movie_list.pkl', 'rb') as f:
        new_df = pickle.load(f)
    with open('tfidf.pkl', 'rb') as f:
        tfidf = pickle.load(f)
    with open('vectors.pkl', 'rb') as f:
        vectors = pickle.load(f)
    return new_df, tfidf, vectors

new_df, tfidf, vectors = load_models()

# ── STEP 3: Search functions — EXACT copy from your notebook ──────────────────
def search_movies(query, top_n=10):
    query = query.replace('-', ' ').replace('_', ' ')
    stemmed_query = " ".join([ps.stem(w) for w in query.lower().split()])
    query_vec = tfidf.transform([stemmed_query])
    scores = cosine_similarity(query_vec, vectors).flatten()
    top_indices = np.argsort(scores)[::-1][:top_n]
    results = []
    for idx in top_indices:
        if scores[idx] > 0:
            results.append({
                'title': new_df.iloc[idx]['title'],
                'score': round(float(scores[idx]), 4)
            })
    return results

def search_movies_ranked(query, top_n=10):
    query = query.replace('-', ' ').replace('_', ' ')
    stemmed_query = " ".join([ps.stem(w) for w in query.lower().split()])
    query_vec = tfidf.transform([stemmed_query])
    scores = cosine_similarity(query_vec, vectors).flatten()
    top_indices = np.argsort(scores)[::-1][:50]
    results = []
    for idx in top_indices:
        if scores[idx] > 0:
            row = new_df.iloc[idx]
            vote = row['vote_average'] if pd.notna(row.get('vote_average')) else 5.0
            combined = 0.7 * scores[idx] + 0.3 * (vote / 10)
            results.append({
                'title':      row['title'],
                'similarity': round(float(scores[idx]), 4),
                'rating':     float(vote),
                'score':      round(float(combined), 4)
            })
    results.sort(key=lambda x: x['score'], reverse=True)
    return results[:top_n]

# ── TMDB fetcher ───────────────────────────────────────────────────────────────
@st.cache_data(show_spinner=False)
def fetch_movie_details(title):
    try:
        r = requests.get(TMDB_SEARCH, params={
            "api_key": TMDB_API_KEY, "query": title,
            "language": "en-US", "page": 1
        }, timeout=5)
        results = r.json().get("results", [])
        if results:
            m        = results[0]
            poster   = f"{TMDB_IMG_BASE}{m['poster_path']}" if m.get("poster_path") else PLACEHOLDER
            year     = m.get("release_date", "")[:4] or "N/A"
            overview = m.get("overview") or "No overview available."
            return poster, year, overview
    except Exception:
        pass
    return PLACEHOLDER, "N/A", "No overview available."

# ── Session state ──────────────────────────────────────────────────────────────
if 'search_query' not in st.session_state:
    st.session_state.search_query = ''
if 'selected_movie' not in st.session_state:
    st.session_state.selected_movie = None

# ── Movie detail modal ─────────────────────────────────────────────────────────
@st.dialog("🎬 Movie Details", width="medium")
def show_movie_modal(movie_data):
    title    = movie_data['title']
    poster   = movie_data['poster']
    year     = movie_data['year']
    overview = movie_data['overview']
    rating   = movie_data['rating']
    match    = movie_data['match_pct']

    # Override dialog background to #CA5995
    st.markdown("""
    <style>
    div[data-testid="stDialog"] > div > div {
        background-color: #4b4453 !important;
        color: #ffffff !important;
    }
    div[data-testid="stDialog"] p,
    div[data-testid="stDialog"] h1,
    div[data-testid="stDialog"] h2,
    div[data-testid="stDialog"] h3,
    div[data-testid="stDialog"] span,
    div[data-testid="stDialog"] label {
        color: #ffffff !important;
    }
    </style>
    """, unsafe_allow_html=True)

    col_img, col_info = st.columns([1, 2])
    with col_img:
        st.image(poster, use_container_width=True)
    with col_info:
        st.markdown(f"""
        <div style="padding:8px 0;">
            <h2 style="font-family:'Nunito',sans-serif;font-size:24px;font-weight:900;
                       color:#ffffff;margin:0 0 12px;">{title}</h2>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
                <span style="background:rgba(0,0,0,0.25);color:#fff;
                             font-size:12px;font-weight:700;padding:4px 10px;border-radius:8px;">
                    ⭐ {rating}
                </span>
                <span style="background:rgba(0,0,0,0.25);color:#fff;
                             font-size:12px;font-weight:700;padding:4px 10px;border-radius:8px;">
                    Match {match}%
                </span>
                <span style="background:rgba(0,0,0,0.25);color:#fff;
                             font-size:12px;font-weight:700;padding:4px 10px;border-radius:8px;">
                    📅 {year}
                </span>
            </div>
            <p style="color:rgba(255,255,255,0.75);font-size:12px;font-weight:700;
                      letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">Overview</p>
            <p style="color:#ffffff;font-size:14px;line-height:1.75;margin:0;">{overview}</p>
        </div>
        """, unsafe_allow_html=True)

# ── Hero ───────────────────────────────────────────────────────────────────────
st.markdown("""
<div class="hero">
    <h1 class="hero-title">FLIXORA</h1>
    <p class="hero-sub">Discover your next favourite film by genre, mood, or keyword</p>
</div>
""", unsafe_allow_html=True)

# ── Stats ──────────────────────────────────────────────────────────────────────
st.markdown(f"""
<div class="stats-row">
    <div class="stat-pill"><div class="stat-num">{len(new_df):,}</div><div class="stat-lbl">Movies</div></div>
    <div class="stat-pill"><div class="stat-num">TF-IDF</div><div class="stat-lbl">Engine</div></div>
    <div class="stat-pill"><div class="stat-num">5K</div><div class="stat-lbl">Features</div></div>
</div>
""", unsafe_allow_html=True)

# ── Mode selector ──────────────────────────────────────────────────────────────
_, col_mode, _ = st.columns([1, 2, 1])
with col_mode:
    mode = st.selectbox(
        "Search Mode",
        ["🔍  Keyword Match", "⭐  Keyword + Rating Boost"],
        index=0
    )

# ── Genre chips ────────────────────────────────────────────────────────────────
genres = [
    ("🚀", "Sci-Fi"), ("💘", "Romance"), ("💥", "Action"),
    ("😂", "Comedy"), ("👻", "Horror"),  ("🕵️", "Thriller"),
    ("🎭", "Drama"),  ("🧠", "Heist"),   ("🧙", "Fantasy"),
    ("🎵", "Musical"),
]
chip_cols = st.columns(len(genres))
for j, (icon, genre) in enumerate(genres):
    with chip_cols[j]:
        if st.button(f"{icon} {genre}", key=f"chip_{genre}", use_container_width=True):
            st.session_state.search_query = genre
            st.rerun()

# ── Search bar ─────────────────────────────────────────────────────────────────
_, col_m, _ = st.columns([1, 4, 1])
with col_m:
    typed = st.text_input(
        "search",
        value=st.session_state.search_query,
        placeholder="Try: sci-fi space, romantic comedy, dark thriller...",
        label_visibility="collapsed"
    )
    if typed != st.session_state.search_query:
        st.session_state.search_query = typed

# ── Results slider ─────────────────────────────────────────────────────────────
_, col_s, _ = st.columns([1, 2, 1])
with col_s:
    top_n = st.slider("Number of results", 3, 15, 9)

# ── Run search ─────────────────────────────────────────────────────────────────
active_query = st.session_state.search_query.strip()

if active_query:
    with st.spinner("Finding films..."):
        if "Rating" in mode:
            raw     = search_movies_ranked(active_query, top_n=top_n)
            results = [{
                'title':         r['title'],
                'content_score': r['similarity'],
                'rating':        r['rating'],
                'final_score':   r['score']
            } for r in raw]
        else:
            raw     = search_movies(active_query, top_n=top_n)
            # look up rating from new_df for display purposes only
            results = []
            for r in raw:
                match = new_df[new_df['title'] == r['title']]
                vote  = float(match['vote_average'].values[0]) if len(match) and 'vote_average' in new_df.columns and pd.notna(match['vote_average'].values[0]) else 0.0
                results.append({
                    'title':         r['title'],
                    'content_score': r['score'],
                    'rating':        vote,
                    'final_score':   r['score']
                })

    if not results:
        st.markdown("""
        <div class="empty-state">
            <div class="empty-icon">🎬</div>
            <div class="empty-text">No matches found — try a broader keyword</div>
        </div>
        """, unsafe_allow_html=True)
    else:
        max_score  = max(r['final_score'] for r in results) or 1.0
        mode_label = "Rating Boost" if "Rating" in mode else "Keyword Match"

        st.markdown(f"""
        <div class="result-header">
            <div class="result-query">"{active_query}"</div>
            <div class="result-count">{len(results)} films · {mode_label}</div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("""
        <style>
        .poster-img {
            width: 100%;
            aspect-ratio: 2/3;
            object-fit: cover;
            display: block;
            border-radius: 20px 20px 0 0;
            border: 1px solid #2a2a4a;
            border-bottom: none;
        }
        /* Button sits flush between poster and card info */
        .view-btn { margin: 0 !important; padding: 0 !important; }
        .view-btn > button {
            width: 100% !important;
            background: linear-gradient(135deg,#667eea,#764ba2) !important;
            border: none !important;
            border-radius: 0 !important;
            color: #ffffff !important;
            font-family: 'Outfit', sans-serif !important;
            font-size: 13px !important;
            font-weight: 700 !important;
            letter-spacing: 1px !important;
            padding: 12px 0 !important;
            margin: 0 !important;
            display: block !important;
            transition: opacity 0.2s !important;
        }
        .view-btn > button:hover {
            opacity: 0.85 !important;
            transform: none !important;
            border: none !important;
            color: #ffffff !important;
        }
        .card-body-wrap {
            background: linear-gradient(160deg,#16162e,#1a1a35);
            border: 1px solid #2a2a4a;
            border-top: none;
            border-radius: 0 0 20px 20px;
            padding: 16px;
            margin-bottom: 24px;
        }
        </style>
        """, unsafe_allow_html=True)

        cols = st.columns(3)
        for i, movie in enumerate(results):
            with cols[i % 3]:
                poster, year, overview = fetch_movie_details(movie['title'])
                score_pct = int(movie['final_score'] / max_score * 100)
                match_pct = int(movie['content_score'] * 100)
                rating    = round(movie['rating'], 1)

                movie_payload = {
                    'title':     movie['title'],
                    'poster':    poster,
                    'year':      year,
                    'overview':  overview,
                    'rating':    rating,
                    'match_pct': match_pct,
                }

                # 1. Poster
                st.markdown(f"""
                <img class="poster-img" src="{poster}" alt="{movie['title']}"
                     onerror="this.src='{PLACEHOLDER}'" />
                """, unsafe_allow_html=True)

                # 2. Button — sits right between poster and card info
                st.markdown('<div class="view-btn">', unsafe_allow_html=True)
                if st.button("🔍 VIEW FULL OVERVIEW", key=f"detail_{i}"):
                    show_movie_modal(movie_payload)
                st.markdown('</div>', unsafe_allow_html=True)

                # 3. Card info below the button
                st.markdown(f"""
                <div class="card-body-wrap">
                    <div class="card-title">{movie['title']}</div>
                    <div class="card-meta">
                        <span class="badge badge-star">⭐ {rating}</span>
                        <span class="badge badge-match">Match {match_pct}%</span>
                        <span class="badge badge-year">📅 {year}</span>
                    </div>
                    <div class="card-overview">{overview}</div>
                    <div class="score-bar-wrap">
                        <div class="score-bar-label">RELEVANCE</div>
                        <div class="score-bar-bg">
                            <div class="score-bar-fill" style="width:{score_pct}%"></div>
                        </div>
                    </div>
                </div>
                """, unsafe_allow_html=True)

else:
    st.markdown("""
    <div class="empty-state">
        <div class="empty-icon">🎬</div>
        <div class="empty-text">Click a genre above or type a keyword to discover films</div>
    </div>
    """, unsafe_allow_html=True)

# ── Footer ─────────────────────────────────────────────────────────────────────
st.markdown("""
<div class="footer">FLIXORA &nbsp;·&nbsp; TMDB 5000 DATASET &nbsp;·&nbsp; POWERED BY TF-IDF</div>
""", unsafe_allow_html=True)