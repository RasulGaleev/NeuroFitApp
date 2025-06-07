import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Workout } from '../types/workouts';
import { Check, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Workouts: React.FC = () => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchWorkout();
  }, [navigate]);

  const fetchWorkout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await apiService.getLatestWorkout();
      const latestWorkout: Workout = response.data;

      if (!latestWorkout || shouldGenerateNewWorkout(latestWorkout.date)) {
        await handleGenerate();
      } else {
        setWorkout(latestWorkout);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Нет тренировки — генерируем новую
        await handleGenerate();
      } else {
        console.error('Ошибка при загрузке тренировки:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const shouldGenerateNewWorkout = (planDate: string) => {
    const planDay = new Date(planDate).toDateString();
    const today = new Date().toDateString();
    return planDay !== today;
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await apiService.generateWorkout();
      setWorkout(response.data);
    } catch (error: any) {
      console.error('Ошибка при генерации тренировки:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!workout) return;
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      await apiService.completeWorkout(workout.id);
      setWorkout(prev => (prev ? { ...prev, completed: true } : prev));
      setNotification('Тренировка успешно выполнена!');
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Ошибка при завершении тренировки:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-yellow-500 text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
          {notification}
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Тренировка на сегодня</h1>
          {workout?.completed ? (
            <div className="text-green-500 font-medium flex items-center gap-2">
              <Check className="w-5 h-5" />
              Тренировка выполнена
              <span className="text-gray-400 text-sm">(Следующая тренировка будет доступна завтра)</span>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-400 transition flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Сгенерировать
            </button>
          )}
        </div>

        {workout ? (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  {new Date(workout.date).toLocaleDateString()}
                </h2>
              </div>
              {!workout.completed && (
                <button
                  onClick={handleComplete}
                  className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
                >
                  <Check className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {workout.plan.map((exercise, index) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded-md p-3 text-gray-100"
                >
                  <div className="font-medium">{exercise.name}</div>
                  <div className="text-sm text-gray-300 mb-2">
                    {exercise.sets} подходов × {exercise.reps} повторений
                  </div>
                  <div className="text-sm text-gray-400">
                    {exercise.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-gray-300 text-center py-8">
            Нет доступной тренировки
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;
