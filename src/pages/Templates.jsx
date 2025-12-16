import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, Plus, Loader2 } from 'lucide-react';
import { templatesAPI } from '@/api/endpoints/templates';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { TemplatePreviewModal } from '@/components/templates/TemplatePreviewModal';

export default function Templates() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('landscape');
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // Modal states
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch templates based on orientation
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params = {
        limit,
        offset: (page - 1) * limit,
        orientation: activeTab, // 'landscape' or 'portrait'
      };

      if (category !== 'all') {
        params.category = category;
      }

      if (searchQuery.trim()) {
        params.search = searchQuery;
      }

      const response = await templatesAPI.getAllTemplates(params);

      if (response.success) {
        setTemplates(response.data);
        // Calculate total pages
        setTotalPages(Math.ceil(response.count / limit) || 1);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      alert('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and when filters change
  useEffect(() => {
    fetchTemplates();
  }, [category, page, activeTab, searchQuery]);

  // Handler functions
  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setPreviewModalOpen(true);
  };

  // Handle page navigation
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Handle delete confirmation
  const handleDeleteClick = (template) => {
    setTemplateToDelete(template);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;

    try {
      setDeleting(true);
      const response = await templatesAPI.deleteTemplate(templateToDelete.id);

      if (response.success) {
        alert('Template deleted successfully');
        setDeleteDialogOpen(false);
        setTemplateToDelete(null);
        // Refresh the page
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      alert(error.response?.data?.message || 'Failed to delete template');
    } finally {
      setDeleting(false);
    }
  };

  const tabs = [
    { value: 'landscape', label: 'Landscape' },
    { value: 'portrait', label: 'Portrait' },
  ];

  // Get dynamic empty state content based on active tab
  const getEmptyStateContent = () => {
    const emptyStates = {
      landscape: {
        title: "No landscape templates available",
        description: "There are currently no landscape templates. Create your first template to get started."
      },
      portrait: {
        title: "No portrait templates available",
        description: "There are currently no portrait templates. Create your first template to get started."
      }
    };

    // If filtering by category, show category-specific message
    if (category !== 'all') {
      return {
        title: `No ${category.toLowerCase()} templates found`,
        description: `There are no ${category.toLowerCase()} templates available in ${activeTab} orientation. Try changing the category or create a new template.`
      };
    }

    return emptyStates[activeTab] || emptyStates.landscape;
  };

  const emptyState = getEmptyStateContent();

  return (
    <div className="p-6 flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Header with Custom Tabs and Actions */}
      <div className="bg-white rounded-t-lg border border-b-0 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Custom Tab Navigation */}
          <div className="flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`pb-3 px-4 text-base leading-[100%] text-center transition-colors relative ${
                  activeTab === tab.value
                    ? 'font-semibold'
                    : 'font-normal'
                }`}
                style={{
                  fontSize: '16px',
                  lineHeight: '100%',
                  letterSpacing: '0px',
                  color: activeTab === tab.value ? 'rgba(34, 52, 141, 1)' : 'rgba(142, 152, 168, 1)'
                }}
              >
                {tab.label}
                {activeTab === tab.value && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: 'rgba(34, 52, 141, 1)' }} />
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search.."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px] h-10 pl-4 pr-10 bg-[#F5F5F7] border-0 focus:bg-[#F5F5F7] focus:ring-0 rounded-lg text-gray-700 placeholder:text-gray-400"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            <Select value={category} onValueChange={(value) => { setCategory(value); setPage(1); }}>
              <SelectTrigger className="w-[180px] bg-white border-gray-300 shadow-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="STUDENT">Student ID</SelectItem>
                <SelectItem value="EMPLOYEE">Employee ID</SelectItem>
                <SelectItem value="VISITOR">Visitor Badge</SelectItem>
                <SelectItem value="MEMBERSHIP">Membership Card</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => navigate('/templates/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        </div>
      </div>

      {/* Templates Content or Empty State */}
      {loading ? (
        <div className="bg-white rounded-b-lg border border-t flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white rounded-b-lg border border-t flex-1 flex items-center justify-center">
          <div className="max-w-xl w-full p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="text-6xl">📄</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {emptyState.title}
            </h3>
            <p className="text-gray-500">
              {emptyState.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-b-lg border border-t overflow-hidden flex-1">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={handlePreview}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pagination - Always at bottom */}
      <div className="flex items-center justify-between mt-6 pt-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold">{templates.length > 0 ? ((page - 1) * limit) + 1 : 0}-{Math.min(page * limit, templates.length)}</span> of <span className="font-semibold">{templates.length}</span> templates
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={handlePrevPage}
          >
            Previous
          </Button>

          <Button
            variant={page === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setPage(1)}
          >
            1
          </Button>

          {totalPages >= 2 && (
            <Button
              variant={page === 2 ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(2)}
            >
              2
            </Button>
          )}

          {totalPages >= 3 && (
            <Button
              variant={page === 3 ? "default" : "outline"}
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
                variant={page === totalPages ? "default" : "outline"}
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
            onClick={handleNextPage}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={selectedTemplate}
        isOpen={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setSelectedTemplate(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{templateToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
