import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../style/dogcard.css";

const DogCard = ({ dog, toggleFavorite, favorites = [] }) => {
  const isFavorite = favorites.some((fav) => fav.id === dog.id);

  return (
    <div className="dog-card">
      <img
        src={dog.img || "default-dog-image.jpg"}
        alt={dog.name || "Dog"}
        className="dog-image"
        loading="lazy"
      />
      <div className="dog-info">
        <div className="dog-meta">
          <span> <h3 className="dog-name">{dog.name || "Unknown"}</h3></span>
          <span>
            <button
              className="favorite-button"
              onClick={() => toggleFavorite(dog)}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? <FaHeart className="heart-icon filled" /> : <FaRegHeart className="heart-icon" />}
            </button>
          </span>
        </div>
        <div className="dog-meta">
          <span className="dog-breed">{dog.breed || "Unknown Breed"}</span>
          <span className="dog-location">
            <span>{dog.city || "N/A"}, {dog.state || "N/A"}</span>
          </span>
        </div>
        <div className="dog-meta">
          <span>🐶 {dog.age ? `${dog.age} years` : "N/A"}</span>
          <span>📍 {dog.zip_code || "N/A"}</span>
        </div>
      </div>
      {/* Hover Effect */}
    
    </div>
  );
};

export default DogCard;