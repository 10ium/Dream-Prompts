import React from 'react';
import {
  Code2,
  Cpu,
  PenTool,
  BookOpenCheck,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Layers,
  Film,
  Brain,
  Compass,
  FileText,
  Palette,
  Terminal,
  FolderTree,
} from 'lucide-react';
import { CategoryInfo, PromptCategory, PromptItem } from '../types';

interface CategoryFilterProps {
  selectedCategory: PromptCategory;
  onSelectCategory: (cat: PromptCategory) => void;
  prompts: PromptItem[];
  categories: CategoryInfo[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  Cpu,
  PenTool,
  BookOpenCheck,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Layers,
  Film,
  Brain,
  Compass,
  FileText,
  Palette,
  Terminal,
  FolderTree,
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  prompts,
  categories,
}) => {
  const getCount = (catId: PromptCategory) => {
    if (catId === 'all') return prompts.length;
    return prompts.filter((p) => p.category === catId).length;
  };

  // Only show categories that have at least 1 prompt
  const visibleCategories = categories.filter((cat) => getCount(cat.id) > 0);

  return (
    <div className="relative z-10 my-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {/* 'All' Category button */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white border-indigo-400/40 shadow-lg shadow-indigo-900/20'
              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>همه دسته‌ها</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
              selectedCategory === 'all' ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-400'
            }`}
          >
            {getCount('all')}
          </span>
        </button>

        {/* Categories list */}
        {visibleCategories.map((cat) => {
          const Icon = iconMap[cat.iconName] || Layers;
          const isSelected = selectedCategory === cat.id;
          const count = getCount(cat.id);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white border-indigo-400/40 shadow-lg shadow-indigo-900/20'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-400'
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
