import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../apiConfig";
import { AuthContext } from "../AuthContext";
import Navbar from "./Navbar.jsx";
import "./Forms.css";

const JoinWhiteboard = () => {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleJoinWhiteboard = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await api.post("/whiteboards/join", { shareCode: code });
      if (response.status === 200) {
        const { _id } = response.data;
        navigate(`/whiteboards/${_id}`);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ error: error.response.data.error });
      } else {
        console.error("Create whiteboard error", error);
        setErrors({ error: "An unexpected error occurred" });
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="box">
          <h2 className="text-center">Join whiteboard</h2>
          <form onSubmit={handleJoinWhiteboard}>
            <div className="form-group">
              <label htmlFor="title">Invitation Code</label>
              <input
                type="text"
                className={`form-control ${errors.error ? "is-invalid" : ""}`}
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              {errors.error && (
                <div className="invalid-feedback">{errors.error}</div>
              )}
            </div>
            <button
              type="submit"
              className="sub-btn btn btn-primary btn-block mt-4"
            >
              Join whiteboard
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default JoinWhiteboard;
