
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <i className="fas fa-bolt text-lg"></i>
              </div>
              <h2 className="text-2xl font-bold">TechNova</h2>
            </div>
            <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
              Главный источник новостей из мира технологий, программирования и инноваций. Будьте в курсе будущего сегодня.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"><i className="fab fa-telegram"></i></a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"><i className="fab fa-twitter"></i></a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"><i className="fab fa-github"></i></a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-6">Навигация</h3>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Главная</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Новости</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Статьи</a></li>
              <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-6">Категории</h3>
            <ul className="space-y-4 text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Искусственный интеллект</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Разработка ПО</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Кибербезопасность</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Гаджеты</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} TechNova. Все права защищены. Разработано с использованием Gemini AI.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
