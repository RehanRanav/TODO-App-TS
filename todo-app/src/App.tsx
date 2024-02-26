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

  useEffect(() => {
    let logedUser: string | null = localStorage.getItem("user");
    if (logedUser) {
      dispatch(setUser(logedUser));
    }
  }, []);

  return (
    <div className="App overflow-x-hidden min-h-screen bg-sky-50 touch-none">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
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
