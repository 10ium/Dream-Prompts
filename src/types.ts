export type PromptCategory = string;

export interface PromptVariable {
  key: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
}

export interface PromptVersion {
  version: string;
  releaseDate?: string;
  changeSummary?: string;
  fullPrompt: string;
  variables?: PromptVariable[];
}

export interface PromptItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  fullPrompt: string;
  category: string;
  emoji: string;
  version?: string;
  versions?: PromptVersion[];
  author: {
    name: string;
    isDream: boolean;
    role?: string;
    avatar?: string;
  };
  status?: string;
  createdAt: string;
  tags: string[];
  likes: number;
  copies: number;
  targetModels?: string[];
  variables?: PromptVariable[];
  difficulty?: 'مبتدی' | 'متوسط' | 'پیشرفته' | 'متخصص';
}

export interface CategoryInfo {
  id: string;
  label: string;
  iconName: string;
  color?: string;
  description: string;
}
