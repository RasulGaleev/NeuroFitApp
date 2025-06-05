import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ProgressChart } from '../types';
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
import { Plus, Trash2 } from 'lucide-react';

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
  const [progress, setProgress] = useState<ProgressChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState('');
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
    if (!weight || !notes) return;

    try {
      const response = await apiService.createProgress({
        weight: parseFloat(weight),
        notes
      });
      setProgress([...progress, response.data]);
      setWeight('');
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
    labels: progress.map(p => new Date(p.created_at).toLocaleDateString()),
    datasets: [
      {
        label: 'Вес (кг)',
        data: progress.map(p => p.weight),
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
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
        text: 'График изменения веса',
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
        <h1 className="text-3xl font-bold text-gray-100 mb-8">Мой прогресс</h1>

        {progress.length > 0 ? (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-8">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="text-gray-400 text-center mb-8">
            Пока нет записей прогресса.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-8">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-2">Вес (кг)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                step="0.1"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Заметки</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-400 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Добавить запись
          </button>
        </form>

        <div className="space-y-4">
          {progress.map((entry) => (
            <div
              key={entry.id}
              className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-2xl font-semibold text-gray-100 mb-2">
                    {entry.weight} кг
                  </div>
                  <div className="text-gray-300">{entry.notes}</div>
                  <div className="text-sm text-gray-400 mt-2">
                    {new Date(entry.created_at).toLocaleDateString()}
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
