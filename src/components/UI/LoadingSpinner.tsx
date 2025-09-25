import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Skeleton,
} from "@mui/material";

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = 40,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}>
      {/* App Bar Skeleton */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
        }}>
        <Container maxWidth="xl">
          <Toolbar
            sx={{ justifyContent: "space-between", py: 2, minHeight: 56 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1.5,
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                }}>
                SSP
              </Box>
              <Box>
                <Skeleton variant="text" width={200} height={32} />
                <Skeleton variant="text" width={150} height={20} />
              </Box>
            </Box>
            <Skeleton variant="rounded" width={80} height={32} />
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Loading Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          py: 4,
        }}>
        <CircularProgress size={size} />
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>

        {/* Content Skeleton */}
        <Box sx={{ mt: 4, width: "100%", maxWidth: 600 }}>
          <Container>
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{ borderRadius: 2 }}
            />
          </Container>
        </Box>
      </Box>
    </Box>
  );
};
