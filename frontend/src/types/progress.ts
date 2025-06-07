export interface ProgressChartType {
  id: number;
  date: string;
  weight: number;
  height: number;
  photo: string;
  notes: string;
}

export interface ProgressListType {
  results: ProgressChartType[];
}