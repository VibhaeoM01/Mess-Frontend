import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAnalyticsData from '../../lib/useAnalyticsData';
import { useAuth } from '../../context/AuthContext';
import { useMess } from '../../context/MessContext';
import { useToast } from '../../context/ToastContext';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Area
} from 'recharts';
import './analyticsDashboard.scss';

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function to get date range for the past week
const getLastWeekDates = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

// Helper function to get date range for the past month
const getLastMonthDates = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsDashboard = () => {
  const { messId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentMess } = useMess();
  const { addToast: showToast } = useToast();
  const analyticsService = useAnalyticsData();

  // State variables
  const [summaryData, setSummaryData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [wastageInput, setWastageInput] = useState({
    breakfast: 0,
    lunch: 0,
    snacks: 0,
    dinner: 0
  });
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);
  const [processingMonthly, setProcessingMonthly] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Fetch data based on selected time range
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get the mess ID from either params or context
        const targetMessId = messId || (currentMess ? currentMess.messId : null);
        
        if (!targetMessId) {
          showToast('No mess selected', 'error');
          return;
        }

        // Get date range based on selected time period
        let dateRange;
        if (timeRange === 'week') {
          dateRange = getLastWeekDates();
        } else if (timeRange === 'month') {
          dateRange = getLastMonthDates();
        }

        // Fetch summary data
        const summary = await analyticsService.getAnalyticsSummary(targetMessId, timeRange);
        setSummaryData(summary);

        // Fetch range data for charts
        const rangeData = await analyticsService.getRangeAnalytics(
          targetMessId, 
          dateRange.startDate, 
          dateRange.endDate
        );
        setChartData(rangeData.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        showToast('Failed to load analytics', 'error');
        setLoading(false);
      }
    };

    fetchData();
  }, [messId, currentMess, timeRange, analyticsService, showToast]);
  
  // Fetch monthly data when showing monthly report
  useEffect(() => {
    const fetchMonthlyData = async () => {
      if (!showMonthlyReport) return;
      
      try {
        setProcessingMonthly(true);
        
        // Get the mess ID from either params or context
        const targetMessId = messId || (currentMess ? currentMess.messId : null);
        
        if (!targetMessId) {
          showToast('No mess selected', 'error');
          setProcessingMonthly(false);
          return;
        }

        // Fetch monthly analytics data
        const response = await analyticsService.getMonthlyAnalytics(targetMessId);
        setMonthlyData(response.data || []);
        
        setProcessingMonthly(false);
      } catch (error) {
        console.error('Error fetching monthly analytics:', error);
        showToast('Failed to load monthly analytics', 'error');
        setProcessingMonthly(false);
      }
    };

    fetchMonthlyData();
  }, [showMonthlyReport, messId, currentMess, analyticsService, showToast]);

  // Handle wastage input change
  const handleWastageInputChange = (mealType, value) => {
    setWastageInput(prev => ({
      ...prev,
      [mealType]: parseInt(value, 10) || 0
    }));
  };

  // Handle wastage form submission
  const handleWastageSubmit = async (e, mealType) => {
    e.preventDefault();
    
    try {
      const targetMessId = messId || (currentMess ? currentMess.messId : null);
      
      if (!targetMessId) {
        showToast('No mess selected', 'error');
        return;
      }
      
      await analyticsService.updateWastage({
        messId: targetMessId,
        mealType,
        actualWastage: wastageInput[mealType],
        date: dateInput
      });
      
      showToast(`Wastage updated for ${mealType}`, 'success');
      
      // Refresh data
      setTimeRange(prev => prev); // Trigger useEffect
    } catch (error) {
      console.error('Error updating wastage:', error);
      showToast('Failed to update wastage', 'error');
    }
  };
  
  // Generate monthly report for the selected month
  const handleGenerateMonthlyReport = async () => {
    try {
      const targetMessId = messId || (currentMess ? currentMess.messId : null);
      
      if (!targetMessId) {
        showToast('No mess selected', 'error');
        return;
      }
      
      setProcessingMonthly(true);
      
      // Generate monthly summary
      await analyticsService.generateMonthlySummary(targetMessId, selectedMonth, selectedYear);
      showToast(`Monthly report generated for ${new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })} ${selectedYear}`, 'success');
      
      // Refresh monthly data
      setShowMonthlyReport(true);
      
    } catch (error) {
      console.error('Error generating monthly report:', error);
      showToast(
        error.response?.data?.message || 'Failed to generate monthly report', 
        'error'
      );
    } finally {
      setProcessingMonthly(false);
    }
  };
  
  // Reset counters after generating monthly report
  const handleResetCounters = async () => {
    if (!window.confirm(`Are you sure you want to reset the daily counters for ${new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })} ${selectedYear}? This will clear all daily records after saving the monthly summary.`)) {
      return;
    }
    
    try {
      const targetMessId = messId || (currentMess ? currentMess.messId : null);
      
      if (!targetMessId) {
        showToast('No mess selected', 'error');
        return;
      }
      
      setProcessingMonthly(true);
      
      // Reset daily counters
      const result = await analyticsService.resetDailyCounters(
        targetMessId, 
        selectedMonth, 
        selectedYear, 
        true // Keep historical data
      );
      
      showToast(`Daily counters reset successfully. ${result.deletedCount} records processed.`, 'success');
      
      // Refresh data
      setTimeRange(prev => prev); // Trigger useEffect
      
    } catch (error) {
      console.error('Error resetting counters:', error);
      showToast(
        error.response?.data?.message || 'Failed to reset counters. Make sure to generate monthly report first.', 
        'error'
      );
    } finally {
      setProcessingMonthly(false);
    }
  };
  
  // Handle month/year selection change
  const handleMonthYearChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setSelectedYear(parseInt(year));
    setSelectedMonth(parseInt(month) - 1); // Convert from 1-12 to 0-11
  };

  if (loading) {
    return <div className="loading">Loading analytics data...</div>;
  }

  return (
    <div className="analytics-dashboard">
      <h1>Mess Meal Analytics Dashboard</h1>
      
      {/* Time range selector */}
      <div className="time-range-selector">
        <button 
          className={timeRange === 'week' ? 'active' : ''}
          onClick={() => {
            setTimeRange('week');
            setShowMonthlyReport(false);
          }}
        >
          Last Week
        </button>
        <button 
          className={timeRange === 'month' ? 'active' : ''}
          onClick={() => {
            setTimeRange('month');
            setShowMonthlyReport(false);
          }}
        >
          Last Month
        </button>
        <button 
          className={showMonthlyReport ? 'active' : ''}
          onClick={() => setShowMonthlyReport(true)}
        >
          Monthly Reports
        </button>
      </div>
      
      {/* Summary cards */}
      {summaryData && (
        <div className="summary-cards">
          <div className="card">
            <h3>Total Booked</h3>
            <p className="value">{summaryData.summary.totalBooked}</p>
          </div>
          <div className="card">
            <h3>Total Skipped</h3>
            <p className="value">{summaryData.summary.totalSkipped}</p>
          </div>
          <div className="card">
            <h3>Total Wasted</h3>
            <p className="value">{summaryData.summary.totalWasted}</p>
          </div>
          <div className="card">
            <h3>Efficiency</h3>
            <p className="value">{summaryData.summary.efficiency}%</p>
          </div>
        </div>
      )}
      
      {/* Daily Meals Bar Chart */}
      <div className="chart-container">
        <h2>Meals Booked vs Skipped vs Wasted</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [`${value} meals`, name]}
              labelFormatter={formatDate}
            />
            <Legend />
            <Bar dataKey="booked" fill="#8884d8" name="Booked" />
            <Bar dataKey="skipped" fill="#82ca9d" name="Skipped" />
            <Bar dataKey="actualWastage" fill="#ff8042" name="Wasted" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Meal Type Breakdown */}
      {summaryData && (
        <div className="chart-container">
          <h2>Meal Type Breakdown</h2>
          <div className="chart-grid">
            {/* Pie Chart for each meal type */}
            {Object.entries(summaryData.summary.mealTypeData).map(([mealType, data]) => (
              <div className="pie-chart-container" key={mealType}>
                <h3>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Consumed', value: data.booked - data.skipped - data.wasted },
                        { name: 'Skipped', value: data.skipped },
                        { name: 'Wasted', value: data.wasted },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Consumed', color: '#0088FE' },
                        { name: 'Skipped', color: '#00C49F' },
                        { name: 'Wasted', color: '#FF8042' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="stats">
                  <p>Total Booked: {data.booked}</p>
                  <p>Total Skipped: {data.skipped}</p>
                  <p>Total Wasted: {data.wasted}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Wastage Update Form */}
      {user && user.role === 'mess_manager' && (
        <div className="wastage-input-section">
          <h2>Update Today's Meal Wastage</h2>
          <div className="date-input">
            <label>Date:</label>
            <input 
              type="date" 
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
          </div>
          
          <div className="wastage-forms">
            {['breakfast', 'lunch', 'snacks', 'dinner'].map(mealType => (
              <div className="wastage-form" key={mealType}>
                <h3>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h3>
                <form onSubmit={(e) => handleWastageSubmit(e, mealType)}>
                  <input
                    type="number"
                    min="0"
                    value={wastageInput[mealType]}
                    onChange={(e) => handleWastageInputChange(mealType, e.target.value)}
                    placeholder="Number of wasted meals"
                  />
                  <button type="submit">Update</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Monthly Reports Section */}
      {showMonthlyReport && (
        <div className="monthly-reports-section">
          <h2>Monthly Meal Analytics Reports</h2>
          
          {/* Month/Year Selector */}
          <div className="month-selector">
            <label>Select Month:</label>
            <input 
              type="month" 
              value={`${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}`}
              onChange={handleMonthYearChange}
              max={`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`}
            />
            
            <div className="month-actions">
              <button 
                onClick={handleGenerateMonthlyReport}
                disabled={processingMonthly}
              >
                {processingMonthly ? 'Processing...' : 'Generate Monthly Report'}
              </button>
              <button 
                onClick={handleResetCounters}
                disabled={processingMonthly}
                className="reset-button"
              >
                {processingMonthly ? 'Processing...' : 'Reset Daily Counters'}
              </button>
            </div>
          </div>
          
          {/* Monthly Analytics Chart */}
          {monthlyData.length > 0 ? (
            <div className="chart-container">
              <h3>Monthly Performance Overview</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                  data={monthlyData}
                  margin={{ top: 20, right: 20, bottom: 60, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="booked" fill="#8884d8" name="Booked Meals" />
                  <Bar yAxisId="left" dataKey="skipped" fill="#82ca9d" name="Skipped Meals" />
                  <Bar yAxisId="left" dataKey="wasted" fill="#ff8042" name="Wasted Meals" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#ff0000"
                    name="Efficiency %"
                    dot={{ stroke: '#ff0000', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="no-monthly-data">
              <p>No monthly reports available. Generate a monthly report to see analytics.</p>
            </div>
          )}
          
          {/* Monthly Breakdown by Meal Type */}
          {monthlyData.length > 0 && monthlyData.length > 0 && (
            <div className="chart-container">
              <h3>Last Month's Meal Type Breakdown</h3>
              <div className="chart-grid">
                {['breakfast', 'lunch', 'snacks', 'dinner'].map(mealType => {
                  const currentMonth = monthlyData[monthlyData.length - 1];
                  const mealData = currentMonth?.mealTypeBreakdown?.[mealType];
                  
                  if (!mealData) return null;
                  
                  return (
                    <div className="pie-chart-container" key={mealType}>
                      <h3>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={[
                              { 
                                name: 'Consumed', 
                                value: mealData.booked - mealData.skipped - mealData.wasted 
                              },
                              { name: 'Skipped', value: mealData.skipped },
                              { name: 'Wasted', value: mealData.wasted },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {[
                              { name: 'Consumed', color: '#0088FE' },
                              { name: 'Skipped', color: '#00C49F' },
                              { name: 'Wasted', color: '#FF8042' },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="back-button">
        <button onClick={() => navigate('/mess_manager')}>Back to Mess Manager</button>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
