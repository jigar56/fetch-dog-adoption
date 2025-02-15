import React, { useEffect, useState } from "react";
import axios from "axios";
import DogCard from "./dogcard";
import { matchDog } from "../api"; // Import match API function
import "./searchdogs.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

const SearchDogs = ({ favorites, setFavorites }) => {
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [ageRange, setAgeRange] = useState([0, 20]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [breedSearch, setBreedSearch] = useState("");
  const [matchResult, setMatchResult] = useState(null);

  useEffect(() => {
    fetchBreeds();
  }, []);

  useEffect(() => {
    fetchDogs();
  }, [selectedBreed, zipCode, ageRange, page, sortOrder]);

  // Fetch all breeds
  const fetchBreeds = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dogs/breeds`, { withCredentials: true });
      setBreeds(response.data);
    } catch (error) {
      console.error("Error fetching breeds:", error);
    }
  };

  // Fetch dogs based on filters
  const fetchDogs = async () => {
    setLoading(true);
    try {
      const searchResponse = await axios.get(`${API_BASE_URL}/dogs/search`, {
        params: {
          breeds: selectedBreed ? [selectedBreed] : [],
          zipCodes: zipCode ? [zipCode] : [],
          ageMin: ageRange[0],
          ageMax: ageRange[1],
          size: 8,
          from: page * 8,
          sort: `breed:${sortOrder}`,
        },
        withCredentials: true,
      });

      if (searchResponse.data.resultIds.length > 0) {
        const dogIds = searchResponse.data.resultIds;
        const dogsResponse = await axios.post(`${API_BASE_URL}/dogs`, dogIds, { withCredentials: true });
        setDogs(dogsResponse.data);
        setTotalPages(Math.ceil(searchResponse.data.total / 8));
      } else {
        setDogs([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching dogs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle breed search
  const handleBreedSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setBreedSearch(value);
    if (value) {
      const suggestions = breeds.filter((breed) => breed.toLowerCase().startsWith(value));
      setFilteredBreeds(suggestions);
    } else {
      setFilteredBreeds([]);
    }
  };

  // Select breed from search or dropdown
  const selectBreed = (breed) => {
    setSelectedBreed(breed);
    setBreedSearch(breed);
    setFilteredBreeds([]);
  };

  // Toggle favorite dogs (heart turns red when active)
  const toggleFavorite = (dog) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav.id === dog.id);
      return isFavorite ? prevFavorites.filter((fav) => fav.id !== dog.id) : [...prevFavorites, dog];
    });
  };

  // Find best match
  const findMatch = async () => {
    if (favorites.length === 0) {
      alert("Select at least one favorite dog before matching.");
      return;
    }

    try {
      const response = await matchDog(favorites.map((dog) => dog.id));
      setMatchResult(response.data.match);
    } catch (error) {
      console.error("Error finding match:", error);
    }
  };

  return (
    <div className="sch_container">
      <div className="sch_sidebar">
        <h2 className="sch_title">Find Your Perfect Dog 🐶</h2>

        <div className="sch_filter">
          <input
            type="text"
            placeholder="Search breed..."
            value={breedSearch}
            onChange={handleBreedSearch}
            className="sch_input sch_searchbox"
          />
          {filteredBreeds.length > 0 && (
            <div className="sch_suggestions">
              {filteredBreeds.map((breed) => (
                <div key={breed} className="sch_suggestion-item" onClick={() => selectBreed(breed)}>
                  {breed}
                </div>
              ))}
            </div>
          )}

          <select onChange={(e) => selectBreed(e.target.value)} className="sch_dropdown">
            <option value="">All Breeds</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>

          <input type="text" placeholder="Enter Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="sch_input" />

          <div className="sch_age-filter">
            <label>Age Range: {ageRange[0]} - {ageRange[1]} years</label>
            <Slider
              range
              min={0}
              max={20}
              value={ageRange}
              onChange={setAgeRange}
              className="sch_range-slider"
            />
          </div>
        </div>

        <button onClick={() => setShowFavorites(!showFavorites)} className="sch_btn">
          {showFavorites ? "Show All Dogs" : "Show Favorites ❤️"}
        </button>

        <button onClick={findMatch} className="sch_btn">Find Best Match</button>
      </div>

      <div className="sch_main">
        <div className="sch_dog-grid">
          {loading ? (
            <p>Loading dogs...</p>
          ) : (showFavorites ? favorites : dogs).length > 0 ? (
            (showFavorites ? favorites : dogs).map((dog) => (
              <DogCard key={dog.id} dog={dog} toggleFavorite={toggleFavorite} favorites={favorites} />
            ))
          ) : (
            <p>No dogs found. Try a different search.</p>
          )}
        </div>

        <div className="sch_pagination">
          <button onClick={() => setPage((prev) => prev - 1)} disabled={page === 0} className="sch_page-btn">
            ◀ Previous
          </button>
          <span className="sch_page-info">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage((prev) => prev + 1)} disabled={page + 1 >= totalPages} className="sch_page-btn">
            Next ▶
          </button>
        </div>

        {matchResult && <p className="sch_match-result">Your best match is: {matchResult}</p>}
      </div>
    </div>
  );
};

export default SearchDogs;
