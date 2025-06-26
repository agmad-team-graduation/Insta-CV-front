import React from 'react';
import { Resume, TemplateName } from '../../types';
import ModernTemplate from './ModernTemplate';
import ClassicTemplate from './ClassicTemplate';
import TechnicalTemplate from './TechnicalTemplate';
import HarvardTemplate from './HarvardTemplate';
import HarvardClassicTemplate from './HarvardClassicTemplate';
import HunterGreenTemplate from './HunterGreenTemplate';
import AtlanticBlueTemplate from './AtlanticBlueTemplate';
import LaTeXTemplate from './LaTeXTemplate';

export interface TemplateProps {
  resume: Resume;
}

type TemplateComponent = React.ComponentType<TemplateProps>;

// Template registry - maps template names to their components
export const templateRegistry: Record<TemplateName, TemplateComponent> = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  technical: TechnicalTemplate,
  harvard: HarvardTemplate,
  harvardclassic: HarvardClassicTemplate,
  huntergreen: HunterGreenTemplate,
  atlanticblue: AtlanticBlueTemplate,
  latex: LaTeXTemplate,
};

// Helper function to get template component by name
export const getTemplateComponent = (templateName: TemplateName): TemplateComponent => {
  return templateRegistry[templateName];
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
  LaTeXTemplate,
}; 