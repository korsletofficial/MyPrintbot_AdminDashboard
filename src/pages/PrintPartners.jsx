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
import { Search, Eye, Mail, Trash2, Loader2, Shield, ShieldOff } from 'lucide-react';
import { printPartnersAPI } from '../api/endpoints/printPartners';
import { toast } from 'sonner';

const PrintPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [blockDialog, setBlockDialog] = useState({ open: false, partner: null });
  const [blockReason, setBlockReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Fetch partners
  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await printPartnersAPI.getPrintPartners({
        page,
        limit,
        search: searchQuery,
      });

      if (response.success) {
        setPartners(response.data);
        setTotal(response.pagination.total);
        setTotalPages(response.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching print partners:', error);
      alert('Failed to load print partners');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchPartners();
  }, [page]);

  // Handle search
  const handleSearch = () => {
    setPage(1); // Reset to first page
    fetchPartners();
  };

  // Handle delete
  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await printPartnersAPI.deletePrintPartner(id);
      alert('Print partner deleted successfully');
      fetchPartners(); // Refresh list
    } catch (error) {
      console.error('Error deleting partner:', error);
      alert(error.response?.data?.error || 'Failed to delete print partner');
    }
  };

  // Handle block
  const handleBlock = (partner) => {
    setBlockDialog({ open: true, partner });
    setBlockReason('');
  };

  // Handle block confirm
  const handleBlockConfirm = async () => {
    if (!blockReason.trim()) {
      toast.error('Please provide a reason for blocking');
      return;
    }

    try {
      setActionLoading(true);
      await printPartnersAPI.blockPrintPartner(blockDialog.partner.id, blockReason);
      toast.success(`${blockDialog.partner.name} has been blocked`);
      setBlockDialog({ open: false, partner: null });
      setBlockReason('');
      fetchPartners(); // Refresh list
    } catch (error) {
      console.error('Error blocking partner:', error);
      toast.error(error.response?.data?.error || 'Failed to block partner');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle unblock
  const handleUnblock = async (partner) => {
    if (!confirm(`Are you sure you want to unblock "${partner.name}"?`)) return;

    try {
      setActionLoading(true);
      await printPartnersAPI.unblockPrintPartner(partner.id);
      toast.success(`${partner.name} has been unblocked`);
      fetchPartners(); // Refresh list
    } catch (error) {
      console.error('Error unblocking partner:', error);
      toast.error(error.response?.data?.error || 'Failed to unblock partner');
    } finally {
      setActionLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Print Partners</h1>
        <p className="text-muted-foreground mt-2">
          Manage and monitor all print partners on the platform
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search partners by name, email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Partners Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Print Partners ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : partners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No print partners found
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? 'Try adjusting your search criteria'
                  : 'No print partners have registered yet'}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Jobs</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">
                        {partner.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {partner.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {partner.phone || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              partner.isBlocked
                                ? 'destructive'
                                : partner.status === 'Active'
                                ? 'success'
                                : 'warning'
                            }
                          >
                            {partner.isBlocked ? 'Blocked' : partner.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{partner.jobsHandled}</TableCell>
                      <TableCell>{partner.jobsCompleted}</TableCell>
                      <TableCell>{formatCurrency(partner.revenue)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(partner.joined)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Details"
                            onClick={() =>
                              alert('Partner details view - Coming soon')
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Send Message"
                            onClick={() =>
                              (window.location.href = `mailto:${partner.email}`)
                            }
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          {partner.isBlocked ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Unblock Partner"
                              className="text-green-500 hover:text-green-600"
                              onClick={() => handleUnblock(partner)}
                              disabled={actionLoading}
                            >
                              <ShieldOff className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Block Partner"
                              className="text-orange-500 hover:text-orange-600"
                              onClick={() => handleBlock(partner)}
                              disabled={actionLoading}
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            className="text-red-500 hover:text-red-600"
                            onClick={() =>
                              handleDelete(partner.id, partner.name)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Showing{' '}
                  <span className="font-semibold">
                    {partners.length > 0 ? (page - 1) * limit + 1 : 0}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold">
                    {Math.min(page * limit, total)}
                  </span>{' '}
                  of <span className="font-semibold">{total}</span> partners
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant={page === 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(1)}
                  >
                    1
                  </Button>
                  {totalPages >= 2 && (
                    <Button
                      variant={page === 2 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(2)}
                    >
                      2
                    </Button>
                  )}
                  {totalPages >= 3 && (
                    <Button
                      variant={page === 3 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(3)}
                    >
                      3
                    </Button>
                  )}
                  {totalPages > 3 && (
                    <>
                      <span className="px-2 text-gray-500">...</span>
                      <Button
                        variant={page === totalPages ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Block Partner Dialog */}
      <Dialog open={blockDialog.open} onOpenChange={(open) => setBlockDialog({ open, partner: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Print Partner</DialogTitle>
            <DialogDescription>
              You are about to block{' '}
              <span className="font-semibold">{blockDialog.partner?.name}</span>.
              They will not be able to access their dashboard until unblocked.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="blockReason" className="text-sm font-medium">
                Reason for blocking <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="blockReason"
                placeholder="Enter the reason for blocking this partner..."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBlockDialog({ open: false, partner: null })}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlockConfirm}
              disabled={actionLoading || !blockReason.trim()}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Blocking...
                </>
              ) : (
                'Block Partner'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrintPartners;
