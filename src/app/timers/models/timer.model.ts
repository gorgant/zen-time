export interface Timer {
  setOnDate: number;
  title: string;
  category: string;
  notes: string;
  duration: number;
  id?: string;
  completedDate?: number;
}
