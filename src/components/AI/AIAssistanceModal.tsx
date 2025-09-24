import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Generate AI assistance when modal opens
  useEffect(() => {
    if (isOpen && !suggestion && !error) {
      generateAssistance();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Focus trap for accessibility
  useEffect(() => {
    if (isOpen) {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        const firstFocusable = focusableElements[0] as HTMLElement;
        const lastFocusable = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        const handleTabKey = (event: KeyboardEvent) => {
          if (event.key === "Tab") {
            if (event.shiftKey) {
              if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                event.preventDefault();
              }
            } else {
              if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                event.preventDefault();
              }
            }
          }
        };

        document.addEventListener("keydown", handleTabKey);
        return () => document.removeEventListener("keydown", handleTabKey);
      }
    }
  }, [isOpen, suggestion, error]);

  const generateAssistance = async () => {
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
  };

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

  if (!isOpen) return null;

  return (
    <div
      className="ai-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
      aria-describedby="ai-modal-description">
      <div
        ref={modalRef}
        className="ai-modal-content"
        onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                id="ai-modal-title"
                className="text-lg font-semibold text-foreground">
                {t("situation.aiModal.title")}
              </h3>
              <p
                id="ai-modal-description"
                className="text-sm text-muted-foreground mt-1">
                {t("situation.aiModal.subtitle")}
              </p>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="btn-ghost p-2 -mr-2"
              aria-label="Close AI assistance modal">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="min-h-48">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="loading-spinner w-8 h-8 mb-4"></div>
                <p className="text-muted-foreground">
                  {t("situation.aiModal.generating")}
                </p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="bg-error/10 border border-error/20 rounded-md p-4 mb-4">
                  <p className="text-error font-medium">{error}</p>
                </div>
                <button onClick={handleRetry} className="btn-primary">
                  {t("situation.aiModal.retry")}
                </button>
              </div>
            )}

            {suggestion && (
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  {t("situation.aiModal.suggestion")}
                </h4>
                <div className="bg-muted/50 border border-border rounded-md p-4 mb-6">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {suggestion}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={onClose}
                    className="btn-outline order-1 sm:order-none">
                    {t("situation.aiModal.discard")}
                  </button>
                  <button onClick={handleEdit} className="btn-secondary">
                    {t("situation.aiModal.edit")}
                  </button>
                  <button onClick={handleAccept} className="btn-primary">
                    {t("situation.aiModal.accept")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
