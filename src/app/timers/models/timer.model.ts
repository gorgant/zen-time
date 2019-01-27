export interface Timer {
  setOnDate: number;
  title: string;
  category: string;
  notes: string;
  duration: number;
  dueDate: number;
  id?: string;
  completedDate?: number;
}
