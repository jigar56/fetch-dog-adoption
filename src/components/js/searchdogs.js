import React, { useEffect, useState } from "react";
import axios from "axios";
import DogCard from "./dogcard";
import { Container, Row, Col, Form, Button, Alert, Spinner, Modal } from "react-bootstrap";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../style/searchdogs.css";

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

const SearchDogs = ({ favorites, setFavorites }) => {
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [ageRange, setAgeRange] = useState([0, 20]);
  const [sortOrder, setSortOrder] = useState("breed:asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [page, setPage] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchBreeds();
  }, []);

  useEffect(() => {
    if (!showFavorites) {
      fetchDogs();
    }
  }, [selectedBreed, city, state, zipCode, ageRange, sortOrder, page, showFavorites]);

  const fetchBreeds = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dogs/breeds`, { withCredentials: true });
      setBreeds(response.data.sort());
    } catch (error) {
      console.error("Error fetching breeds:", error);
      setError("Failed to fetch breeds. Please try again.");
    }
  };

  const fetchDogs = async () => {
    setLoading(true);
    setError(null);

    try {
      let zipCodes = [];
      if (zipCode) {
        if (!/^\d{5}$/.test(zipCode)) {
          throw new Error("Invalid zip code. Please enter a 5-digit zip code.");
        }
        zipCodes = [zipCode];
      } else if (city || state) {
        const locationResponse = await axios.post(
          `${API_BASE_URL}/locations/search`,
          { city: city || undefined, states: state ? [state] : undefined },
          { withCredentials: true }
        );
        if (locationResponse.data.results.length > 0) {
          zipCodes = locationResponse.data.results.map((loc) => loc.zip_code);
        } else {
          throw new Error("No locations found for the specified city or state.");
        }
      }

      const params = {
        breeds: selectedBreed ? [selectedBreed] : [],
        zipCodes: zipCodes,
        ageMin: ageRange[0],
        ageMax: ageRange[1],
        sort: sortOrder,
        from: page * 8,
        size: 8,
      };

      const searchResponse = await axios.get(`${API_BASE_URL}/dogs/search`, {
        params,
        withCredentials: true,
      });

      if (searchResponse.data.resultIds.length > 0) {
        const dogIds = searchResponse.data.resultIds;
        const dogsResponse = await axios.post(`${API_BASE_URL}/dogs`, dogIds, { withCredentials: true });

        const dogsWithLocation = await Promise.all(
          dogsResponse.data.map(async (dog) => {
            const locationResponse = await axios.post(`${API_BASE_URL}/locations`, [dog.zip_code], { withCredentials: true });
            if (locationResponse.data.length > 0) {
              return {
                ...dog,
                city: locationResponse.data[0].city,
                state: locationResponse.data[0].state,
              };
            }
            return dog;
          })
        );

        setDogs(dogsWithLocation);
      } else {
        setDogs([]);
      }
    } catch (error) {
      console.error("Error fetching dogs:", error);
      setError(error.message || "Failed to fetch dogs. Please check your filters and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBreedSelect = (e) => {
    setSelectedBreed(e.target.value);
  };

  const handleCitySearch = (e) => {
    setCity(e.target.value);
  };

  const handleStateSearch = (e) => {
    setState(e.target.value.toUpperCase().substring(0, 2));
  };

  const handleZipCodeChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,5}$/.test(value)) {
      setZipCode(value);
    }
  };

  const toggleFavorite = (dog) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.some((fav) => fav.id === dog.id);
      return isFavorite ? prevFavorites.filter((fav) => fav.id !== dog.id) : [...prevFavorites, dog];
    });
  };

  const findMatch = async () => {
    if (favorites.length === 0) {
      alert("Please add at least one favorite dog before finding a match.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/dogs/match`, favorites.map((dog) => dog.id), { withCredentials: true });
      if (response.data.match) {
        const matchedDog = favorites.find((dog) => dog.id === response.data.match);
        setMatchResult(matchedDog);
      } else {
        setMatchResult("No perfect match found, but keep looking!");
      }
    } catch (error) {
      console.error("Error finding match:", error);
      setMatchResult("An error occurred while finding a match.");
    }
    setShowMatchModal(true);
  };

  const resetFilters = () => {
    setSelectedBreed("");
    setCity("");
    setState("");
    setZipCode("");
    setAgeRange([0, 20]);
    setSortOrder("breed:asc");
    setPage(0);
  };

  const paginatedFavorites = favorites.slice(page * 8, (page + 1) * 8);
  const totalFavoritesPages = Math.ceil(favorites.length / 8);

  return (
    <Container fluid className="search-container">
      <Row>
        {/* Mobile Filter Button */}
        <Button className="mobile-filter-btn" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          ☰ 
        </Button>

        {/* Filter Section */}
        <Col md={2} className={`filter-section ${isFilterOpen ? "open" : ""}`}>
          <h2 className="mb-0">Find Your Perfect </h2>
          <h1 className="mb-2">FRIEND🐶</h1>

          <Form>
            <Form.Group className="mb-3">
              <Form.Select value={selectedBreed} onChange={handleBreedSelect} className="filter-input">
                <option value="">Select a breed</option>
                {breeds.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter Zip Code"
                value={zipCode}
                onChange={handleZipCodeChange}
                maxLength={5}
                className="filter-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter City"
                value={city}
                onChange={handleCitySearch}
                className="filter-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter State (e.g., IL)"
                value={state}
                onChange={handleStateSearch}
                maxLength={2}
                className="filter-input"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <label>Age Range: {ageRange[0]} - {ageRange[1]} years</label>
              <Slider range min={0} max={20} value={ageRange} onChange={setAgeRange} />
            </Form.Group>

            <div className="mb-3">
              <Button variant="outline-primary" className="filter-btn" onClick={() => setSortOrder("breed:asc")}>
                Sort A-Z
              </Button>
              <Button variant="outline-primary" className="filter-btn" onClick={() => setSortOrder("breed:desc")}>
                Sort Z-A
              </Button>
            </div>

            <Button variant="danger" className="filter-btn" onClick={resetFilters}>
              Reset Filters
            </Button>
          </Form>

          <Button variant="primary" className="filter-btn" onClick={() => setShowFavorites(!showFavorites)}>
            {showFavorites ? "Show All Dogs" : "Show Favorites ❤️"}
          </Button>

          <Button variant="success" className="filter-btn" onClick={findMatch}>
            Find Best Match
          </Button>
        </Col>

        {/* Dog Cards Section */}
        <Col md={10} className="dog-section">
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Row>
              {showFavorites
                ? paginatedFavorites.length > 0
                  ? paginatedFavorites.map((dog) => (
                      <Col key={dog.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <DogCard dog={dog} toggleFavorite={toggleFavorite} favorites={favorites} />
                      </Col>
                    ))
                  : <p>Please select some favorite dogs first! ❤️</p>
                : dogs.length > 0
                  ? dogs.map((dog) => (
                      <Col key={dog.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <DogCard dog={dog} toggleFavorite={toggleFavorite} favorites={favorites} />
                      </Col>
                    ))
                  : <p>No dogs found. Try a different search.</p>}
            </Row>
          )}
        </Col>
      </Row>

      {/* Sticky Next/Previous Buttons */}
      <div className="sticky-buttons">
        <Button
          className="pagination-btn"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </Button>
        <span className="page-number">{page + 1}</span>
        <Button
          className="pagination-btn"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={showFavorites ? page + 1 >= totalFavoritesPages : dogs.length < 8}
        >
          Next
        </Button>
      </div>

      {/* Match Result Modal */}
      <Modal show={showMatchModal} onHide={() => setShowMatchModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Your Best Match</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {typeof matchResult === "object" ? (
            <DogCard dog={matchResult} toggleFavorite={toggleFavorite} favorites={favorites} />
          ) : (
            <p>{matchResult}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMatchModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SearchDogs;