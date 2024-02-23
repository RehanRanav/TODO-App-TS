import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Tooltip } from "flowbite-react";
import { HiLogout } from "react-icons/hi";
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
        <div className="w-fit flex gap-4 items-center">
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
