import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import { useToast } from '../../context/ToastContext';
import './MessIdInput.scss';

const MessIdInput = ({ onSuccess, userRole = 'student' }) => {
  const [messId, setMessId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { joinMess, validateMessId } = useMess();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!messId.trim()) {
      addToast({
        message: '🎯 Please enter a valid Mess ID',
        type: 'warning',
        duration: 3000
      });
      return;
    }

    setIsLoading(true);

    try {
      if (userRole === 'mess_manager') {
        // For mess managers, just validate the mess ID
        const result = await validateMessId(messId);
        if (result.success) {
          addToast({
            message: `🎉 Welcome back! ${result.mess.name} dashboard is ready.`,
            type: 'success',
            duration: 4000
          });
          onSuccess && onSuccess(result.mess);
        } else {
          addToast({
            message: `❌ ${result.message}. Please check your Mess ID or contact support.`,
            type: 'error',
            duration: 4000
          });
        }
      } else {
        // For students, join the mess
        const result = await joinMess(messId, 'temp-user@email.com', userRole);
        if (result.success) {
          addToast({
            message: `🎉 ${result.message}`,
            type: 'success',
            duration: 4000
          });
          onSuccess && onSuccess(result.mess);
        } else {
          addToast({
            message: `❌ ${result.message}`,
            type: 'error',
            duration: 4000
          });
        }
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

  return (
    <div className="mess-id-input">
      <div className="mess-id-card">
        <div className="mess-id-header">
          <h3>
            {userRole === 'mess_manager' ? '🏢 Access Your Mess Dashboard' : '🍽️ Join Your Mess'}
          </h3>
          <p>
            {userRole === 'mess_manager' 
              ? 'Enter your unique Mess ID to access your management dashboard'
              : 'Enter the Mess ID provided by your mess manager to join'
            }
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mess-id-form">
          <div className="input-group">
            <label htmlFor="messId">Mess ID</label>
            <input
              type="text"
              id="messId"
              value={messId}
              onChange={(e) => setMessId(e.target.value.toUpperCase())}
              placeholder="e.g., MESS001"
              className="mess-id-input-field"
              disabled={isLoading}
            />
            <small className="input-hint">
              Format: MESS + 3 digits (e.g., MESS001)
            </small>
          </div>
          
          <button 
            type="submit" 
            className="mess-id-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Connecting...
              </>
            ) : (
              userRole === 'mess_manager' ? 'Access Dashboard' : 'Join Mess'
            )}
          </button>
        </form>
        
        <div className="mess-id-help">
          <p>
            {userRole === 'mess_manager' 
              ? "Don't have a Mess ID? " 
              : "Don't have a Mess ID? Ask your mess manager or "
            }
            <button 
              type="button" 
              className="help-link"
              onClick={() => addToast({
                message: '📞 Contact support at support@messmaster.com or call +1-234-567-8900',
                type: 'info',
                duration: 6000
              })}
            >
              contact support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessIdInput;
