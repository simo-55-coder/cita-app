const fs = require('fs');
const content = fs.readFileSync('src/components/CVDocument.tsx', 'utf8');

let newContent = content;

// Replace the main CVDocument signature to be just a switcher
const importsAndInterfaces = `import React from 'react';
import { CVData, TemplateId } from '../types';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Code2,
  Languages,
  Heart,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface CVDocumentProps {
  data: CVData;
  id?: string;
  isPrint?: boolean;
}

// Helper functions that can be used by all templates
export const useTemplateHelpers = (data: CVData, isPrint: boolean) => {
  const { isRTL } = useLanguage();
  const theme = data.theme;
  const getFontFamily = () => {
    if (isRTL) {
      return theme?.fontFamily === 'serif' ? 'Tajawal, Cairo, serif' : 'Cairo, Tajawal, sans-serif';
    }
    return theme?.fontFamily === 'serif' ? 'Playfair Display, serif' : 'Plus Jakarta Sans, sans-serif';
  };
  const getSkillPercent = (level: string) => {
    switch (level) {
      case 'Beginner': return '30%';
      case 'Intermediate': return '55%';
      case 'Advanced': return '80%';
      case 'Expert': return '100%';
      default: return '60%';
    }
  };
  return { getFontFamily, getSkillPercent };
};
`;

// Now let's extract the bodies of each template.
// Actually, it's easier to just use sed/awk or simple JS split.

