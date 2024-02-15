import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "flowbite-react";
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
      <div className="w-full flex justify-end p-4 pr-8 bg-slate-100">
        <div className="w-fit flex gap-10 items-center">
          <img
            src={picture}
            alt="profile picture"
            className="h-10 w-10 rounded-full"
            title={name}
          />
          <span className="font-mono text-lg font-bold">Hello, {name}</span>
          <Button onClick={googleLogout}>Logout</Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
