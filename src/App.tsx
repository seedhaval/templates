import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Template, TemplateCategory, SnackbarState } from './types';
import { loadSavedTemplates, saveTemplates, resetToDefaults, exportTemplatesToJson } from './utils/storage';
import { copyToClipboard } from './utils/clipboard';
import { Header } from './components/Header';
import { CategoryChips } from './components/CategoryChips';
import { TemplateCard } from './components/TemplateCard';
import { TemplateDialog } from './components/TemplateDialog';
import { FloatingActionButton } from './components/FloatingActionButton';
import { AndroidSnackbar } from './components/AndroidSnackbar';
import { MessageSquareDashed, Plus } from 'lucide-react';

export default function App() {
  const [templates, setTemplates] = useState<Template[]>(() => loadSavedTemplates());
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ visible: false, message: '' });

  // Sync to local storage whenever templates change
  useEffect(() => {
    saveTemplates(templates);
  }, [templates]);

  // Handle Copy Action
  const handleCopy = useCallback(async (template: Template) => {
    const success = await copyToClipboard(template.content);
    if (success) {
      setSnackbar({
        visible: true,
        message: 'Copied to clipboard!',
        detail: template.content.length > 50 ? template.content.slice(0, 50) + '...' : template.content,
        id: Date.now(),
      });

      // Update copy count and last used timestamp
      setTemplates((prev) =>
        prev.map((item) =>
          item.id === template.id
            ? { ...item, copyCount: (item.copyCount || 0) + 1, lastUsedAt: Date.now() }
            : item
        )
      );
    } else {
      setSnackbar({
        visible: true,
        message: 'Could not copy to clipboard',
        id: Date.now(),
      });
    }
  }, []);

  // Handle Save (Create or Update)
  const handleSaveTemplate = useCallback(
    (data: { title: string; content: string; category: TemplateCategory }) => {
      if (editingTemplate) {
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === editingTemplate.id
              ? {
                  ...t,
                  title: data.title,
                  content: data.content,
                  category: data.category,
                }
              : t
          )
        );
        setSnackbar({
          visible: true,
          message: 'Template updated!',
          detail: data.title,
          id: Date.now(),
        });
      } else {
        const newTemplate: Template = {
          id: `custom-${Date.now()}`,
          title: data.title,
          content: data.content,
          category: data.category,
          isCustom: true,
          createdAt: Date.now(),
          copyCount: 0,
        };
        setTemplates((prev) => [newTemplate, ...prev]);
        setSnackbar({
          visible: true,
          message: 'New template added!',
          detail: data.title,
          id: Date.now(),
        });
      }
    },
    [editingTemplate]
  );

  // Handle Delete
  const handleDeleteTemplate = useCallback((id: string) => {
    const target = templates.find((t) => t.id === id);
    if (!target) return;
    
    // Quick confirmation
    if (window.confirm(`Delete "${target.title}"?`)) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      setSnackbar({
        visible: true,
        message: 'Template deleted',
        detail: target.title,
        id: Date.now(),
      });
    }
  }, [templates]);

  // Handle Restore Defaults
  const handleResetDefaults = useCallback(() => {
    if (window.confirm('Reset all templates to initial defaults?')) {
      const defs = resetToDefaults();
      setTemplates(defs);
      setSnackbar({
        visible: true,
        message: 'Restored default templates',
        id: Date.now(),
      });
    }
  }, []);

  // Handle Export Backup
  const handleExportBackup = useCallback(() => {
    exportTemplatesToJson(templates);
    setSnackbar({
      visible: true,
      message: 'Templates backup downloaded',
      id: Date.now(),
    });
  }, [templates]);

  // Handle Import Backup
  const handleImportBackup = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTemplates(parsed);
          setSnackbar({
            visible: true,
            message: `Imported ${parsed.length} templates`,
            id: Date.now(),
          });
        } else {
          alert('Invalid template backup file format');
        }
      } catch (err) {
        alert('Failed to parse template backup file');
      }
    };
    reader.readAsText(file);
  }, []);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<TemplateCategory, number> = {
      all: templates.length,
      birthday: 0,
      anniversary: 0,
      congratulations: 0,
      wishes: 0,
      custom: 0,
    };
    templates.forEach((t) => {
      if (t.category && counts[t.category] !== undefined) {
        counts[t.category]++;
      } else {
        counts.custom++;
      }
    });
    return counts;
  }, [templates]);

  // Filter templates based on Category and Search Query
  const filteredTemplates = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return templates.filter((template) => {
      // Category match
      if (activeCategory !== 'all' && template.category !== activeCategory) {
        return false;
      }
      // Search match
      if (q) {
        const matchTitle = template.title.toLowerCase().includes(q);
        const matchContent = template.content.toLowerCase().includes(q);
        return matchTitle || matchContent;
      }
      return true;
    });
  }, [templates, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Android App Bar */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onResetDefaults={handleResetDefaults}
        onExport={handleExportBackup}
        onImport={handleImportBackup}
        templateCount={templates.length}
      />

      {/* Category Chips Bar */}
      <CategoryChips
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        counts={categoryCounts}
      />

      {/* Main List Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-2 space-y-3">
        {/* Quick Instructions banner */}
        <div className="bg-indigo-50/80 border border-indigo-100/80 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs text-indigo-950">
          <p className="flex items-center gap-1.5 font-medium">
            <span className="text-base">📋</span>
            <span>Tap any template to copy immediately to your clipboard.</span>
          </p>
          <span className="hidden sm:inline-block text-[11px] text-indigo-600 font-semibold uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-indigo-200">
            One-Tap
          </span>
        </div>

        {/* Templates List */}
        {filteredTemplates.length > 0 ? (
          <div className="space-y-3 pt-1">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onCopy={handleCopy}
                onEdit={(t) => {
                  setEditingTemplate(t);
                  setIsDialogOpen(true);
                }}
                onDelete={handleDeleteTemplate}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300 mt-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <MessageSquareDashed className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              No templates found
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
              {searchQuery
                ? `No templates match "${searchQuery}". Try a different search word.`
                : 'No templates in this category yet.'}
            </p>
            <button
              type="button"
              onClick={() => {
                if (searchQuery) {
                  setSearchQuery('');
                } else {
                  setEditingTemplate(null);
                  setIsDialogOpen(true);
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs"
            >
              {searchQuery ? (
                'Clear Search'
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Template</span>
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {/* Floating Action Button to Add New Template */}
      <FloatingActionButton
        onClick={() => {
          setEditingTemplate(null);
          setIsDialogOpen(true);
        }}
      />

      {/* Add / Edit Template Dialog */}
      <TemplateDialog
        isOpen={isDialogOpen}
        editingTemplate={editingTemplate}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTemplate(null);
        }}
        onSave={handleSaveTemplate}
      />

      {/* Android Toast/Snackbar */}
      <AndroidSnackbar
        snackbar={snackbar}
        onDismiss={() => setSnackbar((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
