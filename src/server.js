const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(cors({ origin: "http://localhost:3001", credentials: true }));

// Function to handle cookie consent
function askForCookies(req, res) {
  const { allowCookies, alert } = req.body;
  if (allowCookies || alert) {
    res.cookie("userConsent", "granted", { maxAge: 900000, httpOnly: true });
    return res.json({ message: "Cookies allowed" });
  } else {
    return res.json({ message: "Cookies denied" });
  }
}

// API Routes
app.post("/allow-cookies", (req, res) => askForCookies(req, res));
app.get("/check-cookies", (req, res) => {
  res.json({ message: req.cookies.userConsent === "granted" ? "Cookies are enabled" : "Cookies are disabled" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
