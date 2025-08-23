import apiRequest from './apiRequest';

export const useAnalyticsData = () => {
  // Get the JWT token from localStorage
  const getToken = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  };

  // Function to get daily analytics
  const getDailyAnalytics = async (messId, date) => {
    try {
      const config = getToken();
      const response = await apiRequest.get(`/analytics/daily/${messId}?date=${date}`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching daily analytics:', error);
      throw error;
    }
  };

  // Function to get range analytics
  const getRangeAnalytics = async (messId, startDate, endDate) => {
    try {
      const config = getToken();
      const response = await apiRequest.get(
        `/analytics/range/${messId}?startDate=${startDate}&endDate=${endDate}`, 
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching range analytics:', error);
      throw error;
    }
  };

  // Function to get analytics summary
  const getAnalyticsSummary = async (messId, period = 'month') => {
    try {
      const config = getToken();
      const response = await apiRequest.get(
        `/analytics/summary/${messId}?period=${period}`, 
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      throw error;
    }
  };

  // Function to record meal booking
  const recordMealBooking = async (data) => {
    try {
      const config = getToken();
      const response = await apiRequest.post('/analytics/booking', data, config);
      return response.data;
    } catch (error) {
      console.error('Error recording meal booking:', error);
      throw error;
    }
  };

  // Function to record skipped meal
  const recordSkippedMeal = async (data) => {
    try {
      const config = getToken();
      const response = await apiRequest.post('/analytics/skip', data, config);
      return response.data;
    } catch (error) {
      console.error('Error recording skipped meal:', error);
      throw error;
    }
  };

  // Function to update wastage
  const updateWastage = async (data) => {
    try {
      const config = getToken();
      const response = await apiRequest.post('/analytics/wastage', data, config);
      return response.data;
    } catch (error) {
      console.error('Error updating wastage:', error);
      throw error;
    }
  };

  // Function to get monthly analytics
  const getMonthlyAnalytics = async (messId, month, year) => {
    try {
      const config = getToken();
      let url = `/analytics/monthly/${messId}`;
      if (month !== undefined && year !== undefined) {
        url += `?month=${month}&year=${year}`;
      }
      const response = await apiRequest.get(url, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching monthly analytics:', error);
      throw error;
    }
  };

  // Function to generate monthly summary
  const generateMonthlySummary = async (messId, month, year) => {
    try {
      const config = getToken();
      const response = await apiRequest.post(
        `/analytics/monthly/generate/${messId}`,
        { month, year },
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error generating monthly summary:', error);
      throw error;
    }
  };

  // Function to reset daily counters after generating a monthly report
  const resetDailyCounters = async (messId, month, year, keepHistoricalData = true) => {
    try {
      const config = getToken();
      const response = await apiRequest.post(
        `/analytics/monthly/reset/${messId}`,
        { month, year, keepHistoricalData },
        config
      );
      return response.data;
    } catch (error) {
      console.error('Error resetting daily counters:', error);
      throw error;
    }
  };

  return {
    getDailyAnalytics,
    getRangeAnalytics,
    getAnalyticsSummary,
    recordMealBooking,
    recordSkippedMeal,
    updateWastage,
    getMonthlyAnalytics,
    generateMonthlySummary,
    resetDailyCounters
  };
};

export default useAnalyticsData;
