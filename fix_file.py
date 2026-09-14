import re

file_path = 'src/components/CVDocument.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the import block manually
good_imports = """import React from 'react';
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

const getDynamicTextSize = (text?: string, baseSize: string = 'text-[12px]') => {
  if (!text) return baseSize;
  const len = text.length;
  if (len > 35) return 'text-[9.5px] leading-tight';
  if (len > 25) return 'text-[10.5px] leading-tight';
  return baseSize;
};

const renderText = (text?: string) => {"""

# Replace everything before `const renderText = (text?: string) => {`
idx = content.find("const renderText = (text?: string) => {")
content = good_imports + content[idx + len("const renderText = (text?: string) => {"):]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
