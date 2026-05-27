"use client";

import React from "react";
import { MdOutlineControlPointDuplicate } from "react-icons/md";

const Earning = () => {

  return (
    <div className="p-24">
      <div className="flex flex-col px-24 gap-6">
        <MdOutlineControlPointDuplicate className="w-40 h-40 text-[#2D3DFF]" />
        <h1 className="font-semibold text-2xl">There are no analytics available yet</h1>
        <p className="text-base">
          Earning analytics will show here when customers redeem points.
        </p>
      </div>
    </div>
  );
};

export default Earning;
