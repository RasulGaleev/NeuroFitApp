from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.timezone import now


class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    class FitnessGoal(models.TextChoices):
        WEIGHT_LOSS = 'weight_loss', 'Похудение'
        MUSCLE_GAIN = 'muscle_gain', 'Набор массы'
        ENDURANCE = 'endurance', 'Выносливость'
        GENERAL = 'general_fitness', 'Общая физическая форма'

    class FitnessLevel(models.TextChoices):
        BEGINNER = 'beginner', 'Низкий'
        INTERMEDIATE = 'intermediate', 'Средний'
        ADVANCED = 'advanced', 'Высокий'

    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    goal = models.CharField(max_length=20, choices=FitnessGoal.choices, null=True, blank=True)
    fitness_level = models.CharField(max_length=20, choices=FitnessLevel.choices, null=True, blank=True)
    has_equipment = models.BooleanField(default=True)

    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(default=now)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = CustomUserManager()

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
