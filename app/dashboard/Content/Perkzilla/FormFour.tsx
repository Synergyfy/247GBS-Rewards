import React from 'react'
import PerkzillaDashboard from './PerkzillaDashboard';
import { IoMdPlayCircle } from 'react-icons/io';

const FormFour = ({ onBack }: { onBack: () => void }) => {
  const [showPerkzillaDashboard, setShowPerkzillaDashboard] = React.useState(false);
    return (
      <div className="grid grid-col-3 gap-4">
            {showPerkzillaDashboard ? (
                  <PerkzillaDashboard onBack={() => setShowPerkzillaDashboard(false)} />
                ) : (
                  <>
        <div className="flex flex-row p-4 justify-between">
          <div className="">Progress bar4</div>
          <div className="flex flex-row gap-4">
            <button onClick={onBack} className="border border-[#5864FF] text-[#5864FF] rounded-lg py-2 px-4">
              Go Back
            </button>
            <button onClick={() => setShowPerkzillaDashboard(true)} className="border border-[#5864FF] bg-[#5864FF] text-[#fff] rounded-lg px-4 py-2">
              Continue
            </button>
          </div>
        </div>

        <div className="flex flex-row gap-10 w-full ">
            <div className='row-span-3 w-1/2 flex flex-col shadow-lg rounded-md p-6 pb-20 gap-6'>
              <h1 className='font-medium'>Feature Tool Box</h1>
              <select className="block w-full p-2 border border-dashed border-[#DDE2FA] focus:border-[#2D3DFF] outline-none">
                <option value="Split Name">Split Name</option>
                <option value="Name1">Name 1</option>
                <option value="Name2">Name 2</option>
              </select>
              <div className='border border-dashed border-[#DDE2FA] p-2'>
                <input type="checkbox" className="mr-2" />
                <label> Placeholders</label>
              </div>
              <div className='border border-dashed border-[#DDE2FA] p-2'>
                <input type="checkbox" className="mr-2" />
                <label> Labels</label>
              </div>
              <div className='border border-dashed border-[#DDE2FA] p-2'>
                <input type="checkbox" className="mr-2" />
                <label> Consent Description</label>
              </div>
              <div className='flex flex-row justify-between gap-2'>
                <div className='border border-dashed border-[#DDE2FA] p-2 w-5/6'>
                  <input type="checkbox" className="mr-2" />
                  <label> Consent Checkbox</label>
                </div>
                <div className='flex flex-row  justify-center items-center gap-2'>
                  <button className='bg-[#2D3DFF] text-[#fff] px-2 rounded-sm'>+</button>
                  <button className='bg-[#DDE2FA] text-[#000] px-2 rounded-sm'>-</button>
                </div>
              </div>
              <div className="flex flex-row justify-center items-center p-14 cursor-pointer">
              <p className='text-[#8D92C3] text-center'>This Form collects information that we use to send you news, updates, promotions and special offers. We do not share or sell your information. You can unsubscribe at any time.
              </p>
              </div>
              <div className="flex flex-row justify-center items-center gap-2 cursor-pointer">
                <IoMdPlayCircle className="text-[#5864FF] w-12 h-12" /> 
                <p className="text-[#5864FF] font-medium">Watch Video Tutorial</p>
              </div>
            </div>
            <div className='row-span-3 w-1/2 flex flex-col shadow-lg rounded-md p-6 gap-4'>
            <h1 className='font-medium'>Form Preview</h1>
            <div className='flex flex-row gap-4'>
              <div className='w-full'>
                <label className='font-semibold'>First Name</label>
                <input type="text" placeholder='First Name' className="block w-full p-4 rounded-md bg-[#DDE2FA] focus:border-[#2D3DFF] outline-none" />
              </div>
              <div className='w-full'>
                <label  className='font-semibold'>Last Name</label>
                <input type="text" placeholder='Last Name' className="block w-full p-4 rounded-md bg-[#DDE2FA] focus:border-[#2D3DFF] outline-none" />
              </div>
            </div>
            <div className='w-full font-semibold'>
              <label>Email address</label>
              <input type="email" placeholder='you@email.com' className="block w-full p-4 rounded-md bg-[#DDE2FA] focus:border-[#2D3DFF] outline-none" />
            </div>
              <div className='p-2 flex flex-row items-center'>
                <input type="checkbox" className="mr-4 scale-150" />
                <label> Yes, I consent to receiving emails</label>
              </div>
              <p className='text-[#8D92C3]'>This Form collects information that we use to send you news, updates, promotions and special offers. We do not share or sell your information. You can unsubscribe at any time.</p>
              <p className="text-[#8D92C3] ">Privacy Policy</p>
              <button className="bg-[#5864FF] text-[#fff] rounded-md p-4">Enter to win</button>
          </div>
        </div>
            </>
          )}
      </div>
    );
  };

export default FormFour