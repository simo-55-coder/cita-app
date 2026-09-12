import { CVData, Language } from '../types';

export const defaultCV_en: CVData = {
  id: 'cv-sample-en',
  title: 'Senior Mobile Engineer CV',
  updatedAt: new Date().toISOString(),
  cvLanguage: 'en',
  personal: {
    fullName: 'Alexandre Morgan',
    jobTitle: 'Senior Mobile & Frontend Engineer',
    email: 'alex.morgan.dev@gmail.com',
    phone: '+1 (555) 234-8901',
    location: 'San Francisco, CA',
    website: 'https://alexmorgan.dev',
    linkedin: 'linkedin.com/in/alexmorgan-dev',
    github: 'github.com/alexmorgan-mobile',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
  },
  summary:
    'Dedicated Mobile & UI/UX Engineer with 6+ years of expertise crafting high-performance Android & React Native applications. Passionate about micro-interactions, responsive typography, 60fps animations, and clean architecture. Proven record leading cross-functional teams and accelerating app release cycles by 40%.',
  experiences: [
    {
      id: 'exp-1',
      company: 'Apex Digital Labs',
      position: 'Lead Mobile Architect',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: 'Present',
      current: true,
      description:
        'Directing architecture for Android and cross-platform mobile client suites used by over 1.8M active monthly users.',
      highlights: [
        'Redesigned core mobile checkout funnel, reducing bounce rates by 28% and boosting conversions.',
        'Pioneered design token system that synchronized Figma styles with React Native & Tailwind components.',
        'Mentored 7 junior engineers and introduced automated UI snapshot testing with 94% coverage.',
      ],
    },
    {
      id: 'exp-2',
      company: 'Nova Mobile Systems',
      position: 'Senior UI/UX & Frontend Developer',
      location: 'Austin, TX (Remote)',
      startDate: '2019-06',
      endDate: '2022-02',
      current: false,
      description:
        'Engineered responsive mobile applications and offline-first data sync engines with real-time analytics.',
      highlights: [
        'Refactored legacy state tree, decreasing bundle size by 35% and startup latency to under 700ms.',
        'Implemented bi-directional cloud backup and Google Drive export integration for enterprise reports.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science',
      fieldOfStudy: 'Software Engineering & Human-Computer Interaction',
      location: 'Berkeley, CA',
      startDate: '2015-09',
      endDate: '2019-05',
      gpa: '3.86 / 4.0',
    },
  ],
  skills: [
    { id: 'sk-1', name: 'React / React Native', level: 'Expert', category: 'Technical' },
    { id: 'sk-2', name: 'TypeScript', level: 'Expert', category: 'Technical' },
    { id: 'sk-3', name: 'Android Architecture & Kotlin', level: 'Advanced', category: 'Technical' },
    { id: 'sk-4', name: 'Tailwind CSS & Mobile UI', level: 'Expert', category: 'Technical' },
    { id: 'sk-5', name: 'Framer Motion & Gestures', level: 'Advanced', category: 'Technical' },
    { id: 'sk-6', name: 'REST & GraphQL APIs', level: 'Advanced', category: 'Technical' },
    { id: 'sk-7', name: 'Figma & Mobile Design Systems', level: 'Advanced', category: 'Tools' },
    { id: 'sk-8', name: 'Agile Team Leadership', level: 'Advanced', category: 'Soft Skills' },
  ],
  languages: [
    { id: 'lang-1', name: 'English', proficiency: 'Native' },
    { id: 'lang-2', name: 'French', proficiency: 'Fluent' },
    { id: 'lang-3', name: 'Arabic', proficiency: 'Intermediate' },
  ],
  hobbies: [
    'Mobile Photography',
    'Open Source Mentoring',
    'Trail Running',
    'Mechanical Keyboards',
    'Indie Game Development',
  ],
  theme: {
    primaryColor: '#8b5cf6',
    accentColor: '#7c3aed',
    fontFamily: 'sans',
    layoutStyle: 'modern',
    template: 'modern',
  },
};

export const defaultCV_fr: CVData = {
  id: 'cv-sample-fr',
  title: 'CV Ingénieur Mobile Senior',
  updatedAt: new Date().toISOString(),
  cvLanguage: 'fr',
  personal: {
    fullName: 'Alexandre Morgan',
    jobTitle: 'Ingénieur Mobile & Frontend Senior',
    email: 'alex.morgan.dev@gmail.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris, France',
    website: 'https://alexmorgan.dev',
    linkedin: 'linkedin.com/in/alexmorgan-dev',
    github: 'github.com/alexmorgan-mobile',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
  },
  summary:
    'Ingénieur Mobile & UI/UX passionné avec 6+ ans d\'expertise dans la conception d\'applications Android et React Native haute performance. Spécialiste des micro-interactions, de la typographie responsive et d\'architectures logicielles fiables. Expérience confirmée dans la direction technique et l\'accélération des cycles de livraison.',
  experiences: [
    {
      id: 'exp-fr-1',
      company: 'Apex Digital Labs',
      position: 'Architecte Mobile Principal',
      location: 'Paris, France (Hybride)',
      startDate: '2022-03',
      endDate: 'Présent',
      current: true,
      description:
        'Direction technique des architectures mobiles Android et multiplateformes au service de plus de 1,8M d\'utilisateurs mensuels.',
      highlights: [
        'Refonte complète du tunnel d\'achat mobile, réduisant le taux d\'abandon de 28% et augmentant les conversions.',
        'Création d\'un système de Design Tokens synchronisant les maquettes Figma avec Tailwind et React Native.',
        'Mentorat de 7 ingénieurs juniors et instauration de tests automatisés couvrant 94% des flux clés.',
      ],
    },
    {
      id: 'exp-fr-2',
      company: 'Nova Mobile Systems',
      position: 'Développeur UI/UX & Frontend Senior',
      location: 'Lyon, France (Télétravail)',
      startDate: '2019-06',
      endDate: '2022-02',
      current: false,
      description:
        'Conception d\'applications mobiles réactives avec synchronisation des données hors ligne et analytique en temps réel.',
      highlights: [
        'Refactorisation de la gestion d\'état, réduisant la taille du bundle de 35% et le temps de démarrage à 700ms.',
        'Intégration d\'une sauvegarde Cloud automatisée avec Google Drive pour l\'export des rapports d\'activité.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-fr-1',
      institution: 'Université Paris-Saclay',
      degree: 'Master en Informatique & Génie Logiciel',
      fieldOfStudy: 'Génie Logiciel & Interaction Homme-Machine',
      location: 'Orsay / Paris',
      startDate: '2015-09',
      endDate: '2019-06',
      gpa: 'Mention Très Bien',
    },
  ],
  skills: [
    { id: 'sk-fr-1', name: 'React / React Native', level: 'Expert', category: 'Technical' },
    { id: 'sk-fr-2', name: 'TypeScript', level: 'Expert', category: 'Technical' },
    { id: 'sk-fr-3', name: 'Architecture Android & Kotlin', level: 'Advanced', category: 'Technical' },
    { id: 'sk-fr-4', name: 'Tailwind CSS & Mobile UI', level: 'Expert', category: 'Technical' },
    { id: 'sk-fr-5', name: 'Framer Motion & Gestes', level: 'Advanced', category: 'Technical' },
    { id: 'sk-fr-6', name: 'APIs REST & GraphQL', level: 'Advanced', category: 'Technical' },
    { id: 'sk-fr-7', name: 'Figma & Design Systems', level: 'Advanced', category: 'Tools' },
    { id: 'sk-fr-8', name: 'Leadership & Méthodes Agiles', level: 'Advanced', category: 'Soft Skills' },
  ],
  languages: [
    { id: 'lang-fr-1', name: 'Français', proficiency: 'Native' },
    { id: 'lang-fr-2', name: 'Anglais', proficiency: 'Fluent' },
    { id: 'lang-fr-3', name: 'Espagnol', proficiency: 'Intermediate' },
  ],
  hobbies: [
    'Photographie mobile',
    'Mentorat Open Source',
    'Course à pied & Trail',
    'Claviers mécaniques',
    'Développement de jeux indé',
  ],
  theme: {
    primaryColor: '#8b5cf6',
    accentColor: '#7c3aed',
    fontFamily: 'sans',
    layoutStyle: 'modern',
    template: 'modern',
  },
};

export const defaultCV_ar: CVData = {
  id: 'cv-sample-ar',
  title: 'السيرة الذاتية لمهندس تطبيقات موبايل أول',
  updatedAt: new Date().toISOString(),
  cvLanguage: 'ar',
  personal: {
    fullName: 'طارق المهندس',
    jobTitle: 'مهندس برمجيات وتطبيقات الهواتف الذكية (أول)',
    email: 'tarek.engineer.dev@gmail.com',
    phone: '+966 50 123 4567',
    location: 'الرياض، المملكة العربية السعودية',
    website: 'https://tarek-dev.com',
    linkedin: 'linkedin.com/in/tarek-engineer',
    github: 'github.com/tarek-mobile-dev',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
  },
  summary:
    'مهندس برمجيات وتطبيقات ذكية بخبرة تتجاوز 6 سنوات في بناء وتطوير تطبيقات أندرويد وتطبيقات الهواتف عبر React Native و Kotlin. شغوف بالهندسة المعمارية النظيفة، وسلاسة الواجهات التفاعلية بمعدل 60 إطاراً في الثانية، وتحسين تجربة المستخدم. سجل حافل بقيادة الفرق البرمجية وتسريع دورات الإطلاق بنسبة 40٪.',
  experiences: [
    {
      id: 'exp-ar-1',
      company: 'مختبرات آبيكس الرقمية',
      position: 'قائد معماري تطبيقات الموبايل',
      location: 'الرياض، السعودية',
      startDate: '2022-03',
      endDate: 'حتى الآن',
      current: true,
      description:
        'قيادة وتوجيه البنية التقنية لمنظومة تطبيقات الهواتف الذكية التي تخدم أكثر من 1.8 مليون مستخدم نشط شهرياً.',
      highlights: [
        'إعادة هندسة مسار الدفع والشراء في التطبيق، مما قلص معدل الارتداد بنسبة 28٪ ورفع نسبة التحويلات.',
        'ابتكار نظام رموز تصميم (Design Tokens) لربط تصاميم فيغما مع مكتبات Tailwind و React Native.',
        'تدريب وتوجيه 7 مهندسين مبتدئين واعتماد اختبارات واجهة المستخدم التلقائية بنسبة تغطية 94٪.',
      ],
    },
    {
      id: 'exp-ar-2',
      company: 'أنظمة نوفا الذكية',
      position: 'مطور واجهات وتجربة مستخدم أول',
      location: 'الرياض (عن بُعد)',
      startDate: '2019-06',
      endDate: '2022-02',
      current: false,
      description:
        'تطوير تطبيقات هواتف ذكية سريعة الاستجابة وتضمين محرك مزامنة بيانات سحابي يعمل حتى بدون اتصال بالإنترنت.',
      highlights: [
        'إعادة بناء شجرة الحالة البرمجية مما خفض حجم التطبيق بنسبة 35٪ ووقت التشغيل إلى أقل من 700 مللي ثانية.',
        'تضمين ميزة النسخ الاحتياطي السحابي التلقائي عبر Google Drive لتصدير وحفظ التقارير المؤسسية.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-ar-1',
      institution: 'جامعة الملك سعود',
      degree: 'بكالوريوس في علوم الحاسب والمعلومات',
      fieldOfStudy: 'هندسة البرمجيات والتفاعل بين الإنسان والحاسب',
      location: 'الرياض، المملكة العربية السعودية',
      startDate: '2015-09',
      endDate: '2019-05',
      gpa: '4.88 / 5.0 (مرتبة الشرف الأولى)',
    },
  ],
  skills: [
    { id: 'sk-ar-1', name: 'React / React Native', level: 'Expert', category: 'Technical' },
    { id: 'sk-ar-2', name: 'TypeScript', level: 'Expert', category: 'Technical' },
    { id: 'sk-ar-3', name: 'هندسة أندرويد و Kotlin', level: 'Advanced', category: 'Technical' },
    { id: 'sk-ar-4', name: 'Tailwind CSS وتصميم الواجهات', level: 'Expert', category: 'Technical' },
    { id: 'sk-ar-5', name: 'الحركات التفاعلية Framer Motion', level: 'Advanced', category: 'Technical' },
    { id: 'sk-ar-6', name: 'واجهات البرمجة REST & GraphQL', level: 'Advanced', category: 'Technical' },
    { id: 'sk-ar-7', name: 'Figma ونظم التصميم الموحدة', level: 'Advanced', category: 'Tools' },
    { id: 'sk-ar-8', name: 'القيادة التقنية ومنهجيات Agile', level: 'Advanced', category: 'Soft Skills' },
  ],
  languages: [
    { id: 'lang-ar-1', name: 'العربية', proficiency: 'Native' },
    { id: 'lang-ar-2', name: 'الإنجليزية', proficiency: 'Fluent' },
    { id: 'lang-ar-3', name: 'الفرنسية', proficiency: 'Intermediate' },
  ],
  hobbies: [
    'التصوير الفوتوغرافي بالهاتف',
    'المساهمة في البرمجيات مفتوحة المصدر',
    'الجري في الطبيعة',
    'لوحات المفاتيح الميكانيكية',
    'برمجة الألعاب المستقلة',
  ],
  theme: {
    primaryColor: '#8b5cf6',
    accentColor: '#7c3aed',
    fontFamily: 'sans',
    layoutStyle: 'modern',
    template: 'modern',
  },
};

export const defaultCV = defaultCV_en;

export const getSampleCVForLanguage = (lang: Language): CVData => {
  if (lang === 'ar') return defaultCV_ar;
  if (lang === 'fr') return defaultCV_fr;
  return defaultCV_en;
};
