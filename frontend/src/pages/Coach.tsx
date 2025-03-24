import React, { useState } from 'react';
import { apiService } from '../services/api';
import { CoachGenerateType } from "../types/coach.ts";

const Coach: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {role: "system", content: "Ты — профессиональный фитнес-тренер."}
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim()) {
      const newUserMessage = {role: "user", content: message};
      const updatedMessages = [...messages, newUserMessage];

      setMessages(updatedMessages);
      setMessage('');
      try {
        const response = await apiService.getGenerate({messages: updatedMessages} as CoachGenerateType);
        console.log(response);

        const aiMessage = {role: "assistant", content: response.data.answer};
        setMessages([...updatedMessages, aiMessage]);
      } catch (error) {
        console.error('Ошибка при общении с ИИ:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Ваш персональный тренер</h1>
        <div className="space-y-4 mb-6 h-96 overflow-y-auto p-4 bg-gray-700 rounded-lg">
          {messages
            .filter(msg => msg.role !== "system")
            .map((msg, index) => (
              <div key={index} className="text-gray-100">
                <strong>{msg.role === "user" ? "Вы" : "Тренер"}:</strong> {msg.content}
              </div>
            ))}
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

export default Coach;