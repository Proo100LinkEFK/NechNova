
import React, { useState, useEffect, useMemo } from 'react';
import { NewsItem, User, Category } from './types';
import { INITIAL_NEWS, CATEGORIES } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';
import NewsCard from './components/NewsCard';
import NewsForm from './components/NewsForm';
import AuthForm from './components/AuthForm';

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'create' | 'auth' | 'detail'>('home');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Load
  useEffect(() => {
    const savedNews = localStorage.getItem('technova_news');
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    } else {
      setNews(INITIAL_NEWS);
    }

    const savedUser = localStorage.getItem('technova_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('technova_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('technova_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('technova_user');
    }
  }, [user]);

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [news, selectedCategory, searchQuery]);

  const handleCreateNews = (newNewsData: Omit<NewsItem, 'id' | 'views' | 'date'>) => {
    const newEntry: NewsItem = {
      ...newNewsData,
      id: Math.random().toString(36).substr(2, 9),
      views: 0,
      date: new Date().toISOString().split('T')[0],
    };
    setNews(prev => [newEntry, ...prev]);
    setCurrentPage('home');
  };

  const handleNewsClick = (item: NewsItem) => {
    // Increment view count
    setNews(prev => prev.map(n => n.id === item.id ? { ...n, views: n.views + 1 } : n));
    setSelectedNews({ ...item, views: item.views + 1 });
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-8 md:p-16 mb-12">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[150%] h-[150%] bg-gradient-to-br from-blue-500 to-indigo-800 rounded-full blur-[100px]"></div>
              </div>
              <div className="relative z-10 max-w-2xl">
                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/30 text-blue-400 text-sm font-bold border border-blue-500/30 mb-6 uppercase tracking-wider">
                  Главные новости
                </span>
                <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                  Где рождается <span className="text-blue-500">будущее</span> IT
                </h2>
                <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed">
                  Будьте в авангарде цифровой трансформации. Лучшие статьи, обзоры и аналитика от профессионалов.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2">
                    Читать популярное <i className="fas fa-arrow-right"></i>
                  </button>
                  <button className="bg-slate-800/50 backdrop-blur-md text-white border border-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-700 transition-all">
                    Подписаться
                  </button>
                </div>
              </div>
            </section>

            {/* Filter & Search Bar */}
            <div className="sticky top-20 z-40 py-4 bg-slate-50/80 backdrop-blur-md">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm border ${
                      selectedCategory === 'All' 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    Все
                  </button>
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm border flex items-center gap-2 ${
                        selectedCategory === cat.id 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <i className={`fas ${cat.icon}`}></i>
                      {cat.label}
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-80">
                  <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input 
                    type="text" 
                    placeholder="Поиск новостей..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.length > 0 ? (
                filteredNews.map(item => (
                  <NewsCard key={item.id} news={item} onClick={handleNewsClick} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="text-slate-300 mb-4">
                    <i className="fas fa-search fa-4x"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-500">Ничего не найдено</h3>
                  <p className="text-slate-400">Попробуйте изменить параметры фильтрации</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'create':
        return user ? (
          <NewsForm 
            onSubmit={handleCreateNews} 
            onCancel={() => setCurrentPage('home')} 
            author={user.username}
          />
        ) : (
          <AuthForm onLogin={(u) => { setUser(u); setCurrentPage('create'); }} />
        );
      case 'auth':
        return <AuthForm onLogin={(u) => { setUser(u); setCurrentPage('home'); }} />;
      case 'detail':
        if (!selectedNews) return null;
        return (
          <article className="max-w-4xl mx-auto animate-in slide-in-from-bottom duration-500">
            <button 
              onClick={() => setCurrentPage('home')}
              className="mb-8 flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors"
            >
              <i className="fas fa-arrow-left"></i> Назад к списку
            </button>
            <div className="relative h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl">
              <img 
                src={selectedNews.imageUrl} 
                alt={selectedNews.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10">
                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                  {CATEGORIES.find(c => c.id === selectedNews.category)?.label}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                  {selectedNews.title}
                </h1>
                <div className="flex items-center gap-6 text-slate-200 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <img src={`https://ui-avatars.com/api/?name=${selectedNews.author}&background=random`} className="w-8 h-8 rounded-full border border-white/20" alt="" />
                    <span>{selectedNews.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="far fa-calendar"></i>
                    <span>{new Date(selectedNews.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="far fa-eye"></i>
                    <span>{selectedNews.views} просмотров</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="prose prose-lg prose-slate max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl mb-10 italic text-slate-700 text-xl leading-relaxed font-medium">
                "{selectedNews.summary}"
              </div>
              <div className="text-slate-700 leading-loose text-lg whitespace-pre-wrap">
                {selectedNews.content}
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold hover:bg-blue-100 transition-all">
                  <i className="far fa-heart"></i> Лайкнуть
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all">
                  <i className="far fa-share-square"></i> Поделиться
                </button>
              </div>
              <div className="text-slate-400 font-medium">
                Теги: {selectedNews.category}, IT, Технологии
              </div>
            </div>
          </article>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        user={user} 
        onNavigate={setCurrentPage} 
        onLogout={() => { setUser(null); setCurrentPage('home'); }} 
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
};

export default App;
