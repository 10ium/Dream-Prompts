import React from 'react';
import { Sparkles, Copy, Heart, Layers } from 'lucide-react';
import { PromptItem, CategoryInfo } from '../types';

interface StatsBarProps {
  prompts: PromptItem[];
  categories: CategoryInfo[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ prompts, categories }) => {
  const totalCopies = prompts.reduce((acc, p) => acc + p.copies, 0);
  const totalLikes = prompts.reduce((acc, p) => acc + p.likes, 0);

  const stats = [
    {
      label: 'کل پرامپت‌های تخصصی',
      value: prompts.length,
      icon: Sparkles,
      color: 'text-indigo-400',
      glow: 'bg-indigo-500/10',
    },
    {
      label: 'دسته‌بندی‌های موضوعی',
      value: categories.length,
      icon: Layers,
      color: 'text-purple-400',
      glow: 'bg-purple-500/10',
    },
    {
      label: 'مجموع دفعات کپی',
      value: totalCopies.toLocaleString('fa-IR'),
      icon: Copy,
      color: 'text-emerald-400',
      glow: 'bg-emerald-500/10',
    },
    {
      label: 'مجموع علاقه‌مندی‌ها',
      value: totalLikes.toLocaleString('fa-IR'),
      icon: Heart,
      color: 'text-rose-400',
      glow: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="relative rounded-2xl p-4 bg-[#11111a] border border-white/10 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-white/20 group overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.glow} blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`} />
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-xs text-gray-400 font-medium">{stat.label}</span>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono relative z-10">
              {stat.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};
