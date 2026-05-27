import React from "react";
import FormThree from "./FormThree";
import Image from "next/image";
import Giveaway from "@/public/Perkzilla/Giveaway.png";
import { IoGift } from "react-icons/io5";
import { RiArrowRightFill } from "react-icons/ri";
import { IoMdPlayCircle } from "react-icons/io";

const FormTwo = ({ onBack }: { onBack: () => void }) => {
  const [showFormThree, setShowFormThree] = React.useState(false);
    return (
      <div className="grid grid-col-3 gap-8">
            {showFormThree ? (
                  <FormThree onBack={() => setShowFormThree(false)} />
                ) : (
                  <>
        <div className="flex flex-row p-4 justify-between">
          <div className="">Progress bar2</div>
          <div className="flex flex-row gap-4">
            <button onClick={onBack} className="border border-[#5864FF] text-[#5864FF] rounded-lg py-2 px-4">
              Go Back
            </button>
            <button onClick={() => setShowFormThree(true)} className="border border-[#5864FF] bg-[#5864FF] text-[#fff] rounded-lg px-4 py-2">
              Continue
            </button>
          </div>
        </div>

        <div className="flex flex-col p-6  gap-10">
            <div className="flex flex-row justify-between items-center bg-[#fff] p-6 gap-4 border border-[#DDE2FA] w-2/3">
                <Image src={Giveaway} width={100} height={100} alt="Gift box" />
                <div>
                    <h1 className="font-bold text-xl">Sample Prize Name</h1> 
                    <p className="mt-6 text-sm text-[#767676]">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ea, blanditiis, rem eveniet rerum deleniti minus earum voluptas nostrum odit adipisci ipsam molestiae, asperiores odio explicabo quos quas dignissimos hic eligendi</p>
                </div>
                <button className="py-2 px-4 w-2/3 bg-[#DDE2FA] text-[#5864FF] border-4 border-[#fff] rounded-full shadow-md">
                    1 Winner
                </button>
            </div>
            <div className="flex flex-row justify-between items-center py-6 pb-20 gap-4 border-b border-[#DDE2FA] w-4/5">
                <div className="flex flex-row items-center gap-2">
                <IoGift className="mr-4 w-8 h-8 text-[#5864FF]"/> 
                    Set up delivery details <RiArrowRightFill />
                </div>
                <button className="p-2 w-1/3 bg-[#DDE2FA] text-[#5864FF] font-bold">
                    + Add Additional Prize
                </button>
            </div>
            <div className="flex flex-row justify-between items-center p-6 gap-4 w-4/5">
                <p className="text-[#8D92C3] w-2/3">
                    Here you can set up the prizes participants can win i your contest, Simply click on any text or image to edit it.
                </p>
                <div className="flex flex-row items-center gap-2 cursor-pointer">
                    <IoMdPlayCircle className="text-[#5864FF] w-12 h-12" /> 
                    <p className="text-[#5864FF]">Watch Video Tutorial</p>
                </div>
            </div>
        </div>
            </>
          )}
      </div>
    );
  };

export default FormTwo;
