import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { Eye, MoreVertical, Trash2 } from 'lucide-react';
import { getImageUrl } from '@/utils/imageUtils';

export function TemplateCard({ template, onPreview, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);

  // Use front preview URL and convert to full URL
  const imageUrl = getImageUrl(template.frontPreviewUrl);

  return (
    <Card
      className="border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer p-0 h-[200px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Template Preview - ONLY IMAGE */}
      <div className="relative bg-gray-100 w-full h-full">
        {/* Template Image */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        ) : (
          // Fallback design if no image
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-sm font-semibold text-gray-600">
                {template.name}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {template.templateWidth} × {template.templateHeight} {template.unit}
              </p>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
            {template.category}
          </Badge>
        </div>

        {/* Action Button - Always visible at top right */}
        {onDelete && (
          <div className="absolute top-2 right-2 z-30">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50">
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(template);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Hover Overlay with Preview Button at Bottom */}
        {isHovered && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white flex items-center justify-center gap-2 py-3 px-4 z-20">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-9 text-sm font-medium"
              onClick={(e) => {
                e.stopPropagation();
                if (onPreview) onPreview(template);
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
