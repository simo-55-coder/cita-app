/**
 * Full localization dictionary supporting English (en), French (fr), and Arabic (ar).
 * Covers every section, modal, button, placeholder, level, and document text.
 */

export const d = {
  en: {
    appTitle: 'CVita',
    appBadge: '',
    appSubtitle: 'PDF Resume Builder',
    language: 'Language',
    edit: 'Edit',
    preview: 'Preview',
    livePreview: 'Live Preview',
    resetSample: 'Clear Section',
    back: 'Back',
    next: 'Next',
    delete: 'Delete',
    present: 'Present',
    current: 'Current',
    save: 'Save',
    cancel: 'Cancel',

    // Wizard tabs
    tabs: {
      personal: 'Personal',
      summary: 'Summary',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      languages: 'Languages',
      hobbies: 'Hobbies',
      theme: 'Templates',
    },

    // Personal Section
    personal: {
      sectionTitle: 'Contact & Identity',
      sectionDesc: 'Your core personal details shown at the top of your CV',
      fullName: 'Full Name',
      fullNamePlaceholder: 'e.g. Alexandre Morgan',
      jobTitle: 'Target Job Title',
      jobTitlePlaceholder: 'e.g. Senior Mobile & Frontend Engineer',
      email: 'Email Address',
      phone: 'Phone Number',
      location: 'Location (City, Country / State)',
      locationPlaceholder: 'e.g. San Francisco, CA',
      website: 'Portfolio / Website',
      websitePlaceholder: 'https://yourportfolio.dev',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      avatarUrl: 'Profile Photo URL (Optional)',
      avatarPlaceholder: 'https://example.com/avatar.jpg',
      avatarNote: 'Portfolio, GitHub, and professional links',
    },

    // Summary Section
    summary: {
      sectionTitle: 'Professional Summary',
      sectionDesc: 'A concise 3-4 sentence overview of your career and strengths',
      placeholder: 'Write a compelling summary highlighting your experience, top skills, and what makes you stand out...',
      characters: 'characters',
      inspirationTitle: 'Quick Starter Presets',
    },

    // Work Experience
    experience: {
      sectionTitle: 'Work Experience',
      sectionDesc: 'Roles, achievements, and impact',
      addPosition: 'Add Role',
      noEntries: 'No work experience listed yet.',
      addFirstPrompt: '+ Add your first position',
      position: 'Job Title / Position',
      positionPlaceholder: 'e.g. Lead Mobile Architect',
      company: 'Company / Organization',
      companyPlaceholder: 'e.g. Apex Digital Labs',
      location: 'Location',
      locationPlaceholder: 'e.g. San Francisco, CA / Remote',
      startDate: 'Start Date',
      endDate: 'End Date',
      datePlaceholder: 'YYYY-MM or Mon YYYY',
      current: 'I am currently working in this role',
      description: 'Role Overview',
      descriptionPlaceholder: 'Brief summary of your primary responsibilities...',
      highlights: 'Key Achievements & Bullet Points',
      addHighlight: 'Add Achievement',
      highlightPlaceholder: 'e.g. Boosted app performance by 45%...',
    },

    // Education
    education: {
      sectionTitle: 'Education & Degrees',
      sectionDesc: 'Academic background and qualifications',
      addDegree: 'Add Degree',
      noEntries: 'No education entries yet.',
      addFirstPrompt: '+ Add university or school',
      degree: 'Degree / Certificate',
      degreePlaceholder: 'e.g. B.S. in Computer Science',
      institution: 'Institution / University',
      institutionPlaceholder: 'e.g. University of California, Berkeley',
      fieldOfStudy: 'Field of Study / Major',
      fieldOfStudyPlaceholder: 'e.g. Software Engineering',
      location: 'Location',
      locationPlaceholder: 'e.g. Berkeley, CA',
      startDate: 'Start Date',
      endDate: 'End Date',
      gpa: 'GPA / Honors',
      gpaPlaceholder: '3.8 / 4.0',
    },

    // Skills
    skills: {
      sectionTitle: 'Skills & Competencies',
      sectionDesc: 'Add technical strengths, tools, and abilities',
      skillPlaceholder: 'e.g. Kotlin, Docker, Figma...',
      addSkill: 'Add',
      defaultLevel: 'Default Level',
      currentSkills: 'Current Skills',
      levelTip: 'Tap selector to adjust level',
      noSkills: 'No skills added yet.',
      suggestionsTitle: 'One-Tap Popular Suggestions',
    },

    // Languages
    languages: {
      sectionTitle: 'Languages',
      sectionDesc: 'Communication skills and fluency levels',
      languagePlaceholder: 'e.g. Spanish, German...',
      addLanguage: 'Add Language',
      currentLanguages: 'Your Languages',
      noLanguages: 'No languages added yet.',
    },

    // Hobbies
    hobbies: {
      sectionTitle: 'Interests & Hobbies',
      sectionDesc: 'Personal passions that showcase your personality',
      hobbyPlaceholder: 'e.g. Mobile Photography, Trail Running...',
      addHobby: 'Add',
      currentHobbies: 'Your Selected Interests',
      noHobbies: 'No hobbies added yet.',
    },

    // Templates & Layouts
    templates: {
      sectionTitle: 'CV Templates',
      sectionDesc: 'Select a professionally tailored layout structure for your industry',
      activeBadge: 'Active',
      selectButton: 'Use Template',
      selectedButton: 'Selected',
      customizationTitle: 'Theme Styling',
      colorsTitle: 'Accent Color',
      colorsDesc: 'Sets the dominant tone, section rules, and visual accents',
      fontsTitle: 'Typography',
      fontsDesc: 'Select the optimal typographic hierarchy',
      modern: {
        name: 'Modern Tech',
        badge: 'Tech & Startups',
        desc: 'Clean grid structure, striking header, ideal for tech and startups.',
        features: ['Two-Column Grid', 'Striking Header', 'Clean Timeline'],
      },
      executive: {
        name: 'Executive Corporate',
        badge: 'Executive & Finance',
        desc: 'Formal, structured, conservative layout ideal for law, finance, and management roles.',
        features: ['Formal Header', 'Structured Dividers', 'High ATS Match'],
      },
      creative: {
        name: 'Creative Designer',
        badge: 'Design & Media',
        desc: 'Bold accent sidebars and modern typographic hierarchy for creative professionals.',
        features: ['Accent Sidebar', 'Visual Skill Tags', 'Bold Typography'],
      },
      minimalist: {
        name: 'Minimalist Clean',
        badge: 'ATS-Friendly & Pure',
        desc: 'ATS-friendly, single-column whitespace layout focused on readability.',
        features: ['ATS-Friendly', 'Single Column', 'Generous Whitespace'],
      },
    },

    // Theme & Styling
    theme: {
      sectionTitle: 'Accent Color',
      sectionDesc: 'Sets the primary tone and highlights across your CV',
      customColor: 'Or pick custom hex code',
      fontFamilyTitle: 'Typographic Style',
      fontFamilyDesc: 'Choose between modern geometric sans and classical serif',
      modernSansDesc: 'Modern, clean, and crisp for tech & creative roles',
      classicSerifDesc: 'Elegant and authoritative for executive & legal roles',
    },

    // Preview Controls
    previewControls: {
      backToEditor: 'Editor',
      fitToScreen: 'Fit to Mobile Screen',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      printPdf: 'Print / PDF',
      downloadPdf: 'Download PDF',
      downloadJson: 'Download JSON',
      downloaded: 'Downloaded!',
      generatingPdf: 'Generating PDF...',
      preparingPrint: 'Opening Print / PDF...',
      printIframeHelp: 'If the print dialog does not open, your browser or preview iframe may be blocking it. Tap below to open in a new tab.',
      openInNewTab: 'Open in New Tab & Print',
      closeAlert: 'Dismiss',
    },

    // Google Drive
    drive: {
      title: 'Google Drive Cloud Backup',
      subtitle: 'Sync, export, and preserve your CV data',
      connectDrive: 'Connect Drive',
      backupToDrive: 'Drive Backup',
      description: 'Backup your CV securely to your private Google Drive and access it anytime from any smartphone or computer.',
      signInGoogle: 'Sign in with Google',
      signingIn: 'Connecting...',
      signOut: 'Sign Out',
      saveCurrent: 'Save Current CV to Google Drive',
      uploading: 'Uploading to Drive...',
      backupsListTitle: 'Backups in Drive',
      refresh: 'Refresh',
      fetchingFiles: 'Fetching files from Google Drive...',
      noBackups: 'No CV backups found in Google Drive yet. Tap "Save Current CV" to create one.',
      restore: 'Restore',
      restoreSuccess: 'CV backup restored into builder!',
      backupSuccess: 'Saved to Google Drive successfully!',
      backupFailed: 'Failed to save CV to Google Drive.',
      connectedSuccess: 'Connected to Google Drive successfully!',
    },

    // Skill Levels
    levels: {
      Beginner: 'Beginner',
      Intermediate: 'Intermediate',
      Advanced: 'Advanced',
      Expert: 'Expert',
    },

    // Language Proficiencies
    proficiencies: {
      Native: 'Native',
      Fluent: 'Fluent',
      Professional: 'Professional',
      Intermediate: 'Intermediate',
      Basic: 'Basic',
    },
  },

  fr: {
    appTitle: 'CVita',
    appBadge: '',
    appSubtitle: 'Créateur de CV PDF',
    language: 'Langue',
    edit: 'Modifier',
    preview: 'Aperçu',
    livePreview: 'Aperçu Direct',
    resetSample: 'Effacer',
    back: 'Retour',
    next: 'Suivant',
    delete: 'Supprimer',
    present: 'Présent',
    current: 'En cours',
    save: 'Enregistrer',
    cancel: 'Annuler',

    // Wizard tabs
    tabs: {
      personal: 'Identité',
      summary: 'Profil',
      experience: 'Expérience',
      education: 'Formation',
      skills: 'Compétences',
      languages: 'Langues',
      hobbies: 'Loisirs',
      theme: 'Modèles',
    },

    // Personal Section
    personal: {
      sectionTitle: 'Coordonnées & Identité',
      sectionDesc: 'Vos informations clés figurant en tête de votre CV',
      fullName: 'Nom Complet',
      fullNamePlaceholder: 'ex. Alexandre Morgan',
      jobTitle: 'Poste Cible',
      jobTitlePlaceholder: 'ex. Ingénieur Mobile & Frontend Senior',
      email: 'Adresse E-mail',
      phone: 'Numéro de Téléphone',
      location: 'Localisation (Ville, Pays)',
      locationPlaceholder: 'ex. Paris, France',
      website: 'Site Web / Portfolio',
      websitePlaceholder: 'https://monportfolio.dev',
      linkedin: 'LinkedIn',
      github: 'GitHub',
      avatarUrl: 'URL Photo de Profil (Facultatif)',
      avatarPlaceholder: 'https://exemple.com/photo.jpg',
      avatarNote: 'Portfolio, GitHub et liens professionnels',
    },

    // Summary Section
    summary: {
      sectionTitle: 'Profil Professionnel',
      sectionDesc: 'Une synthèse concise de 3 à 4 phrases résumant votre expertise',
      placeholder: 'Rédigez un résumé percutant mettant en valeur vos compétences majeures...',
      characters: 'caractères',
      inspirationTitle: 'Exemples de Profil',
    },

    // Work Experience
    experience: {
      sectionTitle: 'Expériences Professionnelles',
      sectionDesc: 'Postes, réalisations et impact',
      addPosition: 'Ajouter Poste',
      noEntries: 'Aucune expérience renseignée.',
      addFirstPrompt: '+ Ajouter votre première expérience',
      position: 'Intitulé du Poste',
      positionPlaceholder: 'ex. Architecte Mobile Principal',
      company: 'Entreprise / Organisation',
      companyPlaceholder: 'ex. Digital Labs France',
      location: 'Lieu',
      locationPlaceholder: 'ex. Paris / Télétravail',
      startDate: 'Date de Début',
      endDate: 'Date de Fin',
      datePlaceholder: 'AAAA-MM ou Mois AAAA',
      current: 'Poste actuellement occupé',
      description: 'Résumé du Rôle',
      descriptionPlaceholder: 'Courte description de vos responsabilités...',
      highlights: 'Réalisations Clés & Succès',
      addHighlight: 'Ajouter Réalisation',
      highlightPlaceholder: 'ex. Augmentation des performances de 45%...',
    },

    // Education
    education: {
      sectionTitle: 'Formations & Diplômes',
      sectionDesc: 'Parcours académique et certifications',
      addDegree: 'Ajouter Diplôme',
      noEntries: 'Aucune formation enregistrée.',
      addFirstPrompt: '+ Ajouter une université ou école',
      degree: 'Diplôme Obtenu',
      degreePlaceholder: 'ex. Master en Informatique',
      institution: 'Établissement / Université',
      institutionPlaceholder: 'ex. Sorbonne Université',
      fieldOfStudy: 'Domaine d\'Études / Filière',
      fieldOfStudyPlaceholder: 'ex. Génie Logiciel',
      location: 'Lieu',
      locationPlaceholder: 'ex. Paris, France',
      startDate: 'Date de Début',
      endDate: 'Date de Fin',
      gpa: 'Mention / Moyenne',
      gpaPlaceholder: 'Mention Très Bien',
    },

    // Skills
    skills: {
      sectionTitle: 'Compétences & Atouts',
      sectionDesc: 'Ajoutez vos compétences techniques, outils et méthodes',
      skillPlaceholder: 'ex. Kotlin, Docker, Figma...',
      addSkill: 'Ajouter',
      defaultLevel: 'Niveau par défaut',
      currentSkills: 'Compétences Acquises',
      levelTip: 'Cliquez pour ajuster le niveau',
      noSkills: 'Aucune compétence ajoutée.',
      suggestionsTitle: 'Suggestions Rapides',
    },

    // Languages
    languages: {
      sectionTitle: 'Langues',
      sectionDesc: 'Aptitudes linguistiques et niveau de maîtrise',
      languagePlaceholder: 'ex. Espagnol, Allemand...',
      addLanguage: 'Ajouter Langue',
      currentLanguages: 'Vos Langues',
      noLanguages: 'Aucune langue ajoutée.',
    },

    // Hobbies
    hobbies: {
      sectionTitle: 'Centres d\'Intérêt',
      sectionDesc: 'Passions et activités personnelles valorisant votre profil',
      hobbyPlaceholder: 'ex. Photographie, Course à pied...',
      addHobby: 'Ajouter',
      currentHobbies: 'Vos Centres d\'Intérêt',
      noHobbies: 'Aucun loisir renseigné.',
    },

    // Templates & Layouts
    templates: {
      sectionTitle: 'Modèles de CV',
      sectionDesc: 'Sélectionnez une mise en page professionnelle adaptée à votre carrière',
      activeBadge: 'Actif',
      selectButton: 'Choisir ce Modèle',
      selectedButton: 'Sélectionné',
      customizationTitle: 'Style & Palette',
      colorsTitle: 'Couleur Principale',
      colorsDesc: 'Définit la teinte dominante, les bordures et les touches visuelles',
      fontsTitle: 'Typographie',
      fontsDesc: 'Sélectionnez la hiérarchie typographique optimale',
      modern: {
        name: 'Tech Moderne',
        badge: 'Tech & Startups',
        desc: 'Structure en grille soignée, en-tête percutant, idéal pour la tech et les startups.',
        features: ['Grille 2 Colonnes', 'En-tête Percutant', 'Chronologie Nette'],
      },
      executive: {
        name: 'Exécutif Corporate',
        badge: 'Direction & Finance',
        desc: 'Présentation formelle et structurée, idéale pour le droit, la finance et le management.',
        features: ['En-tête Institutionnel', 'Séparateurs Formels', 'Compatibilité ATS'],
      },
      creative: {
        name: 'Créatif & Design',
        badge: 'Design & Médias',
        desc: 'Bande latérale colorée et hiérarchie typographique forte pour les métiers créatifs.',
        features: ['Volet Latéral Coloré', 'Compétences Visuelles', 'Typographie Audacieuse'],
      },
      minimalist: {
        name: 'Minimaliste Épuré',
        badge: 'Compatible ATS',
        desc: 'Compatible ATS, colonne unique avec aération maximale axée sur la lisibilité.',
        features: ['Compatible ATS', 'Colonne Unique', 'Aération Maximale'],
      },
    },

    // Theme & Styling
    theme: {
      sectionTitle: 'Couleur Principale',
      sectionDesc: 'Définit la teinte dominante de votre CV',
      customColor: 'Ou code hexadécimal sur-mesure',
      fontFamilyTitle: 'Style Typographique',
      fontFamilyDesc: 'Choisissez entre typographie sans-serif moderne ou avec serif classique',
      modernSansDesc: 'Moderne, net et optimisé pour la tech et le design',
      classicSerifDesc: 'Élégant et institutionnel pour les postes de direction',
    },

    // Preview Controls
    previewControls: {
      backToEditor: 'Éditeur',
      fitToScreen: 'Ajuster à l\'Écran',
      zoomIn: 'Zoom +',
      zoomOut: 'Zoom -',
      printPdf: 'Imprimer / PDF',
      downloadPdf: 'Télécharger PDF',
      downloadJson: 'Télécharger JSON',
      generatingPdf: 'Génération du PDF...',
      preparingPrint: 'Ouverture de l\'impression / PDF...',
      printIframeHelp: 'Si la boîte de dialogue ne s\'ouvre pas, votre aperçu ou navigateur la bloque peut-être. Cliquez ci-dessous pour ouvrir dans un nouvel onglet.',
      openInNewTab: 'Ouvrir dans un nouvel onglet',
      closeAlert: 'Fermer',
    },

    // Google Drive
    drive: {
      title: 'Sauvegarde Google Drive',
      subtitle: 'Synchronisez et sécurisez vos données CV',
      connectDrive: 'Connecter Drive',
      backupToDrive: 'Sauvegarder',
      description: 'Sauvegardez votre CV en toute sécurité sur votre Google Drive privé et retrouvez-le depuis n\'importe quel appareil.',
      signInGoogle: 'Se connecter avec Google',
      signingIn: 'Connexion en cours...',
      signOut: 'Déconnexion',
      saveCurrent: 'Sauvegarder le CV sur Drive',
      uploading: 'Envoi sur Drive en cours...',
      backupsListTitle: 'Sauvegardes sur Drive',
      refresh: 'Actualiser',
      fetchingFiles: 'Chargement des fichiers...',
      noBackups: 'Aucune sauvegarde trouvée sur Google Drive.',
      restore: 'Restaurer',
      restoreSuccess: 'CV restauré avec succès !',
      backupSuccess: 'CV enregistré sur Google Drive avec succès !',
      backupFailed: 'Échec de la sauvegarde sur Google Drive.',
      connectedSuccess: 'Connecté à Google Drive avec succès !',
    },

    // Skill Levels
    levels: {
      Beginner: 'Débutant',
      Intermediate: 'Intermédiaire',
      Advanced: 'Avancé',
      Expert: 'Expert',
    },

    // Language Proficiencies
    proficiencies: {
      Native: 'Langue Maternelle',
      Fluent: 'Courant',
      Professional: 'Professionnel',
      Intermediate: 'Intermédiaire',
      Basic: 'Notions',
    },
  },

  ar: {
    appTitle: 'CVita',
    appBadge: '',
    appSubtitle: 'منشئ السيرة الذاتية PDF',
    language: 'اللغة',
    edit: 'تعديل',
    preview: 'معاينة',
    livePreview: 'معاينة حية',
    resetSample: 'مسح القسم',
    back: 'السابق',
    next: 'التالي',
    delete: 'حذف',
    present: 'حتى الآن',
    current: 'حالي',
    save: 'حفظ',
    cancel: 'إلغاء',

    // Wizard tabs
    tabs: {
      personal: 'البيانات الشخصية',
      summary: 'الملخص المهني',
      experience: 'الخبرات',
      education: 'التعليم',
      skills: 'المهارات',
      languages: 'اللغات',
      hobbies: 'الهوايات',
      theme: 'القوالب',
    },

    // Personal Section
    personal: {
      sectionTitle: 'بيانات الاتصال والهوية',
      sectionDesc: 'بياناتك الشخصية الأساسية التي تظهر في أعلى السيرة الذاتية',
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'مثال: محمد بن عمر',
      jobTitle: 'المسمى الوظيفي المستهدف',
      jobTitlePlaceholder: 'مثال: مهندس برمجيات أول وتطبيقات الموبايل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      location: 'الموقع (المدينة، الدولة)',
      locationPlaceholder: 'مثال: الرياض، المملكة العربية السعودية',
      website: 'الموقع الشخصي / محفظة الأعمال',
      websitePlaceholder: 'https://myportfolio.dev',
      linkedin: 'حساب لينكد إن',
      github: 'حساب جيت هاب',
      avatarUrl: 'رابط الصورة الشخصية (اختياري)',
      avatarPlaceholder: 'https://example.com/avatar.jpg',
      avatarNote: 'روابط الأعمال والحسابات المهنية',
    },

    // Summary Section
    summary: {
      sectionTitle: 'الملخص المهني',
      sectionDesc: 'نبذة موجزة ومركزة من 3 إلى 4 أسطر تبرز خبراتك ونقاط قوتك',
      placeholder: 'اكتب نبذة ملهمة توضح خبراتك وأبرز إنجازاتك وقيمتك المهنية المضافة...',
      characters: 'حرفاً',
      inspirationTitle: 'نماذج جاهزة للاقتباس',
    },

    // Work Experience
    experience: {
      sectionTitle: 'الخبرات المهنية',
      sectionDesc: 'المسميات الوظيفية والإنجازات والأثر المهني',
      addPosition: 'إضافة وظيفة',
      noEntries: 'لم يتم إدراج أي خبرات وظيفية حتى الآن.',
      addFirstPrompt: '+ أضف أول خبرة مهنية لك',
      position: 'المسمى الوظيفي',
      positionPlaceholder: 'مثال: قائد فريق تطوير تطبيقات الموبايل',
      company: 'الشركة / المؤسسة',
      companyPlaceholder: 'مثال: شركة الابتكار الرقمي',
      location: 'المقر أو الدولة',
      locationPlaceholder: 'مثال: دبي / عن بُعد',
      startDate: 'تاريخ البدء',
      endDate: 'تاريخ الانتهاء',
      datePlaceholder: 'YYYY-MM أو الشهر والسنة',
      current: 'أعمل حالياً في هذه الوظيفة',
      description: 'نظرة عامة على المسؤوليات',
      descriptionPlaceholder: 'ملخص موجز للمسؤوليات والمهام الأساسية...',
      highlights: 'أبرز الإنجازات والنتائج بالأرقام',
      addHighlight: 'إضافة إنجاز',
      highlightPlaceholder: 'مثال: تحسين سرعة استجابة التطبيق بنسبة 40%...',
    },

    // Education
    education: {
      sectionTitle: 'التعليم والشهادات الأكاديمية',
      sectionDesc: 'المؤهلات العلمية والتخصصات الأكاديمية',
      addDegree: 'إضافة مؤهل',
      noEntries: 'لا توجد شهادات مدرجة حالياً.',
      addFirstPrompt: '+ أضف جامعتك أو كليتك',
      degree: 'المؤهل / الدرجة العلمية',
      degreePlaceholder: 'مثال: بكالوريوس في علوم الحاسب',
      institution: 'الجامعة أو الصرح التعليمي',
      institutionPlaceholder: 'مثال: جامعة الملك فهد للبترول والمعادن',
      fieldOfStudy: 'التخصص الدقيق',
      fieldOfStudyPlaceholder: 'مثال: هندسة البرمجيات والأنظمة الذكية',
      location: 'المقر',
      locationPlaceholder: 'مثال: الظهران، المملكة العربية السعودية',
      startDate: 'تاريخ البدء',
      endDate: 'تاريخ التخرج',
      gpa: 'المعدل التراكمي / مرتبة الشرف',
      gpaPlaceholder: '4.85 من 5 (مرتبة الشرف الأولى)',
    },

    // Skills
    skills: {
      sectionTitle: 'المهارات والكفاءات',
      sectionDesc: 'أضف قدراتك التقنية والأدوات البرمجية المتقنة',
      skillPlaceholder: 'مثال: Kotlin, React Native, Figma...',
      addSkill: 'إضافة',
      defaultLevel: 'المستوى المبدئي',
      currentSkills: 'المهارات المضافة',
      levelTip: 'انقر على القائمة لتعديل مستوى الإتقان',
      noSkills: 'لم تتم إضافة مهارات بعد.',
      suggestionsTitle: 'اقتراحات شائعة بنقرة واحدة',
    },

    // Languages
    languages: {
      sectionTitle: 'اللغات',
      sectionDesc: 'مهارات التواصل ومستوى الإتقان اللغوي',
      languagePlaceholder: 'مثال: الإنجليزية، الفرنسية...',
      addLanguage: 'إضافة لغة',
      currentLanguages: 'اللغات المضافة',
      noLanguages: 'لم تتم إضافة لغات بعد.',
    },

    // Hobbies
    hobbies: {
      sectionTitle: 'الاهتمامات والهوايات',
      sectionDesc: 'اهتمامات شخصية تُظهر جوانب شخصيتك الإيجابية',
      hobbyPlaceholder: 'مثال: التصوير الفوتوغرافي، الشطرنج...',
      addHobby: 'إضافة',
      currentHobbies: 'الاهتمامات المختارة',
      noHobbies: 'لم تتم إضافة اهتمامات بعد.',
    },

    // Templates & Layouts
    templates: {
      sectionTitle: 'قوالب السيرة الذاتية',
      sectionDesc: 'اختر تصميماً احترافياً وتخطيطاً مهيأً خصيصاً لمجال تخصصك المهني',
      activeBadge: 'القالب المفعل',
      selectButton: 'اختيار القالب',
      selectedButton: 'محدد حالياً',
      customizationTitle: 'تخصيص المظهر والألوان',
      colorsTitle: 'اللون الرئيسي البارز',
      colorsDesc: 'يحدد الهوية اللونية والفواصل والعناصر المميزة في السيرة',
      fontsTitle: 'النمط الطباعي والخطوط',
      fontsDesc: 'اختر الخط المناسب لهويتك المهنية',
      modern: {
        name: 'التقني العصري',
        badge: 'التقنية والشركات الناشئة',
        desc: 'تخطيط شبكي أنيق، وترويسة بارزة، مثالي للتقنية والشركات الناشئة.',
        features: ['تخطيط من عمودين', 'ترويسة عصرية بارزة', 'تسلسل زمني أنيق'],
      },
      executive: {
        name: 'القيادي المؤسسي',
        badge: 'الإدارة والمالية والقانون',
        desc: 'تنسيق رسمي ومحكم، كلاسيكي ورصين، مثالي للإدارة والقانون والمالية.',
        features: ['هيكل كلاسيكي رصين', 'فواصل مزدوجة فخمة', 'فرز آلي ممتاز'],
      },
      creative: {
        name: 'الإبداعي والمصمم',
        badge: 'التصميم وتجربة المستخدم',
        desc: 'شريط جانبي ملون بارز وتسلسل طباعي جذاب للمصممين والمبدعين.',
        features: ['شريط جانبي ملون', 'شارات مهارات بصرية', 'خطوط بارزة متميزة'],
      },
      minimalist: {
        name: 'البسيط النقي (ATS)',
        badge: 'متوافق مع أنظمة الفرز',
        desc: 'متوافق تماماً مع أنظمة الفرز (ATS)، عمود واحد بمسافات بيضاء مريحة للقراءة.',
        features: ['توافق تام مع ATS', 'تنسيق أحادي العمود', 'مسافات بيضاء نقية'],
      },
    },

    // Theme & Styling
    theme: {
      sectionTitle: 'اللون الرئيسي',
      sectionDesc: 'يحدد الهوية اللونية والعناصر البارزة في السيرة الذاتية',
      customColor: 'أو اختر كود لوني مخصص',
      fontFamilyTitle: 'النمط الطباعي والخطوط',
      fontFamilyDesc: 'اختر بين الخط العصري الأنيق (كايرو) أو الخط الكلاسيكي الرفيع (تجوّل)',
      modernSansDesc: 'خط عصري وواضح مثالي للمجالات التقنية والإبداعية',
      classicSerifDesc: 'خط رصين وأنيق للمناصب الإدارية والقيادية',
    },

    // Preview Controls
    previewControls: {
      backToEditor: 'المحرر',
      fitToScreen: 'ملاءمة شاشة الهاتف',
      zoomIn: 'تكبير',
      zoomOut: 'تصغير',
      printPdf: 'طباعة / PDF',
      downloadPdf: 'تنزيل PDF',
      downloadJson: 'تنزيل JSON',
      generatingPdf: 'جاري تجهيز PDF...',
      preparingPrint: 'جاري فتح نافذة الطباعة / PDF...',
      printIframeHelp: 'إذا لم تفتح نافذة الطباعة تلقائياً، فقد يكون إطار المعاينة يحظرها. انقر أدناه للفتح في علامة تبويب جديدة.',
      openInNewTab: 'فتح في علامة تبويب جديدة والطباعة',
      closeAlert: 'إغلاق',
    },

    // Google Drive
    drive: {
      title: 'النسخ الاحتياطي في جوجل درايف',
      subtitle: 'مزامنة وحفظ واسترجاع بيانات سيرتك الذاتية بأمان',
      connectDrive: 'ربط درايف',
      backupToDrive: 'نسخ درايف',
      description: 'احفظ بيانات سيرتك الذاتية في مساحتك الخاصة على Google Drive واسترجعها في أي وقت من أي هاتف أو كمبيوتر.',
      signInGoogle: 'تسجيل الدخول بجوجل',
      signingIn: 'جاري الاتصال...',
      signOut: 'تسجيل الخروج',
      saveCurrent: 'حفظ السيرة الحالية في جوجل درايف',
      uploading: 'جاري الحفظ على درايف...',
      backupsListTitle: 'النسخ المحفوظة على درايف',
      refresh: 'تحديث',
      fetchingFiles: 'جاري جلب الملفات من درايف...',
      noBackups: 'لا توجد نسخ احتياطية محفوظة بعد.',
      restore: 'استعادة',
      restoreSuccess: 'تم استرجاع السيرة الذاتية بنجاح إلى المحرر!',
      backupSuccess: 'تم حفظ السيرة الذاتية في Google Drive بنجاح!',
      backupFailed: 'تعذر الحفظ في Google Drive.',
      connectedSuccess: 'تم الاتصال بـ Google Drive بنجاح!',
    },

    // Skill Levels
    levels: {
      Beginner: 'مبتدئ',
      Intermediate: 'متوسط',
      Advanced: 'متقدم',
      Expert: 'خبير',
    },

    // Language Proficiencies
    proficiencies: {
      Native: 'اللغة الأم',
      Fluent: 'طلاقة كاملة',
      Professional: 'مستوى احترافي',
      Intermediate: 'متوسط',
      Basic: 'أساسي',
    },
  },
} as const;

export type TranslationDictionary = typeof d.en;
export type TranslationDict = TranslationDictionary;
