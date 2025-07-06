import React, { useState, useEffect } from "react";
import { useMess } from "../../context/MessContext";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import "./MessIdGenerator.scss";
import { useAuth } from "../../context/AuthContext";
const MessIdGenerator = () => {
  const [messName, setMessName] = useState("");
  const [generatedMessId, setGeneratedMessId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Generated, 3: Payment
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user, updateUser } = useAuth();
  const { createMessId } = useMess();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Check authentication and role on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user"); // Renamed to avoid conflict

    if (token && storedUser) {
      const userData = JSON.parse(storedUser);
      // Only mess managers can generate Mess IDs
      if (userData.role === "mess_manager" || userData.role === "super_admin") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        addToast({
          message: "� Only Mess Managers can generate Mess IDs",
          type: "warning",
          duration: 4000,
          action: {
            label: "Login as Manager",
            onClick: () => navigate("/login"),
          },
        });
      }
    } else {
      setIsAuthenticated(false);
      addToast({
        message: "�🔐 Please log in as a Mess Manager to generate a Mess ID",
        type: "warning",
        duration: 4000,
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
    }
  }, [user, addToast, navigate]); // Added dependencies

  const handleGenerateMessId = async (e) => {
    e.preventDefault();

    // Double-check authentication and role before proceeding
    const token = localStorage.getItem("token");
    const storedUserData = localStorage.getItem("user"); // Renamed to avoid conflict

    if (!token || !storedUserData) {
      addToast({
        message: "🔐 Please log in as a Mess Manager to generate a Mess ID",
        type: "error",
        duration: 4000,
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }      const userData = JSON.parse(storedUserData);
    if (userData.role !== "mess_manager" && userData.role !== "super_admin") {
      addToast({
        message: "🔒 Only Mess Managers can generate Mess IDs",
        type: "error",
        duration: 4000,
        action: {
          label: "Login as Manager",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    if (!messName.trim()) {
      addToast({
        message: "🏢 Please enter your mess name",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await createMessId(messName.trim());

      if (result.success) {
        setGeneratedMessId({
          messId: result.messId,
          messName: messName.trim(),
          message: result.message,
        });
        setStep(2);
        const updatedUser = { ...user, messId: result.messId };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Update auth context if you have an update function
        if (updateUser) {
          updateUser(updatedUser);
        }
        addToast({
          message: `🎉 Mess ID generated successfully: ${result.messId}`,
          type: "success",
          duration: 5000,
        });
      } else {
        addToast({
          message: `❌ ${result.message}`,
          type: "error",
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error generating Mess ID:", error);
      addToast({
        message: "🔧 Something went wrong. Please try again.",
        type: "error",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    setStep(3);
    addToast({
      message: "💳 Please complete payment to activate your Mess ID",
      type: "info",
      duration: 4000,
    });
  };

  const handleStartOver = () => {
    setStep(1);
    setMessName("");
    setGeneratedMessId(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast({
      message: "📋 Mess ID copied to clipboard!",
      type: "success",
      duration: 2000,
    });
  };

  const handleSubscriptionActivation = async () => {
    try {
      setIsLoading(true);
      console.log('MessIdGenerator - Starting subscription activation');
      console.log('MessIdGenerator - Current user:', user);
      console.log('MessIdGenerator - Generated mess ID:', generatedMessId);

      // Update user object with mess ID and subscription status
      const updatedUser = {
        ...user,
        messId: generatedMessId.messId, // Use the generated mess ID
        subscriptionStatus: "active",
        subscriptionPlan: "premium", // or whatever plan they selected
      };

      console.log('MessIdGenerator - Updated user object:', updatedUser);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      console.log('MessIdGenerator - Updated localStorage');

      // Update auth context
      if (updateUser) {
        console.log('MessIdGenerator - Calling updateUser');
        updateUser(updatedUser);
      } else {
        console.error('MessIdGenerator - updateUser function not available');
      }

      // Show success toast
      addToast({
        message: "🎉 Subscription activated! Your mess is now ready to use.",
        type: "success",
        duration: 4000,
      });

      // Navigate to home page after short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Subscription activation failed:", error);
      addToast({
        message: "❌ Subscription activation failed. Please try again.",
        type: "error",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mess-id-generator">
      <div className="generator-container">
        <div className="generator-header">
          <h2>🎯 Generate Your Mess ID</h2>
          <p>Create a unique identifier for your mess management system</p>
        </div>

        {!isAuthenticated ? (
          <div className="auth-required">
            <div className="auth-icon">🔐</div>
            <h3>Mess Manager Access Required</h3>
            <p>
              Only Mess Managers can generate Mess IDs for their mess management
              system. Please log in with a Mess Manager account.
            </p>
            <div className="auth-buttons">
              <button
                onClick={() => navigate("/login")}
                className="login-btn primary"
              >
                🚀 Login as Manager
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="signup-btn secondary"
              >
                📝 Create Manager Account
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="progress-indicator">
              <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
                <span className="step-number">1</span>
                <span className="step-label">Details</span>
              </div>
              <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
                <span className="step-number">2</span>
                <span className="step-label">Generated</span>
              </div>
              <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
                <span className="step-number">3</span>
                <span className="step-label">Payment</span>
              </div>
            </div>

            {step === 1 && (
              <form onSubmit={handleGenerateMessId} className="generator-form">
                <div className="form-group">
                  <label htmlFor="messName">Mess Name</label>
                  <input
                    type="text"
                    id="messName"
                    value={messName}
                    onChange={(e) => setMessName(e.target.value)}
                    placeholder="e.g., Sunrise Hostel Mess"
                    required
                    disabled={isLoading}
                    maxLength={50}
                  />
                  <small>Enter a descriptive name for your mess</small>
                </div>

                <button
                  type="submit"
                  className="generate-btn"
                  disabled={isLoading || !messName.trim()}
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span className="icon">🎲</span>
                      Generate Mess ID
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 2 && generatedMessId && (
              <div className="generated-result">
                <div className="success-animation">
                  <div className="checkmark">✓</div>
                </div>

                <h3>🎉 Your Mess ID has been generated!</h3>

                <div className="mess-id-display">
                  <div className="mess-id-card">
                    <div className="card-header">
                      <span className="card-title">Mess ID</span>
                      <button
                        onClick={() => copyToClipboard(generatedMessId.messId)}
                        className="copy-btn"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                    </div>
                    <div className="mess-id-value">
                      {generatedMessId.messId}
                    </div>
                    <div className="mess-name">{generatedMessId.messName}</div>
                  </div>
                </div>

                <div className="important-note">
                  <div className="note-header">
                    <span className="icon">⚠️</span>
                    <strong>Important:</strong>
                  </div>
                  <p>
                    Your Mess ID has been created but is not yet active. You
                    need to complete payment to activate it and start using all
                    features.
                  </p>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={handleProceedToPayment}
                    className="payment-btn primary"
                  >
                    💳 Proceed to Payment
                  </button>
                  {/* <button 
                    onClick={handleStartOver}
                    className="start-over-btn secondary"
                  >
                    🔄 Generate New ID
                  </button> */}
                </div>
              </div>
            )}

            {step === 3 && generatedMessId && (
              <div className="payment-step">
                <h3>💳 Complete Your Subscription</h3>
                <p>
                  Your Mess ID <strong>{generatedMessId.messId}</strong> is
                  ready to be activated!
                </p>

                <div className="payment-info">
                  <div className="info-item">
                    <span className="label">Mess:</span>
                    <span className="value">{generatedMessId.messName}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Mess ID:</span>
                    <span className="value">{generatedMessId.messId}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Status:</span>
                    <span className="value pending">Pending Payment</span>
                  </div>
                </div>

                <div className="next-steps">
                  <h4>Next Steps:</h4>
                  <ol>
                    <li>Choose your subscription plan</li>
                    <li>Complete payment via Stripe</li>
                    <li>Your Mess ID will be activated immediately</li>
                    <li>Start managing your mess!</li>
                  </ol>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={handleSubscriptionActivation}
                    className="subscribe-btn primary"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MessIdGenerator;
