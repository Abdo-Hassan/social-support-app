import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Paper,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { AIAssistanceRequest, AIAssistanceResponse } from "../../types/form";
import {
  generateAIAssistance,
  generateMockAIAssistance,
} from "../../services/aiService";

interface AIAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (text: string) => void;
  onEdit: (text: string) => void;
  request: AIAssistanceRequest;
}

export const AIAssistanceModal: React.FC<AIAssistanceModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  onEdit,
  request,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Define generateAssistance first before using it in useEffect
  const generateAssistance = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setSuggestion("");

    try {
      let response: AIAssistanceResponse;
      try {
        response = await generateAIAssistance(request);
      } catch (apiError) {
        // Fall back to mock service
        response = await generateMockAIAssistance(request);
      }

      if (response.success && response.suggestion) {
        setSuggestion(response.suggestion);
      } else {
        setError(response.error || t("situation.aiModal.error"));
      }
    } catch (error) {
      console.error("AI assistance error:", error);
      setError(t("situation.aiModal.error"));
    } finally {
      setIsLoading(false);
    }
  }, [request, t]);

  // Generate AI assistance when modal opens
  useEffect(() => {
    if (isOpen && !suggestion && !error) {
      generateAssistance();
    }
  }, [isOpen, suggestion, error, generateAssistance]);

  const handleAccept = () => {
    onAccept(suggestion);
    onClose();
  };

  const handleEdit = () => {
    onEdit(suggestion);
    onClose();
  };

  const handleRetry = () => {
    setSuggestion("");
    setError("");
    generateAssistance();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="ai-modal-title"
      aria-describedby="ai-modal-description">
      <DialogTitle
        id="ai-modal-title"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}>
        <Box>
          <Typography variant="h6" component="h2" fontWeight={600}>
            {t("situation.aiModal.title")}
          </Typography>
          <Typography
            id="ai-modal-description"
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}>
            {t("situation.aiModal.subtitle")}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="Close AI assistance modal"
          sx={{ ml: 2 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ minHeight: 300 }}>
        {isLoading && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={8}>
            <CircularProgress size={32} sx={{ mb: 2 }} />
            <Typography color="text.secondary">
              {t("situation.aiModal.generating")}
            </Typography>
          </Box>
        )}

        {error && (
          <Box textAlign="center" py={8}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button variant="contained" onClick={handleRetry}>
              {t("situation.aiModal.retry")}
            </Button>
          </Box>
        )}

        {suggestion && (
          <Box>
            <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2 }}>
              {t("situation.aiModal.suggestion")}
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                mb: 3,
                backgroundColor: "grey.50",
                border: 1,
                borderColor: "grey.200",
              }}>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}>
                {suggestion}
              </Typography>
            </Paper>
          </Box>
        )}
      </DialogContent>

      {suggestion && (
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button variant="outlined" onClick={onClose}>
            {t("situation.aiModal.discard")}
          </Button>
          <Button variant="outlined" onClick={handleEdit}>
            {t("situation.aiModal.edit")}
          </Button>
          <Button variant="contained" onClick={handleAccept}>
            {t("situation.aiModal.accept")}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
