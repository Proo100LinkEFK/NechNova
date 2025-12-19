
import { NewsItem, Category } from './types';

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'AI', label: 'ИИ', icon: 'fa-brain' },
  { id: 'Web', label: 'Веб', icon: 'fa-globe' },
  { id: 'Mobile', label: 'Мобайл', icon: 'fa-mobile-screen' },
  { id: 'Security', label: 'Безопасность', icon: 'fa-shield-halved' },
  { id: 'Hardware', label: 'Железо', icon: 'fa-microchip' },
  { id: 'Gaming', label: 'Гейминг', icon: 'fa-gamepad' },
  { id: 'Career', label: 'Карьера', icon: 'fa-briefcase' },
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
  },
  {
    id: '3',
    title: 'Новый вирус-шифровальщик атакует Linux-серверы',
    summary: 'Эксперты по безопасности обнаружили новую угрозу, использующую уязвимости в SSH-протоколе.',
    content: 'Киберпреступники начали активно использовать новый тип малвари, специально разработанный для серверов под управлением Linux. Вирус шифрует данные и требует выкуп в Monero...',
    category: 'Security',
    author: 'Дмитрий Иванов',
    date: '2024-05-19',
    imageUrl: 'https://picsum.photos/seed/security/800/400',
    views: 890,
  }
];
