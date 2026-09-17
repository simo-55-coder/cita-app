import React, { useState } from 'react';
import { CertificationItem } from '../../types';
import { Award, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface CertificationsSectionProps {
  certifications: CertificationItem[];
  onChange: (updated: CertificationItem[]) => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications = [],
  onChange,
}) => {
  const { t, isRTL } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(certifications[0]?.id || null);

  const handleAddCert = () => {
    const newId = `cert-${Date.now()}`;
    const newCert: CertificationItem = {
      id: newId,
      name: '',
      issuer: '',
      date: '',
      link: '',
    };
    onChange([newCert, ...certifications]);
    setExpandedId(newId);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(certifications.filter((c) => c.id !== id));
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const handleMoveUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    const next = [...certifications];
    const item = next[index];
    next[index] = next[index - 1];
    next[index - 1] = item;
    onChange(next);
  };

  const handleMoveDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === certifications.length - 1) return;
    const next = [...certifications];
    const item = next[index];
    next[index] = next[index + 1];
    next[index + 1] = item;
    onChange(next);
  };

  const handleUpdate = (id: string, field: keyof CertificationItem, value: any) => {
    onChange(
      certifications.map((c) => {
        if (c.id === id) {
          return { ...c, [field]: value };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">{t.certifications.sectionTitle}</h2>
            <p className="text-xs text-slate-500">{t.certifications.sectionDesc}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddCert}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.certifications.addCertification}</span>
        </button>
      </div>

      {/* Empty State */}
      {certifications.length === 0 ? (
        <div className="p-8 text-center bg-white border border-dashed border-slate-300 rounded-2xl">
          <Award className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-xs text-slate-500">{t.certifications.noEntries}</p>
          <button
            type="button"
            onClick={handleAddCert}
            className="mt-3 inline-flex items-center gap-1 text-xs text-violet-600 font-semibold hover:underline"
          >
            {t.certifications.addFirstPrompt}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {certifications.map((cert, index) => {
            const isExpanded = expandedId === cert.id;
            const isFirst = index === 0;
            const isLast = index === certifications.length - 1;

            return (
              <div
                key={cert.id}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                {/* Collapsible Card Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : cert.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 select-none transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="text-xs font-bold text-slate-800 truncate block">
                      {cert.name || (isRTL ? 'شهادة بدون مسمى' : 'Untitled Certificate')}
                    </span>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {cert.issuer || (isRTL ? 'الجهة المانحة' : 'Issuing Organization')} {cert.date ? `• ${cert.date}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Reorder Buttons */}
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={(e) => handleMoveUp(index, e)}
                      title={t.moveUp}
                      className={`p-1 rounded-lg transition-colors ${
                        isFirst ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={(e) => handleMoveDown(index, e)}
                      title={t.moveDown}
                      className={`p-1 rounded-lg transition-colors ${
                        isLast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(cert.id, e)}
                      title={t.delete}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Form Fields */}
                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-slate-100 space-y-3 bg-slate-50/50">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.certifications.name} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => handleUpdate(cert.id, 'name', e.target.value)}
                        placeholder={t.certifications.namePlaceholder}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.certifications.issuer} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => handleUpdate(cert.id, 'issuer', e.target.value)}
                          placeholder={t.certifications.issuerPlaceholder}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.certifications.date}
                        </label>
                        <input
                          type="text"
                          value={cert.date}
                          onChange={(e) => handleUpdate(cert.id, 'date', e.target.value)}
                          placeholder={t.certifications.datePlaceholder}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.certifications.link}
                      </label>
                      <input
                        type="url"
                        value={cert.link || ''}
                        onChange={(e) => handleUpdate(cert.id, 'link', e.target.value)}
                        placeholder={t.certifications.linkPlaceholder}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
