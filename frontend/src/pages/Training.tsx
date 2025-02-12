import React, { useState, useEffect } from 'react';
// import { apiService } from '../services/api';

interface Exercise {
  id: string;
  name: string;
  description: string;
}

const Training: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('chest'); // Состояние для выбранной группы мышц
  const [exercises, setExercises] = useState<Exercise[]>([]); // Состояние для хранения упражнений

  useEffect(() => {
    // Функция для загрузки упражнений по выбранной группе мышц
    const fetchExercises = async () => {
      try {
        // const response = await authAPI.getExercises({ group: selectedGroup });
        // setExercises(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке тренировок:', error);
      }
    };
    fetchExercises();
  }, [selectedGroup]);

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Тренировки</h1>
        <div>
          {exercises.length === 0 ? (
            <p className="text-gray-400">Здесь будут отображаться упражнения...</p>
          ) : (
            exercises.map((exercise) => (
              <div key={exercise.id} className="bg-gray-700 p-4 rounded-md mb-4">
                <h3 className="text-xl text-yellow-500">{exercise.name}</h3>
                <p className="text-gray-400">{exercise.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Training;
