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
import {  HiClock } from "react-icons/hi";
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

  return (
    <div className="w-full text-center h-full">
      <Header />

      <div className="font-mono w-4/5 grid grid-cols-4 gap-4 p-2 m-auto mt-1">
        <div className="bg-white p-2 rounded flex flex-col justify-center items-center shadow-md cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out">
          <FaListAlt color="#38bdf8" size={24}/>
          <span className="text-2xl font-bold">{todoList.length}</span>
          <span className="flex items-center">
            Total Tasks</span>
        </div>
        <div className="bg-white py-4 rounded-sm flex flex-col justify-center items-center shadow-md cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out">
          <HiClock color="#fde047" size={24}/>
          <span className="text-2xl font-bold"> {todoList.filter((task) => task.status == false).length}</span>
          <span className="flex items-center">
          Pending Tasks</span>
        </div>
        <div className="bg-white p-2 rounded-sm flex flex-col justify-center items-center shadow-md cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out">
          <FaCheckCircle color="#86efac" size={24}/>
          <span className="text-2xl font-bold"> {todoList.filter((task) => task.status == true).length}</span>
          <span className="flex items-center">
          Completed Tasks</span>
        </div>
        <div className="bg-white p-2 rounded-sm flex flex-col justify-center items-center shadow-md cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out">
          <AiFillCloseCircle color="#fca5a5" size={24}/>
          <span className="text-2xl font-bold"> {todoList.filter((todo) => dayjs().isAfter(todo.deadline)).length}</span>
          <span className="flex items-center">
          OverDue Tasks</span>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <AddModal />
      </div>
      <div className=" w-1/2 m-auto p-5 max-sm:w-full h-auto ">
        <div className="h-[340px] px-4 py-8 overflow-y-auto overflow-x-hidden">
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
                  <div className="flex flex-col justify-center items-center font-mono text-lg font-bold text-[#EEEEEE]">
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
