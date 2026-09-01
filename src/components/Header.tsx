import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'popular' | 'newest' | 'copies';
  onSortChange: (sort: 'popular' | 'newest' | 'copies') => void;
  totalPrompts: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalPrompts,
}) => {
  return (
    <header className="relative z-20 pt-6 pb-4">
      {/* Top Brand Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
        {/* 3D Logo & Title */}
        <div className="flex items-center gap-4 text-right">
          <div className="relative group perspective-1000">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.5)] p-[2px] group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full rounded-2xl bg-[#0a0a0f] flex items-center justify-center text-xl">
                ✨
              </div>
            </div>
            {/* Ambient Orb Glow */}
            <div className="absolute -inset-1 rounded-2xl bg-indigo-500/25 blur-lg -z-10 group-hover:bg-indigo-500/40 transition-all" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              دریم پرامپت • Dream Prompts
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              مجموعه سیستم‌پرامپت‌های تخصصی، ساختاریافته و مهندسی‌شده برای هوش مصنوعی (ChatGPT، Claude، Cursor و Gemini)
            </p>
          </div>
        </div>
      </div>

      {/* Search & Sorting Bar */}
      <div className="mt-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو در عناوین، متن پرامپت‌ها، تگ‌ها و کلیدواژه‌ها..."
            className="w-full pl-10 pr-11 py-2.5 rounded-full bg-[#11111a] border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-gray-500 text-xs sm:text-sm outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sorters */}
        <div className="flex items-center bg-[#11111a] rounded-xl p-1 border border-white/10 self-end md:self-auto">
          <span className="text-[11px] text-gray-500 px-2 font-medium">مرتب‌سازی:</span>
          <button
            type="button"
            onClick={() => onSortChange('popular')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              sortBy === 'popular'
                ? 'bg-white/10 text-white font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            محبوب‌ترین
          </button>
          <button
            type="button"
            onClick={() => onSortChange('copies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              sortBy === 'copies'
                ? 'bg-white/10 text-white font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            بیشترین کپی
          </button>
          <button
            type="button"
            onClick={() => onSortChange('newest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              sortBy === 'newest'
                ? 'bg-white/10 text-white font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            جدیدترین
          </button>
        </div>
      </div>
    </header>
  );
};
