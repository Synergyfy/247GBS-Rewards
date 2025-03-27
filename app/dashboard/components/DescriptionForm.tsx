'use client';

import React, { useRef, useState, useEffect } from 'react';
import JoditEditor from 'jodit-react';

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
    placeholder: '',
    toolbar: true, // Enable the toolbar
    buttons: 'bold,italic,underline,|,link', // Define custom toolbar buttons
  };

  const handleUpdate = (newContent: string) => {
    setContent(newContent);
    setDescription(newContent); // Pass content to the parent
  };

  return (
    <div className="space-y-4">
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={handleUpdate} // Save content when focus is lost
      />
    </div>
  );
};

export default DescriptionForm;
