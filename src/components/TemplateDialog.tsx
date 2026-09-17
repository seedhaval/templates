import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Template, TemplateCategory } from '../types';

interface TemplateDialogProps {
  isOpen: boolean;
  editingTemplate: Template | null;
  onClose: () => void;
  onSave: (templateData: { title: string; content: string; category: TemplateCategory }) => void;
}

const COMMON_EMOJIS = ['🎉', '🥳', '🎂', '💐', '🎊', '🎁', '🥂', '💍', '👏', '🏆', '✨', '❤️', '🙏', '🎈', '🌸', '🚀'];

const CATEGORIES: { id: TemplateCategory; label: string }[] = [
  { id: 'birthday', label: 'Birthday' },
  { id: 'anniversary', label: 'Anniversary' },
  { id: 'congratulations', label: 'Congratulations' },
  { id: 'wishes', label: 'Wishes' },
  { id: 'custom', label: 'Custom' },
];

export const TemplateDialog: React.FC<TemplateDialogProps> = ({
  isOpen,
  editingTemplate,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<TemplateCategory>('birthday');

  useEffect(() => {
    if (editingTemplate) {
      setTitle(editingTemplate.title || '');
      setContent(editingTemplate.content || '');
      setCategory(editingTemplate.category || 'custom');
    } else {
      setTitle('');
      setContent('');
      setCategory('birthday');
    }
  }, [editingTemplate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // If title is empty, generate an intuitive title from first words or category
    const finalTitle = title.trim() || content.trim().slice(0, 24);
    onSave({
      title: finalTitle,
      content: content.trim(),
      category,
    });
    onClose();
  };

  const insertEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        id="template-dialog"
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]"
      >
        {/* Android bottom sheet grab handle on mobile */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Dialog Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingTemplate ? 'Edit Template' : 'Add New Template'}
            </h2>
            <p className="text-xs text-slate-500">
              Stored locally on this device only
            </p>
          </div>
          <button
            type="button"
            id="btn-close-dialog"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dialog Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  id={`cat-select-${cat.id}`}
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    category === cat.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Template Title */}
          <div>
            <label
              htmlFor="template-title-input"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
            >
              Title / Label <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              id="template-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Quick Birthday Wish"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-900"
            />
          </div>

          {/* Template Content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="template-content-input"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Template Message <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {content.length} chars
              </span>
            </div>
            <textarea
              id="template-content-input"
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="🎉🥳 Happy Birthday !! 🎊🎁"
              className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-900 resize-none font-sans"
            />
          </div>

          {/* Quick Emoji Bar */}
          <div>
            <div className="flex items-center gap-1 text-xs text-slate-500 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tap to insert celebration emojis:</span>
            </div>
            <div className="flex flex-wrap gap-1 p-2 bg-slate-50 rounded-xl border border-slate-200/80">
              {COMMON_EMOJIS.map((emoji, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => insertEmoji(emoji)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-white hover:shadow-xs active:scale-90 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              id="btn-dialog-cancel"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-dialog-save"
              disabled={!content.trim()}
              className="px-5 py-2 text-sm font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {editingTemplate ? 'Update Template' : 'Save Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
