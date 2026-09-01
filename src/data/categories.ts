import { CategoryInfo } from '../types';

export const INITIAL_CATEGORIES: CategoryInfo[] = [
  {
    id: 'analysis',
    label: 'تحلیل، فلسفه و استدلال',
    iconName: 'BarChart3',
    color: 'from-sky-500/20 to-blue-500/20 border-sky-500/30 text-sky-400',
    description: 'مصاحبه اخلاقی، تحلیل سیاسی، حقیقت‌جویی و تفکر انتقادی',
  },
  {
    id: 'programming',
    label: 'برنامه‌نویسی و مهندسی نرم‌افزار',
    iconName: 'Code2',
    color: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-400',
    description: 'معماری سیستم، کدنویسی تمیز، حل تعارضات و Peer Review',
  },
  {
    id: 'writing',
    label: 'نگارش، ویرایش و ترجمه',
    iconName: 'BookOpenCheck',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    description: 'بومی‌سازی زیرنویس، ویرایش متن، ترجمه محاوره‌ای و بازنویسی',
  },
  {
    id: 'media',
    label: 'سینما، فیلم و مدیا',
    iconName: 'Sparkles',
    color: 'from-fuchsia-500/20 to-purple-500/20 border-fuchsia-500/30 text-fuchsia-400',
    description: 'موتور هوشمند پیشنهاد فیلم، سریال، انیمه، مستند و مدیریت تصمیم‌گیری',
  },
];

export const CATEGORIES = INITIAL_CATEGORIES;

export const CATEGORY_MAP = new Map<string, string>(
  INITIAL_CATEGORIES.map((c) => [c.id, c.label])
);
