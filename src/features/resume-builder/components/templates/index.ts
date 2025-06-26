import React from 'react';
import { Resume, TemplateName } from '../../types';
import ModernTemplate from './ModernTemplate';
import ClassicTemplate from './ClassicTemplate';
import TechnicalTemplate from './TechnicalTemplate';
import HarvardTemplate from './HarvardTemplate';
import HarvardClassicTemplate from './HarvardClassicTemplate';
import HunterGreenTemplate from './HunterGreenTemplate';
import AtlanticBlueTemplate from './AtlanticBlueTemplate';

export interface TemplateProps {
  resume: Resume;
}

export type TemplateComponent = React.FC<TemplateProps>;

// Template registry - maps template names to their components
export const templateRegistry: Record<TemplateName, TemplateComponent> = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  technical: TechnicalTemplate,
  harvard: HarvardTemplate,
  harvardclassic: HarvardClassicTemplate,
  huntergreen: HunterGreenTemplate,
  atlanticblue: AtlanticBlueTemplate,
};

// Get template component by name
export const getTemplate = (templateName: TemplateName): TemplateComponent => {
  return templateRegistry[templateName] || templateRegistry.modern;
};

// Export all templates for direct import if needed
export {
  ModernTemplate,
  ClassicTemplate,
  TechnicalTemplate,
  HarvardTemplate,
  HarvardClassicTemplate,
  HunterGreenTemplate,
  AtlanticBlueTemplate,
}; 