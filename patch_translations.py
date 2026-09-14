import json

file_path = 'src/data/translations.ts'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

en_add = """      'executive-modern': {
        name: 'Executive Modern',
        badge: 'Premium',
        desc: 'Sleek two-column layout with a dark sophisticated header accent and side profile picture.',
        features: ['Profile Picture', 'Dark Header', 'Timeline Layout'],
      },
      'creative-minimal': {
        name: 'Creative Minimal',
        badge: 'Premium',
        desc: 'Bold modern design featuring a circular profile picture and elegant typography grid.',
        features: ['Profile Picture', 'Clean Grid', 'Elegant Typography'],
      },
      'corporate-elite': {
        name: 'Corporate Elite',
        badge: 'Premium',
        desc: 'High-end executive layout with a prominent left-side panel for personal details and photo.',
        features: ['Profile Picture', 'Left-side Panel', 'Executive Look'],
      },
"""

fr_add = """      'executive-modern': {
        name: 'Exécutif Moderne',
        badge: 'Premium',
        desc: 'Mise en page élégante à deux colonnes avec un en-tête sombre et une photo de profil latérale.',
        features: ['Photo de Profil', 'En-tête Sombre', 'Chronologie'],
      },
      'creative-minimal': {
        name: 'Créatif Minimaliste',
        badge: 'Premium',
        desc: 'Design moderne audacieux avec photo de profil circulaire et grille typographique élégante.',
        features: ['Photo de Profil', 'Grille Épurée', 'Typographie Élégante'],
      },
      'corporate-elite': {
        name: 'Élite d\\'Entreprise',
        badge: 'Premium',
        desc: 'Disposition exécutive haut de gamme avec panneau latéral gauche pour les détails et la photo.',
        features: ['Photo de Profil', 'Panneau Gauche', 'Look Exécutif'],
      },
"""

ar_add = """      'executive-modern': {
        name: 'القيادي العصري',
        badge: 'مميز',
        desc: 'تخطيط أنيق من عمودين مع ترويسة داكنة جذابة وصورة شخصية جانبية.',
        features: ['صورة شخصية', 'ترويسة داكنة', 'تسلسل زمني'],
      },
      'creative-minimal': {
        name: 'الإبداعي البسيط',
        badge: 'مميز',
        desc: 'تصميم عصري جريء بصورة شخصية دائرية وشبكة طباعية أنيقة.',
        features: ['صورة شخصية', 'شبكة نقية', 'طباعة أنيقة'],
      },
      'corporate-elite': {
        name: 'نخبة الشركات',
        badge: 'مميز',
        desc: 'تخطيط تنفيذي راقٍ مع لوحة جانبية بارزة للتفاصيل الشخصية والصورة.',
        features: ['صورة شخصية', 'لوحة جانبية', 'مظهر قيادي'],
      },
"""

content = content.replace("minimalist: {\n        name: 'Minimalist Clean',", en_add + "      minimalist: {\n        name: 'Minimalist Clean',", 1)
content = content.replace("minimalist: {\n        name: 'Minimaliste Épuré',", fr_add + "      minimalist: {\n        name: 'Minimaliste Épuré',", 1)
content = content.replace("minimalist: {\n        name: 'البسيط النقي (ATS)',", ar_add + "      minimalist: {\n        name: 'البسيط النقي (ATS)',", 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

