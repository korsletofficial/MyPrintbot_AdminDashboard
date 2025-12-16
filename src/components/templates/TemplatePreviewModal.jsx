import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUtils';
import { useState } from 'react';

export function TemplatePreviewModal({ template, isOpen, onClose }) {
  if (!template) return null;

  const [activeTab, setActiveTab] = useState('preview');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            {template.name}
            <Badge variant="outline">{template.category}</Badge>
          </DialogTitle>
          <DialogDescription className="text-base">
            Professional ID card template • {template.orientation}
          </DialogDescription>
        </DialogHeader>

        {/* Template Details */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase">Dimensions</span>
            <span className="text-sm font-semibold text-gray-900 mt-1">
              {template.templateWidth} × {template.templateHeight} {template.unit}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase">Sides</span>
            <span className="text-sm font-semibold text-gray-900 mt-1">
              {template.bothSides ? 'Double-sided' : 'Single-sided'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-500 uppercase">Created</span>
            <div className="flex items-center gap-1 mt-1">
              <Calendar className="w-3 h-3 text-gray-400" />
              <span className="text-sm text-gray-600">{formatDate(template.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Simple Tab Navigation */}
        <div className="w-full">
          <div className="inline-flex h-9 items-center justify-center rounded-lg bg-gray-100 p-1 w-full">
            <button
              onClick={() => setActiveTab('preview')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all flex-1 ${
                activeTab === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Preview Templates
            </button>
            <button
              onClick={() => setActiveTab('blank')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all flex-1 ${
                activeTab === 'blank'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Blank Templates
            </button>
          </div>

          {/* Preview Templates Content */}
          {activeTab === 'preview' && (
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Front Side (Preview)</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center" style={{ height: '400px' }}>
                  {template.frontPreviewUrl ? (
                    <img
                      src={getImageUrl(template.frontPreviewUrl)}
                      alt={`${template.name} - Front Preview`}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-200 to-gray-100">
                      <p className="text-gray-500">No preview available</p>
                    </div>
                  )}
                </div>
              </div>

              {template.bothSides && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Back Side (Preview)</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center" style={{ height: '400px' }}>
                    {template.backPreviewUrl ? (
                      <img
                        src={getImageUrl(template.backPreviewUrl)}
                        alt={`${template.name} - Back Preview`}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-200 to-gray-100">
                        <p className="text-gray-500">No preview available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Blank Templates Content */}
          {activeTab === 'blank' && (
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Front Side (Blank)</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center" style={{ height: '400px' }}>
                  {template.frontBlankUrl ? (
                    <img
                      src={getImageUrl(template.frontBlankUrl)}
                      alt={`${template.name} - Front Blank`}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-200 to-gray-100">
                      <p className="text-gray-500">No blank template available</p>
                    </div>
                  )}
                </div>
              </div>

              {template.bothSides && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Back Side (Blank)</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center" style={{ height: '400px' }}>
                    {template.backBlankUrl ? (
                      <img
                        src={getImageUrl(template.backBlankUrl)}
                        alt={`${template.name} - Back Blank`}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-200 to-gray-100">
                        <p className="text-gray-500">No blank template available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Template Info */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Template Information:</h4>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Pre-configured dimensions and layout</li>
            <li>Both blank and preview templates available</li>
            <li>Professional design elements and styling</li>
            <li>Ready for customization and use</li>
          </ul>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
