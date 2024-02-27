import { UniqueIdentifier } from "@dnd-kit/core";
import dayjs from "dayjs";

export interface TaskCardProps {
  id: UniqueIdentifier;
  task: string;
  index: number;
  status: string;
}

export interface TaskObject {
  id: UniqueIdentifier;
  task: string;
  status: string;
  user: string;
  deadline: dayjs.Dayjs;
}
export type Tasklist = {
  taskList: TaskObject[];
};
