from rest_framework import serializers

from .models import CustomUser


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = (
            'username',
            'email',
            'password',
            'date_of_birth',
            'gender',
            'height_cm',
            'weight_kg',
            'goal',
        )

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Пароль должен содержать минимум 8 символов.")
        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            date_of_birth=validated_data.get('date_of_birth'),
            gender=validated_data.get('gender'),
            height_cm=validated_data.get('height_cm'),
            weight_kg=validated_data.get('weight_kg'),
            goal=validated_data.get('goal'),
        )
        return user

    def update(self, instance, validated_data):
        password = validated_data.get('password')
        if password:
            instance.set_password(password)

        for attr, value in validated_data.items():
            if attr != 'password':  # Пропускаем пароль
                setattr(instance, attr, value)

        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    bmi = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = (
            'id',
            'username',
            'email',
            'date_of_birth',
            'gender',
            'height_cm',
            'weight_kg',
            'goal',
            'is_admin',
            'created_at',
            'updated_at',
            'bmi',
        )
        read_only_fields = ('id', 'is_admin', 'created_at', 'updated_at')

    def get_bmi(self, obj):
        if obj.height_cm and obj.weight_kg:
            height_m = obj.height_cm / 100
            return round(obj.weight_kg / (height_m ** 2), 2)
        return None
