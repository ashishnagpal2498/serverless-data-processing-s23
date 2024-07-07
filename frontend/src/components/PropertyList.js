import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "https://tu6xk652ljzr5rfnxjxqwtmwzu0gfsub.lambda-url.us-east-1.on.aws"
    )
      .then((response) => response.json())
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch((error) => console.error("Failed to fetch properties:", error));
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  const handleBooking = (propertyId, roomId) => {
    navigate(`/book-room/${propertyId}/${roomId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property.property_id}>
            <Paper elevation={3} sx={{ height: "100%" }}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://cdn.britannica.com/96/115096-050-5AFDAF5D/Bellagio-Hotel-Casino-Las-Vegas.jpg"
                  alt="Property"
                />
                <CardContent>
                  <Typography variant="h5" component="div">
                    Property ID: {property.property_id}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Agent ID: {property.agent_id}
                  </Typography>
                  {property.rooms.map((room) => (
                    <Box
                      key={room.room_id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1,
                      }}
                    >
                      <Typography variant="body2">
                        Room {room.room_id} - {room.size}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleBooking(property.property_id, room.room_id)
                        }
                      >
                        Book Now
                      </Button>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default PropertyList;