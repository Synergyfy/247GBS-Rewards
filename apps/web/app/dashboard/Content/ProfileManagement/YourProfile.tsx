'use client';

import React, { useState } from "react";
import GeneralProfile from "../../components/GeneralProfile";
import Localization from "../../components/Localization";
import ChangePassword from "../../components/ChangePassword";

const YourProfile = () => {
  const [activeTab, setActiveTab] = useState<
    "GENERAL" | "LOCALIZATION" | "CHANGE PASSWORD"
  >("GENERAL");

  const tabs: Array<"GENERAL" | "LOCALIZATION" | "CHANGE PASSWORD"> = [
    "GENERAL",
    "LOCALIZATION",
    "CHANGE PASSWORD",
  ];

  return (
    <div className="p-2 flex ">
      <div className="bg-white w-full py-6">
        <h2 className="text-2xl font-bold text-gray-800 text-left mb-6">Profile</h2>
        <div className="border-b border-gray-300 flex ">
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`px-6 py-3 cursor-pointer font-semibold text-lg transition-all duration-300 ${
                activeTab === tab
                  ? "text-[#2D3DFF] border-b-4 border-[#2D3DFF]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
        <div className="mt-6 ">
          {activeTab === "GENERAL" && <GeneralProfile />}
          {activeTab === "LOCALIZATION" && <Localization />}
          {activeTab === "CHANGE PASSWORD" && <ChangePassword />}
        </div>
        <div className="flex justify-end border-b-2 border-gray-300 mt-20 p-6 pt-4">
              <button className="px-4 py-2 font-semibold bg-[#2D3DFF] text-[#fff] rounded">
                UPDATE
              </button>
            </div>
      </div>
    </div>
  );
};

export default YourProfile;
