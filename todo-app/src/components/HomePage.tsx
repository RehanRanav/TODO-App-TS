import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTask, setTask } from "../reducers/taskSlice";
import { selectUser } from "../reducers/userSlice";
import AddModal from "./AddModal";

const HomePage = () => {
  const tasks = useSelector(selectTask);
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

  return (
    <div className="w-full text-center">
      <div className="flex justify-center mt-20">
        <AddModal />
      </div>
    </div>
  );
};

export default HomePage;
