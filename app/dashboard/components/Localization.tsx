"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Localization = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
          <div className="mt-4 px-6">
            <div className="mb-4">
              <label className="block text-gray-700">Locale</label>
              <select className="block w-full p-2 border-b border-[#838383] focus:border-[#2D3DFF] outline-none">
                <option value=""></option>
                <option value="Synergyfy">Synergyfy</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Timezone</label>
              <select className="block w-full p-2 border-b border-[#838383] focus:border-[#2D3DFF] outline-none">
                <option value="Africa/Lagos">Africa/Lagos</option>
                <option value="Manchester">Manchester</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Currency</label>
              <select className="block w-full p-2 border-b border-[#838383] focus:border-[#2D3DFF] outline-none">
                <option value="">US Dollar (USD) </option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            {/* Password Input */}
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

export default Localization;
