import React from 'react'
import FormFour from './FormFour';
import { IoInformationCircle } from "react-icons/io5";
import { IoTrophy } from "react-icons/io5";
import { RiGift2Fill } from "react-icons/ri";
import { FaRandom } from "react-icons/fa";

interface FormThreeProps {
  onBack: () => void;
}

const FormThree: React.FC<FormThreeProps> = ({ onBack }) => {
  const [showFormFour, setShowFormFour] = React.useState(false);
      return (
        <div className="grid grid-col-3 gap-8">
              {showFormFour ? (
                    <FormFour onBack={() => setShowFormFour(false)} />
                  ) : (
                    <>
          <div className="flex flex-row p-4 justify-between">
            <div className="">Progress bar3</div>
            <div className="flex flex-row gap-4">
              <button onClick={onBack} className="border border-[#5864FF] text-[#5864FF] rounded-lg py-2 px-4">
                Go Back
              </button>
              <button onClick={() => setShowFormFour(true)} className="border border-[#5864FF] bg-[#5864FF] text-[#fff] rounded-lg px-4 py-2">
                Continue
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center p-6 gap-10">
            <div className="flex gap-4 items-center w-3/4">
              <div className="flex flex-row items-center gap-10 p-6 border bg-[#337BED] w-11/12">
              <div className='flex items-center p-8 bg-[#fff] bg-opacity-25'>
                <IoTrophy className='w-10 h-10 text-[#fff]'/>
              </div>
              <div className='flex flex-col gap-2'>
                <h1 className='text-[#fff] font-medium text-3xl'>Based on Leaderboard</h1>
                <p className='text-[#fff] text-sm'>Participants with the most points or entries win.</p>
              </div>
              </div> 
              <IoInformationCircle  className="w-8 h-8 text-[#DDE2FA]"/>
            </div>
            <div className="flex gap-4 items-center w-3/4">
              <div className="flex flex-row items-center gap-10 p-6 border bg-[#37CBAC] w-11/12">
                    <div className='flex items-center p-8 bg-[#fff] bg-opacity-25'>
                      <RiGift2Fill className='w-10 h-10 text-[#fff]'/>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <h1 className='text-[#fff] font-medium text-3xl'>Probability Based</h1>
                      <p className='text-[#fff] text-sm'>Selection is weighted based on total entries.</p>
                    </div>
              </div> 
              <IoInformationCircle  className="w-8 h-8 text-[#DDE2FA]"/>
            </div>
            <div className="flex gap-4 items-center w-3/4">
              <div className="flex flex-row items-center gap-10 p-6 border bg-[#FDA772]  w-11/12">
              <div className='flex items-center p-8 bg-[#fff] bg-opacity-25'>
                <FaRandom className='w-10 h-10 text-[#fff]'/>
              </div>
              <div className='flex flex-col gap-2'>
                <h1 className='text-[#fff] font-medium text-3xl'>Randomly</h1>
                <p className='text-[#fff] text-sm'>Select winners randomly regardless of entries.</p>
              </div>
              </div> 
              <IoInformationCircle  className="w-8 h-8 text-[#DDE2FA]"/>
            </div>
        </div>
              </>
            )}
        </div>
      );
    };

export default FormThree