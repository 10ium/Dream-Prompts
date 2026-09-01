import React, { useState, useEffect, useMemo } from 'react';
import { PromptItem, PromptCategory, CategoryInfo } from './types';
import {
  getPrompts,
  getCategories,
  getUserLikes,
  saveUserLikes,
  recordPromptCopy,
  recordPromptLikeDelta,
} from './utils/storage';
import { ThreeBackground } from './components/ThreeBackground';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { CategoryFilter } from './components/CategoryFilter';
import { PromptCard3D } from './components/PromptCard3D';
import { PromptModal } from './components/PromptModal';
import { SearchX, Sparkles, Heart, Send, Twitter } from 'lucide-react';

export default function App() {
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [userLikes, setUserLikes] = useState<string[]>([]);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'copies'>('popular');

  // Modal state
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem | null>(null);

  // Load prompts & categories directly from code and local storage interactions
  useEffect(() => {
    setPrompts(getPrompts());
    setCategories(getCategories());
    setUserLikes(getUserLikes());
  }, []);

  // Like handler (toggles like state & updates counters)
  const handleLike = (promptId: string) => {
    let updatedLikes = [...userLikes];
    let isAdding = false;

    if (updatedLikes.includes(promptId)) {
      updatedLikes = updatedLikes.filter((id) => id !== promptId);
      isAdding = false;
    } else {
      updatedLikes.push(promptId);
      isAdding = true;
    }

    setUserLikes(updatedLikes);
    saveUserLikes(updatedLikes);
    recordPromptLikeDelta(promptId, isAdding ? 1 : -1);

    const updatedPrompts = prompts.map((p) => {
      if (p.id === promptId) {
        return {
          ...p,
          likes: Math.max(0, p.likes + (isAdding ? 1 : -1)),
        };
      }
      return p;
    });

    setPrompts(updatedPrompts);
    if (selectedPrompt && selectedPrompt.id === promptId) {
      setSelectedPrompt({
        ...selectedPrompt,
        likes: Math.max(0, selectedPrompt.likes + (isAdding ? 1 : -1)),
      });
    }
  };

  // Copy handler (records copy event & increments counter)
  const handleCopy = (copiedPrompt: PromptItem) => {
    recordPromptCopy(copiedPrompt.id);
    const updatedPrompts = prompts.map((p) => {
      if (p.id === copiedPrompt.id) {
        return { ...p, copies: p.copies + 1 };
      }
      return p;
    });
    setPrompts(updatedPrompts);
    if (selectedPrompt && selectedPrompt.id === copiedPrompt.id) {
      setSelectedPrompt({
        ...selectedPrompt,
        copies: selectedPrompt.copies + 1,
      });
    }
  };

  // Filtered & Sorted prompts calculation
  const filteredPrompts = useMemo(() => {
    return prompts
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchesTitle = p.title.toLowerCase().includes(query);
          const matchesSummary = p.summary.toLowerCase().includes(query);
          const matchesPrompt = p.fullPrompt.toLowerCase().includes(query);
          const matchesAuthor = p.author.name.toLowerCase().includes(query);
          const matchesTags = p.tags?.some((t) => t.toLowerCase().includes(query));

          if (!matchesTitle && !matchesSummary && !matchesPrompt && !matchesAuthor && !matchesTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.likes - a.likes;
        if (sortBy === 'copies') return b.copies - a.copies;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [prompts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#050508] text-white relative font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* 3D WebGL Particle Background Canvas */}
      <ThreeBackground />

      {/* Ambient Radial Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalPrompts={prompts.length}
        />

        {/* Dynamic Stats Bar */}
        <StatsBar prompts={prompts} categories={categories} />

        {/* Category Filter Pills */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          prompts={prompts}
          categories={categories}
        />

        {/* Section Heading */}
        <div className="flex items-center justify-between mt-8 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>
                {selectedCategory === 'all'
                  ? 'گالری سیستم‌پرامپت‌های تخصصی'
                  : `پرامپت‌های دسته‌بندی`}
              </span>
            </h2>
          </div>
        </div>

        {/* Prompts 3D Cards Grid */}
        {filteredPrompts.length === 0 ? (
          <div className="my-16 p-10 rounded-3xl bg-[#11111a] border border-white/10 backdrop-blur-xl text-center max-w-lg mx-auto space-y-4 shadow-2xl">
            <SearchX className="w-16 h-16 text-gray-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">پرامپتی یافت نشد!</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              عبارت جستجو یا فیلتر دسته‌بندی را تغییر دهید تا پرامپت‌های مورد نظرتان نمایش داده شوند.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 cursor-pointer transition-colors"
            >
              پاک‌سازی فیلترها
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptCard3D
                key={prompt.id}
                prompt={prompt}
                categories={categories}
                isLiked={userLikes.includes(prompt.id)}
                onLike={handleLike}
                onView={setSelectedPrompt}
                onCopy={handleCopy}
              />
            ))}
          </div>
        )}

        {/* Clean Social Footer */}
        <footer className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 relative z-10 text-xs text-gray-400">
          <div className="flex items-center gap-2 text-gray-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>سامانه سیستم‌پرامپت‌های تخصصی هوش مصنوعی</span>
          </div>

          {/* Social Channels (Twitter & Telegram) */}
          <div className="flex items-center gap-3">
            <a
              href="https://t.me/vpnclashfa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-[#229ED9]/20 text-gray-300 hover:text-[#229ED9] border border-white/10 hover:border-[#229ED9]/40 transition-all cursor-pointer shadow-sm"
              title="کانال تلگرام"
            >
              <Send className="w-3.5 h-3.5" />
              <span>کانال تلگرام</span>
            </a>

            <a
              href="https://x.com/coldwater_10"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-sky-500/20 text-gray-300 hover:text-sky-400 border border-white/10 hover:border-sky-500/40 transition-all cursor-pointer shadow-sm"
              title="توییتر / X"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>توییتر / X</span>
            </a>
          </div>
        </footer>
      </div>

      {/* Prompt Details & Copy Modal */}
      <PromptModal
        prompt={selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
        categories={categories}
        isLiked={selectedPrompt ? userLikes.includes(selectedPrompt.id) : false}
        onLike={handleLike}
        onCopy={handleCopy}
      />
    </div>
  );
}
