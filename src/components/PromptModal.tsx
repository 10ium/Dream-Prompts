import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  Copy,
  Check,
  Heart,
  Sparkles,
  Sliders,
  Layers,
  HelpCircle,
  Share2,
  History,
} from 'lucide-react';
import { PromptItem, CategoryInfo } from '../types';

interface PromptModalProps {
  prompt: PromptItem | null;
  onClose: () => void;
  categories?: CategoryInfo[];
  isLiked: boolean;
  onLike: (id: string) => void;
  onCopy: (prompt: PromptItem) => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({
  prompt,
  onClose,
  categories = [],
  isLiked,
  onLike,
  onCopy,
}) => {
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'prompt' | 'customizer' | 'guide'>('prompt');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Determine current active prompt text and variables based on selected version
  const currentVersionData = prompt?.versions?.find((v) => v.version === selectedVersion);
  const activePromptText = currentVersionData ? currentVersionData.fullPrompt : prompt?.fullPrompt || '';
  const activeVariables = currentVersionData?.variables || prompt?.variables || [];
  const displayVersion = selectedVersion || prompt?.version || '1.0';

  useEffect(() => {
    if (!prompt) return;

    // Default to the latest version of the prompt
    const defaultVer = prompt.version || '1.0';
    setSelectedVersion(defaultVer);

    // Reset variables with defaults
    const initialVars: Record<string, string> = {};
    const initialVarsList = prompt.versions?.find((v) => v.version === defaultVer)?.variables || prompt.variables || [];
    initialVarsList.forEach((v) => {
      initialVars[v.key] = v.defaultValue || '';
    });
    setVariableValues(initialVars);
    setActiveTab('prompt');

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prompt, onClose]);

  // When changing versions, update default variable values if any
  const handleVersionChange = (newVersion: string) => {
    setSelectedVersion(newVersion);
    if (!prompt) return;
    const vData = prompt.versions?.find((v) => v.version === newVersion);
    const vars = vData?.variables || prompt.variables || [];
    const newVars: Record<string, string> = {};
    vars.forEach((v) => {
      newVars[v.key] = variableValues[v.key] || v.defaultValue || '';
    });
    setVariableValues(newVars);
  };

  if (!prompt) return null;

  // Calculate processed prompt with replaced variables
  let processedPrompt = activePromptText;
  Object.entries(variableValues).forEach(([key, val]) => {
    const placeholder = `{{${key}}}`;
    const stringVal = String(val || '');
    if (stringVal.trim()) {
      processedPrompt = processedPrompt.replaceAll(placeholder, stringVal);
    }
  });

  const wordsCount = processedPrompt.trim().split(/\s+/).length;
  const approxTokens = Math.round(wordsCount * 1.35);

  const handleCopyPrompt = (e: React.MouseEvent) => {
    navigator.clipboard.writeText(processedPrompt);
    setCopied(true);
    onCopy(prompt);

    confetti({
      particleCount: 35,
      spread: 70,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ['#38bdf8', '#c084fc', '#34d399'],
    });

    setTimeout(() => setCopied(false), 2200);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const categoryLabel =
    categories.find((c) => c.id === prompt.category)?.label || prompt.category;

  const cleanTitle = prompt.title.replace(/\s*\([^)]*\)/g, '').trim();

  // Combine latest version and historical versions for dropdown/selector
  const allVersionsList: { version: string; isLatest: boolean; summary?: string }[] = [];
  if (prompt.version) {
    allVersionsList.push({ version: prompt.version, isLatest: true });
  }
  if (prompt.versions && prompt.versions.length > 0) {
    prompt.versions.forEach((v) => {
      if (!allVersionsList.some((item) => item.version === v.version)) {
        allVersionsList.push({
          version: v.version,
          isLatest: false,
          summary: v.changeSummary,
        });
      }
    });
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.1 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0a0a0f] border border-white/10 shadow-2xl text-white overflow-hidden z-10 text-right"
        >
          {/* Header */}
          <div className="flex-shrink-0 p-5 sm:p-6 border-b border-white/10 bg-[#050508]/60">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-3xl shadow-lg">
                  {prompt.emoji}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                      <Layers className="w-3 h-3 text-indigo-400" />
                      {categoryLabel}
                    </span>

                    {prompt.difficulty && (
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/5 text-gray-400 border border-white/5">
                        سطح: {prompt.difficulty}
                      </span>
                    )}

                    {/* Version Selector or Badge */}
                    {allVersionsList.length > 1 ? (
                      <div className="relative inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        <History className="w-3 h-3 text-indigo-400" />
                        <span className="text-[11px] font-sans">نسخه:</span>
                        <select
                          value={selectedVersion}
                          onChange={(e) => handleVersionChange(e.target.value)}
                          className="bg-transparent text-indigo-200 font-mono text-xs outline-none cursor-pointer pr-1"
                        >
                          {allVersionsList.map((verItem) => (
                            <option
                              key={verItem.version}
                              value={verItem.version}
                              className="bg-[#0a0a0f] text-white"
                            >
                              v{verItem.version} {verItem.isLatest ? '(آخرین نسخه)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : prompt.version ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        نسخه {prompt.version}
                      </span>
                    ) : null}
                  </div>

                  <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    {cleanTitle}
                  </h2>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="بستن"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Summary description & Version note */}
            <p className="mt-3 text-sm text-gray-300 leading-relaxed max-w-3xl">
              {prompt.summary}
            </p>

            {currentVersionData?.changeSummary && (
              <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 flex-shrink-0" />
                <span>تغییرات نسخه {currentVersionData.version}: {currentVersionData.changeSummary}</span>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 border-b border-white/10 bg-[#050508]/40 overflow-x-auto">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('prompt')}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'prompt'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                متن سیستم پرامپت
                {allVersionsList.length > 1 && (
                  <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                    v{displayVersion}
                  </span>
                )}
              </button>

              {activeVariables && activeVariables.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('customizer')}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === 'customizer'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  شخصی‌سازی متغیرها ({activeVariables.length})
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'guide'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                راهنمای استفاده
              </button>
            </div>

            {/* Quick Stats in Tab header */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400 font-mono">
              <span>{wordsCount} کلمه</span>
              <span>•</span>
              <span>~{approxTokens} توکن</span>
            </div>
          </div>

          {/* Modal Body Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {/* Tab 1: System Prompt */}
            {activeTab === 'prompt' && (
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                        copied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          کپی شد!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          کپی پرامپت (v{displayVersion})
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 sm:p-6 rounded-2xl bg-[#030305] border border-white/10 font-mono text-xs sm:text-sm text-gray-200 leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-indigo-500/40 select-text max-h-[500px]">
                    {processedPrompt}
                  </div>
                </div>

                {prompt.tags && prompt.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-xs text-gray-400">برچسب‌ها:</span>
                    {prompt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg text-xs bg-white/5 text-gray-300 border border-white/10"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Customizer */}
            {activeTab === 'customizer' && activeVariables.length > 0 && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 leading-relaxed">
                  مقادیر مورد نظر خود را در فیلدهای زیر وارد کنید تا به‌صورت زنده در متن پرامپت جای‌گذاری شوند.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeVariables.map((v) => (
                    <div key={v.key} className="space-y-1.5">
                      <label className="block text-xs font-semibold text-gray-300">
                        {v.label}
                      </label>
                      <input
                        type="text"
                        placeholder={v.placeholder}
                        value={variableValues[v.key] || ''}
                        onChange={(e) =>
                          setVariableValues({
                            ...variableValues,
                            [v.key]: e.target.value,
                          })
                        }
                        className="w-full bg-[#11111a] border border-white/10 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Guide */}
            {activeTab === 'guide' && (
              <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#11111a] border border-white/10 space-y-4">
                  <h4 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    چگونه از این سیستم پرامپت بیشترین بازدهی را بگیریم؟
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <strong className="text-white block">۱. در ChatGPT و Claude:</strong>
                      <p className="text-gray-400">
                        متن این سیستم‌پرامپت را در قسمت <span className="text-indigo-300">Custom Instructions</span> (دستورالعمل‌های اختصاصی) قرار دهید یا به عنوان اولین پیام چت ارسال کنید.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <strong className="text-white block">۲. در Cursor و ابزارهای کدنویسی AI:</strong>
                      <p className="text-gray-400">
                        پرامپت را در فایل <code className="px-1.5 py-0.5 bg-[#0a0a0f] rounded font-mono text-indigo-300 border border-white/10">.cursorrules</code> یا تنظیمات دستیار پروژه ذخیره کنید.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <strong className="text-white block">۳. در Gemini یا API:</strong>
                      <p className="text-gray-400">
                        متن پرامپت را در فیلد <code className="px-1.5 py-0.5 bg-[#0a0a0f] rounded font-mono text-indigo-300 border border-white/10">system_instruction</code> مدل مقداردهی نمایید.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Bar */}
          <div className="flex-shrink-0 p-4 sm:p-5 border-t border-white/10 bg-[#050508]/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onLike(prompt.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isLiked
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                />
                <span>{prompt.likes} پسند</span>
              </button>

              <button
                type="button"
                onClick={handleShareLink}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                title="اشتراک‌گذاری"
              >
                {shareCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>لینک کپی شد</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-indigo-400" />
                    <span className="hidden sm:inline">اشتراک‌گذاری</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                بستن
              </button>

              <button
                type="button"
                onClick={handleCopyPrompt}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white shadow-indigo-900/40'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    کپی شد!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    کپی کل سیستم پرامپت (v{displayVersion})
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
