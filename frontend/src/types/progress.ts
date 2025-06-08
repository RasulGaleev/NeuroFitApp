export interface ProgressChartType {
  id: number;
  user: number;
  date: string;
  weight: number | null;
  height: number | null;
  photo: string | null;
  notes: string;
  bmi: number | null;
  created_at: string;
}
