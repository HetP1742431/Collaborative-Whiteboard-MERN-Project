import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "./apiConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      // List of paths that don't require authentication
      const publicPaths = ["/", "/users/login", "/users/signup"];

      if (publicPaths.includes(location.pathname)) {
        setLoading(false);
        return;
      }

      try {
        // Attempt to refresh the access token
        const tokenResponse = await api.post("/users/token");
        const { accessToken } = tokenResponse.data;

        // Set the default authorization header for future requests
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        // Fetch the user data
        const userResponse = await api.get("/users/me");
        setUser(userResponse.data);
        setLoading(false);
      } catch (error) {
        console.log("Not authenticated", error);
        setUser(null);
        setLoading(false);
        navigate("/users/login");
      }
    };

    checkAuth();
  }, [location.pathname, navigate]);

  if (loading) {
    return;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
