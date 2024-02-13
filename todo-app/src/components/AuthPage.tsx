import React, { FC } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/userSlice";

const AuthPage: FC = () => {
    const dispatch = useDispatch();

  return (
    <div className="flex justify-center items-center h-full">
      <GoogleLogin
        onSuccess={(credentialResponse: any) => {
          const decoded = jwtDecode(credentialResponse?.credential);
          dispatch(setUser(decoded))
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default AuthPage;
