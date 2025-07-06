import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast/Toast';
import { useSubscribe } from './SubscribeContext';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const { setSubscribed } = useSubscribe();

  // Stripe checkout URL
  const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/test_7sYcN53Z86A19fmbBnfUQ01";

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      ...toast,
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove after duration (if specified)
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 4000);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const handleStripeRedirect = useCallback(() => {
    // Set subscription to true temporarily (for demo purposes)
    setSubscribed(true);
    
    // Show success notification
    addToast({
      message: `🎉 Awesome! Your subscription is now active! You can now access all features including login and signup.`,
      type: 'success',
      duration: 4000,
    });
    
    // Set a timeout to reset after 5 minutes (as per the original logic)
    setTimeout(() => {
      setSubscribed(false);
      // Show expiration notice
      addToast({
        message: `⏰ Your trial period has expired. Subscribe again to continue enjoying all features!`,
        type: 'warning',
        duration: 5000,
        actionButton: (
          <button onClick={() => window.open(STRIPE_CHECKOUT_URL, "_blank")}>
            Renew Subscription
          </button>
        )
      });
    }, 300000); // 5 minutes = 300,000 ms
    
    // Redirect to Stripe checkout
    window.open(STRIPE_CHECKOUT_URL, "_blank");
    
    // Remove current subscription-related toasts
    setToasts(prev => prev.filter(toast => 
      !toast.message.includes('Subscribe') && !toast.message.includes('Ready to')
    ));
  }, [setSubscribed, addToast]);

  const showSubscriptionToast = useCallback((action = 'access this feature') => {
    return addToast({
      message: `🚀 Ready to ${action}? Subscribe to unlock all features and start managing your mess meals efficiently!`,
      type: 'info',
      duration: 5000,
      actionButton: (
        <button onClick={handleStripeRedirect}>
          Subscribe Now
        </button>
      )
    });
  }, [addToast, handleStripeRedirect]);

  const showLoginSubscriptionToast = useCallback(() => {
    return addToast({
      message: `🎯 Want to login? Subscribe first to access your personalized mess management dashboard!`,
      type: 'info',
      duration: 5000,
      actionButton: (
        <button onClick={handleStripeRedirect}>
          Subscribe Now
        </button>
      )
    });
  }, [addToast, handleStripeRedirect]);

  const showSignupSubscriptionToast = useCallback(() => {
    return addToast({
      message: `🌟 Ready to join? Subscribe to create your account and start enjoying better mess management!`,
      type: 'info',
      duration: 5000,
      actionButton: (
        <button onClick={handleStripeRedirect}>
          Subscribe & Join
        </button>
      )
    });
  }, [addToast, handleStripeRedirect]);

  // Function to handle successful payment (can be called from success page or webhook)
  const handlePaymentSuccess = useCallback(() => {
    setSubscribed(true);
    addToast({
      message: `🎉 Payment successful! Welcome to MessMaster Premium! You now have full access to all features.`,
      type: 'success',
      duration: 6000,
    });
  }, [setSubscribed, addToast]);

  // Function to handle payment failure
  const handlePaymentFailure = useCallback(() => {
    addToast({
      message: `💳 Payment was not completed. Don't worry, you can try again anytime!`,
      type: 'warning',
      duration: 5000,
      actionButton: (
        <button onClick={handleStripeRedirect}>
          Try Again
        </button>
      )
    });
  }, [addToast, handleStripeRedirect]);

  const value = {
    addToast,
    removeToast,
    showSubscriptionToast,
    showLoginSubscriptionToast,
    showSignupSubscriptionToast,
    handlePaymentSuccess,
    handlePaymentFailure,
    handleStripeRedirect,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            isVisible={true}
            onClose={() => removeToast(toast.id)}
            duration={0} // Duration is handled by the context
            actionButton={toast.actionButton}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
