import React, { FC } from "react";
import AuthPage from "./components/AuthPage";
import { useSelector } from "react-redux";
import { selectUser } from "./reducers/userSlice";
import HomePage from "./components/HomePage";

const App: FC = () => {
  const user = useSelector(selectUser);
  return (
    <div className="App w-full h-screen">
      {user ? <HomePage /> : <AuthPage />}
    </div>
  );
};

export default App;
