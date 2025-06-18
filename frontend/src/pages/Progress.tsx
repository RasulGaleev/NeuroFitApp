import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ProgressChartType } from '../types/progress';
import { ProfileType } from '../types/user';
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
import { Plus, Trash2, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

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
  const [expandedDates, setExpandedDates] = useState<{ [key: string]: boolean }>({});
  const [profile, setProfile] = useState<ProfileType | null>(null);

  useEffect(() => {
    fetchProgress();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await apiService.getProfile();
      setProfile(response.data);
      if (response.data.weight) setWeight(response.data.weight.toString());
      if (response.data.height) setHeight(response.data.height.toString());
    } catch (error) {
      console.error('Ошибка при загрузке профиля:', error);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await apiService.getProgress();
      const progressData = Array.isArray(response.data) ? response.data : (response.data as { results: ProgressChartType[] }).results;
      setProgress(progressData);
      const dates = progressData.reduce((acc: { [key: string]: boolean }, entry: ProgressChartType) => {
        acc[entry.date] = false;
        return acc;
      }, {});
      setExpandedDates(dates);
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
    const today = new Date().toISOString().split('T')[0];
    formData.append('date', today);
    formData.append('weight', weight);
    formData.append('height', height);
    formData.append('notes', notes);
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      await apiService.createProgress(formData);
      await apiService.updateProfile({ 
        weight: parseFloat(weight), 
        height: parseInt(height),
        date_of_birth: profile?.date_of_birth || '',
        has_equipment: profile?.has_equipment || false
      });
      await fetchProgress();
      await fetchProfile();
      setWeight('');
      setHeight('');
      setPhoto(null);
      setNotes('');
      toast.success('Запись успешно добавлена');
    } catch (error) {
      console.error('Ошибка при добавлении записи:', error);
      toast.error('Ошибка при добавлении записи');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      try {
        await apiService.deleteProgress(id);
        await fetchProgress();
        toast.success('Запись успешно удалена');
      } catch (error) {
        console.error('Ошибка при удалении записи:', error);
        toast.error('Ошибка при удалении записи');
      }
    }
  };

  const sortedProgress = [...progress].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartData = {
    labels: sortedProgress.map(p => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Вес (кг)',
        data: sortedProgress.map(p => p.weight),
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
        tension: 0.4
      },
      {
        label: 'Рост (см)',
        data: sortedProgress.map(p => p.height),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      },
      {
        label: 'ИМТ',
        data: sortedProgress.map(p => p.bmi),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
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

  const toggleDate = (date: string) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
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
                  required
                  step="0.1"
                  min="20"
                  max="200"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Рост (см)</label>
                <input
                  type="number"
                  required
                  min="50"
                  max="250"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
          {Object.entries(progress.reduce((acc, entry) => {
            const date = entry.date;
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(entry);
            return acc;
          }, {} as { [key: string]: ProgressChartType[] }))
          .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
          .map(([date, entries]) => (
            <div key={date} className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleDate(date)}
              >
                <div className="text-xl font-semibold text-gray-100">
                  {new Date(date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
                <button className="text-gray-400 hover:text-yellow-500 transition">
                  {expandedDates[date] ? (
                    <ChevronUp className="w-6 h-6" />
                  ) : (
                    <ChevronDown className="w-6 h-6" />
                  )}
                </button>
              </div>
              {expandedDates[date] && (
                <div className="mt-4 space-y-4">
                  {entries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((entry) => (
                    <div key={entry.id} className="flex justify-between items-start bg-gray-700/50 p-4 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-2xl font-semibold text-gray-100">
                            {entry.weight} кг / {entry.height} см
                          </div>
                          {entry.bmi && (
                            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                              ИМТ: {entry.bmi}
                            </div>
                          )}
                        </div>
                        {entry.photo && (
                          <img
                            src={entry.photo}
                            alt="Progress"
                            className="w-32 h-32 object-cover rounded-md mb-4"
                          />
                        )}
                        {entry.notes && (
                          <div className="text-gray-300 mb-4">{entry.notes}</div>
                        )}
                        <div className="text-sm text-gray-400">
                          {new Date(entry.created_at).toLocaleTimeString('ru-RU')}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-gray-400 hover:text-red-500 transition ml-4"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;
