import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-card-border mt-auto py-6" role="contentinfo">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>© 2024 Government Social Services</span>
            <span>•</span>
            <a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <a 
              href="#support" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Technical Support
            </a>
            <a 
              href="tel:1-800-SUPPORT" 
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              1-800-SUPPORT
            </a>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-card-border">
          <p className="text-xs text-muted-foreground text-center">
            This application is secure and your information is protected. 
            For assistance with this application, please contact our support team.
          </p>
        </div>
      </div>
    </footer>
  );
};