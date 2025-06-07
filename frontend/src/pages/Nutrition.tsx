import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { NutritionType } from '../types/nutrition';
import { RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Nutrition: React.FC = () => {
  const [nutrition, setNutrition] = useState<NutritionType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchNutrition();
  }, [navigate]);

  const fetchNutrition = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await apiService.getLatestNutritionPlan();
      const latestPlan: NutritionType = response.data;

      if (!latestPlan || shouldGenerateNewPlan(latestPlan.date)) {
        await handleGenerate();
      } else {
        setNutrition(latestPlan);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        await handleGenerate();
      } else {
        console.error('Ошибка при загрузке плана питания:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const shouldGenerateNewPlan = (planDate: string) => {
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

      const response = await apiService.generateNutritionPlan();
      setNutrition(response.data);
    } catch (error: any) {
      console.error('Ошибка при генерации плана питания:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">План питания</h1>
          <button
            onClick={handleGenerate}
            className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-400 transition flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Сгенерировать
          </button>
        </div>

        {nutrition ? (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  {new Date(nutrition.date).toLocaleDateString()}
                </h2>
                <p className="text-gray-300">Общая калорийность: {nutrition.calories} ккал</p>
              </div>
            </div>

            <div className="space-y-3">
              {(['breakfast', 'lunch', 'dinner'] as const).map((mealKey) => {
                const meal = nutrition.meals[mealKey];
                return (
                  <div
                    key={mealKey}
                    className="bg-gray-700 rounded-md p-3 text-gray-100"
                  >
                    <div className="font-medium mb-2">
                      {mealKey === 'breakfast' ? 'Завтрак' : mealKey === 'lunch' ? 'Обед' : 'Ужин'}
                    </div>
                    <ul className="text-sm text-gray-300 mb-2">
                      {meal.items.map((item, idx) => (
                        <li key={idx}>{item} - {meal.grams[idx]}г</li>
                      ))}
                    </ul>
                    <div className="text-sm text-gray-400">
                      {meal.calories} ккал | Б: {meal.proteins}г | Ж: {meal.fats}г | У: {meal.carbs}г
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-gray-300 text-center py-8">
            Нет доступного плана питания
          </div>
        )}
      </div>
    </div>
  );
};

export default Nutrition;
