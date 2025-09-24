import React from "react";
import { useTranslation } from "react-i18next";
import { useApplication } from "../../contexts/ApplicationContext";

export const SuccessStep: React.FC = () => {
  const { t } = useTranslation();
  const { referenceNumber, resetApplication } = useApplication();

  const handleNewApplication = () => {
    resetApplication();
  };

  // Generate reference number if not exists
  const displayReferenceNumber =
    referenceNumber || `SSP-${Date.now().toString().slice(-8)}`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-6 w-20 h-20 bg-success rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-success-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("success.title")}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          {t("success.subtitle")}
        </p>

        {/* Reference Number */}
        <div className="form-section text-left mb-8">
          <div className="bg-primary/5 border border-primary/20 rounded-md p-4 mb-6">
            <h3 className="font-semibold text-foreground mb-2">
              {t("success.referenceNumber")}
            </h3>
            <div className="flex items-center">
              <code className="bg-primary/10 px-3 py-2 rounded text-primary font-mono text-lg">
                {displayReferenceNumber}
              </code>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(displayReferenceNumber)
                }
                className="ml-3 btn-ghost p-2"
                aria-label="Copy reference number to clipboard">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <p className="text-foreground mb-6">{t("success.message")}</p>

          {/* Next Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {t("success.nextSteps")}
            </h3>

            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-primary-foreground text-sm font-semibold">
                    1
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {t("success.processing")}
                </p>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-primary-foreground text-sm font-semibold">
                    2
                  </span>
                </div>
                <p className="text-muted-foreground">{t("success.contact")}</p>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  <span className="text-primary-foreground text-sm font-semibold">
                    3
                  </span>
                </div>
                <p className="text-muted-foreground">{t("success.decision")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={handleNewApplication} className="btn-primary">
            {t("success.newApplication")}
          </button>

          <a href="#status" className="btn-outline">
            Check Application Status
          </a>
        </div>

        {/* Support Information */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="bg-muted/30 rounded-md p-4">
            <h4 className="font-medium text-foreground mb-2">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-3">
              If you have questions about your application or need assistance,
              please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <a
                href="tel:1-800-SUPPORT"
                className="text-primary hover:text-primary-hover transition-colors">
                📞 1-800-SUPPORT
              </a>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <a
                href="mailto:support@socialservices.gov"
                className="text-primary hover:text-primary-hover transition-colors">
                ✉️ support@socialservices.gov
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
