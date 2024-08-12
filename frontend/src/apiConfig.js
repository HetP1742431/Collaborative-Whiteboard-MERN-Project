import axios from "axios";

export const baseURL = "https://collaborative-whiteboard-api.vercel.app/";

export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
