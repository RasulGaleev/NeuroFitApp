import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ProgressChartType } from '../types/blog.ts';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Plus, Trash2, Upload } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Progress: React.FC = () => {
  const [progress, setProgress] = useState<ProgressChartType[]>([]);
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await apiService.getProgress();
      setProgress(response.data.results || []);
    } catch (error) {
      console.error('Ошибка при загрузке прогресса:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !height) return;

    const formData = new FormData();
    formData.append('weight', weight);
    formData.append('height', height);
    formData.append('notes', notes);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      const response = await apiService.createProgress(formData);
      setProgress([...progress, response.data]);
      setWeight('');
      setHeight('');
      setPhoto(null);
      setNotes('');
    } catch (error) {
      console.error('Ошибка при добавлении записи:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiService.deleteProgress(id);
      setProgress(progress.filter(p => p.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении записи:', error);
    }
  };

  const chartData = {
    labels: progress.map(p => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Вес (кг)',
        data: progress.map(p => p.weight),
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
        tension: 0.4
      },
      {
        label: 'Рост (см)',
        data: progress.map(p => p.height),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(229, 231, 235)'
        }
      },
      title: {
        display: true,
        text: 'График изменений',
        color: 'rgb(229, 231, 235)'
      }
    },
    scales: {
      y: {
        ticks: {
          color: 'rgb(229, 231, 235)'
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        }
      },
      x: {
        ticks: {
          color: 'rgb(229, 231, 235)'
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        }
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
          <h1 className="text-3xl font-bold text-gray-100">Мой прогресс</h1>
        </div>

        {progress.length > 0 ? (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-8">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="text-gray-300 text-center mb-8">
            Пока нет записей прогресса.
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-2">Вес (кг)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  step="0.1"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Рост (см)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Фото</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="hidden"
                  id="photo"
                  accept="image/*"
                />
                <label
                  htmlFor="photo"
                  className="flex-1 p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 cursor-pointer hover:bg-gray-600 transition"
                >
                  {photo ? photo.name : 'Выберите фото'}
                </label>
                <button
                  type="button"
                  onClick={() => document.getElementById('photo')?.click()}
                  className="bg-gray-700 text-gray-100 p-3 rounded-md hover:bg-gray-600 transition"
                >
                  <Upload className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Заметки</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-400 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Добавить запись
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {progress.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-2xl font-semibold text-gray-100 mb-2">
                    {entry.weight} кг / {entry.height} см
                  </div>
                  {entry.photo && (
                    <img
                      src={entry.photo}
                      alt="Progress"
                      className="w-32 h-32 object-cover rounded-md mb-2"
                    />
                  )}
                  <div className="text-gray-300">{entry.notes}</div>
                  <div className="text-sm text-gray-400 mt-2">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;
