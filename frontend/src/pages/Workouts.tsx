import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { WorkoutType, ExerciseType } from '../types/workouts';
import { Check, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Workouts: React.FC = () => {
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
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
      setWorkout(response.data);
    } catch (error: any) {
      console.error('Ошибка при загрузке тренировки:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
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
      setNotification('Тренировка успешно сгенерирована!');
      setTimeout(() => setNotification(null), 3000);
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
      setWorkout((prev: WorkoutType | null) => (prev ? { ...prev, completed: true } : prev));
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
    <div className="min-h-screen bg-gray-900 py-8 sm:py-12 px-4">
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-lg z-50 text-sm sm:text-base">
          {notification}
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">Тренировка на сегодня</h1>

          {workout?.completed ? (
            <div className="text-green-500 font-medium flex flex-col items-end">
              <span className="flex items-center gap-2 text-sm sm:text-base">
                <Check className="w-5 h-5"/>
                Тренировка выполнена
              </span>
              <span className="text-gray-400 text-xs sm:text-sm mt-1">
                Следующая тренировка будет доступна завтра
              </span>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              className="w-full sm:w-auto bg-yellow-500 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-400 transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5"/>
              Сгенерировать
            </button>
          )}
        </div>

        {workout ? (
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2">
                {workout.title}
              </h2>

              {!workout.completed && (
                <button
                  onClick={handleComplete}
                  className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
                >
                  <Check className="w-5 h-5"/>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {workout.plan.map((exercise: ExerciseType, index: number) => (
                <div
                  key={index}
                  className="bg-gray-700 rounded-md p-3 text-gray-100"
                >
                  <div className="font-medium text-sm sm:text-base">{exercise.name}</div>
                  <div className="text-xs sm:text-sm text-gray-300 mb-2">
                    {exercise.sets} подходов × {exercise.reps} повторений
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">
                    {exercise.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-gray-300 text-center py-8">
            <p className="text-lg sm:text-xl mb-2">Тренировка не сгенерирована</p>
            <p className="text-sm sm:text-base text-gray-400">Нажмите кнопку "Сгенерировать" для создания новой тренировки</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workouts;
