"use client";

import React, { useState } from "react";
import { FaUserCircle, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import Image from "next/image";

const GeneralProfile = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>

          {/* Avatar Preview */}
          {avatar && (
            <div className="relative flex justify-center mt-4">
              <Image
                src={avatar}
                alt="Avatar Preview"
                width={300}
                height={300}
                className="w-80 h-80 rounded-full border border-gray-300"
              />
              <button
                onClick={handleRemoveAvatar}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <FaTimes size={16} />
              </button>
            </div>
          )}

          {/* Avatar Upload */}
          <div className="mb-4">
            <div className="relative flex items-center focus:border-[#2D3DFF] outline-none p-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="avatarInput"
              />
              <label
                htmlFor="avatarInput"
                className="cursor-pointer flex items-center"
              >
                <FaUserCircle className="text-gray-500 mr-2" size={100} />
              </label>
            </div>
          </div>

          <div className="mt-4 px-6">
            {/* Business Multi-Select */}
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Name"
                className="block w-full p-2 border-b border-[#838383] focus:border-[#2D3DFF] outline-none mb-4"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">E-mail address</label>
              <input
                type="email"
                placeholder="Email Address"
                className="block w-full p-2 border-b border-[#838383] focus:border-[#2D3DFF] outline-none mb-4"
              />
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

export default GeneralProfile;
