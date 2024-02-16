import React, { FC, useEffect } from "react";
import { Slide, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import AuthPage from "./components/AuthPage";
import { selectUser, setUser } from "./reducers/userSlice";
import { selectTask, setTask } from "./reducers/taskSlice";
import HomePage from "./components/HomePage";
import "react-toastify/dist/ReactToastify.css";

const App: FC = () => {
  const user = useSelector(selectUser);
  const tasks = useSelector(selectTask);
  const dispatch = useDispatch();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor,{
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  type TaskObject = {
    task: string;
    status: boolean;
  };
  type Tasklist = {
    storedTasks: TaskObject[];
  };

  useEffect(() => {
    let logedUser: string | null | Tasklist = localStorage.getItem("user");
    if (logedUser) {
      logedUser = JSON.parse(logedUser) as Tasklist;
      dispatch(setUser(logedUser));
    }
  }, []);

  console.log(tasks);
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id === over?.id) return;

    const updatedTasks= arrayMove(tasks, active.id as number, over?.id as number);
    dispatch(setTask(updatedTasks));
  };

  return (
    <div className="App w-screen min-h-screen bg-amber-100">
      <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={closestCorners}>
        <ToastContainer
          position="top-left"
          autoClose={3000}
          hideProgressBar={false}
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
      </DndContext>
    </div>
  );
};

export default App;
