Chapter 5: Implementation and Testing
5.1 AI 
5.1.1 Skill Extraction Model
5.1.1.1 Problem
One of the core functionalities is extracting relevant skills from job descriptions. These extracted skills are essential for enabling skill matching and gap analysis. The primary problem we address is automatic skill extraction from unstructured job description text — a task best framed as Named Entity Recognition (NER) using BIO sequence labeling, where spans corresponding to knowledge entities are identified. This problem falls under the domain of Natural Language Processing (NLP) and is approached using modern transformer-based language models fine-tuned for this NER task.
This enables downstream processes to compare extracted job-required skills with the user's skill profile, compute a compatibility score, and recommend missing skills for career growth.
5.1.1.2 Research Paper
To approach this problem, we explored several research directions and identified the SkillSpan paper as the most suitable foundation. The paper titled "SkillSpan: A Benchmark Dataset for Extracting and Normalizing Skills" introduces a high-quality benchmark dataset for skill and knowledge extraction and proposes a span-based approach using BIO (Begin-Inside-Outside) tagging to label mentions in job descriptions.
The paper builds on the ESCO taxonomy, which separates knowledge and skills:
Knowledge refers to learned concepts, such as "object-oriented programming" or "machine learning."
Skills are the ability to apply that knowledge in practical scenarios, such as "building a REST API" or "working in a fast environment."
In this framework, many technical topics relevant to IT are categorized as knowledge components. Since our goal is to identify technical competencies from job descriptions, we focused specifically on knowledge extraction.
5.1.1.3 Dataset
We adopted the dataset provided by the SkillSpan paper, which includes job postings annotated with BIO tags for both skills and knowledge mentions. The dataset contains approximately 14.5K sentences and over 12.5K annotated spans, making it a robust and diverse resource for training and evaluating sequence labeling models.
The job postings were collected between June 2020 and September 2021 from three sources:
BIG: A major job platform with diverse job types and positions.
HOUSE: An in-house dataset covering similar job types from 2012–2020.
TECH: Data from StackOverflow job listings, heavily focused on technical positions like developer roles.
The presence of the TECH subset was especially valuable for our project, which focuses on extracting technical skills in the IT domain.
Each input to the model is a tokenized sentence from a job description. Each token is labeled using the BIO scheme:
B-KNOWLEDGE for the beginning of a knowledge span,
I-KNOWLEDGE for continuation within a span,
O for tokens outside any span.
Example input-output pair:
Input sentence: "Strong understanding of data structures and algorithms."
BIO labels: O O O B-KNOWLEDGE I-KNOWLEDGE O B-KNOWLEDGE
This labeling makes the dataset suitable for training Named Entity Recognition (NER) models to extract knowledge spans from text, which we then use in our downstream matching and analysis pipeline.
5.1.1.4 Fine-tuning Different Models
As part of our implementation, we fine-tuned several transformer-based models on the SkillSpan dataset's knowledge extraction task:
BERT-Base (bert-base-cased): Served as our baseline model. While it offered decent performance, it lacked domain-specific understanding and trailed behind more specialized models.


JobBERT: A domain-adapted variant of BERT. It was created by continuing pre-training on ~3.2 million sentences from job postings. We then fine-tuned this model on the SkillSpan dataset (14.5K sentences, 12.5K spans) specifically for knowledge extraction (referred to as jobbert_knowledge_extraction). This adaptation led to improved domain awareness and better performance.
SpanBERT: This model is designed to better represent and predict span-level entities. It performed fairly well, but slightly under JobBERT.


JobSpanBERT: A domain-specific variant of SpanBERT trained on job-related corpora. It showed slightly lower F1 scores than JobBERT, possibly due to overfitting or reduced generalization.


RoBERTa (xlm-roberta-large): We extended the SkillSpan setup by introducing a large RoBERTa model. RoBERTa has a different architecture from the others and is trained on more data with dynamic masking. It was introduced mainly for experimentation and research purposes.
5.1.1.5 Results
We evaluated all models using precision, recall, and span-level F1 score on the development set for the knowledge extraction task:
Model
Precision
Recall
F1 Score
JobSpanBERT
0.537
0.671
0.597
BERT-Base (baseline)
0.556
0.622
0.587
SpanBERT
0.555
0.663
0.604
JobBERT
0.558
0.678
0.612
RoBERTa (XLM-large)
0.618
0.688
0.651

Table 5.1.1: Skill extraction comparison table

Figure 5.1.1: Skill extraction comparison chart
Among all, RoBERTa and JobBERT produced the most interesting and high-performing results. RoBERTa achieved the best F1 score overall. However, due to its different architecture, significantly larger resource demands, and deployment complexity, we treated it as a research and comparison model rather than a production candidate.
Deployment Considerations
Given the real-time nature of our application and resource constraints, we built a FastAPI application hosted on Hugging Face Spaces. This API utilizes the JobBERT model to analyze job descriptions and return extracted knowledge spans. These are then used to compute user compatibility scores and suggest missing knowledge areas.
5.1.2 Skill Matching Model
5.1.2.1 Problem
Once job-required knowledge components are extracted, we need to match them against a user's skills to assess compatibility. This isn't a simple exact string match — for example, "Python scripting" and "Python programming" should match based on meaning. The problem requires semantic matching, not lexical matching.
5.1.2.2 Model Choice
We used the sentence-transformers/all-MiniLM-L6-v2 model — a well-known sentence embedding model that maps sentences and phrases to a 384-dimensional dense vector space. We chose this model because:
It enables semantic comparisons, which is critical for matching real-world skill phrases.
It is lightweight and fast (6-layer transformer), making it suitable for responsive applications.
It is widely adopted and performs well on standard similarity tasks.
Other popular embedding models (e.g., MPNet, DistilUSE, or BERT-based sentence models) were considered, but MiniLM provided the best trade-off between speed, resource usage, and semantic accuracy for our task.
5.1.2.3 Matching Logic
We encode each skill from the job and the user into dense vectors, then compute cosine similarity between them to form a similarity matrix.
Since each job skill is compared with every user skill, the system performs many pairwise comparisons. The choice of MiniLM helps keep this operation fast and feasible, even with moderate-sized skill sets.
This step enables us to calculate a matching score and identify missing or weakly matched skills to support user feedback and recommendations.
5.1.3 Use of LLMs (Large Language Models)
In addition to our custom-trained models for skill extraction and semantic skill matching, we leveraged several Large Language Models (LLMs) to support auxiliary tasks such as interview question generation, job summarization, and document parsing. These tasks benefit from the general-purpose capabilities of LLMs, and unlike our core models, the choice of LLM is more flexible and can be adjusted over time based on performance, availability, and cost.
We adopted a trial-and-error approach backed by practical comparison to determine which model best fits each task. Since we rely on free or limited-access versions of these models, we distribute the load across providers to stay within request and token limits.
5.1.3.1 Interview Question Generation
Model Used: deepseek-r1-distill-llama-70b
Purpose: Generate relevant interview questions based on job descriptions and required skills.
Rationale: This model demonstrates strong performance across academic, programming, and professional language tasks, making it suitable for generating rich, context-aware questions.
5.1.3.2 Job Description Summarization & Cleaning
Model Used: meta-llama/llama-guard-4-12b
Purpose: Summarize and clean noisy job descriptions before they are processed.
Rationale: Since we integrate job postings from external sources, many contain noise such as excessive branding, marketing language, or inconsistent formatting. To improve the quality of downstream skill extraction and analysis, we use this model to filter and standardize the content effectively while maintaining performance and cost-efficiency.
5.1.3.3 PDF Parsing and Extraction
Model Used: Gemini 2.5
Purpose: Extract and interpret content from PDF resume documents.
Rationale: Users often upload their CVs in PDF format. To analyze and extract structured data (such as skills or experiences) from these documents, we needed a model capable of handling complex layouts and varied file structures. Gemini Flash performed this task accurately and efficiently.
Flexibility and Future Adjustments
LLMs are used here as interchangeable tools for general-purpose tasks. Their selection is based on current performance, availability, and access limits, and can be changed at any time with minimal effort. This flexibility allows us to adapt to better or more cost-efficient models as needed.

5.2 Backend
The backend of the InstaCV platform is built with Spring Boot, designed around a modular, layered architecture. It handles business logic, data persistence, AI model orchestration, and external service integration in a scalable and maintainable way.
5.2.1 Architecture
Controller Layer: HTTP endpoint routing.
Service Layer: Core logic and orchestration.
Repository Layer: Database interactions using Spring Data JPA.
Model Layer: Entity definitions mapped to the database.
DTO Layer: Structured data exchange for APIs.
Configuration Layer: External service clients and application setup.
This layered approach simplifies testing, maintenance, and future scalability.
5.2.2 External Integrations
5.2.2.1 GitHub API Integration
OAuth2-based login and permission-scoped access.
Repository data extraction (languages, README content, metadata).
Enables automated developer skill analysis based on GitHub activity.
5.2.2.2 RemoteOK Job Integration
Scheduled job sync for remote developer roles.
Cleans and normalizes content before AI skill extraction.
5.2.2.3 Cloudinary Integration
Stores user profile images with resizing and optimization.
5.2.2.4 AI Model Integration
Connects to a FastAPI service hosted on Hugging Face that runs:
JobBERT: Skill extraction from job descriptions.
all-MiniLM-L6-v2: Semantic skill matching.
Also integrates with external LLM providers:
deepseek-r1-distill-llama-70b on Groq: Used for interview question generation.
meta-llama/llama-guard-4-12b on Groq: Used for job summarization and cleaning.
Gemini Flash 2.5 via Google Vertex AI: Used for high-quality PDF parsing and text extraction.
5.2.3 Database Design
Database: PostgreSQL with normalized relational schema.
Entities:
Users: Authentication, profile information
Skills: User-declared and extracted skills
CVs: Sections, templates, and layout settings
Jobs: External listings with parsed and cleaned descriptions
Job Skills: Extracted skills per job for matching
GitHub Repositories: Metadata, README content, language data
Matching Results: Matched skills, semantic comparison outcomes
5.2.4 Additional Backend Services
Problem: The generated CVs are highly dynamic, with advanced CSS styling and custom fonts. Standard HTML-to-PDF libraries were unable to preserve the design and layout reliably.
Solution: We developed a lightweight Express.js service that uses Puppeteer, a Node.js library for controlling a headless Chrome browser. This browser renders the full preview page exactly as seen by the user and then exports it as a PDF.
This microservice functions similarly to a lambda-style rendering utility:
It accepts a CV preview URL from the frontend.
Launches a headless browser instance to render the page.
Exports a pixel-perfect PDF that matches the on-screen preview and remains fully parsable by Applicant Tracking Systems (ATS), ensuring compatibility with modern recruitment workflows.
This service is deployed independently on Railway, enabling fast rendering without burdening the main backend.
5.2.5 Deployment
Platform: Railway hosts both the Spring Boot backend and PostgreSQL.
Microservices: The Puppeteer rendering service is deployed separately on Railway for isolation and scalability.
Containerization: All services are Dockerized for consistency.
Configuration: Railway handles environment variables and automatic scaling.

5.3 Frontend
The frontend of the InstaCV platform is built with React and Vite, providing a modern, responsive user interface that seamlessly integrates with the backend services and AI capabilities. The architecture emphasizes component reusability, state management, and optimal user experience across different devices and screen sizes.
5.3.1 Technology Stack
React 18: Modern React with hooks and functional components for efficient rendering and state management.
Vite: Fast build tool and development server for rapid development cycles.
Tailwind CSS: Utility-first CSS framework for consistent, responsive styling.
Shadcn/ui: Component library built on Radix UI primitives for accessible, customizable UI components.
React Router: Client-side routing for single-page application navigation.
Zustand: Lightweight state management for global application state.
Axios: HTTP client for API communication with the backend.
5.3.2 Architecture
The frontend follows a feature-based architecture organized around domain-specific functionality:
Common Layer: Shared components, utilities, and styles used across the application.
Features Layer: Domain-specific modules (auth, profile, jobs, resume-builder, github).
Dashboard: Main application interface with overview and navigation.
Pages: Landing page and public-facing content.
Store: Global state management for user data and application state.
This modular approach enables easy maintenance, testing, and feature development while promoting code reusability.
5.3.3 Key Features Implementation
5.3.3.1 Authentication System
OAuth2 integration with GitHub and Google for seamless login experiences.
JWT token management with automatic refresh and secure storage.
Protected routes with role-based access control.
Context-based authentication state management for real-time user status updates.
5.3.3.2 Profile Management
Multi-step profile setup wizard with progress tracking.
Dynamic skill management with drag-and-drop functionality.
GitHub integration for automatic skill extraction from repositories.
Real-time profile updates with optimistic UI updates.
5.3.3.3 Resume Builder
Template-based CV generation with 10+ professional templates.
Drag-and-drop section reordering for custom layouts.
Real-time preview with WYSIWYG editing capabilities.
PDF export functionality with pixel-perfect rendering.
Import capabilities for existing projects and experiences.
5.3.3.4 Job Matching System
Intelligent job recommendations based on user skills and preferences.
Skill gap analysis with visual progress indicators.
Interview question generation using AI models.
Job application tracking and status management.
5.3.4 Component Design
5.3.4.1 Reusable UI Components
Built on Shadcn/ui foundation with custom styling and behavior.
Consistent design system with standardized spacing, colors, and typography.
Accessible components following WCAG guidelines.
Responsive design patterns for mobile-first development.
5.3.4.2 Layout Components
Sidebar navigation with collapsible sections and active state management.
Header with user profile, notifications, and quick actions.
Footer with links and platform information.
Modal system for overlays and dialogs.
5.3.5 State Management
Zustand stores for global application state:
User store: Authentication status, profile data, and preferences.
Resume store: CV data, templates, and editing state.
Jobs store: Job listings, filters, and matching results.
Local state management with React hooks for component-specific data.
5.3.6 API Integration
Centralized API client with interceptors for authentication and error handling.
Real-time data synchronization with backend services.
Optimistic updates for improved user experience.
Error boundary implementation for graceful error handling.
5.3.7 Performance Optimization
Code splitting with React.lazy for route-based loading.
Memoization of expensive components and calculations.
Image optimization and lazy loading.
Bundle size optimization with tree shaking and dynamic imports.
5.3.8 Deployment
Platform: Netlify for static site hosting with automatic deployments.
Build Process: Vite-based production builds with optimization.
Environment Configuration: Environment-specific variables for API endpoints.
CDN: Global content delivery for fast loading times.
