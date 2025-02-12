import React from 'react';
import { Bot, Dumbbell, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <Bot className="h-16 w-16 text-yellow-500 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-400 mb-4">
            Добро пожаловать в NeuroFit
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Революционная платформа, использующая искусственный интеллект для создания
            персонализированных программ тренировок
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-yellow-500">
            <Bot className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">ИИ-тренер</h3>
            <p className="text-gray-300">
              Умный алгоритм анализирует ваши показатели и адаптирует тренировки
              в режиме реального времени
            </p>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-yellow-500">
            <Dumbbell className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Умные тренировки</h3>
            <p className="text-gray-300">
              Персонализированные планы, созданные искусственным интеллектом
              специально под ваши цели
            </p>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-yellow-500">
            <Sparkles className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Прогресс</h3>
            <p className="text-gray-300">
              Продвинутая аналитика и рекомендации на основе машинного обучения
            </p>
          </div>
        </div>

        <div className="text-center space-y-8">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-gray-800/80 to-yellow-400 text-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Будущее фитнеса уже здесь</h2>
            <p className="text-lg">
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
