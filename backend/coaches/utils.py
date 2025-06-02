from users.models import CustomUser


def get_system_message(user: CustomUser):
    username = user.username
    birth_date = getattr(user, "date_of_birth", None)
    formatted_birth_date = birth_date.strftime('%d.%m.%Y') if birth_date else "Не указана"
    gender = getattr(user, "gender", "Не указан")
    height = getattr(user, "height", "Не указан")
    weight = getattr(user, "weight", "Не указан")
    goal = user.get_goal_display() if user.goal else "Не указана"
    has_equipment = getattr(user, "has_equipment", True)

    return {
        "role": "system",
        "content": (
            f"Ты — профессиональный персональный фитнес-тренер.\n"
            f"Твой клиент: {username}, {formatted_birth_date} года рождения. "
            f"Его главная цель: {goal}.\n\n"
            f"Параметры тела:\n"
            f"Пол: {gender}\nРост: {height} см\nВес: {weight} кг.\n\n"
            f"Наличие оборудования: {'Есть' if has_equipment else 'Нет'}\n\n"
            f"Твоя задача: отвечать на вопросы, консультировать и помогать ему в достижении цели."
        )
    }


nutrition_instruction = {
    "role": "user",
    "content": (
        "Составь план питания на день, строго в формате JSON.\n"
        "Укажи три приёма пищи: завтрак, обед и ужин. Для каждого приёма пищи укажи:\n"
        "- список блюд или продуктов\n"
        "- количество калорий\n"
        "- БЖУ (белки, жиры, углеводы) в граммах\n\n"
        "В конце укажи общее количество калорий за день в поле 'calories'.\n\n"
        "Формат ответа:\n"
        "{\n"
        "  \"meals\": {\n"
        "    \"breakfast\": {\n"
        "      \"items\": [\"Овсянка на воде с бананом\", \"Яйцо варёное\"],\n"
        "      \"calories\": 350,\n"
        "      \"proteins\": 18,\n"
        "      \"fats\": 12,\n"
        "      \"carbs\": 45\n"
        "    },\n"
        "    \"lunch\": {\n"
        "      \"items\": [\"Гречка с куриной грудкой\", \"Салат из овощей\"],\n"
        "      \"calories\": 550,\n"
        "      \"proteins\": 35,\n"
        "      \"fats\": 15,\n"
        "      \"carbs\": 60\n"
        "    },\n"
        "    \"dinner\": {\n"
        "      \"items\": [\"Тушёные овощи\", \"Нежирный творог\"],\n"
        "      \"calories\": 400,\n"
        "      \"proteins\": 25,\n"
        "      \"fats\": 10,\n"
        "      \"carbs\": 30\n"
        "    }\n"
        "  },\n"
        "  \"calories\": 1300\n"
        "}\n\n"
        "Отвечай **только JSON-объектом**, без пояснений и комментариев."
    )
}

workout_instruction = {
    "role": "user",
    "content": (
        "Составь план тренировки на день, строго в формате JSON.\n"
        "Укажи список упражнений, для каждого упражнения укажи:\n"
        "- название упражнения\n"
        "- количество подходов\n"
        "- количество повторений в подходе\n"
        "- краткое описание техники выполнения\n\n"
        "Формат ответа:\n"
        "{\n"
        "  \"workout\": [\n"
        "    {\n"
        "      \"name\": \"Приседания со штангой\",\n"
        "      \"sets\": 4,\n"
        "      \"reps\": 12,\n"
        "      \"description\": \"Стой прямо, ноги на ширине плеч, присядь, держа спину прямо\"\n"
        "    },\n"
        "    {\n"
        "      \"name\": \"Отжимания\",\n"
        "      \"sets\": 3,\n"
        "      \"reps\": 15,\n"
        "      \"description\": \"Руки на ширине плеч, опускай тело до касания грудью пола\"\n"
        "    }\n"
        "  ]\n"
        "}\n\n"
        "Отвечай **только JSON-объектом**, без пояснений и комментариев."
    )
}
