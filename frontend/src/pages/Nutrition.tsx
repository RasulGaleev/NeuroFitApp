import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NutritionPlan, Meal } from '../types/workouts';


const Nutrition: React.FC = () => {
  const [plan, setPlan] = useState<NutritionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchPlan();
  }, [navigate]);

  const fetchPlan = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await apiService.getLatestNutritionPlan();
      const latestPlan: NutritionPlan = response.data;

      if (!latestPlan || shouldGenerateNewPlan(latestPlan.date)) {
        await handleGenerate();
      } else {
        setPlan(latestPlan);
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
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await apiService.generateNutritionPlan();
      setPlan(response.data);
    } catch (error) {
      console.error('Ошибка при генерации плана питания:', error);
      if ((error as any).response?.status === 401) {
        navigate('/login');
      }
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
            Обновить
          </button>
        </div>

        {plan ? (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  План на {new Date(plan.date).toLocaleDateString()}
                </h2>
                <p className="text-gray-300">Общая калорийность: {plan.calories} ккал</p>
              </div>
            </div>

            {(['breakfast', 'lunch', 'dinner'] as const).map((mealKey) => {
              const meal = plan.nutrition[mealKey];
              return (
                <div
                  key={mealKey}
                  className="bg-gray-700 rounded-md p-4 mb-4"
                >
                  <h3 className="text-lg font-medium text-gray-100 mb-3">
                    {mealKey === 'breakfast' ? 'Завтрак' : mealKey === 'lunch' ? 'Обед' : 'Ужин'}
                  </h3>
                  <ul className="space-y-2 mb-3">
                    {meal.items.map((item, idx) => (
                      <li key={idx} className="text-gray-300">{item}</li>
                    ))}
                  </ul>
                  <div className="text-sm text-gray-400">
                    {meal.calories} ккал | Б: {meal.proteins}г | Ж: {meal.fats}г | У: {meal.carbs}г
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-300">Нет плана на сегодня</div>
        )}
      </div>
    </div>
  );
};

export default Nutrition;
