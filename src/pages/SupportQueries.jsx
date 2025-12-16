import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Clock, AlertCircle, CheckCircle, XCircle, Eye, Trash2, Loader2, Filter } from 'lucide-react';
import { supportQueriesAPI } from '../api/endpoints/supportQueries';
import { toast } from 'sonner';

const SupportQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: ''
  });
  const [updateData, setUpdateData] = useState({
    status: '',
    adminNotes: '',
    priority: ''
  });

  // Fetch queries
  const fetchQueries = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      if (filters.priority) params.priority = filters.priority;

      const response = await supportQueriesAPI.getAllQueries(params);

      if (response.success) {
        setQueries(response.data);
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
      toast.error('Failed to load support queries');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await supportQueriesAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchQueries();
    fetchStats();
  }, []);

  // Handle view details
  const handleView = (query) => {
    setSelectedQuery(query);
    setViewDialog(true);
  };

  // Handle update query
  const handleUpdate = (query) => {
    setSelectedQuery(query);
    setUpdateData({
      status: query.status,
      adminNotes: query.adminNotes || '',
      priority: query.priority
    });
    setUpdateDialog(true);
  };

  // Submit update
  const handleSubmitUpdate = async () => {
    if (!updateData.status) {
      toast.error('Please select a status');
      return;
    }

    try {
      setActionLoading(true);
      const response = await supportQueriesAPI.updateQuery(selectedQuery.id, updateData);

      if (response.success) {
        toast.success('Query updated successfully');
        setUpdateDialog(false);
        fetchQueries();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating query:', error);
      toast.error(error.response?.data?.message || 'Failed to update query');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id, subject) => {
    if (!confirm(`Are you sure you want to delete query "${subject}"?`)) return;

    try {
      await supportQueriesAPI.deleteQuery(id);
      toast.success('Query deleted successfully');
      fetchQueries();
      fetchStats();
    } catch (error) {
      console.error('Error deleting query:', error);
      toast.error(error.response?.data?.message || 'Failed to delete query');
    }
  };

  // Apply filters
  const applyFilters = () => {
    fetchQueries();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ status: '', category: '', priority: '' });
    setTimeout(() => fetchQueries(), 0);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { variant: 'secondary', icon: Clock, className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
      IN_PROGRESS: { variant: 'default', icon: AlertCircle, className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
      COMPLETED: { variant: 'default', icon: CheckCircle, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
      CANCELLED: { variant: 'secondary', icon: XCircle, className: 'bg-gray-100 text-gray-800 hover:bg-gray-100' }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      URGENT: 'bg-red-100 text-red-800'
    };

    return (
      <Badge variant="secondary" className={priorityConfig[priority] || priorityConfig.MEDIUM}>
        {priority}
      </Badge>
    );
  };

  // Get category label
  const getCategoryLabel = (category) => {
    const labels = {
      JOB_CREATION: 'Job Creation',
      PARTNER_CONNECTION: 'Partner Connection',
      TECHNICAL_ISSUE: 'Technical Issue',
      BILLING: 'Billing',
      ACCOUNT: 'Account',
      OTHER: 'Other'
    };
    return labels[category] || category;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Support Queries</h1>
        <p className="text-gray-500 mt-2">
          Manage client support tickets and queries
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.byStatus.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.byStatus.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.byStatus.completed}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All Categories</SelectItem>
                  <SelectItem value="JOB_CREATION">Job Creation</SelectItem>
                  <SelectItem value="PARTNER_CONNECTION">Partner Connection</SelectItem>
                  <SelectItem value="TECHNICAL_ISSUE">Technical Issue</SelectItem>
                  <SelectItem value="BILLING">Billing</SelectItem>
                  <SelectItem value="ACCOUNT">Account</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={applyFilters} className="flex-1">Apply</Button>
              <Button onClick={resetFilters} variant="outline">Reset</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queries Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Support Queries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : queries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No support queries found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queries.map((query) => (
                  <TableRow key={query.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{query.client?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{query.client?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{query.subject}</TableCell>
                    <TableCell>{getCategoryLabel(query.category)}</TableCell>
                    <TableCell>{getPriorityBadge(query.priority)}</TableCell>
                    <TableCell>{getStatusBadge(query.status)}</TableCell>
                    <TableCell>{new Date(query.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(query)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdate(query)}
                        >
                          Update
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(query.id, query.subject)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialog} onOpenChange={setViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Query Details</DialogTitle>
          </DialogHeader>
          {selectedQuery && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Client</Label>
                <p className="font-medium">{selectedQuery.client?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">{selectedQuery.client?.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Subject</Label>
                <p>{selectedQuery.subject}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">Description</Label>
                <p className="text-sm whitespace-pre-wrap">{selectedQuery.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Category</Label>
                  <p>{getCategoryLabel(selectedQuery.category)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Priority</Label>
                  <div className="mt-1">{getPriorityBadge(selectedQuery.priority)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedQuery.status)}</div>
                </div>
              </div>
              {selectedQuery.adminNotes && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">Admin Notes</Label>
                  <p className="text-sm whitespace-pre-wrap">{selectedQuery.adminNotes}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created</Label>
                  <p>{new Date(selectedQuery.createdAt).toLocaleString()}</p>
                </div>
                {selectedQuery.resolvedAt && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Resolved</Label>
                    <p>{new Date(selectedQuery.resolvedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={updateDialog} onOpenChange={setUpdateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Query</DialogTitle>
            <DialogDescription>
              Update the status and add notes for this support query
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status *</Label>
              <Select
                value={updateData.status}
                onValueChange={(value) => setUpdateData({ ...updateData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={updateData.priority}
                onValueChange={(value) => setUpdateData({ ...updateData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Admin Notes</Label>
              <Textarea
                placeholder="Add notes or response for the client..."
                value={updateData.adminNotes}
                onChange={(e) => setUpdateData({ ...updateData, adminNotes: e.target.value })}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setUpdateDialog(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitUpdate}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Query'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportQueries;
