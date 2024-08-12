import axios from "axios";

export const baseURL =
  "https://collaborative-whiteboard-54thnvly5-hetp1742431s-projects.vercel.app";

export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
