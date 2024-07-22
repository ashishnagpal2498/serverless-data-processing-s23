// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Signup from "./components/Signup";
import SecurityQuestions from "./components/SecurityQuestions";
import CipherComponent from "./components/CipherComponent";
import RoomBooking from "./components/RoomBooking";
import Properties from "./components/PropertyList";
import PropertyFeedback from "./components/Feedback/GetFeedbackById";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Feedback from "./components/Feedback/AddFeedback";
import GetAllFeedbacks from "./components/Feedback/GetAllFeedbacks";
import LoginStats from "./components/LoginStatistics";

const App = () => {
  const [agentId, setAgentId] = useState("");

  useEffect(() => {
    console.log(localStorage);
    const isAuthCompleted = localStorage.getItem("isAuthCompleted"); // Example: Get username from local storage
    if (!isAuthCompleted) {
      setAgentId("0fb6986f-9eae-4894-a16b-09b8ce5272f3");
    } else {
      setAgentId("90e74eb0-ade5-4500-9023-1eb358391f96");
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/security-questions" element={<SecurityQuestions />} />
            <Route path="/cipher-challenge" element={<CipherComponent />} />
            <Route path="/login-stats" element={<LoginStats />} />
            <Route path="/properties" element={<Properties />} />
            <Route
              path="/book-room/:propertyId/:roomId"
              element={<RoomBooking />}
            />
            <Route path="/feedbacks" element={<GetAllFeedbacks />} />
            <Route
              path="/feedback/:propertyId"
              element={<ProtectedRoute element={<Feedback />} />}
            />
            <Route
              path="/property-feedback/:propertyId"
              element={<PropertyFeedback />}
            />
          </Routes>
          <df-messenger
            intent="WELCOME"
            chat-title="DalAppBot"
            //agent-id="0fb6986f-9eae-4894-a16b-09b8ce5272f3"
            agent-id={agentId}
            language-code="english"
          ></df-messenger>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
