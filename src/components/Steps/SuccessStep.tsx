import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
  Gavel as GavelIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useApplication } from '../../contexts/ApplicationContext';

export const SuccessStep: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { resetApplication } = useApplication();

  // Generate mock reference number
  const referenceNumber = `SSP-${Date.now().toString().slice(-8)}`;

  const handleNewApplication = () => {
    resetApplication();
  };

  const nextSteps = [
    {
      icon: <ScheduleIcon color="primary" />,
      text: t('success.processing'),
    },
    {
      icon: <EmailIcon color="primary" />,
      text: t('success.contact'),
    },
    {
      icon: <GavelIcon color="primary" />,
      text: t('success.decision'),
    },
  ];

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Card
        elevation={3}
        sx={{
          borderTop: 4,
          borderColor: 'success.main',
          textAlign: 'center',
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <CheckCircleIcon
            sx={{
              fontSize: 80,
              color: 'success.main',
              mb: 2,
            }}
          />
          
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              mb: 1,
              fontSize: { xs: '1.75rem', md: '2.125rem' },
            }}
          >
            {t('success.title')}
          </Typography>
          
          <Typography
            variant="h6"
            color="success.main"
            sx={{ fontWeight: 500, mb: 3 }}
          >
            {t('success.subtitle')}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, lineHeight: 1.6 }}
          >
            {t('success.message')}
          </Typography>

          <Box
            sx={{
              bgcolor: 'grey.50',
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              p: 3,
              mb: 4,
            }}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {t('success.referenceNumber')}
            </Typography>
            <Chip
              label={referenceNumber}
              color="primary"
              variant="outlined"
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                py: 2,
                px: 1,
                height: 'auto',
              }}
            />
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ textAlign: 'left' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 2,
                textAlign: 'center',
              }}
            >
              {t('success.nextSteps')}
            </Typography>

            <List sx={{ py: 0 }}>
              {nextSteps.map((step, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {step.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={step.text}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: { lineHeight: 1.5 },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={handleNewApplication}
              startIcon={<RefreshIcon />}
              size="large"
              sx={{
                minWidth: { xs: '100%', sm: 220 },
                py: 1.5,
                fontWeight: 600,
              }}
            >
              {t('success.newApplication')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};