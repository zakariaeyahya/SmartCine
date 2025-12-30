"""
Script de nettoyage des données TMDB pour le projet de recommandation de films
Fusionne movies_metadata.csv et credits.csv pour créer films_clean.csv
"""

import logging
import pandas as pd
import ast
import json
from pathlib import Path

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/clean_data.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Configuration
MAX_ACTORS = 5  # Nombre max d'acteurs à garder par film
MAX_FILMS = 100  # Nombre de films à garder (pour le projet)


def safe_parse_json(x):
    """Parse une chaîne JSON de manière sécurisée"""
    if pd.isna(x) or x == '' or x == '[]':
        return []
    try:
        return ast.literal_eval(x)
    except Exception:
        try:
            return json.loads(x.replace("'", '"'))
        except Exception:
            return []


def extract_names(json_list, key='name', max_items=None):
    """Extrait les noms d'une liste JSON"""
    if not isinstance(json_list, list):
        json_list = safe_parse_json(json_list)
    names = [item.get(key, '') for item in json_list if isinstance(item, dict)]
    if max_items:
        names = names[:max_items]
    return '; '.join(names) if names else ''


def extract_director(crew_list):
    """Extrait le réalisateur de la liste crew"""
    if not isinstance(crew_list, list):
        crew_list = safe_parse_json(crew_list)
    for member in crew_list:
        if isinstance(member, dict) and member.get('job') == 'Director':
            return member.get('name', '')
    return ''


def extract_genres(genres_str):
    """Extrait les genres"""
    genres_list = safe_parse_json(genres_str)
    return '; '.join([g.get('name', '') for g in genres_list if isinstance(g, dict)])


def extract_year(date_str):
    """Extrait l'année de la date de sortie"""
    if pd.isna(date_str) or date_str == '':
        return ''
    try:
        return str(date_str)[:4]
    except Exception:
        return ''


def main():
    # Créer le dossier logs si nécessaire
    Path('logs').mkdir(exist_ok=True)

    logger.info("=" * 60)
    logger.info("Nettoyage des données TMDB pour le projet de recommandation")
    logger.info("=" * 60)

    # Charger les données
    logger.info("[1/5] Chargement des fichiers CSV...")

    try:
        movies_df = pd.read_csv('movies_metadata.csv', low_memory=False)
        credits_df = pd.read_csv('credits.csv')
    except FileNotFoundError as e:
        logger.error(f"Fichier non trouvé: {e}")
        return None

    logger.info(f"   - movies_metadata.csv: {len(movies_df)} films")
    logger.info(f"   - credits.csv: {len(credits_df)} entrées")

    # Nettoyer les IDs pour la fusion
    logger.info("[2/5] Nettoyage des IDs...")
    movies_df['id'] = pd.to_numeric(movies_df['id'], errors='coerce')
    movies_df = movies_df.dropna(subset=['id'])
    movies_df['id'] = movies_df['id'].astype(int)

    # Fusionner les DataFrames
    logger.info("[3/5] Fusion des données...")
    merged_df = movies_df.merge(credits_df, on='id', how='inner')
    logger.info(f"   - Films avec crédits: {len(merged_df)}")

    # Filtrer les films valides (avec titre, durée, date)
    logger.info("[4/5] Filtrage et extraction des données...")
    merged_df = merged_df[
        (merged_df['title'].notna()) &
        (merged_df['runtime'].notna()) &
        (merged_df['runtime'] > 0) &
        (merged_df['release_date'].notna()) &
        (merged_df['vote_count'] > 100)  # Films populaires uniquement
    ]

    # Trier par popularité et prendre les top films
    merged_df = merged_df.sort_values('popularity', ascending=False).head(MAX_FILMS)

    # Créer le DataFrame nettoyé
    logger.info(f"   - Extraction de {len(merged_df)} films...")

    clean_data = []
    for idx, row in merged_df.iterrows():
        actors = extract_names(row['cast'], 'name', MAX_ACTORS)
        director = extract_director(row['crew'])
        genres = extract_genres(row['genres'])
        year = extract_year(row['release_date'])

        if actors and director and genres:  # Garder seulement les films complets
            # Construire l'URL du poster TMDB
            poster_path = row.get('poster_path', '')
            poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}" if pd.notna(poster_path) and poster_path else ''

            clean_data.append({
                'Film': row['title'],
                'Acteurs': actors,
                'Realisateur': director,
                'Genre': genres,
                'Annee': year,
                'Duree': int(row['runtime']) if pd.notna(row['runtime']) else 0,
                'Poster': poster_url
            })

    # Créer le DataFrame final
    clean_df = pd.DataFrame(clean_data)

    # Sauvegarder
    logger.info("[5/5] Sauvegarde...")
    clean_df.to_csv('films_clean.csv', index=False, encoding='utf-8')
    logger.info(f"   - Fichier sauvegardé: films_clean.csv ({len(clean_df)} films)")

    # Statistiques
    logger.info("=" * 60)
    logger.info("STATISTIQUES")
    logger.info("=" * 60)
    logger.info(f"Nombre total de films: {len(clean_df)}")
    logger.info(f"Genres uniques: {clean_df['Genre'].str.split('; ').explode().nunique()}")
    logger.info(f"Réalisateurs uniques: {clean_df['Realisateur'].nunique()}")
    logger.info(f"Période: {clean_df['Annee'].min()} - {clean_df['Annee'].max()}")

    logger.info("Nettoyage terminé avec succès!")
    return clean_df


if __name__ == "__main__":
    main()
