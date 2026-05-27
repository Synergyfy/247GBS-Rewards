import React from "react";
import { IoInformationCircle } from "react-icons/io5";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import FormTwo from "./FormTwo";

const FormOne = ({ onBack }: { onBack: () => void }) => {
      const [showFormTwo, setShowFormTwo] = React.useState(false);
  return (
    <div className="grid grid-col-3 gap-8">
          {showFormTwo ? (
                <FormTwo onBack={() => setShowFormTwo(false)} />
              ) : (
                <>
      <div className="flex flex-row p-4 justify-between">
        <div className="">Progress bar</div>
        <div className="flex flex-row gap-4">
          <button onClick={onBack} className="border border-[#5864FF] text-[#5864FF] rounded-lg py-2 px-4">
            Go Back
          </button>
          <button onClick={() => setShowFormTwo(true)} className="border border-[#5864FF] bg-[#5864FF] text-[#fff] rounded-lg px-4 py-2">
            Continue
          </button>
        </div>
      </div>
      <div className="flex flex-col rounded-lg shadow-lg p-6  gap-10">
        <h1 className="text-[#767676] font-bold text-xl">Campaign Name</h1>
        <div className="flex gap-4 items-center">
            <input type="text" placeholder="First Name"  className="p-2 border border-[#DDE2FA] rounded-lg w-11/12"/>
            <IoInformationCircle  className="w-8 h-8 text-[#DDE2FA]"/>
        </div>
        <div className="flex gap-4 items-center">
            <input type="text" placeholder="Website"  className="p-2 border border-[#DDE2FA] rounded-lg w-11/12"/>
            <IoInformationCircle  className="w-8 h-8 text-[#DDE2FA]"/>
        </div>
        <div className="flex gap-4 justify-start items-center w-1/2 mb-6">
            <FaToggleOn className="w-8 h-8 text-[#DDE2FA]"/>
            <FaToggleOff className="w-8 h-8 text-[#DDE2FA]"/>
            <p className="text-[#767676] text-sm"> want to use a dedicated landing page?</p>
            <IoInformationCircle  className="w-8 h-8 text-[#DDE2FA]"/>
        </div>
      </div>
      <div className="flex flex-col rounded-lg shadow-lg p-6 gap-14">
        <h1 className="text-[#767676] mt-4 font-bold text-xl">Campaign End Date</h1>
        <input type="date" className="w-2/3 rounded-lg p-2 border mb-20 border-[#DDE2FA] focus:border-[#2D3DFF] outline-none" />
      </div>
          </>
        )}
    </div>
  );
};

export default FormOne;
