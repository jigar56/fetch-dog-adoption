import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./dogcard.css";

const DogCard = ({ dog, toggleFavorite, favorites = [] }) => {
  const isFavorite = favorites.some((fav) => fav.id === dog.id); // Check if the dog is favorited

  return (
    <div className="sch_dog-card">
      {/* Dog Image */}
      <img 
        src={dog.img || "default-dog-image.jpg"} 
        alt={dog.name || "Dog"} 
        className="sch_dog-img" 
        loading="lazy"
      />

      {/* Dog Info */}
      <div className="sch_dog-info">
        <h3 className="sch_dog-name">{dog.name || "Unknown"}</h3>
        <p className="sch_dog-breed">{dog.breed || "Unknown Breed"}</p>
      </div>

      {/* Age and Location */}
      <div className="sch_dog-meta">
        <span>🐶 Age: {dog.age ? `${dog.age} years` : "N/A"}</span>
        <span>📍 Zip: {dog.zip_code || "N/A"}</span>
      </div>

      {/* Favorite Button - Heart Turns Red When Active */}
      <button 
        className="sch_favorite-button" 
        onClick={() => toggleFavorite(dog)}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? <FaHeart className="sch_heart  filled" /> : <FaRegHeart className="sch_heart" />}
      </button>
    </div>
  );
};

export default DogCard;
