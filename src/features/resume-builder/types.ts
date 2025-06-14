export interface EducationItem {
  id: number;
  orderIndex: number;
  degree: string;
  school: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  description: string;
  present: boolean;
  hidden?: boolean;
}

export type EducationEntry = EducationItem; 