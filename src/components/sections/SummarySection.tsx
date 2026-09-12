import React from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SummarySectionProps {
  summary: string;
  onChange: (updated: string) => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({ summary, onChange }) => {
  const { t, lang, isRTL } = useLanguage();

  const presets = {
    en: [
      {
        title: 'Mobile & UI/UX Engineer',
        text: 'Dedicated Mobile & UI/UX Engineer with 6+ years of expertise crafting high-performance Android & React Native applications. Passionate about micro-interactions, responsive typography, 60fps animations, and clean architecture. Proven record leading cross-functional teams and accelerating app release cycles by 40%.',
      },
      {
        title: 'Senior Full-Stack Architect',
        text: 'Results-driven Senior Full-Stack Engineer with comprehensive experience scaling distributed web applications and modern mobile clients. Proven success driving technical excellence, cloud automation, and team mentoring.',
      },
      {
        title: 'Product-Focused Developer',
        text: 'Creative software developer combining strong technical acumen with user-centric product sense. Specializes in transforming complex user requirements into elegant, accessible, and responsive interfaces.',
      },
    ],
    fr: [
      {
        title: 'Ingénieur Mobile & UI/UX',
        text: 'Ingénieur Mobile & UI/UX passionné avec 6+ ans d\'expertise dans la conception d\'applications Android et React Native haute performance. Spécialiste des micro-interactions, de la typographie responsive et d\'architectures logicielles fiables.',
      },
      {
        title: 'Architecte Full-Stack Senior',
        text: 'Ingénieur Full-Stack Senior orienté résultats avec une solide expérience dans le passage à l\'échelle d\'applications web et mobiles. Succès avéré dans le pilotage de l\'excellence technique et le mentorat.',
      },
      {
        title: 'Développeur Orienté Produit',
        text: 'Développeur logiciel créatif combinant rigueur technique et vision produit centrée utilisateur. Spécialisé dans la transformation des besoins complexes en interfaces fluides et accessibles.',
      },
    ],
    ar: [
      {
        title: 'مهندس تطبيقات الموبايل وتجربة المستخدم',
        text: 'مهندس برمجيات وتطبيقات ذكية بخبرة تتجاوز 6 سنوات في بناء وتطوير تطبيقات أندرويد وتطبيقات الهواتف عبر React Native و Kotlin. شغوف بالهندسة المعمارية النظيفة، وسلاسة الواجهات التفاعلية بمعدل 60 إطاراً في الثانية.',
      },
      {
        title: 'معماري برمجيات متكاملة أول',
        text: 'مهندس برمجيات متكاملة يتمتع بخبرة واسعة في بناء وتوسيع الأنظمة السحابية وتطبيقات الويب والموبايل الحديثة. سجل حافل بالتميز التقني وإدارة الفرق البرمجية.',
      },
      {
        title: 'مطور واجهات يركز على المنتجات الرقمية',
        text: 'مطور برمجيات مبتكر يجمع بين الإتقان الهندسي والحس العميق بتجربة المستخدم، متخصص في تحويل متطلبات العمل المعقدة إلى واجهات أنيقة وعالية الاستجابة.',
      },
    ],
  }[lang] || [];

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t.summary.sectionTitle}</h3>
              <p className="text-xs text-slate-500">{t.summary.sectionDesc}</p>
            </div>
          </div>
        </div>

        <div>
          <textarea
            id="textarea-summary"
            rows={6}
            value={summary}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t.summary.placeholder}
            className="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none transition-all leading-relaxed shadow-xs"
          />
          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5 px-1">
            <span>250 - 450</span>
            <span className={summary.length > 500 ? 'text-amber-600 font-semibold' : ''}>
              {summary.length} {t.summary.characters}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Inspiration Chips */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2.5 text-violet-600 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.summary.inspirationTitle}</span>
        </div>

        <div className="space-y-2">
          {presets.map((tpl, i) => (
            <button
              key={i}
              type="button"
              id={`btn-preset-summary-${i}`}
              onClick={() => onChange(tpl.text)}
              className="w-full text-start p-3 rounded-xl bg-slate-50 hover:bg-violet-50/70 border border-slate-200/80 hover:border-violet-300 transition-all group shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 group-hover:text-violet-700">
                  {tpl.title}
                </span>
                <span className="text-[10px] text-violet-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  {isRTL ? '← استخدام' : 'Use →'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {tpl.text}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
