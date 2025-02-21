import axios from "axios";

const API_BASE_URL = "http://localhost:3000"; // Update if backend is hosted

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// AUTH FUNCTIONS
export const loginUser = (name, email) => api.post("/auth/login", { name, email });

// ✅ FIXED: Ensure this function exists and is properly exported
export const logoutUser = () => api.post("/auth/logout");

// FETCH DATA
export const fetchBreeds = () => api.get("/dogs/breeds");

export const fetchDogs = (filters) => api.get("/dogs/search", { params: filters });

export const fetchDogDetails = (dogIds) => api.post("/dogs", dogIds);

export const matchDog = (dogIds) => api.post("/dogs/match", dogIds);

export const fetchLocations = (zipCodes) => api.post("/locations", zipCodes);

export const checkCookies = () => api.get("/check-cookies");

export const allowCookies = () => api.post("/allow-cookies", { allowCookies: true });

export const declineCookies = () => api.post("/allow-cookies", { allowCookies: false });
