import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import { useToast } from '../../context/ToastContext';
import './SubscriptionManager.scss';

const SubscriptionManager = () => {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [messId, setMessId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { purchaseSubscription, currentMess, subscriptionStatus } = useMess();
  const { addToast } = useToast();

  const plans = {
    basic: {
      name: 'Basic Plan',
      price: 49.99,
      maxUsers: 25,
      features: ['Basic Menu Management', 'Student Feedback', 'Basic Analytics'],
      recommended: false
    },
    premium: {
      name: 'Premium Plan',
      price: 99.99,
      maxUsers: 50,
      features: ['Advanced Menu Management', 'Real-time Feedback', 'Advanced Analytics', 'Custom Reports'],
      recommended: true
    },
    enterprise: {
      name: 'Enterprise Plan',
      price: 199.99,
      maxUsers: 100,
      features: ['Everything in Premium', 'Priority Support', 'Custom Integrations', 'Advanced Security'],
      recommended: false
    }
  };

  const handleSubscription = async (e) => {
    e.preventDefault();
    
    if (!messId.trim()) {
      addToast({
        message: '🎯 Please enter your Mess ID',
        type: 'warning',
        duration: 3000
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await purchaseSubscription(messId, selectedPlan);
      
      if (result.success) {
        addToast({
          message: `🚀 Redirecting to payment for ${plans[selectedPlan].name}...`,
          type: 'info',
          duration: 3000
        });
        
        // Redirect to Stripe after a short delay
        setTimeout(() => {
          window.open(result.checkoutUrl, '_blank');
        }, 1000);
      } else {
        addToast({
          message: `❌ ${result.message}`,
          type: 'error',
          duration: 4000
        });
      }
    } catch (error) {
      addToast({
        message: '🔧 Something went wrong. Please try again.',
        type: 'error',
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (currentMess && subscriptionStatus.isActive) {
    return (
      <div className="subscription-manager active">
        <div className="active-subscription">
          <h2>✅ Active Subscription</h2>
          <div className="subscription-details">
            <div className="detail-item">
              <span className="label">Mess:</span>
              <span className="value">{currentMess.name}</span>
            </div>
            <div className="detail-item">
              <span className="label">Plan:</span>
              <span className="value">{plans[subscriptionStatus.plan]?.name || 'Premium'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Users:</span>
              <span className="value">{subscriptionStatus.currentUsers}/{subscriptionStatus.maxUsers}</span>
            </div>
            <div className="detail-item">
              <span className="label">Expires:</span>
              <span className="value">{subscriptionStatus.expiresAt}</span>
            </div>
          </div>
          <button className="manage-subscription">
            Manage Subscription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-manager">
      <div className="subscription-header">
        <h2>🚀 Choose Your Mess Management Plan</h2>
        <p>Select the perfect plan for your mess and start managing meals efficiently!</p>
      </div>

      <div className="subscription-plans">
        {Object.entries(plans).map(([key, plan]) => (
          <div 
            key={key}
            className={`plan-card ${selectedPlan === key ? 'selected' : ''} ${plan.recommended ? 'recommended' : ''}`}
            onClick={() => setSelectedPlan(key)}
          >
            {plan.recommended && <div className="recommended-badge">Recommended</div>}
            
            <h3>{plan.name}</h3>
            <div className="price">
              <span className="amount">${plan.price}</span>
              <span className="period">/month</span>
            </div>
            <div className="max-users">Up to {plan.maxUsers} users</div>
            
            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            
            <div className="select-indicator">
              {selectedPlan === key ? '✅ Selected' : 'Click to select'}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubscription} className="subscription-form">
        <div className="form-group">
          <label htmlFor="messId">Your Mess ID</label>
          <input
            type="text"
            id="messId"
            value={messId}
            onChange={(e) => setMessId(e.target.value.toUpperCase())}
            placeholder="e.g., MESS001"
            required
            disabled={isLoading}
          />
          <small>If you don't have a Mess ID, one will be generated for you</small>
        </div>

        <div className="selected-plan-summary">
          <h4>Selected Plan: {plans[selectedPlan].name}</h4>
          <p>
            <strong>${plans[selectedPlan].price}/month</strong> for up to {plans[selectedPlan].maxUsers} users
          </p>
        </div>

        <button 
          type="submit" 
          className="subscribe-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Processing...
            </>
          ) : (
            `Subscribe to ${plans[selectedPlan].name} - $${plans[selectedPlan].price}/month`
          )}
        </button>
      </form>
    </div>
  );
};

export default SubscriptionManager;
