
import React from 'react';
import { NewsItem } from '../types';
import { CATEGORIES } from '../constants';

interface NewsCardProps {
  news: NewsItem;
  onClick: (news: NewsItem) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onClick }) => {
  const categoryInfo = CATEGORIES.find(c => c.id === news.category);

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={() => onClick(news)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={news.imageUrl} 
          alt={news.title} 
          className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm flex items-center gap-1.5">
            <i className={`fas ${categoryInfo?.icon || 'fa-tag'}`}></i>
            {categoryInfo?.label || news.category}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="font-medium text-slate-700">{news.author}</span>
          <span>•</span>
          <span>{new Date(news.date).toLocaleDateString('ru-RU')}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600">
          {news.title}
        </h3>
        <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
          {news.summary}
        </p>
        <div className="mt-auto flex items-center justify-between text-slate-400 text-xs font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <i className="far fa-eye"></i> {news.views}
            </span>
            <span className="flex items-center gap-1">
              <i className="far fa-comment"></i> {Math.floor(news.views / 20)}
            </span>
          </div>
          <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
            Читать <i className="fas fa-arrow-right ml-1"></i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
