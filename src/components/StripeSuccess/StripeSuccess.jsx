import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useMess } from '../../context/MessContext';
import './StripeSuccess.scss';

const StripeSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handlePaymentSuccess } = useToast();
  const { checkPaymentStatus, getUserMess } = useMess();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const handleSuccessfulPayment = async () => {
      try {
        // Get payment intent ID from URL params
        const paymentIntentId = searchParams.get('payment_intent');
        const messId = searchParams.get('mess_id');
        
        if (paymentIntentId && messId) {
          // Check payment status
          const paymentResult = await checkPaymentStatus(messId);
          
          if (paymentResult.success) {
            setPaymentData(paymentResult.data);
            
            // Refresh user's mess information
            await getUserMess();
            
            // Show success toast
            handlePaymentSuccess();
          } else {
            console.error('Payment verification failed:', paymentResult.message);
          }
        }
      } catch (error) {
        console.error('Error processing payment success:', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleSuccessfulPayment();
    
    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchParams, handlePaymentSuccess, navigate, checkPaymentStatus, getUserMess]);

  if (isLoading) {
    return (
      <div className="stripe-success loading">
        <div className="success-container">
          <div className="loading-spinner-large"></div>
          <h2>Verifying Payment...</h2>
          <p>Please wait while we confirm your payment and activate your subscription.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stripe-success">
      <div className="success-container">
        <div className="success-icon">
          <div className="checkmark">✓</div>
        </div>
        <h1>Payment Successful!</h1>
        <p>Welcome to MessMaster Premium! 🎉</p>
        
        {paymentData && (
          <div className="payment-details">
            <h3>Subscription Details</h3>
            <div className="detail-item">
              <span className="label">Mess ID:</span>
              <span className="value">{paymentData.messId}</span>
            </div>
            <div className="detail-item">
              <span className="label">Status:</span>
              <span className="value success">{paymentData.subscriptionStatus}</span>
            </div>
            <div className="detail-item">
              <span className="label">Started:</span>
              <span className="value">{new Date(paymentData.subscriptionStartDate).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Expires:</span>
              <span className="value">{new Date(paymentData.subscriptionEndDate).toLocaleDateString()}</span>
            </div>
          </div>
        )}
        
        <div className="features-activated">
          <h3>You now have full access to:</h3>
          <ul>
            <li>✅ Student dashboard access</li>
            <li>✅ Mess manager tools</li>
            <li>✅ Menu voting and feedback</li>
            <li>✅ Real-time notifications</li>
            <li>✅ Analytics and insights</li>
          </ul>
        </div>
        
        <p className="redirect-info">
          Redirecting you to the homepage in 5 seconds...
        </p>
        
        <div className="action-buttons">
          <button 
            onClick={() => navigate('/')}
            className="continue-btn primary"
          >
            Continue to MessMaster
          </button>
          <button 
            onClick={() => navigate('/manager')}
            className="continue-btn secondary"
          >
            Go to Manager Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default StripeSuccess;
