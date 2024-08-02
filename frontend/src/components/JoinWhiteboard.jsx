import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../apiConfig";
import { AuthContext } from "../AuthContext";
import "./Forms.css";

const JoinWhiteboard = () => {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleJoinWhiteboard = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await api.post("/whiteboards/join", { code });
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
    <div className="container">
      <div className="box">
        <h2 className="text-center">Join existing whiteboard</h2>
        <form onSubmit={handleJoinWhiteboard}>
          <div className="form-group">
            <label htmlFor="title">Code</label>
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
          <button type="submit" className="btn btn-primary btn-block mt-4">
            Join whiteboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinWhiteboard;
