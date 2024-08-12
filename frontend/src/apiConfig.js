import axios from "axios";

export const baseURL = "http://localhost:8000";

export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
