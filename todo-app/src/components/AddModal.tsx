import React, { useState, useRef } from "react";
import { Button, Modal, TextInput, Tooltip, Datepicker } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTask as addToLocalStorage } from "../reducers/taskSlice";
import { selectUser } from "../reducers/userSlice";
import { customAlphabet } from "nanoid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function AddModal() {
  const [openModal, setOpenModal] = useState(false);
  const [taskDeadline, setTaskDeadline] = useState<dayjs.Dayjs>(dayjs);
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
              deadline: taskDeadline.format("MM/DD/YYYY hh:mm A"),
            })
          );
          toast.success("Task Added Successfully...");
        } else {
          toast.error("Please Enter the task...");
        }
        taskInputRef.current.value = ``;
        setOpenModal(false);
        setTaskDeadline(dayjs);
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
          <div className="space-y-6 overflow-auto">
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
              <div className="flex gap-1">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDateTimePicker
                    value={taskDeadline}
                    onChange={(newDeadline: dayjs.Dayjs | null) => {
                      if (newDeadline) {
                        setTaskDeadline(newDeadline);
                      }
                    }}
                    className="rounded"
                    sx={{
                      "& .MuiInputBase-root": {
                        padding: "0px",
                        backgroundColor: "#f9fafb",
                        border: "none",
                        outline: "none",
                      },
                      "& .MuiInputBase-input": {
                        padding: "10px",
                        boxShadow: "none",
                        borderColor: "#f9fafb",
                      },
                    }}
                  />
                </LocalizationProvider>
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
