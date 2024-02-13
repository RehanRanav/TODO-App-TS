import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import taskReducer from './taskSlice'

const rootReducer = combineReducers({
  user: userReducer,
  task: taskReducer
  // Add other reducers as needed
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
