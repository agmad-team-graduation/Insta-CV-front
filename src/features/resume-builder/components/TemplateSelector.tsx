import React from 'react';
import { Template, TemplateName } from '../types';
import useResumeStore from '../store/resumeStore';
import { CheckIcon } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplate: TemplateName;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate }) => {
  const { setSelectedTemplate } = useResumeStore();

  // Template options
  const templates: Template[] = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'A clean, contemporary design with a colored header and sidebar sections.',
      thumbnail: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional resume layout with a formal, professional appearance.',
      thumbnail: 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple, elegant design with focus on content and readability.',
      thumbnail: 'https://images.pexels.com/photos/7319303/pexels-photo-7319303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 'technical',
      name: 'Technical',
      description: 'Designed for technical roles with skills visualization and timeline features.',
      thumbnail: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    {
      id: 'harvard',
      name: 'Harvard Resume',
      description: 'Classic Sans Serif template following Harvard Career Services guidelines.',
      thumbnail: 'https://images.pexels.com/photos/6953876/pexels-photo-6953876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-800 mb-1">Choose a Template</h2>
        <p className="text-gray-600 text-sm">Select a template design for your resume</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
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
              <img 
                src={template.thumbnail} 
                alt={`${template.name} template`} 
                className="w-full h-40 object-cover"
              />
              {selectedTemplate === template.id && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                  <div className="bg-white rounded-full p-2">
                    <CheckIcon size={24} className="text-blue-600" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-medium text-gray-800">{template.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector; 