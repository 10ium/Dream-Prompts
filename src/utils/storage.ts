import { PromptItem, CategoryInfo } from '../types';
import { INITIAL_PROMPTS } from '../data/initialPrompts';
import { INITIAL_CATEGORIES } from '../data/categories';

const LIKED_PROMPTS_KEY = 'dream_prompts_user_likes_v6';
const PROMPTS_COPIES_KEY = 'dream_prompts_user_copies_v6';
const PROMPTS_LIKES_DELTA_KEY = 'dream_prompts_likes_delta_v6';

/**
 * Loads prompts directly from the code source (INITIAL_PROMPTS),
 * and seamlessly blends in local user interaction data (likes & copies).
 * This ensures that whenever you add or edit prompts in code, they instantly show up
 * on GitHub Pages without being blocked by stale cached data.
 */
export function getPrompts(): PromptItem[] {
  try {
    const rawCopies = localStorage.getItem(PROMPTS_COPIES_KEY);
    const copiesMap: Record<string, number> = rawCopies ? JSON.parse(rawCopies) : {};

    const rawLikesDelta = localStorage.getItem(PROMPTS_LIKES_DELTA_KEY);
    const likesDeltaMap: Record<string, number> = rawLikesDelta ? JSON.parse(rawLikesDelta) : {};

    return INITIAL_PROMPTS.map((prompt) => {
      const extraCopies = copiesMap[prompt.id] || 0;
      const extraLikes = likesDeltaMap[prompt.id] || 0;
      return {
        ...prompt,
        copies: Math.max(0, prompt.copies + extraCopies),
        likes: Math.max(0, prompt.likes + extraLikes),
      };
    });
  } catch {
    return INITIAL_PROMPTS;
  }
}

export function getCategories(): CategoryInfo[] {
  return INITIAL_CATEGORIES;
}

export function getUserLikes(): string[] {
  try {
    const raw = localStorage.getItem(LIKED_PROMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUserLikes(likes: string[]): void {
  try {
    localStorage.setItem(LIKED_PROMPTS_KEY, JSON.stringify(likes));
  } catch (err) {
    console.error('Error saving user likes:', err);
  }
}

export function recordPromptCopy(promptId: string): void {
  try {
    const raw = localStorage.getItem(PROMPTS_COPIES_KEY);
    const map: Record<string, number> = raw ? JSON.parse(raw) : {};
    map[promptId] = (map[promptId] || 0) + 1;
    localStorage.setItem(PROMPTS_COPIES_KEY, JSON.stringify(map));
  } catch (err) {
    console.error('Error recording prompt copy:', err);
  }
}

export function recordPromptLikeDelta(promptId: string, delta: number): void {
  try {
    const raw = localStorage.getItem(PROMPTS_LIKES_DELTA_KEY);
    const map: Record<string, number> = raw ? JSON.parse(raw) : {};
    map[promptId] = Math.max(0, (map[promptId] || 0) + delta);
    localStorage.setItem(PROMPTS_LIKES_DELTA_KEY, JSON.stringify(map));
  } catch (err) {
    console.error('Error recording prompt like delta:', err);
  }
}
