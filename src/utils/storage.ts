import { Template } from '../types';
import { DEFAULT_TEMPLATES } from '../data/defaultTemplates';

const STORAGE_KEY = 'offline_templates_v1';

export function loadSavedTemplates(): Template[] {
  if (typeof window === 'undefined') return DEFAULT_TEMPLATES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First run: save and return defaults
      saveTemplates(DEFAULT_TEMPLATES);
      return DEFAULT_TEMPLATES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Error loading templates from localStorage', e);
  }
  return DEFAULT_TEMPLATES;
}

export function saveTemplates(templates: Template[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (e) {
    console.error('Error saving templates to localStorage', e);
  }
}

export function resetToDefaults(): Template[] {
  saveTemplates(DEFAULT_TEMPLATES);
  return DEFAULT_TEMPLATES;
}

export function exportTemplatesToJson(templates: Template[]): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templates, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `message_templates_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
