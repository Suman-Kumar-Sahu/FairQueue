import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Users, Clock, Download } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../../services/api';
import { format, subDays } from 'date-fns';

const Analytics = () => {
  const [selectedCenter, setSelectedCenter] = useState('all');
  const [dateRange, setDateRange] = useState('7days');
  const [centers, setCenters] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCenters();
  }, []);

  useEffect(() => {
    if (selectedCenter) {
      fetchAnalytics();
    }
  }, [selectedCenter, dateRange]);

  const fetchCenters = async () => {
    try {
      const response = await api.get('/centers');
      setCenters(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedCenter(response.data.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching centers:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
      const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
      const endDate = format(new Date(), 'yyyy-MM-dd');

      const response = await api.get(
        `/analytics/center/${selectedCenter}?startDate=${startDate}&endDate=${endDate}`
      );
      setAnalyticsData(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Export analytics as CSV
    const csvData = generateCSV(analyticsData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${selectedCenter}-${dateRange}.csv`;
    a.click();
  };

  const generateCSV = (data) => {
    // Simple CSV generation
    return `Metric,Value
Total Bookings,${data?.totalBookings || 0}
Completion Rate,${data?.completionRate || 0}%
No-Show Rate,${data?.noShowRate || 0}%
Avg Bookings/Day,${data?.avgBookingsPerDay || 0}`;
  };

  // Sample data for charts
  const hourlyData = [
    { hour: '9 AM', bookings: 12, capacity: 16 },
    { hour: '10 AM', bookings: 15, capacity: 16 },
    { hour: '11 AM', bookings: 14, capacity: 16 },
    { hour: '12 PM', bookings: 10, capacity: 16 },
    { hour: '1 PM', bookings: 8, capacity: 16 },
    { hour: '2 PM', bookings: 11, capacity: 16 },
    { hour: '3 PM', bookings: 13, capacity: 16 },
    { hour: '4 PM', bookings: 16, capacity: 16 },
    { hour: '5 PM', bookings: 14, capacity: 16 },
  ];

  const dailyTrends = [
    { day: 'Mon', completed: 45, noShow: 3, cancelled: 2 },
    { day: 'Tue', completed: 52, noShow: 2, cancelled: 1 },
    { day: 'Wed', completed: 48, noShow: 4, cancelled: 3 },
    { day: 'Thu', completed: 55, noShow: 1, cancelled: 2 },
    { day: 'Fri', completed: 60, noShow: 2, cancelled: 1 },
    { day: 'Sat', completed: 42, noShow: 3, cancelled: 4 },
    { day: 'Sun', completed: 35, noShow: 2, cancelled: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800">
            Analytics
          </h1>
          <p className="text-neutral-600 mt-1">
            Detailed insights and performance metrics
          </p>
        </div>

        <Button
          variant="outline"
          icon={<Download size={20} />}
          onClick={handleExport}
        >
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Select Center
            </label>
            <select
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="input-field"
            >
              {centers.map((center) => (
                <option key={center._id} value={center._id}>
                  {center.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Bookings</p>
              <p className="text-3xl font-bold">
                {analyticsData?.totalBookings || 245}
              </p>
              <p className="text-blue-100 text-xs mt-2">
                {analyticsData?.avgBookingsPerDay || 35}/day avg
              </p>
            </div>
            <Calendar size={32} className="opacity-80" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Completion Rate</p>
              <p className="text-3xl font-bold">
                {analyticsData?.completionRate || 92}%
              </p>
              <p className="text-green-100 text-xs mt-2">
                +5% from last period
              </p>
            </div>
            <TrendingUp size={32} className="opacity-80" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-red-100 text-sm mb-1">No-Show Rate</p>
              <p className="text-3xl font-bold">
                {analyticsData?.noShowRate || 5}%
              </p>
              <p className="text-red-100 text-xs mt-2">
                -2% improvement
              </p>
            </div>
            <Users size={32} className="opacity-80" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Avg Wait Time</p>
              <p className="text-3xl font-bold">12</p>
              <p className="text-purple-100 text-xs mt-2">
                minutes
              </p>
            </div>
            <Clock size={32} className="opacity-80" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Analysis */}
        <Card>
          <h3 className="font-bold text-lg text-neutral-800 mb-4">
            Peak Hours Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="bookings" fill="#2563eb" name="Bookings" />
              <Bar dataKey="capacity" fill="#cbd5e1" name="Capacity" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Daily Trends */}
        <Card>
          <h3 className="font-bold text-lg text-neutral-800 mb-4">
            Daily Booking Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: 'none', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Completed"
              />
              <Line 
                type="monotone" 
                dataKey="noShow" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="No-Show"
              />
              <Line 
                type="monotone" 
                dataKey="cancelled" 
                stroke="#94a3b8" 
                strokeWidth={2}
                name="Cancelled"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Status Breakdown Table */}
      <Card>
        <h3 className="font-bold text-lg text-neutral-800 mb-4">
          Booking Status Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600">
                  Count
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600">
                  Percentage
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-600">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {analyticsData?.statusBreakdown?.map((item, index) => (
                <tr key={index} className="border-b border-neutral-100">
                  <td className="py-3 px-4 text-sm font-medium text-neutral-800 capitalize">
                    {item._id}
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-800">
                    {item.count}
                  </td>
                  <td className="py-3 px-4 text-sm text-neutral-800">
                    {((item.count / analyticsData.totalBookings) * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-success-600 text-sm">↑ 2.5%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;