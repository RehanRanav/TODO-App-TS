import { UniqueIdentifier } from "@dnd-kit/core";
import dayjs from "dayjs";

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
  deadline: dayjs.Dayjs;
}
export type Tasklist = {
  taskList: TaskObject[];
};
