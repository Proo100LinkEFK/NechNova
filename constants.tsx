
import { NewsItem, Category, Podcast } from './types';

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'AI', label: 'ИИ', icon: 'fa-brain' },
  { id: 'Web', label: 'Веб', icon: 'fa-globe' },
  { id: 'Mobile', label: 'Мобайл', icon: 'fa-mobile-screen' },
  { id: 'Security', label: 'Безопасность', icon: 'fa-shield-halved' },
  { id: 'Hardware', label: 'Железо', icon: 'fa-microchip' },
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Gemini 3: Новый прорыв в понимании контекста',
    summary: 'Google анонсировала новую модель Gemini 3 с невероятным окном контекста в 10 миллионов токенов.',
    content: 'Google продолжает доминировать на рынке ИИ, представляя Gemini 3. Новая модель способна анализировать целые библиотеки кода за считанные секунды. Разработчики утверждают, что это изменит подход к созданию сложных программных систем...',
    category: 'AI',
    author: 'Алексей Петров',
    date: '2024-05-20',
    imageUrl: 'https://picsum.photos/seed/ai/800/400',
    views: 1240,
    likes: 45,
    likedByUserIds: [],
    tags: ['Google', 'Gemini', 'LLM'],
    readTime: 5,
    isHot: true,
    comments: [
      { id: 'c1', author: 'TechGuru', text: 'Это просто невероятно! 10 млн токенов — это же целая база данных в контексте.', date: '2024-05-21', likes: 5, likedByUserIds: [] }
    ]
  },
  {
    id: '2',
    title: 'React 19: Чего ждать разработчикам?',
    summary: 'Основные изменения в новой версии популярной библиотеки: React Compiler и Server Actions.',
    content: 'React 19 обещает стать одним из крупнейших обновлений за последние годы. Главное новшество — React Compiler, который автоматически оптимизирует рендеринг компонентов без использования useMemo и useCallback...',
    category: 'Web',
    author: 'Марина Соколова',
    date: '2024-05-18',
    imageUrl: 'https://picsum.photos/seed/react/800/400',
    views: 3500,
    likes: 128,
    likedByUserIds: [],
    tags: ['React', 'Frontend', 'JS'],
    readTime: 8,
    comments: []
  }
];

export const INITIAL_PODCASTS: Podcast[] = [
  {
    id: 'p1',
    title: 'Будущее фронтенда с React 19',
    host: 'Никита Сидоров',
    duration: '45:20',
    imageUrl: 'https://picsum.photos/seed/pod1/200/200',
    date: '2024-05-15'
  },
  {
    id: 'p2',
    title: 'ИИ: Заменит ли он нас?',
    host: 'Елена Кузнецова',
    duration: '58:10',
    imageUrl: 'https://picsum.photos/seed/pod2/200/200',
    date: '2024-05-10'
  }
];
