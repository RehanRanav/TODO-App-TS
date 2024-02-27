import React, { FC, useEffect, useState } from "react";
import { Slide, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import AuthPage from "./components/AuthPage";
import { selectUser, setUser } from "./reducers/userSlice";
import HomePage from "./components/HomePage";
import { ThemeProvider } from "./context/theme";
import "react-toastify/dist/ReactToastify.css";

const App: FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("theme") || "light"
  );

  const darkTheme = () => {
    setThemeMode("dark");
  };
  const lightTheme = () => {
    setThemeMode("light");
  };

  useEffect(() => {
    document.querySelector("html")?.classList.remove("dark", "light");
    document.querySelector("html")?.classList.add(themeMode);
    localStorage.setItem('theme',themeMode);
  }, [themeMode]);

  useEffect(() => {
    let logedUser: string | null = localStorage.getItem("user");
    if (logedUser) {
      dispatch(setUser(logedUser));
    }
  }, []);

  return (
    <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
      <div className="App overflow-x-hidden min-h-screen bg-sky-50 dark:bg-sky-950 touch-none">
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
    </ThemeProvider>
  );
};

export default App;
