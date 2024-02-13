import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TaskObject = {
  task: string;
  status: boolean;
};
type Tasklist = {
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
