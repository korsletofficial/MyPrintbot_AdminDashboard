import { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  Gift,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "../api/axios";
import { toast } from "sonner";

export default function ReferralAnalytics() {
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
  });

  // State for data
  const [analyticsData, setAnalyticsData] = useState(null);
  const [relationshipsData, setRelationshipsData] = useState(null);

  // Loading states
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingRelationships, setLoadingRelationships] = useState(true);

  // Fetch analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoadingAnalytics(true);
        const response = await api.get('/referrals/admin/analytics');
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics');
      } finally {
        setLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Fetch relationships (re-fetch when filters change)
  useEffect(() => {
    const fetchRelationships = async () => {
      try {
        setLoadingRelationships(true);
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        const response = await api.get(`/referrals/admin/relationships?${params.toString()}`);
        setRelationshipsData(response.data);
      } catch (error) {
        console.error('Error fetching relationships:', error);
        toast.error('Failed to load referral relationships');
      } finally {
        setLoadingRelationships(false);
      }
    };
    fetchRelationships();
  }, [filters]);

  const analytics = analyticsData?.data || {};
  const relationships = relationshipsData?.data || [];

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toLocaleString('en-IN')}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Completed' },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Cancelled' },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getCreditStatusBadge = (status) => {
    const statusConfig = {
      AVAILABLE: { color: 'bg-green-100 text-green-800', label: 'Available' },
      USED: { color: 'bg-gray-100 text-gray-800', label: 'Used' },
      EXPIRED: { color: 'bg-red-100 text-red-800', label: 'Expired' },
      FROZEN: { color: 'bg-orange-100 text-orange-800', label: 'Frozen' },
    };
    const config = statusConfig[status] || statusConfig.AVAILABLE;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const handleExport = () => {
    try {
      // Convert relationships to CSV
      const headers = [
        'Referrer Name',
        'Referrer Email',
        'Referee Name',
        'Referee Email',
        'Referral Code',
        'Status',
        'Signup Date',
        'First Job Date',
        'First Job Amount',
        'Referrer Credit Status',
        'Referee Credit Status',
      ];

      const rows = relationships.map((rel) => [
        rel.referrer.name || '',
        rel.referrer.email || '',
        rel.referee.name || '',
        rel.referee.email || '',
        rel.referralCode || '',
        rel.status || '',
        formatDate(rel.signupDate),
        rel.firstJobDate ? formatDate(rel.firstJobDate) : 'N/A',
        rel.firstJobAmount ? formatCurrency(rel.firstJobAmount) : 'N/A',
        rel.credits.find((c) => c.type === 'SIGNUP_BONUS')?.status || 'N/A',
        rel.credits.find((c) => c.type === 'WELCOME_BONUS')?.status || 'N/A',
      ]);

      const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `referral-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Referral Program Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor and manage the referral program</p>
        </div>
        <Button onClick={handleExport} disabled={loadingRelationships}>
          <Download className="h-4 w-4 mr-2" />
          Export to CSV
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {loadingAnalytics ? '...' : analytics.overview?.totalReferrals || 0}
            </div>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Completed Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {loadingAnalytics ? '...' : analytics.overview?.completedReferrals || 0}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Conversion: {analytics.overview?.conversionRate || '0%'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Gift className="h-4 w-4 text-blue-600" />
              Total Credits Issued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {loadingAnalytics ? '...' : formatCurrency(analytics.credits?.totalCreditsIssued)}
            </div>
            <p className="text-sm text-gray-500 mt-1">Lifetime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              Outstanding Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {loadingAnalytics ? '...' : formatCurrency(analytics.credits?.outstandingCredits)}
            </div>
            <p className="text-sm text-gray-500 mt-1">Available balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Credit Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Credit Distribution</CardTitle>
            <CardDescription>Breakdown of credit types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Signup Bonuses (₹500)</p>
                <p className="text-xs text-gray-500">For referrers</p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {loadingAnalytics ? '...' : formatCurrency(analytics.credits?.signupBonuses)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Welcome Bonuses (₹200)</p>
                <p className="text-xs text-gray-500">For referees</p>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {loadingAnalytics ? '...' : formatCurrency(analytics.credits?.welcomeBonuses)}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t">
              <div>
                <p className="text-sm font-medium text-gray-600">Credits Redeemed</p>
                <p className="text-xs text-gray-500">Used by partners</p>
              </div>
              <p className="text-lg font-bold text-green-600">
                {loadingAnalytics ? '...' : formatCurrency(analytics.credits?.creditsRedeemed)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>Partners with most completed referrals</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAnalytics ? (
              <p className="text-center text-gray-500 py-8">Loading...</p>
            ) : analytics.topReferrers?.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No data yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.topReferrers?.slice(0, 5).map((referrer, index) => (
                  <div key={referrer.userId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{referrer.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{referrer.email}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {referrer.completedReferrals} referrals
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status || "ALL"}
                onValueChange={(value) => setFilters({ ...filters, status: value === "ALL" ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setFilters({ status: '', startDate: '', endDate: '' })}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referral Relationships Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Referral Relationships</CardTitle>
          <CardDescription>Complete list of referrals with details</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingRelationships ? (
            <p className="text-center text-gray-500 py-8">Loading...</p>
          ) : relationships.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No referrals found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Referrer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Referee</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Code</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Signup Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">First Job</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {relationships.map((rel) => (
                    <tr key={rel.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{rel.referrer.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{rel.referrer.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{rel.referee.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{rel.referee.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="font-mono">
                          {rel.referralCode}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(rel.status)}</td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(rel.signupDate)}</td>
                      <td className="py-3 px-4">
                        {rel.firstJobDate ? (
                          <div>
                            <p className="text-sm text-gray-900">{formatDate(rel.firstJobDate)}</p>
                            {rel.firstJobAmount && (
                              <p className="text-xs text-gray-500">
                                {formatCurrency(rel.firstJobAmount)}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Pending</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-end">
                          {rel.credits.map((credit) => (
                            <div key={credit.userId} className="flex items-center gap-2">
                              <span className="text-xs text-gray-600">
                                {credit.type === 'SIGNUP_BONUS' ? 'Referrer' : 'Referee'}:
                              </span>
                              {getCreditStatusBadge(credit.status)}
                            </div>
                          ))}
                          {rel.credits.length === 0 && (
                            <span className="text-sm text-gray-400">No credits yet</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
