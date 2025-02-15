import axios from "axios";

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const loginUser = (name, email) => api.post("/auth/login", { name, email });

export const logoutUser = () => api.post("/auth/logout");

export const fetchBreeds = () => api.get("/dogs/breeds");

export const fetchDogs = (filters) => api.get("/dogs/search", { params: filters });

export const fetchDogDetails = (dogIds) => api.post("/dogs", dogIds);

export const matchDog = (dogIds) => api.post("/dogs/match", dogIds);
