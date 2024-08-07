import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../apiConfig";
import { AuthContext } from "../AuthContext";
import Navbar from "./Navbar";
import "./UserWhiteboards.css";

const UserWhiteboards = () => {
  const [whiteboards, setWhiteboards] = useState([]);
  const [errors, setErrors] = useState({});
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWhiteboards = async () => {
      try {
        if (user) {
          const response = await api.get(`/whiteboards/${user.username}/all`);
          setWhiteboards(response.data);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          setErrors({ error: error.response.data.error });
        } else {
          console.error("Fetch whiteboards error", error);
          setErrors({ error: "An unexpected error occurred" });
        }
      }
    };

    fetchWhiteboards();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="user-whiteboards-container">
        <h2 className="heading">
          {user ? user.username : "user"}'s Whiteboards
        </h2>
        <div className="whiteboards-list">
          {whiteboards.map((whiteboard) => (
            <div key={whiteboard._id} className="whiteboard-card">
              <div className="whiteboard-content">
                <div>
                  <strong>
                    <u>
                      <Link
                        to={`/whiteboards/${whiteboard._id}`}
                        className="whiteboard-title"
                      >
                        {whiteboard.title}
                      </Link>
                    </u>
                  </strong>
                </div>
                <p>Owner: {whiteboard.owner.username}</p>
                <p>
                  Created on:{" "}
                  {new Date(whiteboard.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                className="invite-btn btn btn-primary mt-3"
                onClick={() => navigate(`/whiteboards/${whiteboard._id}/share`)}
              >
                Invite
              </button>
            </div>
          ))}
          {errors.error && <div className="error-message">{errors.error}</div>}
        </div>
        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/whiteboards/create")}
          >
            Create New Whiteboard
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/whiteboards/join")}
          >
            Join Existing Whiteboard
          </button>
        </div>
      </div>
    </>
  );
};

export default UserWhiteboards;
