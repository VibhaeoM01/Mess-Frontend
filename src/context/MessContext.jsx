import React, { createContext, useContext, useState, useCallback } from 'react';
import apiRequest from '../lib/apiRequest';

const MessContext = createContext();

export const useMess = () => {
  const context = useContext(MessContext);
  if (!context) {
    throw new Error('useMess must be used within a MessProvider');
  }
  return context;
};

export const MessProvider = ({ children }) => {
  const [currentMess, setCurrentMess] = useState(null);
  const [messUsers, setMessUsers] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isActive: false,
    plan: null,
    expiresAt: null,
    maxUsers: 0,
    currentUsers: 0
  });

  // Get user's current mess information
  const getUserMess = useCallback(async () => {
    try {
      const response = await apiRequest.get('/auth/user-mess');
      if (response.data) {
        setCurrentMess({
          id: response.data.messId,
          name: response.data.messName,
          manager: response.data.manager,
          isManager: response.data.isManager
        });
        setSubscriptionStatus({
          isActive: response.data.subscriptionStatus === 'active',
          plan: 'premium', // Default plan
          expiresAt: response.data.subscriptionEndDate,
          maxUsers: 50,
          currentUsers: response.data.studentCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user mess:', error);
    }
  }, []);

  // Create a new Mess ID
  const createMessId = useCallback(async (messName) => {
    try {
      const response = await apiRequest.post('/auth/create-mess-id', {
        messName
      });
      return {
        success: true,
        messId: response.data.messId,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create Mess ID'
      };
    }
  }, []);

  // Join a mess using Mess ID
  const joinMess = useCallback(async (messId) => {
    try {
      const response = await apiRequest.post('/auth/join-mess', {
        messId
      });
      
      // Update current mess state
      await getUserMess();
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to join mess'
      };
    }
  }, [getUserMess]);

  // Get mess details by ID
  const getMessDetails = useCallback(async (messId) => {
    try {
      const response = await apiRequest.get(`/auth/mess-details/${messId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Mess not found'
      };
    }
  }, []);

  // Purchase subscription (simplified without Stripe for now)
  const purchaseSubscription = useCallback(async (messId, plan) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      // For now, just return a mock success response
      // In the future, this will integrate with Stripe
      return {
        success: true,
        message: 'Subscription feature coming soon!',
        checkoutUrl: '/subscribe' // Redirect to subscription page
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to process subscription'
      };
    }
  }, []);

  // Check payment status
  const checkPaymentStatus = useCallback(async (messId) => {
    try {
      const response = await apiRequest.get(`/payment/status/${messId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check payment status'
      };
    }
  }, []);

  // Mock mess data (in real app, this would come from API)
  const mockMessData = {
    'MESS001': {
      id: 'MESS001',
      name: 'Sunrise Hostel Mess',
      manager: 'John Doe',
      subscription: {
        isActive: true,
        plan: 'premium',
        expiresAt: '2025-12-31',
        maxUsers: 50,
        currentUsers: 23
      },
      students: ['student1@college.edu', 'student2@college.edu']
    },
    'MESS002': {
      id: 'MESS002',
      name: 'Moonlight Mess Hall',
      manager: 'Jane Smith',
      subscription: {
        isActive: false,
        plan: null,
        expiresAt: null,
        maxUsers: 0,
        currentUsers: 0
      },
      students: []
    }
  };

  const value = {
    currentMess,
    messUsers,
    subscriptionStatus,
    getUserMess,
    createMessId,
    joinMess,
    getMessDetails,
    purchaseSubscription,
    checkPaymentStatus,
    setCurrentMess,
    setSubscriptionStatus
  };

  return (
    <MessContext.Provider value={value}>
      {children}
    </MessContext.Provider>
  );
};
