import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { statsAPI } from '../../api/endpoints/stats';

const Charts = () => {
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [jobStatusData, setJobStatusData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [revenuePeriod, setRevenuePeriod] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);

        // Fetch all chart data in parallel
        const [userGrowthRes, jobStatusRes, revenueRes] = await Promise.all([
          statsAPI.getUserGrowthAnalytics({ days: 30 }),
          statsAPI.getJobStatusBreakdown(),
          statsAPI.getRevenueTrend({ period: revenuePeriod }),
        ]);

        if (userGrowthRes.data.success) {
          setUserGrowthData(userGrowthRes.data.data);
        }

        if (jobStatusRes.data.success) {
          // Transform job status data for pie chart
          const data = jobStatusRes.data.data;

          // Group statuses into meaningful categories
          const statusData = [
            {
              name: 'Active Jobs',
              value: (data.ACTIVE || 0) + (data.APPROVED || 0),
              fill: '#3b82f6'
            },
            {
              name: 'In Progress',
              value: data.APPROVED || 0,
              fill: '#8b5cf6'
            },
            {
              name: 'Completed',
              value: data.COMPLETED || 0,
              fill: '#10b981'
            },
            {
              name: 'Pending Setup',
              value: (data.DRAFT || 0) + (data.PENDING_CLIENT_ACTIVATION || 0),
              fill: '#f59e0b'
            },
            {
              name: 'Cancelled/Rejected',
              value: (data.CANCELLED || 0) + (data.REJECTED || 0),
              fill: '#ef4444'
            },
          ].filter(item => item.value > 0); // Only show categories with data

          setJobStatusData(statusData);
        }

        if (revenueRes.data.success) {
          // Extract chartData from the new API response format
          const responseData = revenueRes.data.data;
          setRevenueData(responseData.chartData || []);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [revenuePeriod]);

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className={i === 1 ? "col-span-1 lg:col-span-2" : ""}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-100 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Failed to load chart data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* User Growth Chart */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>User Growth (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="partners"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Print Partners"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="clients"
                stroke="#10b981"
                strokeWidth={2}
                name="Clients"
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Job Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Job Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={jobStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {jobStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Trend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Revenue Trend</CardTitle>
          <Select value={revenuePeriod} onValueChange={setRevenuePeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue (₹)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;
