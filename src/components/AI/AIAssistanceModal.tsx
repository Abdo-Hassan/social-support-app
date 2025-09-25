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
  TextField,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { AIAssistanceRequest, AIAssistanceResponse } from "../../types/form";
import { generateAIAssistance } from "../../services/aiService";

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
  const [editedText, setEditedText] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);

  // Define generateAssistance first before using it in useEffect
  const generateAssistance = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setSuggestion("");

    try {
      const response = await generateAIAssistance(request);

      if (response.success && response.suggestion) {
        setSuggestion(response.suggestion);
        setEditedText(response.suggestion);
      } else {
        // Use the specific error message from the service, or fallback to generic message
        setError(response.error || t("situation:aiModal.error"));
      }
    } catch (error) {
      console.error("AI assistance error:", error);
      setError(t("situation:aiModal.error"));
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

  // Handle keyboard events for accessibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === "Escape") {
        onClose();
      }

      // Focus trap
      if (event.key === "Tab") {
        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            event.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleAcceptEdited = () => {
    onAccept(editedText);
    onClose();
  };

  const handleRetry = () => {
    setSuggestion("");
    setEditedText("");
    setError("");
    setIsEditing(false);
    generateAssistance();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      role="dialog"
      aria-labelledby="ai-modal-title"
      aria-describedby="ai-modal-description"
      ref={modalRef}>
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
            {t("situation:aiModal.title")}
          </Typography>
          <Typography
            id="ai-modal-description"
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}>
            {t("situation:aiModal.subtitle")}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="Close AI assistance modal"
          sx={{ ml: 2 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {isLoading && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={8}>
            <CircularProgress size={32} sx={{ mb: 2 }} />
            <Typography color="text.secondary">
              {t("situation:aiModal.generating")}
            </Typography>
          </Box>
        )}

        {error && (
          <Box textAlign="center" py={8}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button variant="contained" onClick={handleRetry}>
              {t("situation:aiModal.retry")}
            </Button>
          </Box>
        )}

        {suggestion && (
          <Box>
            {isEditing ? (
              <TextField
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                multiline
                rows={8}
                fullWidth
                variant="outlined"
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    fontSize: "1rem",
                    lineHeight: 1.6,
                  },
                  "& textarea": {
                    resize: "vertical",
                    minHeight: "0px", // Equivalent to 8 rows
                  },
                }}
              />
            ) : (
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
            )}
          </Box>
        )}
      </DialogContent>

      {suggestion && (
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button variant="text" onClick={onClose}>
            {t("situation:aiModal.discard")}
          </Button>

          {isEditing ? (
            <>
              <Button variant="contained" onClick={handleAcceptEdited}>
                {t("situation:aiModal.accept")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" onClick={handleEdit}>
                {t("situation:aiModal.edit")}
              </Button>
              <Button variant="contained" onClick={handleAcceptEdited}>
                {t("situation:aiModal.accept")}
              </Button>
            </>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};
