
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onNavigate: (page: 'home' | 'create' | 'auth') => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onNavigate, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
            <i className="fas fa-bolt text-lg"></i>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            TechNova
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => onNavigate('home')}
            className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
          >
            Главная
          </button>
          <button 
            className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
          >
            Тренды
          </button>
          <button 
            className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
          >
            Подкасты
          </button>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('create')}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
              >
                <i className="fas fa-plus"></i>
                <span className="hidden sm:inline">Создать новость</span>
              </button>
              <div className="relative group">
                <img 
                  src={user.avatar} 
                  alt={user.username} 
                  className="w-10 h-10 rounded-full border-2 border-blue-100 cursor-pointer"
                />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-semibold text-sm truncate">{user.username}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Выйти
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('auth')}
              className="text-slate-700 font-semibold border-2 border-slate-200 px-5 py-2 rounded-full hover:bg-slate-50 transition-all"
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
