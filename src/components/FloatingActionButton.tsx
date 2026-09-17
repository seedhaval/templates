import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <button
      id="btn-fab-add-template"
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-5 sm:right-8 z-40 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-90 text-white font-semibold text-sm px-4 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer border border-indigo-500/30"
      title="Add new template"
    >
      <Plus className="w-5 h-5 stroke-[2.5]" />
      <span className="pr-1 text-xs font-bold tracking-wide uppercase">New Template</span>
    </button>
  );
};
