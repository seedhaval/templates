import React, { useState } from 'react';
import { Check, Copy, Edit3, Trash2, Share2 } from 'lucide-react';
import { Template } from '../types';
import { shareTemplate } from '../utils/clipboard';

interface TemplateCardProps {
  template: Template;
  onCopy: (template: Template) => void;
  onEdit: (template: Template) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_LABELS: Record<string, { label: string; badgeColor: string }> = {
  birthday: { label: 'Birthday', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  anniversary: { label: 'Anniversary', badgeColor: 'bg-rose-100 text-rose-800 border-rose-200' },
  congratulations: { label: 'Congratulations', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  wishes: { label: 'Wishes', badgeColor: 'bg-teal-100 text-teal-800 border-teal-200' },
  custom: { label: 'Custom', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200' },
  all: { label: 'General', badgeColor: 'bg-slate-100 text-slate-800 border-slate-200' },
};

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onCopy,
  onEdit,
  onDelete,
}) => {
  const [justCopied, setJustCopied] = useState(false);

  const handleCardClick = () => {
    onCopy(template);
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 1600);
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation(); // prevent card copy click
    action();
  };

  const catMeta = CATEGORY_LABELS[template.category] || CATEGORY_LABELS.custom;

  return (
    <div
      id={`template-card-${template.id}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={`group relative w-full text-left bg-white rounded-2xl p-4 transition-all duration-150 border active:scale-[0.985] cursor-pointer shadow-xs hover:shadow-md ${
        justCopied
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Header bar within card */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${catMeta.badgeColor}`}
          >
            {catMeta.label}
          </span>
          <span className="text-xs font-semibold text-slate-700 truncate">
            {template.title}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            id={`btn-edit-${template.id}`}
            title="Edit template"
            onClick={(e) => handleActionClick(e, () => onEdit(template))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            id={`btn-share-${template.id}`}
            title="Share via other apps"
            onClick={(e) => handleActionClick(e, () => shareTemplate(template.content, template.title))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            id={`btn-delete-${template.id}`}
            title="Delete template"
            onClick={(e) => handleActionClick(e, () => onDelete(template.id))}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Template Content */}
      <div className="relative py-1">
        <p className="text-base text-slate-900 font-normal leading-relaxed whitespace-pre-wrap select-text break-words">
          {template.content}
        </p>
      </div>

      {/* Footer bar with tap to copy indicator */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="text-[11px] text-slate-400">
          Tap anywhere to copy
        </span>

        <div className="flex items-center gap-1.5 font-medium">
          {justCopied ? (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold animate-pulse">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              Copied!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-500 group-hover:text-indigo-600 transition-colors">
              <Copy className="w-3.5 h-3.5" />
              Copy
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
