import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Users, Briefcase, DollarSign, FileText, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { statsAPI } from '../../api/endpoints/stats';

const MetricsCards = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await statsAPI.getAdminDashboardStats({ period: 30 });
        
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white shadow-sm animate-pulse">
            <CardContent className="px-6 py-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-12 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error || !stats) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-semibold mb-2">Failed to load dashboard statistics</p>
        <p className="text-red-500 text-sm mb-3">{error || 'No data available'}</p>
        <p className="text-gray-600 text-sm">
          Please ensure:
          <ul className="list-disc ml-5 mt-2">
            <li>The backend server is running</li>
            <li>You are logged in as an ADMIN user</li>
            <li>The API URL is correct in .env file</li>
          </ul>
        </p>
      </div>
    );
  }

  const { platformOverview, activeJobs, revenue, submissionMetrics } = stats;

  const cards = [
    {
      title: 'Platform Overview',
      icon: Users,
      isPrimary: true,
      value: platformOverview.printPartners,
      subtitle: 'Print Partners',
      increase: `+${platformOverview.newPartnersThisMonth}`,
      trend: 'up', // 'up' for green arrow, 'down' for red arrow
    },
    {
      title: 'Active Jobs',
      icon: Briefcase,
      value: activeJobs.total,
      subtitle: `${activeJobs.inProgress} In Progress`,
      increase: `+${activeJobs.newToday}`,
      trend: 'up',
    },
    {
      title: 'Revenue (This Month)',
      icon: DollarSign,
      value: `Rs. ${(revenue.thisMonth / 1000).toFixed(0)}K`,
      subtitle: `Avg: Rs. ${revenue.avgPerJob.toLocaleString()}`,
      increase: `+${revenue.growthPercent}%`,
      trend: 'up',
    },
    {
      title: 'Submission Metrics',
      icon: FileText,
      value: submissionMetrics.total.toLocaleString(),
      subtitle: 'Total Submissions',
      increase: `${submissionMetrics.approvalRate}%`,
      trendLabel: 'Approval Rate',
      trend: 'up',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPrimary = card.isPrimary;
        const TrendIcon = card.trend === 'up' ? TrendingUp : TrendingDown;
        const trendColor = card.trend === 'up' ? 'text-green-400' : 'text-red-400';

        return (
          <Card
            key={index}
            className={`
              ${isPrimary
                ? 'bg-gradient-to-br from-[#0672BB] via-[#152056] to-[#152056] text-white'
                : 'bg-white hover:bg-gradient-to-br hover:from-[#0672BB] hover:via-[#152056] hover:to-[#152056] hover:text-white'
              }
              border-none shadow-sm hover:shadow-lg transition-all duration-300 group
            `}
            style={isPrimary ? {
              background: 'radial-gradient(89.78% 128.67% at 10.22% 100%, #0672BB 0%, #152056 94.75%)'
            } : {}}
          >
            <CardContent className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className={`text-[18px] font-medium leading-[100%] ${isPrimary ? 'text-blue-100' : 'text-[#4A4F67] group-hover:text-blue-100'}`}>
                    {card.title}
                  </p>
                  <p className={`text-5xl font-bold ${isPrimary ? 'text-white' : 'text-gray-900 group-hover:text-white'}`}>
                    {card.value}
                  </p>
                  {card.subtitle && (
                    <p className={`text-xs ${isPrimary ? 'text-blue-100' : 'text-gray-500 group-hover:text-blue-100'}`}>
                      {card.subtitle}
                    </p>
                  )}
                  {card.increase && (
                    <div className={`flex items-center gap-2 text-xs ${isPrimary ? 'text-white' : 'text-gray-700 group-hover:text-white'}`}>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isPrimary ? 'bg-white/20' : 'bg-blue-50 group-hover:bg-white/20'}`}>
                        <TrendIcon className={`w-3 h-3 ${isPrimary ? 'text-white' : trendColor}`} />
                        <span className="font-medium">{card.increase}</span>
                      </div>
                      {card.trendLabel && (
                        <span className={`text-xs ${isPrimary ? 'text-blue-100' : 'text-gray-500 group-hover:text-blue-100'}`}>
                          {card.trendLabel}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  className="p-3 rounded-full border-2 border-black bg-white hover:bg-gray-50 text-black transition-all"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricsCards;
