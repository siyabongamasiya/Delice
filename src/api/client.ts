import axios from "axios";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://food-and-vibes.onrender.com/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
