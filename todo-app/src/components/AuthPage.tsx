import { FC } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/userSlice";

const AuthPage: FC = () => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-10 justify-center items-center h-screen">
      <span className="text-gray-300 font-bold font-sans text-4xl">
        Sign Up
      </span>
      <div className="w-fit p-5 text-gray-300 bg-slate-900 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-20 h-20"
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div className="w-fit rounded-full">
        <GoogleLogin
        onSuccess={(credentialResponse: any) => {
          dispatch(setUser(credentialResponse?.credential));
        }}
        onError={() => {
          console.log("Login Failed");
        }}
        theme="filled_blue"
        size="large"
        text="continue_with"
        shape="pill"
      />
      </div>
    </div>
  );
};

export default AuthPage;
