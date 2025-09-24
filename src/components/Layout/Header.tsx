import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLang);
  };

  return (
    <AppBar position="static" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                width: 40,
                height: 40,
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              SSP
            </Avatar>
            <Box>
              <Typography
                variant={isMobile ? 'h6' : 'h5'}
                component="h1"
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  lineHeight: 1.2,
                }}
              >
                Social Support Portal
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Government Financial Assistance Application
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<LanguageIcon />}
              onClick={toggleLanguage}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                borderColor: 'divider',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                },
              }}
            >
              {t('navigation.language')}
            </Button>
            <Button
              variant="text"
              color="primary"
              size={isMobile ? 'small' : 'medium'}
              sx={{ ml: 1 }}
            >
              {t('navigation.help')}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};