import axios from "axios";

export const baseURL =
  "https://collaborative-whiteboard-o1rxdyo79-hetp1742431s-projects.vercel.app/";

export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
