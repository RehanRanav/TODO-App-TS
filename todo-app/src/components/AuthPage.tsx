import { FC } from "react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/userSlice";
import { toast } from "react-toastify";
import { Button } from "flowbite-react";

const AuthPage: FC = () => {
  const dispatch = useDispatch();

  const login = useGoogleLogin({
    onSuccess: (credentialResponse: any) => {
      const decoded = jwtDecode(credentialResponse?.credential);
      dispatch(setUser(decoded));
    },
    onError: () => toast.error("Something went wrong"),
  });

  return (
    <div className="flex flex-col gap-10 justify-center items-center h-screen">
        <span className="text-gray-300">Login to your Account</span>
      <div className="text-gray-300 font-bold ">
        <div className="w-fit p-5 bg-slate-900 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-20 h-20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
      </div>

      <div className="w-fit rounded-full">
        <Button onClick={() => login()}>Login</Button>
      </div>
    </div>
  );
};

export default AuthPage;
