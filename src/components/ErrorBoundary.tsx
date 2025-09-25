import React from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { Refresh } from "@mui/icons-material";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: 3,
            p: 3,
            bgcolor: "background.default",
          }}>
          <Alert severity="error" sx={{ maxWidth: 600, width: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {this.state.error?.message ||
                "An unexpected error occurred while loading the application."}
            </Typography>
          </Alert>

          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            size="large">
            Reload Application
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
