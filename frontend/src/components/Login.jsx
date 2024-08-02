import { useState, useContext } from "react";
import api from "../apiConfig";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "./Forms.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await api.post("/users/login", { email, password });
      if (response.status === 200) {
        const { accessToken } = response.data;

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        const userResponse = await api.get("/users/me");
        setUser(userResponse.data);

        navigate(`/whiteboards/${userResponse.data.username}`);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ error: error.response.data.error });
      } else {
        console.error("Login error", error);
        setErrors({ error: "An unexpected error occurred" });
      }
    }
  };

  return (
    <div className="container">
      <div className="box">
        <h2 className="text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className={`form-control ${errors.error ? "is-invalid" : ""}`}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className={`form-control ${errors.error ? "is-invalid" : ""}`}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {errors.error && <div className="text-danger">{errors.error}</div>}
          <button type="submit" className="btn btn-primary btn-block mt-4">
            Login
          </button>
        </form>
        <span className="text-sm">
          Don't have an account?{" "}
          <Link to="/users/signup" className="text-blue-600">
            {" "}
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
