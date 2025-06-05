from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users.models import CustomUser
from .models import Nutrition
from datetime import date, timedelta


class NutritionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.list_url = reverse('nutrition-list')
        self.generate_url = reverse('nutrition-generate')
        self.latest_url = reverse('nutrition-latest')
        
        # Создаем тестовые планы питания
        self.plan1 = Nutrition.objects.create(
            user=self.user,
            meals={
                'breakfast': {
                    'items': ['Овсянка', 'Банан'],
                    'calories': 300,
                    'proteins': 10,
                    'fats': 5,
                    'carbs': 50
                }
            },
            date=date.today()
        )
        self.plan2 = Nutrition.objects.create(
            user=self.user,
            meals={
                'lunch': {
                    'items': ['Куриная грудка', 'Рис'],
                    'calories': 500,
                    'proteins': 30,
                    'fats': 10,
                    'carbs': 60
                }
            },
            date=date.today() - timedelta(days=1)
        )

    def test_list_nutrition(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_filter_nutrition(self):
        # Фильтр по дате
        response = self.client.get(f"{self.list_url}?date={date.today()}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Фильтр по типу приема пищи
        response = self.client.get(f"{self.list_url}?meal_type=breakfast")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_latest_nutrition(self):
        response = self.client.get(self.latest_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.plan1.id)
        self.assertEqual(response.data['date'].strftime('%Y-%m-%d'), date.today().strftime('%Y-%m-%d'))

    def test_generate_nutrition(self):
        response = self.client.post(self.generate_url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)
        self.assertIn('date', response.data)
        self.assertIn('meals', response.data)
        self.assertIn('breakfast', response.data['meals'])
        self.assertIn('lunch', response.data['meals'])
        self.assertIn('dinner', response.data['meals'])

    def test_meal_structure(self):
        response = self.client.post(self.generate_url)
        for meal_type in ['breakfast', 'lunch', 'dinner']:
            meal = response.data['meals'][meal_type]
            self.assertIn('items', meal)
            self.assertIn('calories', meal)
            self.assertIn('proteins', meal)
            self.assertIn('fats', meal)
            self.assertIn('carbs', meal)
            self.assertIsInstance(meal['items'], list)
