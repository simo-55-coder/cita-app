export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  avatarUrl?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: 'Technical' | 'Soft Skills' | 'Tools';
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface ProjectItem {
  id: string;
  title: string;
  role?: string;
  description: string;
  technologies?: string;
  link?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export type TemplateId = 'modern' | 'executive' | 'creative' | 'minimalist' | 'executive-modern' | 'creative-minimal' | 'corporate-elite';

export type FontSizeOption = 'small' | 'normal' | 'large' | 'xlarge';
export type SpacingOption = 'compact' | 'normal' | 'relaxed';

export interface CVTheme {
  primaryColor: string;
  accentColor?: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  template: TemplateId;
  layoutStyle?: 'modern' | 'minimal' | 'executive' | string;
  fontSize?: FontSizeOption;
  fontSizeScale?: number;
  spacing?: SpacingOption;
  autoFillPage?: boolean;
}

export interface CVData {
  id: string;
  title: string;
  updatedAt: string;
  personal: PersonalInfo;
  summary: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  hobbies: string[];
  projects?: ProjectItem[];
  certifications?: CertificationItem[];
  theme: CVTheme;
  cvLanguage?: Language;
}

export type Language = 'en' | 'fr' | 'ar';

export type WizardTabKey =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'hobbies'
  | 'projects'
  | 'certifications'
  | 'theme';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  webViewLink?: string;
}
