"""
Script de création de l'ontologie OWL pour le projet de recommandation de films
Génère films.ttl à partir de films_clean.csv
"""

import logging
from pathlib import Path
from rdflib import Graph, Namespace, Literal, RDF, RDFS, OWL, XSD
import pandas as pd
import re

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/create_ontology.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Définition des namespaces
NS = Namespace("http://example.org/film#")
SCHEMA = Namespace("http://schema.org/")


def clean_uri(name):
    """Nettoie un nom pour en faire une URI valide"""
    if pd.isna(name) or name == '':
        return None
    # Supprimer les caractères spéciaux et remplacer les espaces
    clean = re.sub(r'[^\w\s-]', '', str(name))
    clean = re.sub(r'\s+', '_', clean.strip())
    return clean


def create_ontology():
    """Crée l'ontologie OWL avec les classes et propriétés"""
    g = Graph()

    # Bind des préfixes pour un TTL plus lisible
    g.bind("ns", NS)
    g.bind("schema", SCHEMA)
    g.bind("owl", OWL)
    g.bind("rdfs", RDFS)
    g.bind("xsd", XSD)

    # ============================================
    # DÉFINITION DES CLASSES
    # ============================================

    # Classe Film
    g.add((NS.Film, RDF.type, OWL.Class))
    g.add((NS.Film, RDFS.label, Literal("Film", lang="fr")))
    g.add((NS.Film, RDFS.comment, Literal("Un film cinématographique", lang="fr")))

    # Classe Acteur
    g.add((NS.Acteur, RDF.type, OWL.Class))
    g.add((NS.Acteur, RDFS.label, Literal("Acteur", lang="fr")))
    g.add((NS.Acteur, RDFS.comment, Literal("Une personne jouant dans un film", lang="fr")))

    # Classe Realisateur
    g.add((NS.Realisateur, RDF.type, OWL.Class))
    g.add((NS.Realisateur, RDFS.label, Literal("Réalisateur", lang="fr")))
    g.add((NS.Realisateur, RDFS.comment, Literal("La personne qui réalise un film", lang="fr")))

    # Classe Genre
    g.add((NS.Genre, RDF.type, OWL.Class))
    g.add((NS.Genre, RDFS.label, Literal("Genre", lang="fr")))
    g.add((NS.Genre, RDFS.comment, Literal("Le genre cinématographique d'un film", lang="fr")))

    # ============================================
    # DÉFINITION DES PROPRIÉTÉS OBJET
    # ============================================

    # hasActor - Film -> Acteur
    g.add((NS.hasActor, RDF.type, OWL.ObjectProperty))
    g.add((NS.hasActor, RDFS.label, Literal("a pour acteur", lang="fr")))
    g.add((NS.hasActor, RDFS.domain, NS.Film))
    g.add((NS.hasActor, RDFS.range, NS.Acteur))

    # directedBy - Film -> Realisateur
    g.add((NS.directedBy, RDF.type, OWL.ObjectProperty))
    g.add((NS.directedBy, RDFS.label, Literal("réalisé par", lang="fr")))
    g.add((NS.directedBy, RDFS.domain, NS.Film))
    g.add((NS.directedBy, RDFS.range, NS.Realisateur))

    # hasGenre - Film -> Genre
    g.add((NS.hasGenre, RDF.type, OWL.ObjectProperty))
    g.add((NS.hasGenre, RDFS.label, Literal("a pour genre", lang="fr")))
    g.add((NS.hasGenre, RDFS.domain, NS.Film))
    g.add((NS.hasGenre, RDFS.range, NS.Genre))

    # ============================================
    # DÉFINITION DES PROPRIÉTÉS DE DONNÉES
    # ============================================

    # titre
    g.add((NS.titre, RDF.type, OWL.DatatypeProperty))
    g.add((NS.titre, RDFS.label, Literal("titre", lang="fr")))
    g.add((NS.titre, RDFS.domain, NS.Film))
    g.add((NS.titre, RDFS.range, XSD.string))

    # nom (pour Acteur, Realisateur, Genre)
    g.add((NS.nom, RDF.type, OWL.DatatypeProperty))
    g.add((NS.nom, RDFS.label, Literal("nom", lang="fr")))
    g.add((NS.nom, RDFS.range, XSD.string))

    # releaseYear
    g.add((NS.releaseYear, RDF.type, OWL.DatatypeProperty))
    g.add((NS.releaseYear, RDFS.label, Literal("année de sortie", lang="fr")))
    g.add((NS.releaseYear, RDFS.domain, NS.Film))
    g.add((NS.releaseYear, RDFS.range, XSD.integer))

    # duration
    g.add((NS.duration, RDF.type, OWL.DatatypeProperty))
    g.add((NS.duration, RDFS.label, Literal("durée en minutes", lang="fr")))
    g.add((NS.duration, RDFS.domain, NS.Film))
    g.add((NS.duration, RDFS.range, XSD.integer))

    logger.info("Structure de l'ontologie créée")
    logger.info("   - Classes: Film, Acteur, Realisateur, Genre")
    logger.info("   - Propriétés objet: hasActor, directedBy, hasGenre")
    logger.info("   - Propriétés de données: titre, nom, releaseYear, duration")

    return g


def populate_ontology(g, csv_file='films_clean.csv'):
    """Peuple l'ontologie avec les données du CSV"""

    logger.info(f"Chargement de {csv_file}...")

    try:
        df = pd.read_csv(csv_file)
    except FileNotFoundError:
        logger.error(f"Fichier {csv_file} non trouvé")
        return g

    logger.info(f"   - {len(df)} films à traiter")

    # Sets pour éviter les doublons
    actors_added = set()
    directors_added = set()
    genres_added = set()

    logger.info("Création des individus...")

    for idx, row in df.iterrows():
        # ============================================
        # CRÉATION DU FILM
        # ============================================
        film_uri_name = clean_uri(row['Film'])
        if not film_uri_name:
            continue

        film_uri = NS[f"Film_{film_uri_name}"]

        # Type et titre
        g.add((film_uri, RDF.type, NS.Film))
        g.add((film_uri, NS.titre, Literal(row['Film'], datatype=XSD.string)))

        # Année
        if pd.notna(row['Annee']) and str(row['Annee']).isdigit():
            g.add((film_uri, NS.releaseYear, Literal(int(row['Annee']), datatype=XSD.integer)))

        # Durée
        if pd.notna(row['Duree']) and row['Duree'] > 0:
            g.add((film_uri, NS.duration, Literal(int(row['Duree']), datatype=XSD.integer)))

        # ============================================
        # CRÉATION DU RÉALISATEUR
        # ============================================
        director_name = row['Realisateur']
        if pd.notna(director_name) and director_name:
            director_uri_name = clean_uri(director_name)
            if director_uri_name:
                director_uri = NS[f"Realisateur_{director_uri_name}"]

                if director_uri_name not in directors_added:
                    g.add((director_uri, RDF.type, NS.Realisateur))
                    g.add((director_uri, NS.nom, Literal(director_name, datatype=XSD.string)))
                    directors_added.add(director_uri_name)

                g.add((film_uri, NS.directedBy, director_uri))

        # ============================================
        # CRÉATION DES ACTEURS
        # ============================================
        if pd.notna(row['Acteurs']):
            actors = [a.strip() for a in str(row['Acteurs']).split(';')]
            for actor_name in actors:
                if actor_name:
                    actor_uri_name = clean_uri(actor_name)
                    if actor_uri_name:
                        actor_uri = NS[f"Acteur_{actor_uri_name}"]

                        if actor_uri_name not in actors_added:
                            g.add((actor_uri, RDF.type, NS.Acteur))
                            g.add((actor_uri, NS.nom, Literal(actor_name, datatype=XSD.string)))
                            actors_added.add(actor_uri_name)

                        g.add((film_uri, NS.hasActor, actor_uri))

        # ============================================
        # CRÉATION DES GENRES
        # ============================================
        if pd.notna(row['Genre']):
            genres = [g_name.strip() for g_name in str(row['Genre']).split(';')]
            for genre_name in genres:
                if genre_name:
                    genre_uri_name = clean_uri(genre_name)
                    if genre_uri_name:
                        genre_uri = NS[f"Genre_{genre_uri_name}"]

                        if genre_uri_name not in genres_added:
                            g.add((genre_uri, RDF.type, NS.Genre))
                            g.add((genre_uri, NS.nom, Literal(genre_name, datatype=XSD.string)))
                            genres_added.add(genre_uri_name)

                        g.add((film_uri, NS.hasGenre, genre_uri))

    logger.info(f"   - Films: {len(df)}")
    logger.info(f"   - Acteurs: {len(actors_added)}")
    logger.info(f"   - Réalisateurs: {len(directors_added)}")
    logger.info(f"   - Genres: {len(genres_added)}")

    return g


def main():
    # Créer le dossier logs si nécessaire
    Path('logs').mkdir(exist_ok=True)

    logger.info("=" * 60)
    logger.info("Création de l'ontologie OWL pour le système de recommandation")
    logger.info("=" * 60)

    # Créer l'ontologie (classes et propriétés)
    logger.info("[ÉTAPE 1] Création de la structure de l'ontologie...")
    g = create_ontology()

    # Peupler avec les données
    logger.info("[ÉTAPE 2] Peuplement de l'ontologie...")
    g = populate_ontology(g)

    # Sauvegarder en TTL
    logger.info("[ÉTAPE 3] Sauvegarde des fichiers...")

    # Format Turtle (plus lisible)
    g.serialize(destination='films.ttl', format='turtle')
    logger.info("   - films.ttl sauvegardé")

    # Format RDF/XML (compatibilité Protégé)
    g.serialize(destination='films.owl', format='xml')
    logger.info("   - films.owl sauvegardé")

    # Statistiques finales
    logger.info("=" * 60)
    logger.info("STATISTIQUES DE L'ONTOLOGIE")
    logger.info("=" * 60)
    logger.info(f"Nombre total de triplets: {len(g)}")

    # Compter par type
    films_count = len(list(g.subjects(RDF.type, NS.Film)))
    actors_count = len(list(g.subjects(RDF.type, NS.Acteur)))
    directors_count = len(list(g.subjects(RDF.type, NS.Realisateur)))
    genres_count = len(list(g.subjects(RDF.type, NS.Genre)))

    logger.info(f"   - Films: {films_count}")
    logger.info(f"   - Acteurs: {actors_count}")
    logger.info(f"   - Réalisateurs: {directors_count}")
    logger.info(f"   - Genres: {genres_count}")

    logger.info("Ontologie créée avec succès!")
    logger.info("Fichiers générés:")
    logger.info("   - films.ttl (format Turtle - pour Fuseki)")
    logger.info("   - films.owl (format RDF/XML - pour Protégé)")

    return g


if __name__ == "__main__":
    main()
