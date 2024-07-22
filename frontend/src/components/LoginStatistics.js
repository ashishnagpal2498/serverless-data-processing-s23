import React, { useEffect } from "react";
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ReportPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  //   useEffect(() => {
  //     if (!auth.isAuthenticated) {
  //       navigate("/signup");
  //     }
  //   }, [auth, navigate]);

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{ height: "100vh", overflow: "hidden" }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <iframe
          title="Looker Studio Report"
          width="100%"
          height="100%"
          src="https://lookerstudio.google.com/embed/reporting/d8b1dda0-6e97-42dd-b250-9a76a05c2f84/page/0Za6D"
          frameBorder="0"
          style={{ flex: 1, border: 0 }}
          allowFullScreen
        ></iframe>
      </Box>
    </Container>
  );
}

export default ReportPage;
