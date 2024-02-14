import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TaskObject  {
  task: string;
  status: boolean;
};
interface Tasklist {
  taskList: TaskObject[];
};

const initialState: Tasklist = {
  taskList: [],
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTask: (state, action: PayloadAction<TaskObject[] | undefined>) => {
      state.taskList = action.payload ?? [];
    },
  },
});

export const { setTask } = taskSlice.actions;
export const selectTask = (state: { task: Tasklist }) => state.task.taskList;
export default taskSlice.reducer;
