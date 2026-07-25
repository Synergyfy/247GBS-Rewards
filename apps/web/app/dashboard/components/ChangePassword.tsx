"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePassword = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
          <div className="mt-4 px-6">
          <div className="flex flex-row items-center relative mt-8">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Change Password"
                className="block w-full p-4 border-b border-[#838383] focus:border-[#2D3DFF] outline-none"
              />
              <span
                className="absolute right-3 top-5 cursor-pointer text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>   

            <div className="flex flex-row items-center relative mt-8">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Current Password"
                className="block w-full p-4 border border-[#838383] rounded-md focus:border-[#2D3DFF] outline-none"
              />
              <span
                className="absolute right-3 top-5 cursor-pointer text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>          
          </div>
    </div>
  );
};

export default ChangePassword;
