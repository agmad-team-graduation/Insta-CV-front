import React from 'react';
import { Template, TemplateName } from '../types/index';
import useResumeStore from '../store/resumeStore';
import { CheckIcon } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: TemplateName;
}

interface ExtendedTemplate extends Template {
  features: string[];
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate }) => {
  const { setSelectedTemplate } = useResumeStore();

  // Template options with improved descriptions and thumbnails
  const templates: ExtendedTemplate[] = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'A contemporary design with a bold blue header, perfect for tech and creative professionals.',
      thumbnail: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Bold header', 'Clean typography', 'Modern layout']
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'A timeless, professional template with a dark header. Ideal for corporate roles.',
      thumbnail: 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Professional', 'Traditional', 'Corporate']
    },
    {
      id: 'technical',
      name: 'Technical',
      description: 'Specifically designed for technical roles with a monospace font and structured layout.',
      thumbnail: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Monospace', 'Technical', 'Developer-friendly']
    },
    {
      id: 'harvard',
      name: 'Harvard',
      description: 'Based on Harvard Career Services guidelines. Ideal for research and education roles.',
      thumbnail: 'https://images.pexels.com/photos/6953876/pexels-photo-6953876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Academic', 'Professional', 'Research-focused']
    },
    {
      id: 'harvardclassic',
      name: 'Harvard Classic',
      description: 'A refined Harvard-style template with elegant typography and clean section dividers.',
      thumbnail: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Academic', 'Elegant', 'Traditional']
    },
    {
      id: 'huntergreen',
      name: 'Hunter Green',
      description: 'A sophisticated template with a hunter green color scheme. Perfect for business professionals.',
      thumbnail: 'https://images.pexels.com/photos/3747463/pexels-photo-3747463.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Elegant', 'Hunter green', 'Business']
    },
    {
      id: 'atlanticblue',
      name: 'Atlantic Blue',
      description: 'A modern template with a deep blue color scheme and sidebar layout.',
      thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      features: ['Sidebar', 'Deep blue', 'Modern']
    }
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-800 mb-1">Choose a Template</h2>
        <p className="text-gray-600 text-sm">Select a template design that best represents your professional style</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div 
            key={template.id}
            className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
              selectedTemplate === template.id 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="relative">
              <div className="aspect-[16/9] bg-gray-100 relative">
                <img 
                  src={template.thumbnail} 
                  alt={`${template.name} template`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Template+Preview';
                  }}
                />
                {selectedTemplate === template.id && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                    <div className="bg-white rounded-full p-1.5">
                      <CheckIcon size={20} className="text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-3">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-medium text-gray-800 text-sm">{template.name}</h3>
                {selectedTemplate === template.id && (
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{template.description}</p>
              <div className="flex flex-wrap gap-1">
                {template.features.map((feature: string, index: number) => (
                  <span 
                    key={index}
                    className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector; 