export type TemplateCategory = 
  | 'all'
  | 'birthday'
  | 'anniversary'
  | 'congratulations'
  | 'wishes'
  | 'custom';

export interface Template {
  id: string;
  title: string;
  content: string;
  category: TemplateCategory;
  isCustom?: boolean;
  createdAt: number;
  lastUsedAt?: number;
  copyCount?: number;
}

export interface SnackbarState {
  visible: boolean;
  message: string;
  detail?: string;
  id?: number;
}
