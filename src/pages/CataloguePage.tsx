import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
// import { api } from "../services/api";
import type { Movie } from "../types/movie";
import { MovieCard } from "../components/MovieCard";
import { SearchBar } from "../components/SearchBar";

// =============================================================
// EXERCICE 2 — CataloguePage (8 pts)
// =============================================================
//
// Compléter cette page pour charger et afficher la liste des films.
//
// L'état search et genre est déjà câblé avec SearchBar.
// L'endpoint API est : GET /api/movies?search=...&genre=...
//
// 1. (2 pts) Écrire le useQuery avec un queryKey qui reflète
//    les critères de recherche actuels
//
// 2. (2 pts) Dans la queryFn, construire l'URL avec les bons
//    paramètres et appeler le service API
//
// 3. (1 pt) Afficher un message de chargement quand les données
//    ne sont pas encore arrivées
//
// 4. (1 pt) Afficher un message d'erreur si la requête échoue
//
// 5. (2 pts) Afficher les films dans une grille en utilisant
//    le composant MovieCard (penser à la prop key)
//

export const CataloguePage = () => {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");

    const { data: movies, error, isPending } = useQuery<Movie[]>({
        queryKey: ["movies", search, genre],
        queryFn: async () => {
            const res = await fetch(
                `/api/movies?search=${encodeURIComponent(search)}&genre=${encodeURIComponent(genre)}`
            );

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                throw new Error(body?.error ?? "Failed to fetch movies");
            }

            return res.json();
        },
    });


  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Catalogue</h1>
      <SearchBar onSearch={setSearch} onGenreChange={setGenre} />

        {isPending ? (
            <p>Loading Movies...</p>
        ) : error instanceof Error ? (
            <div>
                <h1>Error</h1>
                <p>{error.message}</p>
            </div>
        ) : (
            <>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">                       {(movies ?? []).map((movie: Movie, idx: number) => (
                        <MovieCard key={idx} movie={movie} />
                    ))}
                </ul>
            </>
        )}
    </div>
  );
};
