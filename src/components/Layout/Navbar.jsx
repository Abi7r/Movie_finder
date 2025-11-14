import { CiSearch } from "react-icons/ci";
import { useState } from "react";
const API_KEY = "30e9dcae";
function Navbar({ setSearch, setFound }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    console.log("Searching for", searchQuery);
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchQuery}`
      );
      const data = await response.json();
      console.log("After fetching", data);
      if (data.Response == "True") {
        setFound(true);
        setSearch(data.Search || []);
      } else {
        setFound(false);
        setSearch([]);
      }
    } catch (err) {
      console.log("Error occured while fetching", err);
      setSearch([]);
    }
  };

  return (
    <>
      <nav className="shadow-md bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="https://e7.pngegg.com/pngimages/616/35/png-clipart-red-and-white-film-icon-area-text-brand-sign-apps-google-movies-text-rectangle.png"
                alt=""
                className="w-14 h-10 rounded-md my-2 "
              />
              <span className="font-bold text-gray-800 text-xl ml-2">
                Movie App
              </span>
            </div>
            <div className="flex-1 max-w-md ">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search Movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute  right-7 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
                >
                  <CiSearch />
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
