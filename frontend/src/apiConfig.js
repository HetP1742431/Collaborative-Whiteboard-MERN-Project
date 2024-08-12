import axios from "axios";

export const baseURL = "https://collaborative-whiteboard-api.onrender.com";

export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
