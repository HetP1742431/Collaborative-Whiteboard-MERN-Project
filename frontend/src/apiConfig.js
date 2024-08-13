import axios from "axios";

export const baseURL = "https://api.collaborateboard.site";

export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
