
import React, { useState } from 'react';
import { Category, NewsItem } from '../types';
import { CATEGORIES } from '../constants';

interface NewsFormProps {
  onSubmit: (news: Omit<NewsItem, 'id' | 'views' | 'date'>) => void;
  onCancel: () => void;
  author: string;
}

const NewsForm: React.FC<NewsFormProps> = ({ onSubmit, onCancel, author }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState<Category>('AI');
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/seed/tech/800/400');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !summary) {
      alert('Заполните все поля!');
      return;
    }
    onSubmit({
      title,
      content,
      summary,
      category,
      imageUrl,
      author,
    });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <i className="fas fa-pen-nib text-blue-600"></i>
        Создать новость
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Текст новости</label>
          <textarea 
            className="w-full h-48 px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
            placeholder="О чем вы хотите рассказать IT сообществу?..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Заголовок</label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              type="text"
              placeholder="Коротко и ясно"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Категория</label>
            <select 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Краткое описание (Summary)</label>
          <input 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            type="text"
            placeholder="О чем эта статья в одном предложении"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Ссылка на обложку</label>
          <input 
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-100">
          <button 
            type="submit"
            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Опубликовать
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;
