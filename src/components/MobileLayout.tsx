
import React from 'react';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  title, 
  showBackButton = false, 
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {title && (
        <div className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="flex items-center px-4 py-3">
            {showBackButton && (
              <button
                onClick={onBack}
                className="mr-3 p-2 hover:bg-accent rounded-full"
              >
                ←
              </button>
            )}
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          </div>
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;
