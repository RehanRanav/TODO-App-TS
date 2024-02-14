import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTask, setTask } from "../reducers/taskSlice";
import { clearUser, selectUser } from "../reducers/userSlice";
import { TaskObject } from "../interface";
import AddModal from "./AddModal";
import TaskCard from "./TaskCard";
import { Button } from "flowbite-react";
import Notask from "../images/Notasks.jpg";

const HomePage: FC = () => {
  const tasks = useSelector(selectTask);
  const { name, picture } = useSelector(selectUser) || {};
  const dispatch = useDispatch();

  useEffect(() => {
    let taskList = localStorage.getItem("tasklist");
    if (taskList) {
      const taskLists: TaskObject[] = JSON.parse(taskList);
      dispatch(setTask(taskLists));
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
      <div className="flex flex-col gap-5 justify-center items-center w-1/2 m-auto p-5 max-sm:w-full">
        {tasks.length > 0 ? (
          tasks.map((task, index) => {
            return (
              <TaskCard
                key={index}
                index={index}
                task={task.task}
                status={task.status}
              />
            );
          })
        ) : (
          <img
            src={Notask}
            alt="No Task Found"
            className="m-auto p-auto w-1/2"
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
