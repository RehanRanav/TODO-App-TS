import React, { FC, useEffect } from "react";
import { Slide, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import AuthPage from "./components/AuthPage";
import { selectUser, setUser } from "./reducers/userSlice";
import HomePage from "./components/HomePage";
import "react-toastify/dist/ReactToastify.css";

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
      dispatch(setUser(logedUser));
    }
  }, []);

  return (
    <div className="App overflow-hidden min-h-screen bg-[#393E46] touch-none">
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />

      {user ? <HomePage /> : <AuthPage />}
    </div>
  );
};

export default App;
