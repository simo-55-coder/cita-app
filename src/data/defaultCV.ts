import { CVData, Language } from '../types';

export const getEmptyCV = (lang: Language): CVData => {
  return {
    id: `cv-${Date.now()}`,
    title: '',
    updatedAt: new Date().toISOString(),
    cvLanguage: lang,
    personal: {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
      avatarUrl: '',
    },
    summary: '',
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    hobbies: [],
    theme: {
      primaryColor: '#8b5cf6',
      accentColor: '#7c3aed',
      fontFamily: 'sans',
      layoutStyle: 'modern',
      template: 'modern',
    },
  };
};

