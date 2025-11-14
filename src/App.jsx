import { useState } from "react";
import "./App.css";
import Navbar from "./components/Layout/Navbar";
import MovieList from "./components/Movie/MovieList";
function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [Found, setFound] = useState(false);
  return (
    <>
      <Navbar setSearch={setSearchResults} setFound={setFound} />
      <MovieList Found={Found} searchResults={searchResults} />
    </>
  );
}

export default App;
