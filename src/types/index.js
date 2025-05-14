// Resume Data Types
export const Resume = {
  id: Number,
  jobId: Number,
  personalDetails: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
  },
  summary: String,
  educationSection: {
    id: Number,
    orderIndex: Number,
    sectionTitle: String,
    items: Array,  // Items would be of type EducationItem
    hidden: Boolean,
  },
  experienceSection: {
    id: Number,
    orderIndex: Number,
    sectionTitle: String,
    items: Array,  // Items would be of type ExperienceItem
    hidden: Boolean,
  },
  skillSection: {
    id: Number,
    orderIndex: Number,
    sectionTitle: String,
    items: Array,  // Items would be of type SkillItem
    hidden: Boolean,
  },
  projectSection: {
    id: Number,
    orderIndex: Number,
    sectionTitle: String,
    items: Array,  // Items would be of type ProjectItem
    hidden: Boolean,
  },
  createdAt: String,
  updatedAt: String,
  sectionsOrder: Object,  // A key-value pair of string and number
};

export const PersonalDetails = {
  fullName: String,
  email: String,
  phone: String,
  address: String,
};

export const Section = {
  id: Number,
  orderIndex: Number,
  sectionTitle: String,
  items: Array,  // The items can be an array of any type (EducationItem, ExperienceItem, etc.)
  hidden: Boolean,
};

export const BaseItem = {
  id: Number,
  orderIndex: Number,
};

export const EducationItem = {
  id: Number,
  orderIndex: Number,
  degree: String,
  school: String,
  city: String,
  country: String,
  startDate: String,
  endDate: String,
  description: String,
  present: Boolean,
};

export const ExperienceItem = {
  id: Number,
  orderIndex: Number,
  jobTitle: String,
  company: String,
  city: String,
  country: String,
  startDate: String,
  endDate: String,
  description: String,
  present: Boolean,
};

export const SkillItem = {
  id: Number,
  orderIndex: Number,
  skill: String,
  level: ['BEGINNER', 'INTERMEDIATE', 'PROFICIENT', 'EXPERT'],
};

export const ProjectItem = {
  id: Number,
  orderIndex: Number,
  title: String,
  startDate: String,
  endDate: String,
  description: String,
  skills: [{ id: Number, skill: String }],  // Array of objects with skill id and skill name
  present: Boolean,
};

// Template Types
export const TemplateName = ['modern', 'classic', 'technical', 'minimal'];

export const Template = {
  id: String,  // TemplateName would be the string types ('modern', 'classic', etc.)
  name: String,
  description: String,
  thumbnail: String,
};

// UI Types
export const DraggableItemProps = {
  id: [String, Number],
  index: Number,
  children: React.ReactNode,
  className: String,  // Optional
};

export const DroppableContainerProps = {
  id: String,
  items: Array,  // Items would be any array
  onDragEnd: Function,  // Callback function to handle drag end event
  children: React.ReactNode,
  className: String,  // Optional
};

// API Types
export const ApiResponse = {
  data: 'Any type',  // Can be any data type
  success: Boolean,
  message: String,  // Optional
};
