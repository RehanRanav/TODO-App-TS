import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function AuthPage() {
  return (
    <div className="flex justify-center items-center h-full">
      <GoogleLogin
        onSuccess={(credentialResponse:any) => {
          const decoded = jwtDecode(credentialResponse?.credential);
          console.log(decoded);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
}

export default AuthPage;
