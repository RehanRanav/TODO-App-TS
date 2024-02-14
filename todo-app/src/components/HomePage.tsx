import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTask, setTask } from "../reducers/taskSlice";
import { clearUser, selectUser } from "../reducers/userSlice";
import AddModal from "./AddModal";
import { Button } from "flowbite-react";

const HomePage = () => {
  const tasks = useSelector(selectTask);
  const { name, picture } = useSelector(selectUser) || {};
  const dispatch = useDispatch();

  type TaskObject = {
    task: string;
    status: boolean;
  };
  type Tasklist = {
    storedTasks: TaskObject[];
  };

  useEffect(() => {
    let storedTasksList = localStorage.getItem("tasklist");
    if (storedTasksList) {
      const storedTasks: Tasklist = JSON.parse(storedTasksList);
      dispatch(setTask(storedTasks.storedTasks));
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      localStorage.setItem("tasklist", JSON.stringify(tasks));
    }, 800);
  }, [tasks]);

  const googleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <div className="w-full text-center">
      <div className="w-full flex justify-end p-4 pr-8 bg-slate-100">
        <div className="w-fit flex gap-10 items-center">
          <img
            src={picture}
            alt="profile picture"
            className="h-10 w-10 rounded-full"
          />
          <span className="font-mono text-lg font-bold">Hello, {name}</span>
          <Button onClick={googleLogout}>Logout</Button>
        </div>
      </div>
      <div className="flex justify-center mt-14">
        <AddModal />
      </div>
    </div>
  );
};

export default HomePage;
