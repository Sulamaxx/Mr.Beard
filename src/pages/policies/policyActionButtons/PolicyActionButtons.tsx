import React from 'react';
import './PolicyActionButtons.scss';

interface PolicyActionButtonsProps {
  onBackToHome?: () => void;
  onContinueShopping?: () => void;
}

const PolicyActionButtons: React.FC<PolicyActionButtonsProps> = ({
  onBackToHome,
  onContinueShopping
}) => {
  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      // Default behavior - navigate to home
      window.location.href = '/';
    }
  };

  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping();
    } else {
      // Default behavior - navigate to products/shop
      window.location.href = '/products';
    }
  };

  return (
    <div className="policy-action-buttons d-flex justify-content-center gap-3 flex-wrap">
      <button 
        className="btn btn-secondary btn-back"
        onClick={handleBackToHome}
      >
        Back to home
      </button>
      <button 
        className="btn btn-primary btn-continue"
        onClick={handleContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default PolicyActionButtons;