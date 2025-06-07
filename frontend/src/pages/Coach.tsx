import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/api';
import { CoachGenerateType } from "../types/coach.ts";
import { Send, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MessageType } from '../types/coach';


const Coach: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);
  //
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/~~(.*?)~~/g, '<s>$1</s>')
      .replace(/^- (.*?)$/gm, '• $1')
      .replace(/^\d+\. (.*?)$/gm, '<ol><li>$1</li></ol>')
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-yellow-400 hover:text-yellow-300 underline" target="_blank" rel="noopener noreferrer">$1</a>');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!message.trim()) return;

    const newUserMessage = { role: "user", content: message.trim() };
    const updatedMessages = [...messages, newUserMessage];

    setMessages(updatedMessages);
    setMessage('');
    setLoading(true);

    try {
      const response = await apiService.getGenerate({ messages: updatedMessages } as CoachGenerateType);
      const aiMessage = { 
        role: "assistant", 
        content: response.data.answer,
        formattedContent: formatMessage(response.data.answer)
      };
      setMessages([...updatedMessages, aiMessage]);
    } catch (error: any) {
      console.error('Ошибка при общении с ИИ:', error);
      setError(error.response?.data?.error || 'Произошла ошибка при общении с тренером');
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Ваш персональный тренер</h1>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
          <div className="space-y-4 mb-6 h-[500px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-gray-300 text-center py-8">
                Задайте вопрос тренеру, чтобы начать общение
              </div>
            ) : (
              messages
                .filter(msg => msg.role !== "system")
                .map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-md ${
                        msg.role === "user" 
                          ? "bg-yellow-500 text-gray-900" 
                          : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">
                        {msg.role === "user" ? "Вы" : "Тренер"}
                      </div>
                      {msg.role === "user" ? (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      ) : (
                        <div
                          className="whitespace-pre-wrap prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: msg.formattedContent || msg.content }}
                        />
                      )}
                    </div>
                  </div>
                ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 p-3 rounded-md">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Напишите свой вопрос..."
              disabled={loading}
              className="flex-1 p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-400 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Coach;