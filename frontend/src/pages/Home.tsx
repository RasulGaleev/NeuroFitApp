import React from 'react';
import { Bot, Dumbbell, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-20 relative">
        <div className="text-center mb-12 sm:mb-20">
          <div className="flex justify-center items-center mb-6 sm:mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
              <Bot className="h-16 w-16 sm:h-20 sm:w-20 text-yellow-500 relative z-10" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-400 mb-4 sm:mb-6">
            Добро пожаловать в NeuroFit
          </h1>
          <p className="text-lg sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Революционная платформа, использующая искусственный интеллект для создания
            персонализированных программ тренировок
          </p>
          <div className="mt-8 sm:mt-10">
            <Link 
              to="/workouts" 
              className="inline-flex items-center gap-2 bg-yellow-500 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
            >
              Начать тренироваться
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20">
          <div className="group bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-500/50 hover:border-yellow-500 hover:scale-105">
            <div className="bg-yellow-500/10 p-4 rounded-xl w-fit mb-4 sm:mb-6 group-hover:bg-yellow-500/20 transition-colors">
              <Bot className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">ИИ-тренер</h3>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Умный алгоритм анализирует ваши показатели и адаптирует тренировки
              в режиме реального времени
            </p>
          </div>

          <div className="group bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-500/50 hover:border-yellow-500 hover:scale-105">
            <div className="bg-yellow-500/10 p-4 rounded-xl w-fit mb-4 sm:mb-6 group-hover:bg-yellow-500/20 transition-colors">
              <Dumbbell className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Умные тренировки</h3>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Персонализированные планы, созданные искусственным интеллектом
              специально под ваши цели
            </p>
          </div>

          <div className="group bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-500/50 hover:border-yellow-500 hover:scale-105">
            <div className="bg-yellow-500/10 p-4 rounded-xl w-fit mb-4 sm:mb-6 group-hover:bg-yellow-500/20 transition-colors">
              <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-white">Прогресс</h3>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              Продвинутая аналитика и рекомендации на основе машинного обучения
            </p>
          </div>
        </div>

        <div className="text-center space-y-6 sm:space-y-8">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-gray-800/80 to-yellow-400/20 text-white p-6 sm:p-10 rounded-2xl shadow-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Будущее фитнеса уже здесь</h2>
            <p className="text-lg sm:text-xl leading-relaxed">
              NeuroFit использует передовые алгоритмы искусственного интеллекта,
              чтобы сделать ваши тренировки максимально эффективными
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
