import React, { useState } from 'react';
import { ProjectItem } from '../../types';
import { FolderGit2, Plus, Trash2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onChange: (updated: ProjectItem[]) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects = [], onChange }) => {
  const { t, isRTL } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(projects[0]?.id || null);

  const handleAddProject = () => {
    const newId = `proj-${Date.now()}`;
    const newProj: ProjectItem = {
      id: newId,
      title: '',
      role: '',
      description: '',
      technologies: '',
      link: '',
    };
    onChange([newProj, ...projects]);
    setExpandedId(newId);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(projects.filter((p) => p.id !== id));
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const handleMoveUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;
    const next = [...projects];
    const item = next[index];
    next[index] = next[index - 1];
    next[index - 1] = item;
    onChange(next);
  };

  const handleMoveDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === projects.length - 1) return;
    const next = [...projects];
    const item = next[index];
    next[index] = next[index + 1];
    next[index + 1] = item;
    onChange(next);
  };

  const handleUpdate = (id: string, field: keyof ProjectItem, value: any) => {
    onChange(
      projects.map((p) => {
        if (p.id === id) {
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-4">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-50 text-violet-600 shrink-0">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">{t.projects.sectionTitle}</h2>
            <p className="text-xs text-slate-500">{t.projects.sectionDesc}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddProject}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.projects.addProject}</span>
        </button>
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="p-8 text-center bg-white border border-dashed border-slate-300 rounded-2xl">
          <FolderGit2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-xs text-slate-500">{t.projects.noEntries}</p>
          <button
            type="button"
            onClick={handleAddProject}
            className="mt-3 inline-flex items-center gap-1 text-xs text-violet-600 font-semibold hover:underline"
          >
            {t.projects.addFirstPrompt}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((proj, index) => {
            const isExpanded = expandedId === proj.id;
            const isFirst = index === 0;
            const isLast = index === projects.length - 1;

            return (
              <div
                key={proj.id}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                {/* Collapsible Card Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : proj.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 select-none transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="text-xs font-bold text-slate-800 truncate block">
                      {proj.title || (isRTL ? 'مشروع بدون عنوان' : 'Untitled Project')}
                    </span>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {proj.role ? `${proj.role} ` : ''}{proj.technologies ? `• ${proj.technologies}` : ''}
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
                      onClick={(e) => handleDelete(proj.id, e)}
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
                        {t.projects.title} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => handleUpdate(proj.id, 'title', e.target.value)}
                        placeholder={t.projects.titlePlaceholder}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.projects.role}
                        </label>
                        <input
                          type="text"
                          value={proj.role || ''}
                          onChange={(e) => handleUpdate(proj.id, 'role', e.target.value)}
                          placeholder={t.projects.rolePlaceholder}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {t.projects.technologies}
                        </label>
                        <input
                          type="text"
                          value={proj.technologies || ''}
                          onChange={(e) => handleUpdate(proj.id, 'technologies', e.target.value)}
                          placeholder={t.projects.technologiesPlaceholder}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.projects.link}
                      </label>
                      <input
                        type="url"
                        value={proj.link || ''}
                        onChange={(e) => handleUpdate(proj.id, 'link', e.target.value)}
                        placeholder={t.projects.linkPlaceholder}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        {t.projects.description}
                      </label>
                      <textarea
                        rows={3}
                        value={proj.description}
                        onChange={(e) => handleUpdate(proj.id, 'description', e.target.value)}
                        placeholder={t.projects.descriptionPlaceholder}
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-600 outline-none shadow-xs resize-none"
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
