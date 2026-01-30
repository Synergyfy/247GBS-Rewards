'use client';

import React, { useEffect, useState } from 'react';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface TextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // On mount or when the value changes from parent,
  // convert the incoming HTML to EditorState.
  useEffect(() => {
    if (value) {
      const blocksFromHtml = htmlToDraft(value);
      if (blocksFromHtml) {
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));
      }
    }
  }, [value]);

  const onEditorStateChange = (newState: EditorState) => {
    setEditorState(newState);
    const rawContentState = convertToRaw(newState.getCurrentContent());
    const html = draftToHtml(rawContentState);
    onChange(html);
  };

  return (
    <div className="my-2">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          options: ['inline', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
        }}
        editorClassName="border p-2 min-h-[300px] prose prose-sm max-w-none"
      />
    </div>
  );
};

export default TextEditor;
