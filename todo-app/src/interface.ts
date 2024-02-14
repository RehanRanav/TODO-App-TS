export interface TaskCardProps {
  task: string;
  index: number;
  status: boolean;
}

export interface TaskObject {
  task: string;
  status: boolean;
}
export type Tasklist = {
  taskList: TaskObject[];
}
