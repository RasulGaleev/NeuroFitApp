interface Meal {
  items: string[];
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}

interface NutritionPlan {
  id: number;
  date: string;
  nutrition: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
  calories: number;
}