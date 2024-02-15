import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTask, setTask } from "../reducers/taskSlice";
import { TaskObject } from "../interface";
import AddModal from "./AddModal";
import TaskCard from "./TaskCard";

import Notask from "../images/Notasks.jpg";
import Header from "./Header";

const HomePage: FC = () => {
  const tasks = useSelector(selectTask);
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

  

  return (
    <div className="w-full text-center">
      <Header/>

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
