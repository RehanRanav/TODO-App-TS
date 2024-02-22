import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { selectTask, setTask } from "../reducers/taskSlice";
import { TaskObject } from "../interface";
import AddModal from "./AddModal";
import TaskCard from "./TaskCard";
import Header from "./Header";
import Notask from "../images/Notasks.jpg";
import { selectUser } from "../reducers/userSlice";
import dayjs from "dayjs";

const HomePage: FC = () => {
  const tasks = useSelector(selectTask);
  const { email } = useSelector(selectUser) || {};
  const dispatch = useDispatch();
  const [todoList, setTodoList] = useState(
    tasks.filter((task) => task.user === email)
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    setTodoList(tasks.filter((task) => task.user === email));
  }, [tasks]);

  const getTaskPos = (id: UniqueIdentifier) =>
    tasks.findIndex((task) => task.id === id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id === over?.id || !over) return;

    const originalPos = getTaskPos(active.id);
    const newPos = getTaskPos(over?.id);

    const updatedTasks = arrayMove(
      tasks,
      originalPos as number,
      newPos as number
    );
    dispatch(setTask(updatedTasks));
  };

  return (
    <div className="w-full text-center">
      <div className="w-full sticky top-0 left-0 z-20 bg-[#393E46]">
        <Header />

        <div className="font-mono w-fit flex flex-col p-2 text-left  text-[#EEEEEE]">
          <span>Total Tasks: {todoList.length}</span>
          <span className="flex gap-1 items-center text-[#EEEEEE]">
            <div className="w-1 h-4 bg-[#EEEEEE] rounded-full"></div>
            Pending Tasks:{" "}
            {todoList.filter((task) => task.status == false).length}
          </span>
          <span className="flex gap-1 items-center text-slate-300">
            <div className="w-1 h-4 bg-slate-300 rounded-full"></div>
            Completed Tasks:{" "}
            {todoList.filter((task) => task.status == true).length}
          </span>
          <span className="flex gap-1 items-center text-red-200">
            <div className="w-1 h-4 bg-red-200 rounded-full"></div>
            OverDue Tasks:{" "}
            {todoList.filter((todo) => dayjs().isAfter(todo.deadline)).length}
            {}
          </span>
        </div>

        <div className="flex justify-center">
          <AddModal />
        </div>
      </div>
      <div className="w-full pt-24 overflow-y-auto">
        <div className="flex flex-col gap-8 justify-center items-center w-1/2 h-96 m-auto p-5 max-sm:w-full">
          <DndContext
            onDragEnd={handleDragEnd}
            sensors={sensors}
            collisionDetection={closestCorners}
          >
            <SortableContext
              items={todoList.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {todoList.length > 0 ? (
                todoList.map((task, index) => {
                  return (
                    <TaskCard
                      key={task.id}
                      id={task.id}
                      index={index}
                      task={task.task}
                      status={task.status}
                    />
                  );
                })
              ) : (
                <div className="flex flex-col justify-center items-center font-mono text-lg font-bold text-[#EEEEEE]">
                  <img
                    src={Notask}
                    alt="No Task Found"
                    className="w-1/3 my-4 rounded"
                  />
                  Nothing To do...
                </div>
              )}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
