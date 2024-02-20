import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button, Datepicker, Modal, TextInput, Tooltip } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTask as addToLocalStorage } from "../reducers/taskSlice";
import { selectUser } from "../reducers/userSlice";
import { customAlphabet } from "nanoid";

function AddModal() {
  const [openModal, setOpenModal] = useState(false);
  const taskInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const { email } = useSelector(selectUser) || {};

  const commonPrefix = "A";
  const generateRandomNumber = () => {
    const nanoid = customAlphabet("1234567890", 4);
    const randomNumber = nanoid();
    return commonPrefix + randomNumber;
  };

  const addTask = () => {
    try {
      if (taskInputRef.current) {
        let inputTask = taskInputRef.current?.value;
        inputTask = inputTask.trim();
        if (inputTask.length > 0) {
          dispatch(
            addToLocalStorage({
              id: generateRandomNumber(),
              task: inputTask,
              status: false,
              user: email,
            })
          );
          toast.success("Task Added Successfully...");
        } else {
          toast.error("Please Enter the task...");
        }
        taskInputRef.current.value = ``;
        setOpenModal(false);
      }
    } catch (e) {
      toast.error("Something went wrong");
      setOpenModal(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    <>
      <Tooltip content="Click to Add ToDo Task">
        <Button onClick={() => setOpenModal(true)} className="bg-[#00ADB5]">
          ADD TODO
        </Button>
      </Tooltip>
      <Modal
        show={openModal}
        size="lg"
        popup
        onClose={() => setOpenModal(false)}
        initialFocus={taskInputRef}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              ADD Todo
            </h3>
            <div>
              <TextInput
                id="task"
                ref={taskInputRef}
                placeholder="Enter Your Task"
                onKeyDown={(e) => handleKeyDown(e)}
                autoComplete="off"
                required
              />
            </div>
            <div>
              <h4 className="text-lg text-gray-900 dark:text-white">
                Set Deadline
              </h4>
              <div>
                <Datepicker className=""/>
              </div>
            </div>
            <div className="w-full">
              <Button onClick={addTask}>Add Todo</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddModal;
