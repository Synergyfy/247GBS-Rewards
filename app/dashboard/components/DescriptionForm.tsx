'use client';

import React, { useRef, useState, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import ToolTip from './ToolTip';

interface DescriptionFormProps {
  description: string;
  setDescription: (value: string) => void;
}

const DescriptionForm: React.FC<DescriptionFormProps> = ({
  description,
  setDescription,
}) => {
  const editor = useRef(null);
  const [content, setContent] = useState(description || '');

  useEffect(() => {
    if (description) {
      setContent(description);
    }
  }, [description]);

  const config = {
    readonly: false,
    height: 300,
    placeholder: 'Enter reward description here...',
    toolbar: true, // Enable the toolbar
    buttons: 'bold,italic,underline,|,link', // Define custom toolbar buttons
  };

  const handleUpdate = (newContent: string) => {
    setContent(newContent);
    setDescription(newContent); // Pass content to the parent
  };

  return (
    <div className="space-y-4">
       <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
          Reward Description
          <ToolTip content="Provide a detailed description of the reward for your customers." />
        </label>
      <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
        <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={handleUpdate} // Save content when focus is lost
        />
      </div>
    </div>
  );
};

export default DescriptionForm;
