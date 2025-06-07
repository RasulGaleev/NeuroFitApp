export interface NutritionType {
  id: number;
  date: string;
  meals: {
    breakfast: MealType;
    lunch: MealType;
    dinner: MealType;
  };
  calories: number;
}

export interface MealType {
  items: string[];
  grams: number[];
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}