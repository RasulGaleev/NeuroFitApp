from typing import Optional

from users.models import CustomUser


def get_system_message(user: CustomUser, task: Optional[str] = None) -> dict:
    username = user.username
    birth_date = getattr(user, "date_of_birth", None)
    formatted_birth_date = birth_date.strftime('%d.%m.%Y') if birth_date else "Не указана"
    gender = getattr(user, "gender", "Не указан")
    height = getattr(user, "height", "Не указан")
    weight = getattr(user, "weight", "Не указан")
    goal = user.get_goal_display() if user.goal else "Не указана"
    fitness_level = user.get_fitness_level_display() if user.fitness_level else "Не указан"
    has_equipment = getattr(user, "has_equipment", True)

    base_message = (
        f"Ты — профессиональный персональный фитнес-тренер.\n"
        f"Твой клиент: {username}, дата рождения: {formatted_birth_date}.\n"
        f"Главная цель клиента: {goal}.\n"
        f"Уровень физической подготовки: {fitness_level}.\n"
        f"Параметры тела:\n"
        f"- Пол: {gender}\n"
        f"- Рост: {height} см\n"
        f"- Вес: {weight} кг\n"
        f"Наличие оборудования: {'да' if has_equipment else 'нет'}.\n"
    )

    if task == "nutrition":
        message = base_message + (
            "\nТвоя задача — составить разнообразный план питания на один день, "
            "исходя из параметров клиента и его цели. "
            "Калорийность должна быть:\n\n"
            "1. Для похудения: минимум 1500 ккал\n"
            "2. Для поддержания веса: минимум 2000 ккал\n"
            "3. Для набора мышечной массы: минимум 3000 ккал\n\n"
            "План должен содержать три приёма пищи: завтрак, обед и ужин.\n"
            "Для каждого приёма пищи укажи:\n"
            "- список блюд или продуктов (короткие, конкретные названия)\n"
            "- количество калорий на приём пищи\n"
            "- количество белков, жиров и углеводов (БЖУ) в граммах\n\n"
            "В конце добавь поле с общим количеством калорий за весь день (ключ \"calories\"), "
            "которое соответствует расчетам с учетом веса и цели.\n\n"
            "Строго соблюдай формат JSON, пример структуры:\n"
            "{\n"
            "  \"meals\": {\n"
            "    \"breakfast\": {\"items\": [\"продукт1\", \"продукт2\"], \"grams\": [0, 0], \"calories\": 0, \"proteins\": 0, \"fats\": 0, \"carbs\": 0},\n"
            "    \"lunch\": {\"items\": [\"продукт1\", \"продукт2\"], \"grams\": [0, 0], \"calories\": 0, \"proteins\": 0, \"fats\": 0, \"carbs\": 0},\n"
            "    \"dinner\": {\"items\": [\"продукт1\", \"продукт2\"], \"grams\": [0, 0], \"calories\": 0, \"proteins\": 0, \"fats\": 0, \"carbs\": 0}\n"
            "  },\n"
            "  \"calories\": 0\n"
            "}\n\n"
            "Отвечай **только JSON-объектом**, без объяснений и комментариев."
        )
    elif task == "workout":
        message = base_message + (
            "\nТвоя задача — составить разнообразный и сбалансированный план тренировки на один день, "
            "исходя из параметров клиента и его цели.\n\n"
            "План должен быть в формате JSON-массива, где каждый элемент — это упражнение с полями:\n"
            "- \"name\" — название упражнения\n"
            "- \"sets\" — количество подходов\n"
            "- \"reps\" — количество повторений\n"
            "- \"description\" — краткое описание техники выполнения упражнения\n\n"
            "Упражнения должны быть разнообразными, задействовать разные группы мышц и подходить под уровень "
            "подготовки клиента.\n"
            "Строго соблюдай формат JSON, пример структуры:\n"
            "[\n"
            "  {\"name\": \"упражнение1\", \"sets\": 0, \"reps\": 0, \"description\": \"описание техники\"},\n"
            "  {\"name\": \"упражнение2\", \"sets\": 0, \"reps\": 0, \"description\": \"описание техники\"}\n"
            "]\n\n"
            "Отвечай **только JSON-массивом**, без объяснений и комментариев."
        )
    else:
        message = base_message + (
            "\nТвоя задача — консультировать и помогать клиенту в достижении его целей по фитнесу и здоровью."
        )

    return {"role": "system", "content": message}
