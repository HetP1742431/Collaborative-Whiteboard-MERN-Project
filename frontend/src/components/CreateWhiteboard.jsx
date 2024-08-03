import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../apiConfig";
import { AuthContext } from "../AuthContext";
import Navbar from "./Navbar.jsx";
import "./Forms.css";

const CreateWhiteboard = () => {
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCreateWhiteboard = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await api.post("/whiteboards/create", { title });
      if (response.status === 200) {
        const { _id } = response.data;
        console.log("Whiteboard ID:", _id); // Log the ID for debugging
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
          <h2 className="text-center">Create Whiteboard</h2>
          <form onSubmit={handleCreateWhiteboard}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className={`form-control ${errors.error ? "is-invalid" : ""}`}
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
              Create Whiteboard
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateWhiteboard;
