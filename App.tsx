
import React, { useState, useEffect, useMemo } from 'react';
import { NewsItem, User, Category, Comment, Podcast } from './types';
import { INITIAL_NEWS, CATEGORIES, INITIAL_PODCASTS } from './constants';
import Header from './components/Header';
import Footer from './components/Footer';
import NewsCard from './components/NewsCard';
import NewsForm from './components/NewsForm';
import AuthForm from './components/AuthForm';

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>(INITIAL_PODCASTS);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'create' | 'auth' | 'detail' | 'trends' | 'podcasts'>('home');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentText, setCommentText] = useState('');

  // Initial Load
  useEffect(() => {
    const savedNews = localStorage.getItem('technova_news_v4');
    if (savedNews) {
      setNews(JSON.parse(savedNews));
    } else {
      setNews(INITIAL_NEWS);
    }

    const savedUser = localStorage.getItem('technova_user_v4');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('technova_news_v4', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('technova_user_v4', JSON.stringify(user));
    } else {
      localStorage.removeItem('technova_user_v4');
    }
  }, [user]);

  const filteredNews = useMemo(() => {
    let list = [...news];
    if (currentPage === 'trends') {
      list.sort((a, b) => (b.views + b.likes * 3) - (a.views + a.likes * 3));
    } else {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return list.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [news, selectedCategory, searchQuery, currentPage]);

  const handleCreateNews = (newNewsData: Omit<NewsItem, 'id' | 'views' | 'date' | 'likes' | 'comments' | 'likedByUserIds'>) => {
    const newEntry: NewsItem = {
      ...newNewsData,
      id: Math.random().toString(36).substr(2, 9),
      views: 0,
      likes: 0,
      likedByUserIds: [],
      comments: [],
      date: new Date().toISOString().split('T')[0],
    };
    setNews(prev => [newEntry, ...prev]);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLikeNews = (id: string) => {
    if (!user) {
      setCurrentPage('auth');
      return;
    }

    setNews(prev => prev.map(n => {
      if (n.id === id) {
        const alreadyLiked = n.likedByUserIds.includes(user.id);
        const newLikes = alreadyLiked ? n.likes - 1 : n.likes + 1;
        const newIds = alreadyLiked 
          ? n.likedByUserIds.filter(uid => uid !== user.id) 
          : [...n.likedByUserIds, user.id];
        
        const updated = { ...n, likes: newLikes, likedByUserIds: newIds };
        if (selectedNews?.id === id) setSelectedNews(updated);
        return updated;
      }
      return n;
    }));
  };

  const handleLikeComment = (commentId: string) => {
    if (!user || !selectedNews) {
      if (!user) setCurrentPage('auth');
      return;
    }

    setNews(prev => prev.map(n => {
      if (n.id === selectedNews.id) {
        const updatedComments = n.comments.map(c => {
          if (c.id === commentId) {
            const alreadyLiked = c.likedByUserIds.includes(user.id);
            const newLikes = alreadyLiked ? c.likes - 1 : c.likes + 1;
            const newIds = alreadyLiked 
              ? c.likedByUserIds.filter(uid => uid !== user.id) 
              : [...c.likedByUserIds, user.id];
            return { ...c, likes: newLikes, likedByUserIds: newIds };
          }
          return c;
        });
        const updatedNews = { ...n, comments: updatedComments };
        if (selectedNews.id === n.id) setSelectedNews(updatedNews);
        return updatedNews;
      }
      return n;
    }));
  };

  const handleNewsClick = (item: NewsItem) => {
    setNews(prev => prev.map(n => n.id === item.id ? { ...n, views: n.views + 1 } : n));
    setSelectedNews({ ...item, views: item.views + 1 });
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setCurrentPage('auth');
      return;
    }
    if (!commentText.trim() || !selectedNews) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: user.username,
      text: commentText,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      likedByUserIds: []
    };

    setNews(prev => prev.map(n => n.id === selectedNews.id ? { ...n, comments: [newComment, ...n.comments] } : n));
    setSelectedNews(prev => prev ? { ...prev, comments: [newComment, ...prev.comments] } : null);
    setCommentText('');
  };

  const renderFormattedContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-4xl md:text-5xl font-black text-slate-900 mt-12 mb-6 leading-tight">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl md:text-3xl font-black text-slate-800 mt-10 mb-5 border-b-4 border-blue-500/10 pb-2 inline-block">{line.replace('## ', '')}</h2>;
      }
      if (line.startsWith('> ')) {
        return <blockquote key={i} className="bg-slate-50 border-l-8 border-slate-900 p-8 my-8 italic text-2xl text-slate-700 rounded-r-3xl leading-relaxed">{line.replace('> ', '')}</blockquote>;
      }
      if (line.startsWith('![')) {
        const match = line.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) {
          return (
            <figure key={i} className="my-12 relative group overflow-hidden rounded-[2.5rem] shadow-2xl">
              <img src={match[2]} alt={match[1]} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
              {match[1] && <figcaption className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest">{match[1]}</figcaption>}
            </figure>
          );
        }
      }
      
      let processed = line;
      processed = processed.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-600 font-bold underline decoration-blue-500/30 underline-offset-4 hover:bg-blue-50 p-1 rounded transition-all">$1</a>');
      processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-slate-900">$1</strong>');
      processed = processed.replace(/_(.*?)_/g, '<em class="italic text-slate-600">$1</em>');

      return <p key={i} className="text-slate-700 leading-loose text-xl mb-6 font-medium" dangerouslySetInnerHTML={{ __html: processed || '&nbsp;' }} />;
    });
  };

  const renderContent = () => {
    if (currentPage === 'podcasts') {
      return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
           <div className="mb-16 text-center">
              <h2 className="text-5xl font-black text-slate-900 mb-6">TechNova Подкасты 🎙️</h2>
              <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">Слушайте о технологиях, коде и карьере от лидеров индустрии.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {podcasts.map(pod => (
               <div key={pod.id} className="bg-white rounded-[3rem] p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all group flex flex-col items-center text-center">
                 <div className="relative mb-8 w-full aspect-square overflow-hidden rounded-[2.5rem]">
                    <img src={pod.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={pod.title} />
                    <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white text-blue-600 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl">
                        <i className="fas fa-play text-3xl ml-1"></i>
                      </div>
                    </div>
                 </div>
                 <h3 className="text-3xl font-black mb-3 group-hover:text-blue-600 transition-colors leading-tight">{pod.title}</h3>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">С {pod.host}</p>
                 <div className="mt-auto flex justify-between items-center w-full text-xs font-black text-slate-400 border-t border-slate-100 pt-6">
                   <span className="flex items-center gap-1.5"><i className="far fa-clock"></i> {pod.duration}</span>
                   <span>{new Date(pod.date).toLocaleDateString('ru-RU')}</span>
                 </div>
               </div>
             ))}
           </div>
        </div>
      );
    }

    if (currentPage === 'auth') {
      return <AuthForm onLogin={(u) => { setUser(u); setCurrentPage('home'); }} />;
    }

    if (currentPage === 'create') {
      return (
        <NewsForm 
          onSubmit={handleCreateNews} 
          onCancel={() => setCurrentPage('home')} 
          author={user?.username || 'Гость'}
        />
      );
    }

    if (currentPage === 'detail' && selectedNews) {
      const isNewsLiked = user ? selectedNews.likedByUserIds.includes(user.id) : false;
      return (
        <article className="max-w-4xl mx-auto animate-in slide-in-from-bottom duration-700">
          <button 
            onClick={() => setCurrentPage('home')}
            className="mb-10 flex items-center gap-3 text-slate-400 font-black hover:text-blue-600 transition-colors group"
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
              <i className="fas fa-arrow-left"></i>
            </div>
            Назад к ленте
          </button>
          
          <div className="relative h-[500px] md:h-[650px] rounded-[4rem] overflow-hidden mb-16 shadow-2xl border-[12px] border-white">
            <img src={selectedNews.imageUrl} alt={selectedNews.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/10 to-transparent"></div>
            <div className="absolute bottom-16 left-12 right-12">
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/40">
                  {CATEGORIES.find(c => c.id === selectedNews.category)?.label}
                </span>
                {selectedNews.tags.map(tag => (
                   <span key={tag} className="bg-white/10 backdrop-blur-xl text-white px-4 py-2 rounded-full text-[10px] font-black uppercase border border-white/20 tracking-widest">#{tag}</span>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tight">{selectedNews.title}</h1>
              <div className="flex flex-wrap items-center gap-8 text-slate-300 text-sm font-bold uppercase tracking-widest">
                <div className="flex items-center gap-4">
                  <img src={`https://ui-avatars.com/api/?name=${selectedNews.author}&background=random`} className="w-12 h-12 rounded-2xl border-2 border-white/20" />
                  <span className="text-white">{selectedNews.author}</span>
                </div>
                <span className="flex items-center gap-2"><i className="far fa-eye text-blue-500"></i> {selectedNews.views}</span>
                <span className="flex items-center gap-2"><i className="far fa-clock text-green-500"></i> {selectedNews.readTime} МИН</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 md:p-20 rounded-[3.5rem] border border-slate-200 shadow-sm mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none"></div>
            <div className="relative z-10">
              <div className="bg-slate-50 border-l-[10px] border-blue-600 p-10 rounded-r-[2.5rem] mb-16 italic text-slate-900 text-3xl font-black leading-snug">
                "{selectedNews.summary}"
              </div>
              <div className="prose-content">
                {renderFormattedContent(selectedNews.content)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mb-24">
            <button 
              onClick={() => handleLikeNews(selectedNews.id)}
              className={`flex items-center gap-4 px-12 py-6 rounded-[2.5rem] font-black transition-all border-4 text-2xl ${
                isNewsLiked 
                ? 'bg-red-500 text-white border-red-500 shadow-2xl shadow-red-200' 
                : 'bg-white text-red-500 border-red-100 hover:bg-red-50'
              }`}
            >
              <i className={`${isNewsLiked ? 'fas' : 'far'} fa-heart`}></i> {isNewsLiked ? 'Мне нравится' : 'Оценить'} <span className="text-sm opacity-50 ml-2">({selectedNews.likes})</span>
            </button>
            <button className="flex items-center gap-4 px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black hover:bg-black transition-all shadow-2xl shadow-slate-200 text-2xl">
              <i className="fas fa-share-alt"></i> Поделиться
            </button>
          </div>

          <section className="bg-white rounded-[4rem] p-12 md:p-16 border border-slate-200 shadow-sm mb-32">
            <div className="flex items-center justify-between mb-16">
              <h3 className="text-4xl font-black flex items-center gap-6 text-slate-900">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200">
                  <i className="far fa-comments"></i>
                </div>
                Комментарии <span className="text-slate-300">({selectedNews.comments.length})</span>
              </h3>
            </div>
            
            <form onSubmit={handleAddComment} className="mb-16 relative">
              <textarea 
                placeholder={user ? "Напишите что-нибудь умное..." : "Авторизуйтесь, чтобы участвовать в жизни сообщества"}
                className="w-full p-8 rounded-[2.5rem] border-2 border-slate-100 focus:border-blue-600 focus:ring-[12px] focus:ring-blue-50 outline-none transition-all h-48 resize-none mb-6 text-xl bg-slate-50 focus:bg-white font-medium"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={!user}
              />
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={!user || !commentText.trim()}
                  className="bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black hover:bg-blue-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl shadow-blue-200 text-xl flex items-center gap-3"
                >
                  Опубликовать <i className="fas fa-paper-plane text-sm"></i>
                </button>
              </div>
            </form>

            <div className="space-y-10">
              {selectedNews.comments.map(comment => {
                const isCommentLiked = user ? comment.likedByUserIds.includes(user.id) : false;
                return (
                  <div key={comment.id} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 transition-all hover:bg-slate-100/50">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-5">
                        <img src={`https://ui-avatars.com/api/?name=${comment.author}&background=random`} className="w-14 h-14 rounded-2xl shadow-md border-2 border-white" alt="" />
                        <div>
                          <span className="font-black text-slate-900 block text-xl">{comment.author}</span>
                          <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{new Date(comment.date).toLocaleDateString('ru-RU')}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all border-2 ${
                          isCommentLiked ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-100' : 'bg-white text-slate-400 border-slate-200 hover:border-red-400 hover:text-red-500'
                        }`}
                      >
                        <i className={`${isCommentLiked ? 'fas' : 'far'} fa-heart`}></i> {comment.likes}
                      </button>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-2xl font-medium">{comment.text}</p>
                  </div>
                );
              })}
              {selectedNews.comments.length === 0 && (
                <div className="text-center py-24 border-4 border-dashed border-slate-100 rounded-[4rem]">
                  <i className="far fa-comment-dots text-slate-200 text-6xl mb-6"></i>
                  <p className="text-slate-400 font-black text-2xl uppercase tracking-widest">Здесь пока тишина</p>
                </div>
              )}
            </div>
          </section>
        </article>
      );
    }

    return (
      <div className="space-y-20 animate-in fade-in duration-700">
        {currentPage === 'home' && (
          <section className="relative overflow-hidden rounded-[4rem] bg-slate-900 text-white p-12 md:p-28 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.3)]">
            <div className="absolute top-0 right-0 w-2/3 h-full opacity-40 pointer-events-none">
              <div className="absolute top-[-30%] right-[-20%] w-[150%] h-[150%] bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-900 rounded-full blur-[140px]"></div>
            </div>
            <div className="relative z-10 max-w-4xl">
              <div className="flex items-center gap-4 mb-10">
                <span className="px-5 py-2 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/50">
                  TechNova Original
                </span>
                <div className="w-1.5 h-1.5 bg-slate-600 rounded-full"></div>
                <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Май 2024</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black mb-10 leading-[0.9] tracking-tighter">
                Мир <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 italic">технологий</span> <br/>в одном месте.
              </h2>
              <p className="text-slate-400 text-xl md:text-3xl mb-14 leading-relaxed font-bold max-w-2xl">
                Эксклюзивные новости, глубокая аналитика и лучшие подкасты для тех, кто строит будущее.
              </p>
              <div className="flex flex-wrap gap-6">
                <button 
                  onClick={() => setCurrentPage('trends')}
                  className="bg-white text-slate-900 px-12 py-6 rounded-[2.5rem] font-black hover:scale-105 active:scale-95 transition-all flex items-center gap-4 shadow-2xl text-xl group"
                >
                  Тренды Сейчас <i className="fas fa-fire text-orange-500 group-hover:animate-pulse"></i>
                </button>
                <button 
                  onClick={() => setCurrentPage('podcasts')}
                  className="bg-slate-800/60 backdrop-blur-3xl text-white border-2 border-slate-700/50 px-12 py-6 rounded-[2.5rem] font-black hover:bg-slate-800 transition-all text-xl"
                >
                  Слушать Эфир
                </button>
              </div>
            </div>
          </section>
        )}

        <div className="pt-4">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-8 mb-12">
            <div>
              <h2 className="text-5xl font-black text-slate-900 mb-3 tracking-tighter">
                {currentPage === 'trends' ? 'Популярное Сейчас 🔥' : 'Свежие Публикации 🚀'}
              </h2>
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">
                {currentPage === 'trends' ? 'Материалы с наибольшим охватом' : 'Самые актуальные события индустрии'}
              </p>
            </div>
          </div>
        </div>

        <div className="sticky top-24 z-40 py-8 -mx-4 px-4 bg-slate-50/95 backdrop-blur-3xl">
          <div className="container mx-auto flex flex-col md:flex-row gap-8 items-center justify-between">
            {/* Added 'hide-scrollbar' class here */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto hide-scrollbar no-scrollbar">
              <button 
                onClick={() => setSelectedCategory('All')}
                className={`px-8 py-4 rounded-2xl text-xs font-black transition-all whitespace-nowrap border-2 uppercase tracking-widest ${
                  selectedCategory === 'All' 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-300 scale-105' 
                  : 'bg-white text-slate-400 border-slate-200 hover:border-slate-900 hover:text-slate-900'
                }`}
              >
                Все Темы
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-8 py-4 rounded-2xl text-xs font-black transition-all whitespace-nowrap border-2 uppercase tracking-widest flex items-center gap-3 ${
                    selectedCategory === cat.id 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-200 scale-105' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-blue-600 hover:text-blue-600'
                  }`}
                >
                  <i className={`fas ${cat.icon}`}></i>
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-[450px] group">
              <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors text-xl"></i>
              <input 
                type="text" 
                placeholder="Поиск по архиву TechNova..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-5 rounded-[2rem] border-2 border-slate-200 focus:border-blue-600 focus:ring-[15px] focus:ring-blue-50 outline-none transition-all font-black text-slate-800 shadow-sm text-lg placeholder:text-slate-200"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-40">
          {filteredNews.length > 0 ? (
            filteredNews.map(item => (
              <NewsCard 
                key={item.id} 
                news={item} 
                currentUserId={user?.id}
                onClick={handleNewsClick} 
                onLike={handleLikeNews}
              />
            ))
          ) : (
            <div className="col-span-full py-48 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
              <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 text-slate-200">
                <i className="fas fa-folder-open fa-4x"></i>
              </div>
              <h3 className="text-4xl font-black text-slate-300 mb-4 tracking-tighter uppercase">Архив пуст</h3>
              <p className="text-slate-400 font-bold text-xl">Ничего не найдено по вашему запросу</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-600 selection:text-white scroll-smooth">
      <Header 
        user={user} 
        onNavigate={(p) => { setCurrentPage(p); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
        onLogout={() => { setUser(null); setCurrentPage('home'); }} 
      />
      <main className="flex-grow container mx-auto px-4 py-16">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
