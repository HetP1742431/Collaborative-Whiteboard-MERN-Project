import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { api } from "../apiConfig";
import { AuthContext } from "../AuthContext";
import Navbar from "./Navbar.jsx";
import "./Forms.css";

const ShareWhiteboard = () => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [shareCode, setShareCode] = useState("");
  const [errors, setErrors] = useState({});
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  const handleShareWhiteboard = async (e) => {
    e.preventDefault();
    setErrors({});
    setShareCode("");
    try {
      const response = await api.post(`/whiteboards/${id}/share`, {
        recipientEmail,
      });
      if (response.status === 200) {
        setShareCode(response.data.shareCode);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ error: error.response.data.error });
      } else {
        console.error("Share whiteboard error", error);
        setErrors({ error: "An unexpected error occurred" });
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareCode).then(() => {
      alert("Share code copied to clipboard!");
    });
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="box">
          <h2 className="text-center">Share Whiteboard</h2>
          <form onSubmit={handleShareWhiteboard}>
            <div className="form-group">
              <label htmlFor="recipientEmail">Recipient Email</label>
              <input
                type="email"
                className={`form-control ${errors.error ? "is-invalid" : ""}`}
                id="recipientEmail"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
              />
            </div>
            {errors.error && (
              <div className="invalid-feedback">{errors.error}</div>
            )}
            <button
              type="submit"
              className="sub-btn btn btn-primary btn-block mt-4"
            >
              Generate Share Code
            </button>
          </form>
          {shareCode && (
            <div className="share-code mt-4">
              <p>
                Share this code with the intended user to join the whiteboard:
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <code>{shareCode}</code>
                <button className="btn btn-secondary ml-2" onClick={handleCopy}>
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShareWhiteboard;
