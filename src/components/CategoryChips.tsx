import React from 'react';
import { TemplateCategory } from '../types';

interface CategoryChipsProps {
  activeCategory: TemplateCategory;
  onSelectCategory: (cat: TemplateCategory) => void;
  counts: Record<TemplateCategory, number>;
}

const CHIP_CONFIG: { id: TemplateCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'birthday', label: 'Birthday', icon: '🎂' },
  { id: 'anniversary', label: 'Anniversary', icon: '💍' },
  { id: 'congratulations', label: 'Congrats', icon: '🎉' },
  { id: 'wishes', label: 'Wishes', icon: '💐' },
  { id: 'custom', label: 'Custom', icon: '✍️' },
];

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2.5 px-4">
      <div className="flex items-center gap-2 max-w-2xl mx-auto">
        {CHIP_CONFIG.map((chip) => {
          const isActive = activeCategory === chip.id;
          const count = counts[chip.id] || 0;

          return (
            <button
              key={chip.id}
              id={`category-chip-${chip.id}`}
              type="button"
              onClick={() => onSelectCategory(chip.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all active:scale-95 cursor-pointer select-none ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90'
              }`}
            >
              <span>{chip.icon}</span>
              <span>{chip.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
