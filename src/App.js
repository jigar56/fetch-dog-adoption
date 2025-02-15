import React, { useState } from "react";
import Login from "./components/login";
import SearchDogs from "./components/searchdogs";
import { logoutUser } from "./api";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("isAuthenticated"));
  const [favorites, setFavorites] = useState([]);

  return (
    <div className="app">
      {isAuthenticated ? (
        <>
          <button onClick={() => { logoutUser(); localStorage.removeItem("isAuthenticated"); setIsAuthenticated(false); }}>Logout</button>
          <SearchDogs favorites={favorites} setFavorites={setFavorites} />
        </>
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
};

export default App;
