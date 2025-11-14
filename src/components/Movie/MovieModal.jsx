import React, { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
import ReactModal from "react-modal";
import Star from "./Star";
// import ReactStars from "react-rating-stars-component";

ReactModal.setAppElement("#root");
function MovieModal({
  isOpen,
  onClose,
  onAddRating,
  existingRating,
  movieDetails,
  isLoading,
}) {
  const [userRating, setUserRating] = useState(0);
  useEffect(() => {
    if (movieDetails) {
      setUserRating(existingRating || 0);
    }
  }, [movieDetails, existingRating]);
  // const ratingChanged = (rating) => {
  //   setUserRating(rating);
  // };

  if (isLoading || !movieDetails) {
    return (
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onClose}
        overlayClassName="overlay"
        style={modalStyles}
        contentLabel="Movie Details"
      >
        <div className="p-6 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex justify-between items-start mb-6">
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
          </div>
        </div>
      </ReactModal>
    );
  }
  const {
    Title,
    Year,
    Poster,
    Plot,
    Released,
    Runtime,
    Genre,
    Director,
    Actors,
    imdbRating,
    imdbVotes,
    isSubmitting,
  } = movieDetails;

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      overlayClassName="overlay"
      contentLabel="Movie Details"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">{movieDetails.Title}</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-gray-700 focus:outline-none"
          >
            ×
          </button>
        </div>

        {/* Movie Content  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Poster  */}
          <div className="md:col-span-1">
            <img
              src={Poster !== "N/A" ? Poster : "/placeholder-poster.jpg"}
              alt={Title}
              className="w-full rounded-lg shadow-md"
            />
          </div>

          {/* Details  */}
          <div className="md:col-span-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-lg">⭐</span>
                <span className="font-semibold">IMDb Rating:</span>
                <span>{imdbRating}/10</span>
                <span className="text-sm text-gray-500">
                  ({imdbVotes} votes)
                </span>
              </div>

              <p>
                <span className="font-semibold">Released:</span> {Released}
              </p>
              <p>
                <span className="font-semibold">Runtime:</span> {Runtime}
              </p>
              <p>
                <span className="font-semibold">Genre:</span> {Genre}
              </p>
              <p>
                <span className="font-semibold">Director:</span> {Director}
              </p>
              <p>
                <span className="font-semibold">Cast:</span> {Actors}
              </p>
            </div>
          </div>
        </div>

        {/* Plot  */}
        <div className="border-t py-6 mb-6 text-center">
          <h3 className="font-semibold text-lg mb-4">Plot</h3>
          <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
            {Plot}
          </p>
        </div>

        {/* Rating  */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-center">
            {existingRating ? "Update Your Rating" : "Rate This Movie"}
          </h3>

          <div className="flex flex-col items-center gap-4 mb-4">
            <Star rating={userRating} onChange={setUserRating} size={40} />

            <span className="text-lg font-semibold">
              {userRating > 0 ? `${userRating}/5` : "Select rating"}
            </span>
          </div>
          {/* Submit  */}
          <div className="flex justify-center">
            <button
              onClick={() => onAddRating(userRating)}
              disabled={userRating === 0}
              className={`px-6 py-2 rounded-lg transition-colors ${
                userRating > 0
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSubmitting
                ? "Saving..."
                : existingRating
                ? "Update Rating"
                : "Add to watched list"}
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
}
const modalStyles = {
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: "0",
    borderRadius: "8px",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
    border: "none",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
};
export default MovieModal;
