FLIXORA is a content-based movie recommendation system built using Python, Streamlit, and Machine Learning (TF-IDF + Cosine Similarity). It helps users discover movies based on keywords, genres, or mood.

Features:
1. Keyword-based search for movies
2. Advanced ranking using similarity + movie ratings
3. Genre-based quick filters (Sci-Fi, Romance, Action, etc.)
4. Relevance scoring with visual indicators
5. Movie posters, overview, and release year via TMDB API
6. Interactive UI with detailed movie pop-up view

How It Works:
1. Uses TF-IDF Vectorization to convert movie metadata into numerical form
2. Applies Cosine Similarity to find similar movies
3. Optional ranking boosts results using IMDb-style ratings

Tech Stack:
1. Frontend	- Streamlit
2. Backend - Python
3. ML Algorithm	- TF-IDF, Cosine Similarity
4. Libraries - Pandas, NumPy, Scikit-learn, NLTK
5. API - TMDB API
