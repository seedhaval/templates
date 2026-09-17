import React, { useState, useRef } from 'react';
import { Search, ShieldCheck, MoreVertical, RotateCcw, Download, Upload, X, Smartphone } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetDefaults: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  templateCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onResetDefaults,
  onExport,
  onImport,
  templateCount,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top Bar */}
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo / Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <span className="text-lg">🎉</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight flex items-center gap-1.5">
              <span>Message Templates</span>
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {templateCount}
              </span>
            </h1>
            {/* Privacy indicator */}
            <button
              type="button"
              id="btn-privacy-info"
              onClick={() => setShowPrivacyInfo(true)}
              className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium hover:underline text-left cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>100% Offline • On-Device Only</span>
            </button>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            id="btn-toggle-search"
            title="Search templates"
            onClick={() => {
              setShowSearch(!showSearch);
              if (showSearch) onSearchChange('');
            }}
            className={`p-2 rounded-xl transition-colors ${
              showSearch
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

          {/* More options menu */}
          <div className="relative">
            <button
              type="button"
              id="btn-more-options"
              title="More options"
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs text-slate-700">
                  <button
                    type="button"
                    id="menu-export-backup"
                    onClick={() => {
                      setShowMenu(false);
                      onExport();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 text-left transition-colors font-medium text-slate-800"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Export Templates (Backup)</span>
                  </button>

                  <button
                    type="button"
                    id="menu-import-backup"
                    onClick={() => {
                      setShowMenu(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 text-left transition-colors font-medium text-slate-800"
                  >
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Import Templates</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    type="button"
                    id="menu-reset-defaults"
                    onClick={() => {
                      setShowMenu(false);
                      onResetDefaults();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-rose-50 text-rose-700 text-left transition-colors font-medium"
                  >
                    <RotateCcw className="w-4 h-4 text-rose-500" />
                    <span>Restore Defaults</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Expandable Search Input Bar */}
      {showSearch && (
        <div className="max-w-2xl mx-auto px-4 pb-3 pt-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-templates-input"
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search templates by text or emoji..."
              className="w-full pl-9 pr-9 py-2 text-sm bg-slate-100 border border-slate-200/80 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Privacy Guarantee Modal */}
      {showPrivacyInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1.5">
              100% On-Device Privacy
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              All your customized templates and copied messages remain exclusively on your phone in local storage. No user data, analytics, or network requests are ever transmitted to any external server.
            </p>
            <button
              type="button"
              onClick={() => setShowPrivacyInfo(false)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
