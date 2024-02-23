import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import taskReducer from './taskSlice'

const rootReducer = combineReducers({
  user: userReducer,
  task: taskReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
