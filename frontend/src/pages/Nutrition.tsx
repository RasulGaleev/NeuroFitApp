import React, { useState, useEffect } from 'react';
// import { apiService } from '../services/api';

interface MealPlan {
  meal: string;
  description: string;
}

const Nutrition: React.FC = () => {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null); // Состояние для хранения плана питания

  useEffect(() => {
    // Функция для получения плана питания на сегодня
    const fetchMealPlan = async () => {
      try {
        // const response = await authAPI.getMealPlan();
        // setMealPlan(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке плана питания:', error);
      }
    };

    fetchMealPlan();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Питание</h1>

        {mealPlan ? (
          <div className="bg-gray-700 p-6 rounded-md">
            <h2 className="text-2xl text-yellow-500">{mealPlan.meal}</h2>
            <p className="text-gray-400">{mealPlan.description}</p>
          </div>
        ) : (
          <p className="text-gray-400">План питания на сегодня загружается...</p>
        )}
      </div>
    </div>
  );
};

export default Nutrition;
