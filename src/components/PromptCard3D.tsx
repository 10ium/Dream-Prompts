import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Copy,
  Check,
  Heart,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { PromptItem, CategoryInfo } from '../types';

interface PromptCard3DProps {
  prompt: PromptItem;
  categories?: CategoryInfo[];
  isLiked: boolean;
  onLike: (id: string) => void;
  onView: (prompt: PromptItem) => void;
  onCopy: (prompt: PromptItem) => void;
}

export const PromptCard3D: React.FC<PromptCard3DProps> = ({
  prompt,
  categories = [],
  isLiked,
  onLike,
  onView,
  onCopy,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [copied, setCopied] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt calculation
    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;

    setRotateX(rotX);
    setRotateY(rotY);

    // Glare position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.fullPrompt);
    setCopied(true);
    onCopy(prompt);

    // Fire celebratory confetti
    confetti({
      particleCount: 30,
      spread: 60,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ['#38bdf8', '#c084fc', '#34d399'],
    });

    setTimeout(() => setCopied(false), 2000);
  };

  // Find category label dynamically
  const categoryLabel =
    categories.find((c) => c.id === prompt.category)?.label || prompt.category;

  // Clean title without parentheses
  const cleanTitle = prompt.title.replace(/\s*\([^)]*\)/g, '').trim();

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000 group relative select-none"
    >
      <motion.div
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative h-full flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 backdrop-blur-xl bg-[#11111a] border border-white/10 hover:border-white/20 shadow-xl overflow-hidden"
      >
        {/* Ambient Corner Glow */}
        <div
          className="absolute top-0 right-0 w-36 h-36 blur-3xl transition-all pointer-events-none bg-indigo-500/10 group-hover:bg-indigo-500/20"
        />

        {/* Dynamic 3D Glare effect */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,${glarePosition.opacity}), transparent 70%)`,
          }}
        />

        {/* Top bar: Category + Difficulty */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-4" style={{ transform: 'translateZ(25px)' }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
              <Layers className="w-3 h-3 text-indigo-400" />
              {categoryLabel}
            </span>

            {prompt.difficulty && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white/5 text-gray-400 border border-white/5">
                {prompt.difficulty}
              </span>
            )}
          </div>

          {/* Main Title & Emoji Icon */}
          <div className="flex items-start gap-3.5 mb-3" style={{ transform: 'translateZ(30px)' }}>
            <div className="relative flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform duration-300">
              <span className="relative z-10">{prompt.emoji}</span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
                {cleanTitle}
              </h3>
              {prompt.version && (
                <div className="mt-0.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    نسخه {prompt.version}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <p
            className="text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4 font-normal"
            style={{ transform: 'translateZ(20px)' }}
          >
            {prompt.summary}
          </p>

          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-4" style={{ transform: 'translateZ(15px)' }}>
              {prompt.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-white/5 text-gray-300 border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section: Metrics & Action Buttons */}
        <div className="pt-4 border-t border-white/10 mt-auto" style={{ transform: 'translateZ(25px)' }}>
          <div className="flex items-center justify-between gap-3">
            {/* Actions: Copy & View */}
            <div className="flex items-center gap-2 w-full justify-between">
              <button
                type="button"
                onClick={handleCopy}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/5 hover:bg-white/15 text-gray-200 border border-white/10 hover:border-white/20'
                }`}
                title="کپی کردن متن پرامپت"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'کپی شد' : 'کپی پرامپت'}</span>
              </button>

              <button
                type="button"
                onClick={() => onView(prompt)}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600/90 hover:bg-indigo-600 text-white transition-colors cursor-pointer shadow-lg shadow-indigo-600/20"
                title="مشاهده کامل و جزئیات"
              >
                <span>مشاهده</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Social Stats & Likes */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px] text-gray-400">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLike(prompt.id);
              }}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLiked ? 'text-rose-400' : 'hover:text-rose-300 text-gray-400'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="font-mono">{prompt.likes}</span>
            </button>

            <span className="flex items-center gap-1 text-gray-500">
              <Copy className="w-3 h-3" />
              <span className="font-mono">{prompt.copies} بار کپی</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
