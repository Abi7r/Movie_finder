import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export const saveMovieToFireBase = async (movieData) => {
  try {
    console.log("About to save to Firebase:", movieData);
    const docRef = await addDoc(collection(db, "watchedMovies"), {
      ...movieData,
      createdAt: new Date(),
    });
    console.log("Movie saved with ID:", docRef.id);
    return docRef.id;
  } catch (err) {
    console.error("Error in storageService save:", err);
    throw err;
  }
};

export const getWatchedMoviesFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "watchedMovies"));
    const movies = [];
    querySnapshot.forEach((doc) => {
      movies.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    console.log("Loaded movies from firebase :", movies.length);
    return movies;
  } catch (error) {
    console.log("Error in storage Service m2", error);

    return [];
  }
};

export const deleteMovieFromFirebase = async (movieId) => {
  try {
    await deleteDoc(doc(db, "watchedMovies", movieId));
  } catch (error) {
    console.log("Error in storage Service del :", error);
    throw error;
  }
};

export const updateMovieInFirebase = async (movieId, newRating) => {
  try {
    await updateDoc(doc(db, "watchedMovies", movieId), {
      userRating: newRating,
      updatedAt: new Date(),
    });
    console.log("Movie rating updated", movieId, newRating);
  } catch (err) {
    console.log("Error in storageService updation:", err);
    throw err;
  }
};

export const clearAllMoviesFromFirebase = async () => {
  try {
    const movies = await getWatchedMoviesFromFirebase();
    const deletePromises = movies.map((mov) =>
      deleteDoc(doc(db, "watchedMovies", mov.id))
    );
    await Promise.all(deletePromises);
    console.log("All movies cleared from firebase");
  } catch (err) {
    console.log("Error while clearing all movies in Storage service", err);
    throw err;
  }
};
