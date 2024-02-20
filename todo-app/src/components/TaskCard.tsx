import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Tooltip } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";
import { TaskCardProps } from "../interface";
import { selectTask, setTask, removeTask } from "../reducers/taskSlice";

const TaskCard = ({ task, index, status, id }: TaskCardProps) => {
  const tasks = useSelector(selectTask);
  const [openModal, setOpenModal] = useState(false);
  const [completeTask, setCompleteTask] = useState(status);
  const [disableTask, setDisableTask] = useState(true);
  const [taskInput, setTaskInput] = useState(task);
  const [isEditing, setisEditing] = useState(false);
  const taskInputRef = useRef<HTMLTextAreaElement | null>(null);
  const checkRef = useRef<HTMLInputElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled: isEditing });

  useEffect(() => {
    setTaskInput(task);
    setCompleteTask(status);
  }, [task, status]);

  useEffect(() => {
    if (taskInputRef.current) {
      taskInputRef.current.focus();
    }
  }, [disableTask]);

  useEffect(() => {
    if (checkRef.current) {
      if (status === true) {
        checkRef.current.checked = true;
      } else {
        checkRef.current.checked = false;
      }
    }
  }, [task]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setTaskInput(task);
        setDisableTask(true);
        setisEditing(false)
      }
    };

    if (!disableTask) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [disableTask]);

  const getTaskPos = (id: UniqueIdentifier) =>
    tasks.findIndex((task) => task.id === id);

  const handleEdit = () => {
    setDisableTask(false);
    setisEditing(true);
  };

  const editTaskInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTaskInput(event.target.value);
  };

  const handleCancel = () => {
    setTaskInput(task);
    setDisableTask(true);
    setisEditing(false);
  };

  const addEditedTask = () => {
    try {
      let inputTask = taskInputRef.current?.value;
      if (inputTask) {
        inputTask = inputTask.trim();
        if (inputTask.length > 0) {
          let updatedTasks = [...tasks];
          const i = getTaskPos(id);

          updatedTasks[i] = { ...updatedTasks[i] };

          updatedTasks[i].task = inputTask;

          dispatch(setTask(updatedTasks));
          toast.success("Task Edited Successfully...");
        } else {
          toast.error("Please Enter the task...");
          setTaskInput(task);
        }
      } else {
        toast.error("Please Enter the task...");
        setTaskInput(task);
      }
    } catch (e) {
      toast.error("Something went wrong");
      setTaskInput(task);
      setDisableTask(true);
    } finally {
      setDisableTask(true);
      setisEditing(false);
    }
  };

  const deleteTask = (id: UniqueIdentifier) => {
    const i = getTaskPos(id);
    dispatch(removeTask(i));

    setOpenModal(false);
    toast.warning("Task Deleted Successfully...");
  };

  const handleStatus = () => {
    let updatedTasks = [...tasks];
    const i = getTaskPos(id);
    updatedTasks[i] = { ...updatedTasks[i] };

    updatedTasks[i].status = !completeTask;

    dispatch(setTask(updatedTasks));
    if (!completeTask) {
      toast.info("👏 Good Job! Task Completed...");
    }
    setTaskInput(task);
    setCompleteTask(!completeTask);
    setDisableTask(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      addEditedTask();
    }
  };

  const dndStyle = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        cardRef.current = el;
      }}
      {...attributes}
      {...listeners}
      style={dndStyle}
      className={`${
        completeTask ? "bg-slate-300" : "bg-[#EEEEEE]"
      } focus:cursor-grabbing mx-auto flex justify-between items-center gap-3 border h-fit w-full sm:min-w-fit  p-3 rounded-lg shadow-md font-mono hover:shadow-lg touch-pan-y scroll-smooth`}
    >
      <div>{index + 1}.</div>
      <Tooltip content="Check to mark as complete" placement="left">
        <input
          id="yellow-checkbox"
          type="checkbox"
          className="p-1 min-w-5 min-h-5 rounded-full text-green-400 bg-gray-300 border-gray-300 cursor-pointer"
          onChange={handleStatus}
          ref={checkRef}
        />
      </Tooltip>

      <textarea
        ref={taskInputRef}
        id="todotask"
        className={`p-[4px] h-fit bg-inherit text-lg resize-none flex-1 border-none text-gray-900 font-bold rounded block w-fit p-2.5${
          completeTask ? "line-through opacity-50" : ""
        }`}
        style={{
          textDecoration: `${completeTask ? "line-through" : "none"}`,
        }}
        value={taskInput}
        rows={1}
        onChange={editTaskInput}
        onKeyDown={(e) => handleKeyDown(e)}
        autoComplete="off"
        disabled={disableTask}
        required
      ></textarea>

      {disableTask ? (
        <>
          <Button
            title="Delete Task"
            onClick={() => setOpenModal(true)}
            className="bg-[#00ADB5]"
          >
            Delete
          </Button>
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
                  <Button color="failure" onClick={() => deleteTask(id)}>
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
        <Button onClick={addEditedTask} className="bg-[#00ADB5]">
          Add
        </Button>
      )}

      {disableTask ? (
        <Button
          onClick={handleEdit}
          title="Edit Task"
          disabled={completeTask}
          className="bg-[#00ADB5]"
        >
          Edit
        </Button>
      ) : (
        <Button
          onClick={handleCancel}
          title="Cancel Edit Task"
          className="bg-[#00ADB5]"
        >
          Cancel
        </Button>
      )}
    </div>
  );
};

export default TaskCard;
