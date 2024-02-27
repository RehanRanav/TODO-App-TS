import { FC, useEffect, useRef, useState } from "react";
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
import dayjs from "dayjs";
import { HiClock } from "react-icons/hi";
import { FaListAlt, FaCheckCircle } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import { selectTask, setTask } from "../reducers/taskSlice";
import { selectUser } from "../reducers/userSlice";
import { TaskObject } from "../interface";
import AddModal from "./AddModal";
import TaskCard from "./TaskCard";
import Header from "./Header";
import Notask from "../images/Notasks.jpg";

const HomePage: FC = () => {
  const tasks = useSelector(selectTask);
  const credential = useSelector(selectUser) || "";
  const [email, setEmail] = useState();
  const dispatch = useDispatch();
  const [todoList, setTodoList] = useState(
    tasks.filter((task) => task.user === email)
  );
  const todoListScrollRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

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
  }, [tasks, email]);

  useEffect(() => {
    if (todoListScrollRef.current) {
      todoListScrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [todoList]);

  useEffect(() => {
    const decoded: Record<string, any> = jwtDecode(credential);
    setEmail(decoded.email);
  }, [credential]);

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

  const debounceFunc = (fn: Function, delay: number) => {
    let timer: NodeJS.Timeout;

    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn();
      }, delay);
    };
  };

  const filterdata = () => {
    let input = searchRef.current?.value?.trim()?.toUpperCase() || "";
    if (input) {
      const updatedTodoList = tasks.filter(
        (task) => task.user === email && task.task.toUpperCase().includes(input)
      );
      setTodoList(updatedTodoList);
    } else {
      setTodoList(tasks.filter((task) => task.user === email));
    }
  };

  const searchTask = debounceFunc(filterdata, 800);

  return (
    <div className="w-full text-center h-full">
      <Header />

      <div className="font-mono lg:w-4/5 sm:w-full grid grid-cols-5 gap-4 p-2 m-auto mt-1 overflow-hidden ">
        <div className="bg-white p-2 rounded flex flex-col justify-center items-center shadow-md cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden">
          <FaListAlt color="#38bdf8" size={24} />
          <span className="text-2xl font-bold">{todoList.length}</span>
          <span className="flex items-center">Total Tasks</span>
        </div>
        <div className="bg-white py-4 rounded-sm flex flex-col justify-center items-center shadow-md cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden">
          <HiClock color="#fde047" size={24} />
          <span className="text-2xl font-bold">
            {" "}
            {todoList.filter((todo) => todo.status === `pending`).length}
          </span>
          <span className="flex items-center">Pending Tasks</span>
        </div>
        <div className="bg-white p-2 rounded-sm flex flex-col justify-center items-center shadow-md cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden">
          <FaCheckCircle color="#86efac" size={24} />
          <span className="text-2xl font-bold">
            {" "}
            {todoList.filter((todo) => todo.status === `completed`).length}
          </span>
          <span className="flex items-center">Completed Tasks</span>
        </div>
        <div className="bg-white p-2 rounded-sm flex flex-col justify-center items-center shadow-md cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden">
          <AiFillCloseCircle color="#fca5a5" size={24} />
          <span className="text-2xl font-bold">
            {" "}
            {todoList.filter((todo) => todo.status === `overdue`).length}
          </span>
          <span className="flex items-center">OverDue Tasks</span>
        </div>
        <div className="bg-white p-2 rounded-sm flex flex-col justify-center items-center shadow-md cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden">
          <FaCheckCircle color="#fca5a5" size={24} />
          <span className="text-2xl font-bold">
            {" "}
            {todoList.filter((todo) => todo.status === `late submitted`).length}
          </span>
          <span className="flex items-center">Late Submitted Tasks</span>
        </div>
      </div>

      <div className="flex justify-centermt-8 mt-6">
        <div className="w-1/2 px-8 py-2 m-auto max-md:w-full h-auto flex justify-between max-sm:justify-center ">
          <div className="relative w-fit max-sm:hidden">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              ref={searchRef}
              type="search"
              id="default-search"
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search ToDos"
              onChange={searchTask}
            />
          </div>

          <AddModal />
        </div>
      </div>
      <div className=" w-1/2 m-auto p-5 max-sm:w-full h-auto ">
        <div className="h-[220px] px-4 py-8 overflow-y-auto overflow-x-hidden">
          <DndContext
            onDragEnd={handleDragEnd}
            sensors={sensors}
            collisionDetection={closestCorners}
          >
            <SortableContext
              items={todoList.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div ref={todoListScrollRef} className="flex flex-col gap-8">
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
                  <div className="flex flex-col justify-center items-center font-mono text-lg font-bold text-gray-500">
                    <img
                      src={Notask}
                      alt="No Task Found"
                      className="w-1/3 my-2 rounded"
                    />
                    Nothing To do...
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
