import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskObject, Tasklist } from "../interface";

const initialState: Tasklist = {
  taskList: [],
};

const taskSlice: any = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTask: (state, action: PayloadAction<TaskObject[] | undefined>) => {
      if (action.payload) {
        state.taskList = action.payload;
    }
    },
    addTask: (state, action: PayloadAction<TaskObject | undefined>) => {
      if (action.payload) {
        state.taskList.push(action.payload);
      }
    },
  },
});

export const { addTask, setTask } = taskSlice.actions;
export const selectTask = (state: { task: Tasklist }) => state.task.taskList;
export default taskSlice.reducer;
