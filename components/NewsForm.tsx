
import React, { useState, useRef } from 'react';
import { Category, NewsItem } from '../types';
import { CATEGORIES } from '../constants';

interface NewsFormProps {
  onSubmit: (news: Omit<NewsItem, 'id' | 'views' | 'date' | 'likes' | 'comments' | 'likedByUserIds'>) => void;
  onCancel: () => void;
  author: string;
}

const NewsForm: React.FC<NewsFormProps> = ({ onSubmit, onCancel, author }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState<Category>('AI');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/seed/' + Math.random() + '/800/400');
  const [isHot, setIsHot] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    if (!textAreaRef.current) return;
    const start = textAreaRef.current.selectionStart;
    const end = textAreaRef.current.selectionEnd;
    const text = textAreaRef.current.value;
    const beforeText = text.substring(0, start);
    const afterText = text.substring(end);
    const selectedText = text.substring(start, end);
    const newContent = beforeText + before + selectedText + after + afterText;
    setContent(newContent);
    
    // Reset focus and selection
    setTimeout(() => {
      textAreaRef.current?.focus();
      const newPos = start + before.length + selectedText.length + after.length;
      textAreaRef.current?.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !summary) {
      alert('Заполните все основные поля!');
      return;
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');
    const readTime = Math.ceil(content.length / 500) || 1;

    onSubmit({
      title,
      content,
      summary,
      category,
      imageUrl,
      author,
      tags,
      readTime,
      isHot
    });
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] p-6 md:p-12 border border-slate-200 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <i className="fas fa-edit text-2xl"></i>
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900">Редактор TechNova</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Создание профессионального контента</p>
          </div>
        </div>
        <button onClick={onCancel} className="w-12 h-12 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
          <i className="fas fa-times text-slate-400 text-xl"></i>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Main Editor Area */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Главный Заголовок</label>
              <input 
                className="w-full px-0 py-4 border-b-2 border-slate-100 focus:border-blue-600 outline-none transition-all text-4xl md:text-5xl font-black text-slate-900 placeholder:text-slate-200"
                type="text"
                placeholder="Назовите вашу историю..."
                value={title}
                maxLength={100}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-200 sticky top-28 z-20">
                <button type="button" onClick={() => insertText('# ', '')} className="px-3 py-2 hover:bg-white hover:shadow-sm rounded-xl font-black text-slate-700 transition-all">H1</button>
                <button type="button" onClick={() => insertText('## ', '')} className="px-3 py-2 hover:bg-white hover:shadow-sm rounded-xl font-bold text-slate-700 transition-all">H2</button>
                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                <button type="button" onClick={() => insertText('**', '**')} className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl text-slate-700 transition-all"><i className="fas fa-bold"></i></button>
                <button type="button" onClick={() => insertText('_', '_')} className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl text-slate-700 transition-all"><i className="fas fa-italic"></i></button>
                <div className="w-px h-6 bg-slate-200 mx-1"></div>
                <button type="button" onClick={() => insertText('[', '](https://...)')} className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl text-slate-700 transition-all"><i className="fas fa-link"></i></button>
                <button type="button" onClick={() => insertText('![alt](', ')')} className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl text-slate-700 transition-all"><i className="fas fa-image"></i></button>
                <button type="button" onClick={() => insertText('> ', '')} className="w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-xl text-slate-700 transition-all"><i className="fas fa-quote-left"></i></button>
                <div className="ml-auto flex items-center gap-2 px-3 text-xs font-bold text-slate-400">
                  <i className="fab fa-markdown"></i> Markdown поддержка
                </div>
              </div>
              
              <textarea 
                ref={textAreaRef}
                className="w-full h-[600px] px-0 py-4 focus:ring-0 outline-none transition-all resize-none text-xl leading-relaxed text-slate-700 placeholder:text-slate-200 font-medium"
                placeholder="Используйте инструменты выше, чтобы добавить заголовки, изображения и ссылки в текст..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-10">
            <div className="p-8 bg-slate-900 rounded-[2rem] text-white space-y-8 shadow-2xl">
              <h4 className="font-black text-sm uppercase tracking-[0.2em] text-blue-400 flex items-center gap-3">
                <i className="fas fa-sliders-h"></i> Параметры
              </h4>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Категория</label>
                <select 
                  className="w-full bg-slate-800 border-none rounded-2xl px-5 py-4 text-white font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Теги</label>
                <input 
                  className="w-full bg-slate-800 border-none rounded-2xl px-5 py-4 text-white font-bold placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 transition-all"
                  type="text"
                  placeholder="apple, tech, news"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-2xl border border-slate-700/50">
                <span className="text-xs font-black uppercase tracking-wider">🔥 Hot Trend</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={isHot} onChange={() => setIsHot(!isHot)} />
                  <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white"></div>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Превью-описание</label>
              <textarea 
                className="w-full h-32 px-5 py-4 rounded-[1.5rem] border-2 border-slate-100 focus:border-blue-600 outline-none transition-all resize-none text-sm font-medium text-slate-600"
                placeholder="Краткое саммари для карточки..."
                value={summary}
                maxLength={200}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Главное Изображение</label>
              <div className="relative group rounded-[1.5rem] overflow-hidden border-2 border-slate-100 aspect-video">
                <img src={imageUrl} className="w-full h-full object-cover" alt="Превью" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                   <input 
                    className="w-full bg-white/20 backdrop-blur-md border-none rounded-xl px-4 py-2 text-white text-[10px] font-bold outline-none"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="URL картинки..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-slate-100">
          <button 
            type="submit"
            className="flex-1 bg-blue-600 text-white font-black py-6 rounded-[2rem] hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-3 text-xl"
          >
            Опубликовать Материал <i className="fas fa-check-circle"></i>
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="px-12 py-6 bg-slate-100 text-slate-700 font-black rounded-[2rem] hover:bg-slate-200 transition-all text-xl"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
