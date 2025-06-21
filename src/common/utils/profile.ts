export interface PersonalDetails {
  fullName: string;
  jobTitle: string;
  bio: string;
}

export interface Education {
  degree: string;
  school: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  present: boolean;
  description: string;
}

export interface Experience {
  jobTitle: string;
  company: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  present: boolean;
  description: string;
}

export interface Skill {
  skill: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
}

export interface ProfileData {
  personalDetails: PersonalDetails;
  educationList: Education[];
  experienceList: Experience[];
  userSkills: Skill[];
}
