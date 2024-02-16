import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTask, setTask } from "../reducers/taskSlice";
import { TaskObject } from "../interface";
import AddModal from "./AddModal";
import TaskCard from "./TaskCard";
import Header from "./Header";
import Notask from "../images/Notasks.jpg";

const HomePage: FC = () => {
  const tasks = useSelector(selectTask);
  const dispatch = useDispatch();
  const [todoList, setTodoList] = useState(tasks);

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
    },800);
    setTodoList(tasks);
  }, [tasks]);

  

  return (
    <div className="w-full text-center h-full">
      <Header/>

      <div className="flex justify-center mt-14">
        <AddModal />
      </div>
      <div className="flex flex-col gap-5 justify-center items-center w-1/2 m-auto p-5 max-sm:w-full">
        {todoList.length > 0 ? (
          todoList.map((task, index) => {
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
          <div className="font-mono text-lg font-bold">
          <img
            src={Notask}
            alt="No Task Found"
            className="m-auto p-auto w-1/2 my-4"
            />
            Nothing To do...
            </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
