import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.50',
        borderTop: 1,
        borderColor: 'divider',
        py: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 2 }} />
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ fontWeight: 400 }}
        >
          © 2024 Social Support Portal. Government Financial Assistance Application.
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          display="block"
          sx={{ mt: 1 }}
        >
          Secure • Confidential • Accessible
        </Typography>
      </Container>
    </Box>
  );
};