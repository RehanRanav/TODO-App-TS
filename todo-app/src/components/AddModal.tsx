import React, { useState, useRef, useEffect } from "react";
import { Button, Modal, TextInput, Tooltip } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { customAlphabet } from "nanoid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { addTask as addToLocalStorage } from "../reducers/taskSlice";
import { selectUser } from "../reducers/userSlice";
import { DateTimePicker } from "@mui/x-date-pickers";
import { jwtDecode } from "jwt-decode";

function AddModal() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState();
  const [taskDeadline, setTaskDeadline] = useState<dayjs.Dayjs>(
    dayjs().add(30, "minutes")
  );
  const taskInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const credential = useSelector(selectUser) || "";

  const commonPrefix = "A";
  const generateRandomNumber = () => {
    const nanoid = customAlphabet("1234567890", 4);
    const randomNumber = nanoid();
    return commonPrefix + randomNumber;
  };

  useEffect(() => {
    const decoded: Record<string, any> = jwtDecode(credential);
    setEmail(decoded.email);
  }, [credential]);

  useEffect(() => {
    setTaskDeadline(dayjs().add(30, "minutes"));
  }, [openModal]);

  const addTask = () => {
    try {
      if (taskInputRef.current) {
        let inputTask = taskInputRef.current?.value;
        inputTask = inputTask.trim();
        if (inputTask.length > 0 && dayjs().isBefore(taskDeadline)) {
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
          setOpenModal(false);
          taskInputRef.current.value = ``;
        } else {
          taskInputRef.current.style.borderColor = "red";
        }
      }
    } catch (e) {
      toast.error("Something went wrong");
      setOpenModal(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (taskInputRef.current)
      taskInputRef.current.style.borderColor = "#1C64F2";
    if (e.key === "Enter") {
      addTask();
    }
  };

  return (
    <>
      <Tooltip content="Click to Add ToDo Task" arrow={false}>
        <Button
          onClick={() => setOpenModal(true)}
          className="bg-[#4da0e6] rounded"
        >
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
              <input
                id="task"
                ref={taskInputRef}
                placeholder="Enter Your Task"
                onKeyDown={(e) => handleKeyDown(e)}
                autoComplete="off"
                className="rounded p-2 bg-[#f9fafb] w-full border outline-none border-[#bfc0c1] hover:border-black focus:border-[#1C64F2] focus:border-2"
              />
            </div>
            <div>
              <h4 className="text-lg text-gray-900 dark:text-white">
                Set Deadline
              </h4>
              <div className="flex gap-1">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={taskDeadline}
                    minDateTime={dayjs()}
                    onChange={(newDeadline: dayjs.Dayjs | null) => {
                      if (newDeadline) {
                        setTaskDeadline(newDeadline);
                      }
                    }}
                    slotProps={{
                      popper: {
                        placement: "right-end",
                        style: { width: "40%", height: "50%" },
                      },
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
                      "& .MuiButtonBase-root": {
                        position: "absolute",
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="w-full">
              <Button onClick={addTask} className="rounded">
                Add Todo
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddModal;
