import { useState } from "react";
import api from "../apiConfig";
import { Link, useNavigate } from "react-router-dom";
import "./Forms.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await api.post("/users/signup", {
        username,
        email,
        password,
      });
      if (response.status === 201) {
        navigate("/users/login");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Collecting errors and setting them in state
        const errorData = error.response.data;
        const newErrors = {};
        if (errorData.username) newErrors.username = errorData.username;
        if (errorData.email) newErrors.email = errorData.email;
        setErrors(newErrors);
      } else {
        console.error("Signup error", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="box">
        <h2 className="text-center">Sign up</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && (
              <div className="text-danger">{errors.username}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <div className="text-danger">{errors.password}</div>
            )}
          </div>
          <button type="submit" className="btn btn-primary mt-4">
            Sign up
          </button>
        </form>
        <span className="text-sm">
          Already have an account?{" "}
          <Link to="/users/login" className="text-blue-600">
            Login
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Signup;
