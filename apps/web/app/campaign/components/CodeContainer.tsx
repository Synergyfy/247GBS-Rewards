import React from 'react';
import { IoCopyOutline } from 'react-icons/io5';

const CodeContainer: React.FC<{ code: string }> = ({ code }) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        alert('Code copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="w-[15rem] h-[3rem] border border-black py-1 px-2 rounded flex items-center justify-between">
      <p className="text-xl font-medium">{code}</p>
      <IoCopyOutline className="cursor-pointer" onClick={handleCopy} />
    </div>
  );
};

export default CodeContainer;
