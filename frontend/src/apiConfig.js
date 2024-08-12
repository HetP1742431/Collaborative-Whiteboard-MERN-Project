import axios from "axios";

export const baseURL =
  "https://collaborative-whiteboard-f28cv1zn7-hetp1742431s-projects.vercel.app/";

export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
