import React from "react";
import { Box, TextField, Button, Container } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function BookingForm() {
  const { propertyId, roomId } = useParams();
  const { auth } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const bookingDetails = {
      property_id: propertyId,
      room_id: roomId,
      check_in_date: data.get("checkInDate"),
      check_out_date: data.get("checkOutDate"),
      email: auth.user,
    };

    try {
      // Perform the API call with the booking details
      const response = await fetch(
        "https://jme5i3nvruy6p273ysehgqw76e0xuwqy.lambda-url.us-east-1.on.aws",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingDetails),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok.");
      const result = await response.json();
      console.log("Success:", result);
      alert("Booking submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit booking.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="checkInDate"
          label="Check-in Date"
          name="checkInDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="checkOutDate"
          label="Check-out Date"
          name="checkOutDate"
          type="date"
          InputLabelProps={{ shrink: true }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit Booking
        </Button>

        <Box sx={{ position: "fixed", bottom: 20, right: 20, width: "auto" }}>
          <TextField
            size="small" // Reduces the size of the TextField
            margin="dense" // Reduces the margin, making the component more compact
            required
            id="userQuery"
            label="Your Query"
            name="userQuery"
            autoComplete="userQuery"
            placeholder="Enter any questions or details"
            variant="outlined"
            sx={{ width: 250 }} // Sets a specific width, adjust as necessary
          />
          <Button
            size="small" // Reduces the size of the button
            variant="contained"
            color="primary"
            sx={{ mt: 1, ml: 1 }} // Adds margin top for spacing between fields
          >
            Submit Query
          </Button>
        </Box>
      </form>
    </Container>
  );
}

export default BookingForm;
