import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadTemplateFiles, createTemplate } from '@/api/endpoints/templates';

const STANDARD_SIZES = [
  { id: 'cr80', title: 'CR80', desc: '85.6 × 54 mm, Standard Credit Card Size', width: 85.6, height: 53.98 },
  { id: 'cr79', title: 'CR79', desc: '83.9 × 52.1 mm, Slightly Smaller', width: 83.9, height: 52.1 },
  { id: 'cr100', title: 'CR100', desc: '98.5 × 67 mm, Oversized', width: 98.5, height: 67 },
  { id: 'a7', title: 'A7', desc: '105 × 74 mm, Badge Size', width: 105, height: 74 },
  { id: 'a6', title: 'A6', desc: '148 × 105 mm, Badge Size', width: 148, height: 105 },
];

export default function TemplateBuilder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Dimensions, 2: Upload
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [form, setForm] = useState({
    size: 'cr80',
    custom: {
      width: 85.6,
      height: 53.98,
      unit: 'mm',
      bothSides: 'yes',
    },
  });

  const [uploads, setUploads] = useState({
    front: {
      blank: null,
      preview: null,
    },
    back: {
      blank: null,
      preview: null,
    },
  });

  const [saveForm, setSaveForm] = useState({
    templateName: '',
    category: '',
    orientation: '', // User selects Landscape or Portrait
  });

  const [uploadedFileUrls, setUploadedFileUrls] = useState({
    frontBlankUrl: null,
    frontPreviewUrl: null,
    backBlankUrl: null,
    backPreviewUrl: null,
  });

  const [errors, setErrors] = useState({
    width: '',
    height: '',
  });

  const [touched, setTouched] = useState({
    width: false,
    height: false,
  });

  const validateNumber = (value, fieldName) => {
    if (!value) return `${fieldName} is required`;
    const num = parseFloat(value);
    if (isNaN(num)) return `${fieldName} must be a number`;
    if (num <= 0) return `${fieldName} must be greater than 0`;
    return '';
  };

  const update = (key, value) => {
    setForm((prev) => {
      const newForm = { ...prev, [key]: value };

      if (key === 'size' && value !== 'custom') {
        const selectedSize = STANDARD_SIZES.find((s) => s.id === value);
        if (selectedSize) {
          newForm.custom = {
            ...prev.custom,
            width: selectedSize.width,
            height: selectedSize.height,
          };
        }
      }

      return newForm;
    });
  };

  const handleFileUpload = (side, type, file) => {
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'application/pdf')) {
      setUploads((prev) => ({
        ...prev,
        [side]: {
          ...prev[side],
          [type]: file,
        },
      }));
      alert(`${type === 'blank' ? 'Blank' : 'Preview'} template uploaded for ${side} side`);
    } else {
      alert('Please upload a valid image file (JPG, JPEG, PNG, or PDF)');
    }
  };

  const handleFileRemove = (side, type) => {
    setUploads((prev) => ({
      ...prev,
      [side]: {
        ...prev[side],
        [type]: null,
      },
    }));
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // Validate dimensions
      if (form.size === 'custom') {
        setTouched((prev) => ({ ...prev, width: true, height: true }));

        const widthError = validateNumber(form.custom.width, 'Width');
        const heightError = validateNumber(form.custom.height, 'Height');

        setErrors((prev) => ({ ...prev, width: widthError, height: heightError }));

        if (widthError || heightError) {
          alert('Please fix the errors in custom dimensions');
          return;
        }
      }

      // Move to upload step
      setCurrentStep(2);
      alert('Template dimensions configured!');
    } else if (currentStep === 2) {
      // Validate uploads
      if (!uploads.front.blank || !uploads.front.preview) {
        alert('Please upload both blank and preview templates for front side');
        return;
      }

      if (form.custom.bothSides === 'yes' && (!uploads.back.blank || !uploads.back.preview)) {
        alert('Please upload both blank and preview templates for back side');
        return;
      }

      // Upload files to backend
      setLoading(true);

      try {
        alert('Uploading template files...');
        const uploadResponse = await uploadTemplateFiles(uploads);

        if (!uploadResponse.success) {
          alert(uploadResponse.message || 'Failed to upload template files');
          setLoading(false);
          return;
        }

        // Store the URLs for use in save modal
        setUploadedFileUrls(uploadResponse.data);
        alert('Files uploaded successfully!');

        // Open save modal
        setShowSaveModal(true);
        setLoading(false);

      } catch (error) {
        console.error('Upload error:', error);
        alert(error.response?.data?.message || error.message || 'Failed to upload files');
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      navigate('/templates');
    }
  };

  const handleSaveTemplate = async () => {
    // Validate form fields
    if (!saveForm.templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    if (!saveForm.category) {
      alert('Please select a template category');
      return;
    }

    if (!saveForm.orientation) {
      alert('Please select template orientation');
      return;
    }

    setLoading(true);

    try {
      const width = parseFloat(form.custom.width);
      const height = parseFloat(form.custom.height);

      // Set folder based on user-selected orientation
      const folder = saveForm.orientation === 'LANDSCAPE' ? 'Landscape Templates' : 'Portrait Templates';

      // Prepare complete template data
      const templateData = {
        // Metadata from save modal
        name: saveForm.templateName,
        category: saveForm.category,
        folder: folder,

        // Dimensions from step 1
        templateWidth: width,
        templateHeight: height,
        unit: form.custom.unit,
        bothSides: form.custom.bothSides === 'yes',
        orientation: saveForm.orientation, // User-selected orientation

        // File URLs from upload step
        frontBlankUrl: uploadedFileUrls.frontBlankUrl,
        frontPreviewUrl: uploadedFileUrls.frontPreviewUrl,
        backBlankUrl: uploadedFileUrls.backBlankUrl || null,
        backPreviewUrl: uploadedFileUrls.backPreviewUrl || null,

        // Tags
        tags: [],
      };

      alert('Creating template...');

      // Create template
      const createResponse = await createTemplate(templateData);

      if (createResponse.success) {
        alert('Template saved successfully!');
        setShowSaveModal(false);
        navigate('/templates');
      } else {
        alert(createResponse.message || 'Failed to create template');
      }
    } catch (error) {
      console.error('Create template error:', error);
      alert(error.response?.data?.message || error.message || 'Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  const renderUploadBox = (side, type) => {
    const file = uploads[side][type];
    const label = type === 'blank' ? 'Blank Template' : 'Preview Template';
    const description = type === 'blank'
      ? 'Upload clean card without any data'
      : 'Upload card with dummy data filled in';

    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        {!file ? (
          <label className="cursor-pointer block">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile) handleFileUpload(side, type, selectedFile);
              }}
            />
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <div className="text-sm font-medium text-gray-900 mb-1">{label}</div>
            <div className="text-xs text-gray-500 mb-2">{description}</div>
            <div className="text-xs text-blue-600 underline">choose file</div>
            <div className="text-xs text-gray-400 mt-1">JPG, JPEG, PNG, PDF</div>
          </label>
        ) : (
          <div className="relative">
            <button
              onClick={() => handleFileRemove(side, type)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
            {file.type === 'application/pdf' ? (
              <div className="py-8">
                <div className="text-4xl mb-2">📄</div>
                <div className="text-sm font-medium text-gray-900">{file.name}</div>
                <div className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</div>
              </div>
            ) : (
              <img
                src={URL.createObjectURL(file)}
                alt={label}
                className="max-h-40 mx-auto rounded"
              />
            )}
            <div className="text-xs text-gray-500 mt-2">{label}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {currentStep === 1 ? 'Create Template' : 'Upload Your Template'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {currentStep === 1
            ? 'Define template dimensions and orientation'
            : 'Select a template from the library or upload your PDF, PNG, or JPEG design to generate ID cards.'}
        </p>
      </div>

      {currentStep === 1 ? (
        <div className="bg-white rounded-lg border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Enter Template Information</h2>
          <p className="text-sm text-gray-500">
            Provide template details including size, dimensions, and orientation to ensure accurate ID card generation.
          </p>
        </div>

        <div className="mb-6 relative max-w-md">
          <Input placeholder="Search template size.." className="h-10 pl-4 pr-10 bg-[#F5F5F7] border-0 focus:bg-[#F5F5F7] focus:ring-0 rounded-lg" />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Standard Sizes</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {STANDARD_SIZES.map((size) => (
              <button
                key={size.id}
                onClick={() => update('size', size.id)}
                className={`group relative text-left rounded-lg border-2 p-3 transition-all hover:shadow-md ${
                  form.size === size.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`h-20 rounded-md mb-3 flex items-center justify-center ${
                    form.size === size.id ? 'bg-gradient-to-br from-blue-400 to-blue-500' : 'bg-gradient-to-br from-blue-200 to-blue-300'
                  }`}
                >
                  <div className="w-12 h-8 bg-white/30 rounded border border-white/50" />
                </div>
                <div className="text-sm font-semibold text-gray-900">{size.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{size.desc}</div>
                {form.size === size.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Custom Sizes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="width" className="text-sm font-medium text-gray-700">Width</Label>
              <Input
                id="width"
                type="number"
                step="0.01"
                value={form.custom.width}
                onChange={(e) => {
                  if (form.size !== 'custom') update('size', 'custom');
                  update('custom', { ...form.custom, width: e.target.value });
                  if (touched.width) {
                    const error = validateNumber(e.target.value, 'Width');
                    setErrors((prev) => ({ ...prev, width: error }));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, width: true }));
                  const error = validateNumber(form.custom.width, 'Width');
                  setErrors((prev) => ({ ...prev, width: error }));
                }}
                placeholder="Enter width"
                className={`mt-1.5 ${touched.width && errors.width ? 'border-red-500' : ''}`}
              />
              {touched.width && errors.width && <p className="text-sm text-red-500 mt-1">{errors.width}</p>}
            </div>
            <div>
              <Label htmlFor="height" className="text-sm font-medium text-gray-700">Height</Label>
              <Input
                id="height"
                type="number"
                step="0.01"
                value={form.custom.height}
                onChange={(e) => {
                  if (form.size !== 'custom') update('size', 'custom');
                  update('custom', { ...form.custom, height: e.target.value });
                  if (touched.height) {
                    const error = validateNumber(e.target.value, 'Height');
                    setErrors((prev) => ({ ...prev, height: error }));
                  }
                }}
                onBlur={() => {
                  setTouched((prev) => ({ ...prev, height: true }));
                  const error = validateNumber(form.custom.height, 'Height');
                  setErrors((prev) => ({ ...prev, height: error }));
                }}
                placeholder="Enter height"
                className={`mt-1.5 ${touched.height && errors.height ? 'border-red-500' : ''}`}
              />
              {touched.height && errors.height && <p className="text-sm text-red-500 mt-1">{errors.height}</p>}
            </div>
            <div>
              <Label htmlFor="unit" className="text-sm font-medium text-gray-700">Unit</Label>
              <Select value={form.custom.unit} onValueChange={(v) => update('custom', { ...form.custom, unit: v })}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mm">mm</SelectItem>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="in">in</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Does your id card required both side ?</Label>
          <RadioGroup value={form.custom.bothSides} onValueChange={(v) => update('custom', { ...form.custom, bothSides: v })} className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      ) : (
        <div className="bg-white rounded-lg border p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Upload Template</h2>
            <p className="text-sm text-gray-500">
              Upload both blank and preview versions of your template for accurate field mapping and client preview.
            </p>
          </div>

          {/* Front Side */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Front Side</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Drag & Drop here or <span className="text-blue-600 underline cursor-pointer">choose file</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderUploadBox('front', 'blank')}
              {renderUploadBox('front', 'preview')}
            </div>
          </div>

          {/* Back Side - Only show if bothSides is 'yes' */}
          {form.custom.bothSides === 'yes' && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Back Side</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Drag & Drop here or <span className="text-blue-600 underline cursor-pointer">choose file</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderUploadBox('back', 'blank')}
                {renderUploadBox('back', 'preview')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <Button
          variant="outline"
          onClick={handleBack}
          style={{
            width: '175px',
            height: '48px',
            borderRadius: '8px',
            padding: '10px 16px',
            gap: '8px',
            border: '1px solid #2E46BC',
            background: 'white',
            color: '#152056',
            fontWeight: '500'
          }}
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={loading}
          style={{
            width: '175px',
            height: '48px',
            borderRadius: '8px',
            padding: '10px 16px',
            gap: '8px',
            background: 'radial-gradient(89.12% 100% at 12.42% 0%, #2E46BC 0%, #152056 100%)',
            border: '1px solid',
            color: 'white',
            fontWeight: '500',
            opacity: '1',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          className="border-gradient !opacity-100"
        >
          {loading ? 'Processing...' : currentStep === 1 ? 'Next' : 'Save Template'}
        </Button>
      </div>

      {/* Save Template Modal */}
      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Save Template to Library</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Store this uploaded template in your library for quick access and reuse in future jobs.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Template Previews */}
            <div className="flex gap-4 justify-center">
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 mb-2">Front</div>
                <div className="w-48 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  {uploads.front.preview ? (
                    uploads.front.preview.type === 'application/pdf' ? (
                      <div className="text-white text-4xl">📄</div>
                    ) : (
                      <img
                        src={URL.createObjectURL(uploads.front.preview)}
                        alt="Front preview"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-24 h-16 bg-white/20 rounded border border-white/40" />
                  )}
                </div>
              </div>
              {form.custom.bothSides === 'yes' && (
                <div className="text-center">
                  <div className="text-xs font-medium text-gray-600 mb-2">Back</div>
                  <div className="w-48 h-32 border-2 border-gray-200 rounded-lg overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                    {uploads.back.preview ? (
                      uploads.back.preview.type === 'application/pdf' ? (
                        <div className="text-white text-4xl">📄</div>
                      ) : (
                        <img
                          src={URL.createObjectURL(uploads.back.preview)}
                          alt="Back preview"
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <div className="w-24 h-16 bg-white/20 rounded border border-white/40" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="templateName" className="text-sm font-medium text-gray-700">
                  Template Name *
                </Label>
                <Input
                  id="templateName"
                  placeholder="Enter template name"
                  value={saveForm.templateName}
                  onChange={(e) => setSaveForm({ ...saveForm, templateName: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Select template category
                </Label>
                <Select value={saveForm.category} onValueChange={(v) => setSaveForm({ ...saveForm, category: v })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYEE">Employee ID</SelectItem>
                    <SelectItem value="STUDENT">Student ID</SelectItem>
                    <SelectItem value="VISITOR">Visitor Pass</SelectItem>
                    <SelectItem value="MEMBERSHIP">Membership Card</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="orientation" className="text-sm font-medium text-gray-700">
                  Save to *
                </Label>
                <Select value={saveForm.orientation} onValueChange={(v) => setSaveForm({ ...saveForm, orientation: v })}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select Orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LANDSCAPE">📐 Landscape Templates</SelectItem>
                    <SelectItem value="PORTRAIT">📄 Portrait Templates</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1.5">
                  Template dimensions: {form.custom.width} × {form.custom.height} {form.custom.unit}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowSaveModal(false)}
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveTemplate}
                className="flex-1 h-12"
                style={{
                  background: 'radial-gradient(89.12% 100% at 12.42% 0%, #2E46BC 0%, #152056 100%)',
                  color: 'white',
                }}
              >
                Save Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
