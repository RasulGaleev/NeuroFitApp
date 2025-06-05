from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users.models import CustomUser
from .models import Workout
from datetime import date, timedelta

class WorkoutTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.list_url = reverse('workouts-list')
        self.generate_url = reverse('workouts-generate')
        self.latest_url = reverse('workouts-latest')

        # Создаем тестовые тренировки
        self.workout1 = Workout.objects.create(
            user=self.user,
            plan=[{"exercise": "Push-ups", "sets": 3, "reps": 10}],
            date=date.today()
        )
        self.workout2 = Workout.objects.create(
            user=self.user,
            plan=[{"exercise": "Squats", "sets": 3, "reps": 15}],
            date=date.today() - timedelta(days=1),
            completed=True
        )

    def test_list_workouts(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_workouts(self):
        # Фильтр по дате
        response = self.client.get(f"{self.list_url}?date={date.today()}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Фильтр по статусу
        response = self.client.get(f"{self.list_url}?completed=true")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_latest_workout(self):
        response = self.client.get(self.latest_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.workout1.id)
        self.assertEqual(response.data['date'].strftime('%Y-%m-%d'), date.today().strftime('%Y-%m-%d'))

    def test_generate_workout(self):
        response = self.client.post(self.generate_url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)
        self.assertIn('date', response.data)
        self.assertIn('plan', response.data)
        self.assertIn('completed', response.data)
        self.assertFalse(response.data['completed'])

    def test_complete_workout(self):
        complete_url = reverse('workouts-complete', args=[self.workout1.id])
        response = self.client.post(complete_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'workout completed')
        
        # Проверяем что тренировка отмечена как выполненная
        workout = Workout.objects.get(id=self.workout1.id)
        self.assertTrue(workout.completed)
