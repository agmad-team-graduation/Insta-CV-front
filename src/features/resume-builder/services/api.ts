import { ApiResponse, Resume } from '../types';
import apiClient from '../../../common/utils/apiClient';

/**
 * Fetch resume data by ID
 */
export const fetchResume = async (resumeId: number): Promise<Resume> => {
  try {
    const response = await apiClient.get<Resume>(`/api/v1/cv/${resumeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resume:', error);
    throw error;
  }
};

/**
 * Update resume data
 */
export const updateResume = async (resumeId: number, resumeData: Partial<Resume>): Promise<Resume> => {
  try {
    const response = await apiClient.put<Resume>(`/api/v1/cv/${resumeId}`, resumeData);
    return response.data;
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
};

/**
 * Generate a CV for a specific job
 */
export const fetchDemoResume = async (): Promise<Resume> => {
  // This is a fallback demo data for development purposes
  const demoData: Resume = {
    id: 5,
    jobId: 11,
    personalDetails: {
      fullName: "Youssef Hassan Demo",
      email: "youssef@gmail.com",
      phone: "01008430008",
      address: "100 Street, Cairo, Egypt"
    },
    summary: "Professional with experience in Java, Spring Boot, PostgreSQL, REST API Design, JUnit seeking a position as Software Engineer at Apple.",
    educationSection: {
      id: 2,
      orderIndex: 1,
      sectionTitle: "Education",
      items: [
        {
          id: 5,
          degree: "BSc in Computer Science",
          school: "Massachusetts Institute of Technology (MIT)",
          city: "Cambridge",
          country: "USA",
          startDate: "2016-09-01",
          endDate: "2020-06-01",
          description: "Graduated with Honors. Focused on backend development, distributed systems, and AI fundamentals.",
          orderIndex: 1,
          present: false
        }
      ],
      hidden: false
    },
    experienceSection: {
      id: 2,
      orderIndex: 2,
      sectionTitle: "Work Experience",
      items: [
        {
          id: 9,
          jobTitle: "Senior Backend Developer",
          company: "TechCorp Solutions",
          city: "Boston",
          country: "USA",
          startDate: "2020-07-01",
          endDate: "2023-12-01",
          description: "Led the development of scalable REST APIs using Spring Boot. Designed microservices architecture, integrated OAuth2 authentication, and managed DevOps pipelines with Docker and GitHub Actions.",
          orderIndex: 1,
          present: false
        },
        {
          id: 10,
          jobTitle: "Software Engineer Intern",
          company: "Amazon Web Services",
          city: "Seattle",
          country: "USA",
          startDate: "2019-06-01",
          endDate: "2019-08-31",
          description: "Worked on AWS Lambda team to optimize serverless runtime startup. Used Java and Go for internal tooling.",
          orderIndex: 2,
          present: false
        }
      ],
      hidden: false
    },
    skillSection: {
      id: 2,
      orderIndex: 4,
      sectionTitle: "Skills",
      items: [
        {
          id: 8,
          skill: "Java",
          level: "EXPERT",
          orderIndex: 1
        },
        {
          id: 9,
          skill: "Spring Boot",
          level: "PROFICIENT",
          orderIndex: 2
        },
        {
          id: 10,
          skill: "PostgreSQL",
          level: "PROFICIENT",
          orderIndex: 3
        },
        {
          id: 11,
          skill: "REST API Design",
          level: "EXPERT",
          orderIndex: 4
        },
        {
          id: 12,
          skill: "JUnit",
          level: "INTERMEDIATE",
          orderIndex: 5
        }
      ],
      hidden: false
    },
    projectSection: {
      id: 2,
      orderIndex: 3,
      sectionTitle: "Projects",
      items: [
        {
          id: 5,
          title: "InstaCV Builder",
          startDate: "2022-01-01",
          endDate: "2022-12-01",
          description: "Built a personalized CV generation platform that analyzes user profiles and job descriptions to create tailored resumes. Integrated OpenAI for skill extraction and implemented a robust job-skill matching algorithm.",
          skills: [
            { id: 17, skill: "Spring Boot" },
            { id: 18, skill: "PostgreSQL" }
          ],
          orderIndex: 1,
          present: false
        }
      ],
      hidden: false
    },
    createdAt: "2025-05-04T23:28:54.7881003",
    updatedAt: "2025-05-04T23:28:54.7881003",
    sectionsOrder: {
      education: 1,
      experience: 2,
      project: 3,
      skill: 4
    }
  };
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(demoData);
    }, 500);
  });
};

/**
 * Generate a CV for a specific job
 */
export const generateCV = async (jobId: number): Promise<Resume> => {
  try {
    const response = await apiClient.post<Resume>('/api/v1/cv/generate', { jobId });
    console.log("generated resume", response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating CV:', error);
    throw error;
  }
};