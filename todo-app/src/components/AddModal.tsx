import React, { useState, useRef, useCallback } from "react";
import { Button, Modal, TextInput } from "flowbite-react";
import { useDispatch } from "react-redux";
import { setTask } from "../reducers/taskSlice";

function AddModal() {
  const [openModal, setOpenModal] = useState(false);
  const taskInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  const addTask = useCallback(() => {
    try {
      if (taskInputRef.current) {
        let inputTask = taskInputRef.current?.value;
        inputTask = inputTask.trim();
        if (inputTask.length > 0) {
          dispatch(setTask([{ task: inputTask, status: false }]));
        } else {
        }
        taskInputRef.current.value = ``;
        setOpenModal(false);
      }
    } catch (e) {}
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>ADD TODO</Button>
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
                required
              />
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
