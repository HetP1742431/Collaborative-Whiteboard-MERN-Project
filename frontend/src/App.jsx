import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import UserWhiteboards from "./components/UserWhiteboards.jsx";
import CreateWhiteboard from "./components/CreateWhiteboard.jsx";
import JoinWhiteboard from "./components/JoinWhiteboard.jsx";
import Whiteboard from "./components/Whiteboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { AuthContext } from "./AuthContext.jsx";
import ShareWhiteboard from "./components/ShareWhiteboard.jsx";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/signup" element={<Signup />} />
        <Route
          path="/whiteboards/:username/all"
          element={
            <PrivateRoute user={user}>
              <UserWhiteboards />
            </PrivateRoute>
          }
        />
        <Route
          path="/whiteboards/create"
          element={
            <PrivateRoute user={user}>
              <CreateWhiteboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/whiteboards/:id/share"
          element={
            <PrivateRoute user={user}>
              <ShareWhiteboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/whiteboards/join"
          element={
            <PrivateRoute user={user}>
              <JoinWhiteboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/whiteboards/:id"
          element={
            <PrivateRoute user={user}>
              <Whiteboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
