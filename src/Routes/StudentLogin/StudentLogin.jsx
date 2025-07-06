import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMess } from '../../context/MessContext';
import { useToast } from '../../context/ToastContext';
import MessIdInput from '../../components/MessIdInput/MessIdInput';
import './StudentLogin.scss';

const StudentLogin = () => {
  const [step, setStep] = useState(1); // 1: Mess ID, 2: Login Form
  const [selectedMess, setSelectedMess] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { currentMess } = useMess();
  const { addToast } = useToast();

  const handleMessJoined = (mess) => {
    setSelectedMess(mess);
    setStep(2);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate login process
      const loginResult = await login(formData.email, formData.password);
      
      if (loginResult.success) {
        addToast({
          message: `🎉 Welcome to ${selectedMess.name}! You're now logged in.`,
          type: 'success',
          duration: 4000
        });
        navigate('/student');
      } else {
        addToast({
          message: `❌ Login failed: ${loginResult.message}`,
          type: 'error',
          duration: 4000
        });
      }
    } catch (error) {
      addToast({
        message: '🔧 Login failed. Please check your credentials.',
        type: 'error',
        duration: 4000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (step === 1) {
    return (
      <div className="student-login">
        <MessIdInput onSuccess={handleMessJoined} userRole="student" />
      </div>
    );
  }

  return (
    <div className="student-login">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>🎓 Student Login</h2>
            <p>Welcome to <strong>{selectedMess.name}</strong></p>
            <div className="mess-info">
              <span className="mess-id">Mess ID: {selectedMess.id}</span>
              <span className="subscription-status">
                {selectedMess.subscription.isActive ? '✅ Active' : '❌ Inactive'}
              </span>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Logging in...
                </>
              ) : (
                'Login to Mess'
              )}
            </button>
          </form>

          <div className="login-footer">
            <button 
              type="button" 
              className="back-button"
              onClick={() => setStep(1)}
            >
              ← Change Mess
            </button>
            <button 
              type="button" 
              className="signup-link"
              onClick={() => navigate('/signup')}
            >
              New user? Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
