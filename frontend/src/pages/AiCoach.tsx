import React, { useState } from 'react';
// import { apiService } from '../services/api';

const AiCoach: React.FC = () => {
  const [message, setMessage] = useState<string>(''); // Хранение введенного сообщения
  const [messages, setMessages] = useState<string[]>([]); // Хранение сообщений чата

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim()) {
      // Добавляем сообщение пользователя в чат
      setMessages([...messages, `Вы: ${message}`]);

      try {
        // Отправляем запрос на сервер с сообщением
        // const response = await apiService.askAiCoach({ message });

        // Добавляем ответ от ИИ тренера в чат
        // setMessages([...messages, `Вы: ${message}`, `ИИ Тренер: ${response.data.message}`]);
        setMessage(''); // Очищаем поле ввода
      } catch (error) {
        console.error('Ошибка при общении с ИИ:', error);
        setMessages([...messages, `Ошибка при общении с ИИ. Попробуйте позже.`]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">ИИ Тренер</h1>
        <div className="space-y-4 mb-6 h-96 overflow-y-auto p-4 bg-gray-700 rounded-lg">
          {messages.length === 0 ? (
            <p className="text-gray-400">Начните общение с ИИ тренером...</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="text-gray-100">{msg}</div>
            ))
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Напишите свой вопрос..."
            className="flex-1 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-400 transition"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiCoach;
