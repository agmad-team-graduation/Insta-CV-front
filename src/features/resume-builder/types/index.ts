// Resume Data Types
export interface Resume {
  id: number;
  jobId: number;
  cvTitle?: string;
  personalDetails: PersonalDetails;
  summarySection: {
    summary: string;
    sectionTitle: string;
    hidden: boolean;
    orderIndex: number;
  };
  educationSection: Section<EducationItem>;
  experienceSection: Section<ExperienceItem>;
  skillSection: Section<SkillItem>;
  projectSection: Section<ProjectItem>;
  createdAt: string;
  updatedAt: string;
  sectionsOrder: Record<string, number>;
}

export interface PersonalDetails {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  hidden?: boolean;
}

export interface Section<T> {
  id: number;
  orderIndex: number;
  sectionTitle: string;
  items: T[];
  hidden: boolean;
}

export interface BaseItem {
  id: number;
  orderIndex: number;
  hidden?: boolean;
}

export interface EducationItem extends BaseItem {
  degree: string;
  school: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  description: string;
  present: boolean;
}

export interface ExperienceItem extends BaseItem {
  jobTitle: string;
  company: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  description: string;
  present: boolean;
}

export interface SkillItem extends BaseItem {
  skill: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}

export interface ProjectItem extends BaseItem {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  skills: { id: number; skill: string }[];
  present: boolean;
}

// Template Types
export type TemplateName = 'modern' | 'classic' | 'technical' | 'harvard' | 'harvardclassic' | 'huntergreen' | 'atlanticblue';

export interface Template {
  id: TemplateName;
  name: string;
  description: string;
  thumbnail: string;
}

// UI Types
export interface DraggableItemProps {
  id: string | number;
  index: number;
  children: React.ReactNode;
  className?: string;
}

export interface DroppableContainerProps {
  id: string;
  items: any[];
  onDragEnd: (result: any) => void;
  children: React.ReactNode;
  className?: string;
}

// API Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
} 