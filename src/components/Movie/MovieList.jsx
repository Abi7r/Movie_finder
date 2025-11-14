import React, { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { CgUnavailable } from "react-icons/cg";
import {
  getWatchedMoviesFromFirebase,
  saveMovieToFireBase,
  deleteMovieFromFirebase,
  updateMovieInFirebase,
  clearAllMoviesFromFirebase,
} from "../../services/storageService";
import MovieModal from "./MovieModal";
const API_KEY = "30e9dcae";
function MovieList({ searchResults, Found }) {
  const [watchedMov, setWatchedMov] = useState([]);

  const [modalMov, setModalMov] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const getMovieDetails = async (searchId) => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${API_KEY}&i=${searchId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error occured while fetching specific movie details", error);
    }
  };
  //load list from fb
  useEffect(() => {
    const loadWatchedMovies = async () => {
      setLoading(true);
      try {
        const movies = await getWatchedMoviesFromFirebase();
        setWatchedMov(movies);
      } catch (error) {
        console.log("Error in mov list use effect", error);
      } finally {
        setLoading(false);
      }
    };
    loadWatchedMovies();
  }, []);

  console.log("inside searched movie list", searchResults);

  const handleOpenModal = async (movie) => {
    if (isSubmitting) {
      return;
    }
    try {
      setIsSubmitting(true);
      setIsLoadingModal(true);
      setIsModalOpen(true);
      const movieData = await getMovieDetails(movie.imdbID);
      setModalMov(movieData);
    } catch (err) {
      console.log("Error occured during modal opening", err);
    } finally {
      setIsLoadingModal(false);
      setIsSubmitting(false);
    }
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMov(null);
    setIsLoadingModal(false);
    setIsSubmitting(false);
  };
  const handleAddRating = async (userRating) => {
    console.log("handleAddRating called with:", userRating);
    console.log("modalMov:", modalMov);
    if (modalMov && userRating > 0) {
      const ratedMovie = {
        imdbID: modalMov.imdbID,
        title: modalMov.Title,
        year: modalMov.Year,
        poster: modalMov.Poster,
        imdbRating: modalMov.imdbRating,
        userRating: userRating,
        runtime: modalMov.Runtime,
        genre: modalMov.Genre,
        plot: modalMov.Plot,
        released: modalMov.Released,
        director: modalMov.Director,
        actors: modalMov.Actors,
      };
      console.log("ratedMovie object:", ratedMovie);
      try {
        const existingIndex = watchedMov.findIndex(
          (movie) => movie.imdbID === ratedMovie.imdbID
        );
        console.log("existingIndex:", existingIndex);
        if (existingIndex >= 0) {
          await updateMovieInFirebase(watchedMov[existingIndex].id, userRating);
          setWatchedMov((prev) => {
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              userRating: userRating,
            };
            return updated;
          });
        } else {
          console.log("Saving new movie to Firebase...");
          const docId = await saveMovieToFireBase(ratedMovie);
          setWatchedMov((current) => [
            ...current,
            { ...ratedMovie, id: docId },
          ]);
        }
        console.log("Movie rated", ratedMovie);
        handleCloseModal();
      } catch (err) {
        console.log("Error occured in handleRating", err);
      }
    } else {
      console.log(
        "Conditions not met - modalMov:",
        modalMov,
        "userRating:",
        userRating
      );
    }
  };
  const getExistingRating = (movieId) => {
    const watchedMovie = watchedMov.find((m) => m.imdbID === movieId);
    return watchedMovie ? watchedMovie.userRating : null;
  };
  const handleClearAll = async () => {
    try {
      await clearAllMoviesFromFirebase();
      setWatchedMov([]);
      console.log("All movies cleared");
    } catch (err) {
      console.log("Error in clearing movies from fb", err);
    }
  };
  const deleteSingleMovies = async (movieId) => {
    try {
      await deleteMovieFromFirebase(movieId);
      setWatchedMov((prev) => prev.filter((item) => item.id !== movieId));
    } catch (error) {
      console.log("Error in deleting Single movie", error);
    }
  };
  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {/* First Column  */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Movie List</h2>
        {Found ? (
          <div className="space-y-4">
            {searchResults.length > 0 ? (
              searchResults.map((movie, index) => (
                <div
                  key={`${movie.imdbID}-${index}`}
                  className="bg-white p-4 rounded shadow"
                  onClick={() => handleOpenModal(movie)}
                >
                  <img
                    src={movie.Poster != "N/A" ? movie.Poster : null}
                    alt={movie.Title}
                  />
                  <h3 className="font-semibold">{movie.Title}</h3>
                  <p className="text-gray-600">{movie.Year}</p>
                </div>
              ))
            ) : (
              <p>Search for movies</p>
            )}
          </div>
        ) : (
          <p className="text-3xl text-red-400">
            <CgUnavailable className="text-red" /> <span> No movies Found</span>
          </p>
        )}
      </div>

      {/* Second Column */}
      <div className="bg-gray-100 p-2 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Movie Details</h2>
        <span>
          <button
            className="bg-red-600 py-2 px-2 rounded-md mb-2"
            onClick={handleClearAll}
          >
            Resest
          </button>
        </span>
        {watchedMov.length > 0 ? (
          watchedMov.map((mov) => {
            if (loading) {
              return (
                <div
                  key={mov.imdbID}
                  className="bg-white p-2 rounded shadow grid grid-cols-3 gap-4"
                >
                  <div className="animate-pulse">
                    <div className="bg-gray-300 h-48 rounded"></div>
                  </div>
                  <div className="col-span-2 animate-pulse space-y-3">
                    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </div>
              );
            }
            return (
              <div
                key={mov.imdbID}
                className="bg-white rounded shadow flex gap-4 p-4 relative"
              >
                <button
                  className="absolute text-2xl top-0 right-0 px-4 py-2 bg-red-500 "
                  onClick={() => deleteSingleMovies(mov.id)}
                >
                  <IoIosCloseCircle />
                </button>
                <div className="flex-shrink-0">
                  <img
                    src={
                      mov.Poster !== "N/A"
                        ? mov.poster
                        : "/placeholder-poster.jpg"
                    }
                    alt={mov.Title}
                    className="w-32 h-48 object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold mb-2">{mov.title}</h2>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Release Date:</span>{" "}
                    {mov.released}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Genre:</span> {mov.genre}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">⭐ imdb Rating:</span>{" "}
                    {mov.imdbRating}
                    <span className="font-semibold"> | 🌟 Your Rating : </span>
                    {mov.userRating}/5
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Plot:</span> {mov.plot}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center py-8">
            No watched movies yet. Rate a movie to add it to your list!
          </p>
        )}
      </div>
      <MovieModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddRating={handleAddRating}
        movieDetails={modalMov}
        existingRating={getExistingRating(modalMov?.imdbID)}
        isLoading={isLoadingModal}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default MovieList;
