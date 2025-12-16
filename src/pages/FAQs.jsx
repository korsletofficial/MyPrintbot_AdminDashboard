import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Loader2, Save, X, ChevronUp, ChevronDown } from 'lucide-react';
import { faqsAPI } from '../api/endpoints/faqs';

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    audience: 'BOTH',
    isActive: true,
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await faqsAPI.getAllFAQs();
      if (response.success) {
        setFaqs(response.data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      alert('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      question: '',
      answer: '',
      audience: 'BOTH',
      isActive: true,
    });
  };

  const handleEdit = (faq) => {
    setEditingId(faq.id);
    setIsCreating(false);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      audience: faq.audience,
      isActive: faq.isActive,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({
      question: '',
      answer: '',
      audience: 'BOTH',
      isActive: true,
    });
  };

  const handleSave = async () => {
    if (!formData.question || !formData.answer) {
      alert('Question and answer are required');
      return;
    }

    try {
      setSaving(true);
      if (isCreating) {
        await faqsAPI.createFAQ(formData);
        alert('FAQ created successfully');
      } else {
        await faqsAPI.updateFAQ(editingId, formData);
        alert('FAQ updated successfully');
      }
      handleCancel();
      fetchFAQs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert(error.response?.data?.error || 'Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      await faqsAPI.deleteFAQ(id);
      alert('FAQ deleted successfully');
      fetchFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Failed to delete FAQ');
    }
  };

  const handleMove = async (index, direction) => {
    const newFaqs = [...faqs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newFaqs.length) return;

    // Swap items
    [newFaqs[index], newFaqs[targetIndex]] = [newFaqs[targetIndex], newFaqs[index]];

    // Update order for all FAQs
    const reorderedFAQs = newFaqs.map((faq, idx) => ({
      id: faq.id,
      order: idx + 1,
    }));

    try {
      setFaqs(newFaqs);
      await faqsAPI.reorderFAQs(reorderedFAQs);
    } catch (error) {
      console.error('Error reordering FAQs:', error);
      alert('Failed to reorder FAQs');
      fetchFAQs(); // Revert on error
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await faqsAPI.updateFAQ(id, { isActive: !currentStatus });
      fetchFAQs();
    } catch (error) {
      console.error('Error toggling FAQ status:', error);
      alert('Failed to update FAQ status');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage FAQs displayed in partner and client help pages
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90"
          disabled={isCreating || editingId}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {isCreating ? 'Create New FAQ' : 'Edit FAQ'}
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter the question"
              />
            </div>

            <div>
              <Label htmlFor="answer">Answer *</Label>
              <textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Enter the answer"
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="audience">Audience</Label>
                <Select
                  value={formData.audience}
                  onValueChange={(value) => setFormData({ ...formData, audience: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOTH">Both (Client & Partner)</SelectItem>
                    <SelectItem value="CLIENT">Client Only</SelectItem>
                    <SelectItem value="PARTNER">Partner Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="isActive">Status</Label>
                <Select
                  value={formData.isActive.toString()}
                  onValueChange={(value) => setFormData({ ...formData, isActive: value === 'true' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#1e3a8a] hover:bg-[#1e3a8a]/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* FAQs List */}
      <div className="space-y-3">
        {faqs.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">No FAQs found. Click "Add FAQ" to create one.</p>
          </Card>
        ) : (
          faqs.map((faq, index) => (
            <Card key={faq.id} className={`p-4 ${!faq.isActive ? 'opacity-60 bg-gray-50' : ''}`}>
              <div className="flex items-start gap-4">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === faqs.length - 1}
                    className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* FAQ Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                      <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          faq.audience === 'BOTH' ? 'bg-purple-100 text-purple-700' :
                          faq.audience === 'CLIENT' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {faq.audience === 'BOTH' ? 'Both' : faq.audience === 'CLIENT' ? 'Client' : 'Partner'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          faq.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {faq.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActive(faq.id, faq.isActive)}
                        title={faq.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {faq.isActive ? 'Hide' : 'Show'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(faq)}
                        disabled={isCreating || (editingId && editingId !== faq.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(faq.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
