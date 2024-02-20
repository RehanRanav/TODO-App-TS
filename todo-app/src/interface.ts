import { UniqueIdentifier } from "@dnd-kit/core";

export interface TaskCardProps {
  id: UniqueIdentifier;
  task: string;
  index: number;
  status: boolean;
}

export interface TaskObject {
  id: UniqueIdentifier;
  task: string;
  status: boolean;
  user: string;
}
export type Tasklist = {
  taskList: TaskObject[];
};
