import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import Login from "./components/js/login";
import SearchDogs from "./components/js/searchdogs";
import { logoutUser, checkCookies, allowCookies, declineCookies } from "./components/js/api";
import CookieConsentModal from "./components/js/CookieConsentModal";
import "../src/components/style/app.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("isAuthenticated"));
  const [favorites, setFavorites] = useState([]);
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [cookiesAllowed, setCookiesAllowed] = useState(false);

  useEffect(() => {
    checkCookies()
      .then((response) => {
        if (response.data.message === "Cookies are enabled") {
          setCookiesAllowed(true);
        } else {
          setShowCookieModal(true);
        }
      })
      .catch(() => setShowCookieModal(true));
  }, []);

  const handleAcceptCookies = () => {
    allowCookies().then(() => {
      setCookiesAllowed(true);
      setShowCookieModal(false);
    });
  };

  const handleDeclineCookies = () => {
    declineCookies().then(() => {
      setShowCookieModal(false);
    });
  };

  return (
    <Container fluid className="app">
      <CookieConsentModal show={showCookieModal} onAccept={handleAcceptCookies} onDecline={handleDeclineCookies} />
      {isAuthenticated ? (
        <>
          <Button variant="danger" className="logout-button" onClick={() => { logoutUser(); setIsAuthenticated(false); }}>
            Logout
          </Button>
          <SearchDogs favorites={favorites} setFavorites={setFavorites} />
        </>
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </Container>
  );
};

export default App;
