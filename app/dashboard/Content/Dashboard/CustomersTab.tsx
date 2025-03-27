import React, { useState } from "react";
import { RiUserStarFill } from "react-icons/ri";
import { IoIosArrowDown } from "react-icons/io";

const CustomersTab = () => {
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div className="m-8 p-2 shadow rounded">
      <button className="bg-[#252CFB] text-[#fff] px-6 py-2 items-center text-lg cursor-pointer rounded-lg font-bold ">
        + ADD CUSTOMER
      </button>

      <div className="flex flex-row justify-between p-2">
        <div className="flex gap-4 justify-between">
          <span className="flex items-center gap-4">
            <label>Show</label>
            <input
              type="text"
              placeholder="10"
              className="p-2 rounded border border-[#000] w-16 items-center"
            />
          </span>
          <span className="flex items-center gap-2 relative ml-6">
            <label className="mr-20">entries</label>
            <div className="cursor-pointer" onClick={() => setShowOptions(!showOptions)}>
              <IoIosArrowDown />
            </div>
            {showOptions && (
              <ul className="absolute top-full left-0 mt-1 bg-white border border-[#000] rounded shadow-md w-full">
                <li className="p-2 cursor-pointer hover:bg-gray-200">10</li>
                <li className="p-2 cursor-pointer hover:bg-gray-200">25</li>
                <li className="p-2 cursor-pointer hover:bg-gray-200">50</li>
                <li className="p-2 cursor-pointer hover:bg-gray-200">100</li>
              </ul>
            )}
          </span>
        </div>
        <div className="">
          <label className="flex items-center">
            <span className="text-[#000]">Search</span>
            <input
              type="search"
              className="shadow rounded-lg px-6 py-2 ml-4 border-2 border-[#000]"
            />
          </label>
        </div>
      </div>

      <table className="w-full border-collapse border  mt-4">
        <thead className="bg-[#D9D9D9]">
          <tr className="text-left text-sm text-[#000]">
            <th className="p-4">THE CUSTOMER</th>
            <th className="p-4">LAST VISIT</th>
            <th className="p-4">NUMBER OF VISITS</th>
            <th className="p-4">NUMBER OF COUPON OBTAINED</th>
            <th className="p-4">ACTION</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          <tr className="border-b border-[#ddd]">
            <td className="p-4">
              <div className="w-14 h-14 rounded-full p-3 flex items-center bg-[#6C63FF] text-[#000] justify-center">
              <RiUserStarFill />
              </div>
            </td>
            <td className="p-4">Friday, 27 December 2024</td>
            <td className="p-4">2</td>
            <td className="p-4">0</td>
            <td className="p-4">
              <button className="bg-[#252CFB] text-[#fff] px-6 py-2 text-lg cursor-pointer rounded-lg font-bold">
                DETAIL
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4 px-4 text-sm text-[#000]">
        <span>Showing 1 of 1 entries</span>
        <div className="flex gap-4">
          <button className="text-[#252CFB]">Previous</button>
          <span className="w-10 h-10 rounded-full bg-[#252CFB] flex items-center justify-center p-4 text-[#fff]">1</span>
          <button className="text-[#252CFB]">Next</button>
        </div>
      </div>
    </div>
  );
};

export default CustomersTab;
