import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Edit, Upload } from 'lucide-react';
import { apiService } from '../services/api';
import { ProfileType } from '../types/user';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ProfileType>({
    date_of_birth: '',
    gender: undefined,
    height: 0,
    weight: 0,
    goal: undefined,
    fitness_level: undefined,
    has_equipment: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProfile();
        if (response.data) {
          const profile = response.data;
          setFormData({
            date_of_birth: profile.date_of_birth || '',
            gender: profile.gender,
            height: profile.height || 0,
            weight: profile.weight || 0,
            goal: profile.goal,
            fitness_level: profile.fitness_level,
            has_equipment: profile.has_equipment || false,
          });

          if (profile.avatar) {
            setAvatar(profile.avatar);
          }

          if (user) {
            setUser({
              ...user,
              profile,
            });
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.profile) {
      setFormData({
        date_of_birth: user.profile.date_of_birth || '',
        gender: user.profile.gender,
        height: user.profile.height || 0,
        weight: user.profile.weight || 0,
        goal: user.profile.goal,
        fitness_level: user.profile.fitness_level,
        has_equipment: user.profile.has_equipment || false,
      });
      if (user.profile.avatar) {
        setAvatar(user.profile.avatar);
      }
      setLoading(false);
    } else {
      fetchProfile();
    }
  }, [user?.id]);

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          form.append(key, value.toString());
        }
      });

      if (avatarFile) form.append('avatar', avatarFile);

      const { data } = await apiService.updateProfile(form);
      if (user) setUser({ ...user, profile: data });
      setIsEditing(false);
      setAvatarFile(null);
    } catch (error) {
      console.error('Ошибка при обновлении данных профиля', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-yellow-500 text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-yellow-500 text-xl">Пользователь не найден</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div
              onClick={handleAvatarClick}
              className="relative cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-yellow-500">
                    <span className="text-3xl text-white">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0 bg-yellow-500 p-1 rounded-full">
                  <Upload className="h-4 w-4 text-white" />
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-100">{user.username}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 text-gray-300 hover:text-yellow-500"
          >
            <Edit className="h-5 w-5" />
            <span>{isEditing ? 'Отменить' : 'Редактировать'}</span>
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Дата рождения
                  </label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    min="1925-01-01"
                    onChange={(e) =>
                      setFormData({ ...formData, date_of_birth: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Пол
                  </label>
                  <select
                    value={formData.gender || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | undefined })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  >
                    <option value="">Выберите пол</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Рост (см)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="250"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: parseInt(e.target.value) })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Вес (кг)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="200"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({...formData, weight: parseFloat(e.target.value)})
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Цель
                  </label>
                  <select
                    value={formData.goal || ''}
                    onChange={(e) =>
                      setFormData({...formData, goal: e.target.value as 'weight_loss' | 'muscle_gain' | 'endurance' | 'general_fitness' | undefined})
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  >
                    <option value="">Выберите цель</option>
                    <option value="weight_loss">Похудение</option>
                    <option value="muscle_gain">Набор мышечной массы</option>
                    <option value="endurance">Увеличение выносливости</option>
                    <option value="general_fitness">Общая физическая форма</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Уровень подготовки
                  </label>
                  <select
                    value={formData.fitness_level || ''}
                    onChange={(e) =>
                      setFormData({...formData, fitness_level: e.target.value as 'beginner' | 'intermediate' | 'advanced' | undefined})
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                  >
                    <option value="">Выберите уровень</option>
                    <option value="beginner">Начинающий</option>
                    <option value="intermediate">Средний</option>
                    <option value="advanced">Продвинутый</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="has_equipment"
                    checked={formData.has_equipment}
                    onChange={(e) =>
                      setFormData({ ...formData, has_equipment: e.target.checked })
                    }
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="has_equipment" className="ml-2 block text-sm text-gray-300">
                    У меня есть спортивное оборудование
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Сохранить изменения
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-300">Дата рождения</h3>
                <p className="mt-1 text-lg text-gray-100">
                  {user.profile?.date_of_birth || 'Не указано'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-300">Пол</h3>
                <p className="mt-1 text-lg text-gray-100">
                  {user.profile?.gender === 'male' ? 'Мужской' : user.profile?.gender === 'female' ? 'Женский' : 'Не указано'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-300">Рост (см)</h3>
                <p className="mt-1 text-lg text-gray-100">
                  {user.profile?.height || 'Не указано'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-300">Вес (кг)</h3>
                <p className="mt-1 text-lg text-gray-100">
                  {user.profile?.weight || 'Не указано'}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-300">Цель</h3>
                <p className="mt-1 text-lg text-gray-100">
                  {user.profile?.goal === 'weight_loss'
                    ? 'Похудение'
                    : user.profile?.goal === 'muscle_gain'
                      ? 'Набор мышечной массы'
                      : user.profile?.goal === 'endurance'
                        ? 'Увеличение выносливости'
                        : user.profile?.goal === 'general_fitness'
                          ? 'Общая физическая форма'
                          : 'Не указано'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-300">Уровень подготовки</h3>
                <p className="mt-1 text-lg text-gray-100">
                  {user.profile?.fitness_level === 'beginner'
                    ? 'Начинающий'
                    : user.profile?.fitness_level === 'intermediate'
                      ? 'Средний'
                      : user.profile?.fitness_level === 'advanced'
                        ? 'Продвинутый'
                        : 'Не указано'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-300">Спортивное оборудование</h3>
                <p className="mt-1 text-lg text-gray-100">
                  {user.profile?.has_equipment ? 'Есть' : 'Нет'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;