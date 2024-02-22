import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Tooltip } from "flowbite-react";
import { selectUser } from "../reducers/userSlice";
import { clearUser } from "../reducers/userSlice";

const Header = () => {
  const { name, picture } = useSelector(selectUser) || {};
  const dispatch = useDispatch();

  const googleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <div>
      <div className="w-full flex justify-end p-4 pr-8 text-[#EEEEEE] bg-slate-800">
        <div className="w-fit flex gap-10 items-center">
          <Tooltip content={name}>
            <img
              src={picture}
              alt="profile picture"
              className="w-10 md:h-10 rounded-full"
            />
          </Tooltip>
          <span className="font-mono text-lg font-bold">Hello, {name}</span>
          <Button onClick={googleLogout} className="bg-[#00ADB5] rounded-full">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
