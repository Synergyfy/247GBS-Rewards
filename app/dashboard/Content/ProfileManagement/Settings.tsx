import React from 'react'

const Settings = () => {
  return (
    <div className='flex justify-between'>
        <div className=' p-4 border-2 rounded-2xl'>
            Business
            <div className='flex items-center justify-between p-2  mb-2'>
                <label>Name of the Business</label>
                <input type='text' className='border border-[#000] rounded-lg ml-8' />
            </div>
            <div className='flex items-center justify-between p-2  mb-2'>
                <label>Address</label>
                <input type='text' className='border border-[#000] rounded-lg ml-8' />
            </div>
        </div>
        <div className='flex-col justify-between bg-yellow-200 p-4 '>
            <h1 className='mb-4'>Test Customer Screen:</h1>
            <div className='flex justify-between bg-green-200 p-2 border-4 border-[#000] rounded-2xl mb-4'></div>
            <div className='flex justify-between bg-green-200 p-2 border-4 border-[#000] rounded-2xl mb-4'></div>
        </div>
    </div>
  )
}

export default Settings