import React, { FC, useEffect } from "react";
import AuthPage from "./components/AuthPage";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "./reducers/userSlice";
import HomePage from "./components/HomePage";

const App: FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  type TaskObject = {
    task: string;
    status: boolean;
  };
  type Tasklist = {
    storedTasks: TaskObject[];
  };

  useEffect(() => {
    let logedUser: string | null | Tasklist = localStorage.getItem("user");
    if (logedUser) {
      logedUser = JSON.parse(logedUser) as Tasklist;
      console.log(logedUser);
      dispatch(setUser(logedUser));
    }
  },[]);

  return (
    <div className="App w-full h-screen">
      {user ? <HomePage /> : <AuthPage />}
    </div>
  );
};

export default App;
