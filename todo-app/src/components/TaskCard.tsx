import React, { useState, useRef, useEffect } from "react";
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { TaskCardProps } from "../interface";
import { selectTask, setTask } from "../reducers/taskSlice";
import Deletebtn from "../images/trash.svg";
import Editbtn from "../images/edit.svg";
import Cancelbtn from "../images/cancel.svg";

const TaskCard = ({ task, index, status }: TaskCardProps) => {
  const tasks = useSelector(selectTask);
  const [openModal, setOpenModal] = useState(false);
  const [completeTask, setCompleteTask] = useState(status);
  const [disableTask, setDisableTask] = useState(true);
  const [taskInput, setTaskInput] = useState(task);
  const taskInputRef = useRef<HTMLInputElement | null>(null);
  const checkRef = useRef<HTMLInputElement | null>(null);
  const cardRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (taskInputRef.current) {
      taskInputRef.current.focus();
    }
  }, [disableTask]);

  useEffect(() => {
    if (status === true) {
      if (checkRef.current) {
        checkRef.current.checked = true;
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setDisableTask(true);
      }
    };

    if (!disableTask) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [disableTask]);

  const handleEdit = () => {
    setDisableTask(false);
  };

  const editTaskInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskInput(event.target.value);
  };

  const handleCancel = () => {
    setTaskInput(task);
    setDisableTask(true);
  };

  const addEditedTask = () => {
    try {
      let inputTask = taskInputRef.current?.value;
      if (inputTask) {
        inputTask = inputTask.trim();
        if (inputTask.length > 0) {
          let updatedTasks = [...tasks];
          updatedTasks[index] = { ...updatedTasks[index] };

          updatedTasks[index].task = inputTask;

          dispatch(setTask(updatedTasks));
          toast.success("Task Edited Successfully...");
        }
      } else {
        toast.error("Please Enter the task...");
        setTaskInput(task);
      }
      setDisableTask(true);
    } catch (e) {
      toast.error("Something went wrong");
      setTaskInput(task);
      setDisableTask(true);
    }
  };

  const deleteTask = (index: number) => {
    let updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index] };

    updatedTasks.splice(index, 1);

    dispatch(setTask(updatedTasks));

    setOpenModal(false);
    toast.warning("Task Deleted Successfully...");
  };

  const handleStatus = () => {
    let updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index] };

    updatedTasks[index].status = !completeTask;

    dispatch(setTask(updatedTasks));
    if (!completeTask) {
      toast.info("👏 Good Job! Task Completed...");
    }
    setCompleteTask(!completeTask);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addEditedTask();
    }
  };

  return (
    <div
      ref={cardRef}
      className="flex justify-between gap-2 border h-fit w-full min-w-fit p-3 rounded shadow-md font-mono"
    >
      <input
        ref={taskInputRef}
        type="text"
        id="todotask"
        className={`h-fit flex-1 border-none text-gray-900 text-sm rounded block w-fit p-2.5${
          completeTask ? "line-through opacity-50" : ""
        }`}
        style={{
          textDecoration: `${completeTask ? "line-through" : "none"}`,
        }}
        value={taskInput}
        onChange={editTaskInput}
        onKeyDown={(e) => handleKeyDown(e)}
        autoComplete="off"
        disabled={disableTask}
        required
      />
      <div className="flex justify-end items-center flex-wrap gap-3">
        {disableTask ? (
          <>
            <button
              className="w-fit h-fit text-center border rounded z-10 bg-white hover:bg-slate-100"
              title="Delete Task"
              onClick={() => setOpenModal(true)}
            >
              <img
                src={Deletebtn}
                alt="Enter"
                className="p-1 min-w-10 min-h-10"
              />
            </button>
            <Modal
              show={openModal}
              size="md"
              onClose={() => setOpenModal(false)}
              popup
            >
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this Task?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={() => deleteTask(index)}>
                      {"Yes, I'm sure"}
                    </Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                      No, cancel
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </>
        ) : (
          <Button onClick={addEditedTask}>Add</Button>
        )}

        {disableTask ? (
          <button
            onClick={handleEdit}
            className="w-fit h-fit text-center border rounded z-10 bg-white hover:bg-slate-100"
            title="Edit Task"
            disabled={completeTask}
          >
            <img src={Editbtn} alt="Enter" className="p-1 min-w-10 min-h-10" />
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="w-fit h-fit text-center border rounded z-10 bg-white hover:bg-slate-100"
            title="Cancel Edit Task"
          >
            <img
              src={Cancelbtn}
              alt="Cancel"
              className="p-1 min-w-10 min-h-10"
            />
          </button>
        )}

        <input
          type="checkbox"
          className="p-1 min-w-8 min-h-8 rounded text-blue-500"
          onChange={handleStatus}
          ref={checkRef}
        />
      </div>
    </div>
  );
};

export default TaskCard;
