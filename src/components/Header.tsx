import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Tooltip, theme } from "flowbite-react";
import { HiLogout } from "react-icons/hi";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { selectUser } from "../reducers/userSlice";
import { clearUser } from "../reducers/userSlice";
import { jwtDecode } from "jwt-decode";
import useTheme from "../context/theme";

const Header = () => {
  const credential: string = useSelector(selectUser) || "";
  const dispatch = useDispatch();
  const [name, setName] = useState();
  const [picture, setPicture] = useState();
  const { themeMode, darkTheme, lightTheme } = useTheme();

  useEffect(() => {
    const decoded: Record<string, any> = jwtDecode(credential);
    setName(decoded.name);
    setPicture(decoded.picture);
  }, [credential]);

  const googleLogout = () => {
    dispatch(clearUser());
  };

  const handleTheme = () => {
    if (themeMode === "light") {
      darkTheme();
    } else {
      lightTheme();
    }
  };

  return (
    <div>
      <div className="w-full flex justify-end p-4 pr-8 text-gray-500 dark:text-sky-100 bg-white dark:bg-sky-900">
        <div className="w-fit flex gap-4 items-center">
          <button
            className="p-2 rounded-md bg-stone-100 dark:bg-sky-700 dark:text-white"
            onClick={handleTheme}
          >
            {themeMode === "light" ? <MdDarkMode size={24}/> : <CiLight size={24} />}{" "}
          </button>

          <Tooltip content={name}>
            <span className="font-mono text-lg font-bold whitespace-nowrap text-ellipsis">
              Hello, {name}
            </span>
          </Tooltip>
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <img
                src={picture}
                alt="profile picture"
                className="w-10 md:h-10 rounded-full"
              />
            }
          >
            <Dropdown.Item icon={HiLogout} onClick={googleLogout}>
              Sign out
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Header;
