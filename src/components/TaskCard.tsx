import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Tooltip } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { GrDrag } from "react-icons/gr";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { formatDistanceToNow } from "date-fns";
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
  const [isHovering, setIsHovering] = useState(false);
  const [deadlineStatus, setDeadlineStatus] = useState("");
  const taskInputRef = useRef<HTMLTextAreaElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled: isEditing });

  useEffect(() => {
    if (status === "pending") {
      const i = getTaskPos(id);
      if (tasks[i]) {
        const deadlineTime = dayjs(tasks[i]?.deadline);
        const currentTime = dayjs();

        const timeoutDuration = Math.max(0, deadlineTime.diff(currentTime));

        const timeoutId = setTimeout(() => {
          if (dayjs().isAfter(tasks[i].deadline)) {
            let updatedTasks = [...tasks];
            updatedTasks[i] = { ...updatedTasks[i] };

            updatedTasks[i].status = `overdue`;

            dispatch(setTask(updatedTasks));
            setCompleteTask(updatedTasks[i].status);
          }
        }, timeoutDuration);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [id, tasks, status]);

  useEffect(() => {
    const checkRemainingTime = () => {
      const taskDeadlineTime = dayjs(
        tasks[getTaskPos(id)].deadline,
        "MM/DD/YYYY hh:mm A"
      ).toDate();

      setDeadlineStatus(
        formatDistanceToNow(taskDeadlineTime, { addSuffix: true })
      );
    };
    const intervalID = setInterval(checkRemainingTime, 1000);
    return () => clearInterval(intervalID);
  }, [id, task]);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setTaskInput(task);
        setDisableTask(true);
        setisEditing(false);
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
    taskInputRef.current?.setSelectionRange(
      taskInputRef.current.value.length,
      taskInputRef.current.value.length
    );
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

    updatedTasks[i].status =
      completeTask === `pending`
        ? `completed`
        : completeTask === `completed` &&
          dayjs().isBefore(updatedTasks[i].deadline)
        ? `pending`
        : completeTask === `completed` &&
          dayjs().isAfter(updatedTasks[i].deadline)
        ? `overdue`
        : completeTask === `late submitted`
        ? `overdue`
        : `late submitted`;

    dispatch(setTask(updatedTasks));
    if (updatedTasks[i].status === "complete") {
      toast.success("👏 Good Job! Task Completed...");
    }
    setTaskInput(task);
    setCompleteTask(updatedTasks[i].status);
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
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={dndStyle}
      className={`${
        completeTask === `completed` || completeTask === `late submitted`
          ? "bg-slate-200 dark:bg-slate-300"
          : "bg-white dark:bg-sky-200"
      } focus:cursor-grabbing mx-auto flex justify-between items-center gap-3 border h-fit w-full   p-3 rounded hover:rounded-tl-none shadow-md font-mono hover:shadow-lg touch-pan-y scroll-smooth relative`}
    >
      <GrDrag color="#a1a1aa" />
      <div>{index + 1}.</div>

      <textarea
        ref={taskInputRef}
        id="todotask"
        className={`p-[4px] h-fit bg-inherit text-lg resize-none flex-1 border-none text-gray-900 font-bold rounded block w-fit ${
          completeTask === `completed` || completeTask === `late submitted`
            ? "line-through opacity-50"
            : ""
        }`}
        style={{
          textDecoration: `${
            completeTask === `completed` || completeTask === `late submitted`
              ? "line-through"
              : "none"
          }`,
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
            className="bg-[#4da0e6] hover:bg-[#38a0f6]"
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
        <Button onClick={addEditedTask} className="bg-[#4da0e6]">
          Add
        </Button>
      )}

      {disableTask ? (
        <Button
          onClick={handleEdit}
          title="Edit Task"
          disabled={
            completeTask === `completed` || completeTask === `late submitted`
              ? true
              : false
          }
          className="bg-[#4da0e6]"
        >
          Edit
        </Button>
      ) : (
        <Button
          onClick={handleCancel}
          title="Cancel Edit Task"
          className="bg-[#4da0e6]"
        >
          Cancel
        </Button>
      )}

      <Tooltip
        content="Mark as complete"
        placement="bottom-start"
        animation="duration-1000"
      >
        <span
          className="bg-black w-fit h-fit cursor-pointer"
          onClick={handleStatus}
        >
          <IoCheckmarkDoneCircleSharp
            size={34}
            color={`${
              completeTask === `completed` || completeTask === `late submitted`
                ? "#22c55e"
                : "#6b7280"
            }`}
          />
        </span>
      </Tooltip>

      {isHovering ? (
        <div
          className={`w-fit h-fit py-0.5 px-2 absolute -top-[30px] -left-0 rounded-t ${
            deadlineStatus.includes("ago") &&
            (completeTask === `pending` || completeTask === `overdue`)
              ? "bg-red-200"
              : completeTask === `completed` ||
                completeTask === `late submitted`
              ? "bg-green-100"
              : "bg-yellow-100"
          }`}
        >
          {completeTask === `completed` || completeTask === `late submitted` ? (
            completeTask === `completed` ? (
              <>Task Completed</>
            ) : (
              <>late submitted</>
            )
          ) : deadlineStatus.includes("ago") ? (
            <>Overdue Time:</>
          ) : (
            <>Remaining Time:</>
          )}
          {completeTask === `completed` || completeTask === `late submitted`
            ? null
            : deadlineStatus}
        </div>
      ) : null}
    </div>
  );
};

export default TaskCard;
