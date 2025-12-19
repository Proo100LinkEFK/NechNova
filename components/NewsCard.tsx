
import React from 'react';
import { NewsItem } from '../types';
import { CATEGORIES } from '../constants';

interface NewsCardProps {
  news: NewsItem;
  currentUserId?: string;
  onClick: (news: NewsItem) => void;
  onLike?: (id: string, e: React.MouseEvent) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, currentUserId, onClick, onLike }) => {
  const categoryInfo = CATEGORIES.find(c => c.id === news.category);
  const isLiked = currentUserId ? news.likedByUserIds.includes(currentUserId) : false;

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full relative group"
      onClick={() => onClick(news)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={news.imageUrl} 
          alt={news.title} 
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 shadow-sm flex items-center gap-1.5 uppercase tracking-wider">
            <i className={`fas ${categoryInfo?.icon || 'fa-tag'}`}></i>
            {categoryInfo?.label || news.category}
          </span>
          {news.isHot && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm animate-pulse">
              HOT
            </span>
          )}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onLike?.(news.id, e); }}
          className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-red-500 backdrop-blur-md hover:scale-110'
          }`}
        >
          <i className={`${isLiked ? 'fas' : 'far'} fa-heart`}></i>
        </button>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="font-medium text-slate-700">{news.author}</span>
          <span>•</span>
          <span>{news.readTime} мин чт.</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {news.title}
        </h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {news.summary}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {news.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] font-semibold text-slate-400 border border-slate-100 px-2 py-0.5 rounded uppercase">#{tag}</span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between text-slate-400 text-xs font-medium">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <i className="far fa-eye"></i> {news.views}
            </span>
            <span className="flex items-center gap-1">
              <i className={`fa-heart ${isLiked ? 'fas text-red-500' : 'far text-red-400'}`}></i> {news.likes}
            </span>
            <span className="flex items-center gap-1">
              <i className="far fa-comment"></i> {news.comments.length}
            </span>
          </div>
          <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
            Подробнее <i className="fas fa-arrow-right ml-1"></i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
