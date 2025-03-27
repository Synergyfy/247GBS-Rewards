"use client";

import React, { useState } from "react";
import Image from "next/image";
import McomImg from "@/public/mcom-illustration.png";
import { MdKeyboardArrowRight } from "react-icons/md";
import Perkzilla from "../Perkzilla/Perkzilla";

const McomSocialCommunity = () => {
  const [showPerkzilla, setShowPerkzilla] = useState(false);

  return (
    <div className="flex flex-col space-y-8">
      {showPerkzilla ? (
        <Perkzilla onBack={() => setShowPerkzilla(false)} />
      ) : (
        <>
          <div className="flex items-center">
            <Image
              src={McomImg}
              alt="Person explaining"
              width={500}
              height={500}
              className="w-96 h-auto"
            />
            <h2 className="text-5xl font-bold pl-8">WHAT IS MCOM PERKS?</h2>
          </div>

          <div className="flex flex-col w-1/2 gap-8 md:flex-row items-center justify-center space-x-4 space-y-8 md:space-y-0">
            <div className="relative w-64 h-[32rem] bg-black rounded-3xl p-2 flex flex-col items-center text-black">
              <div className="w-full h-full bg-[#fff] rounded-2xl flex flex-col justify-center items-center border-8">
                <p className="text-5xl font-bold">MCOM</p>
              </div>
            </div>

            <div className="relative w-64 h-[32rem] bg-gray-700 rounded-3xl p-2 flex flex-col items-center text-black">
              <div className="w-full h-full bg-[#fff] rounded-2xl flex flex-col justify-center items-center border-8">
                <p className="text-5xl font-bold">ECOM</p>
              </div>
            </div>
          </div>

          <div
            className=" flex justify-center items-center group cursor-pointer"
            onClick={() => setShowPerkzilla(true)}
          >
            <button className="flex px-6 hover:rounded-xl hover:shadow-lg items-center space-x-4 hover:bg-[#E3EBFA]">
              <p className="text-[#2D3DFF] font-bold text-2xl">Explore</p>
              <span>
                <MdKeyboardArrowRight className="text-[#2D3DFF] w-12 h-12 font-extrabold transform transition-transform duration-300 group-hover:translate-x-2" />
              </span>
            </button>
          </div>

          <p className="text-gray-600 text-xl text-start">
            Mcom Perks is a platform that provides exclusive benefits, rewards,
            and discounts for users who engage with our services. Stay connected
            and enjoy premium perks tailored just for you.
          </p>
        </>
      )}
    </div>
  );
};

export default McomSocialCommunity;
