'use client';

import React, { useState } from 'react';
import { IoMdAttach } from 'react-icons/io';
import TextEditor from './TextEditor';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { updateCampaignField } from '@/store/features/campaign';
import ToolTip from './ToolTip';

type SubTab = 'TOP BAR' | 'HOME' | 'EARN' | 'REDEEM' | 'CONTACT';

const ContentForm: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('TOP BAR');
  // For simplicity, we keep local state for the rich text fields as strings.

  const {
    topTitle,
    topHeadline,
    homeTitle,
    homeText,
    columnsTitle,
    col1Title,
    col1Text,
    col2Title,
    col2Text,
    col3Title,
    col3Text,
    earnText,
    earnTitle,
    redeemText,
    redeemTitle,
    contactText,
    contactTitle,
  } = useSelector((state: RootState) => state.campaing);

  const dispatch = useDispatch();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(updateCampaignField({ [name]: value }));
  };

  const handleTextEditorChange = (name: string, value: string) => {
    dispatch(updateCampaignField({ [name]: value }));
  };

  // A helper to render an “upload field” similar to previous examples.
  const renderImageInput = (placeholder: string) => (
    <div className="mt-2 flex items-center cursor-pointer p-2 border-b-2 border-[#838383]">
      <IoMdAttach className="mr-2 text-gray-500" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full outline-none"
      />
    </div>
  );

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex text-sm border-b border-gray-300 mb-4 py-2 gap-4 bg-gray-100 shadow-lg rounded-lg">
        {(['TOP BAR', 'HOME', 'EARN', 'REDEEM', 'CONTACT'] as SubTab[]).map(
          tab => (
            <div
              key={tab}
              className={`px-4 py-2 cursor-pointer font-semibold ${
                activeSubTab === tab
                  ? 'text-[#2D3DFF] font-bold'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveSubTab(tab)}
            >
              {tab}
            </div>
          )
        )}
      </div>

      {activeSubTab === 'TOP BAR' && (
        <div className="space-y-6">
          <p>Enter the title and headline of your campaign</p>
          <div>
            {/* <label className="block text-gray-700 mb-1">/label> */}
            <label className=" mb-1 flex items-center gap-2">
              Top Title
              <ToolTip content="The title at the top of your campaign page" />
            </label>
            <input
              type="text"
              placeholder="Top Title"
              className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
              value={topTitle}
              name="topTitle"
              onChange={handleInputChange}
            />
          </div>
          <div>
            {/* <label className="block text-gray-700 mb-1"></label> */}
            <label className=" mb-1 flex items-center gap-2">
              Headline
              <ToolTip content="The headline at the top of your campaign page" />
            </label>
            <input
              type="text"
              placeholder="Headline"
              className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
              value={topHeadline}
              name="topHeadline"
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}

      {activeSubTab === 'HOME' && (
        <div className="space-y-6">
          <div>
            {/* <label className="block text-gray-700 mb-1">Title (required)</label> */}
            <input
              type="text"
              placeholder="Title"
              className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
              value={homeTitle}
              name="homeTitle"
              onChange={handleInputChange}
            />
          </div>
          <div>
            {/* <label className="block text-gray-700 mb-1">Description</label> */}
            <TextEditor
              value={homeText}
              onChange={html => handleTextEditorChange('homeText', html)}
            />
          </div>
          <div>
            {/* <label className="block text-gray-700 mb-1">Header image</label> */}
            {renderImageInput('Header image')}
          </div>
          <p className="text-gray-600">
            The campaign home page may contain three columns with content
          </p>
          <div>
            {/* <label className="block text-gray-700 mb-1">Columns title</label> */}
            <input
              type="text"
              placeholder="Columns title"
              className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
              value={columnsTitle}
              name="columnsTitle"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <p className="text-lg font-medium">Column one</p>
            <input
              type="text"
              placeholder="Column one title"
              className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
              value={col1Title}
              name="col1Title"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <TextEditor
              value={col1Text ?? ''}
              onChange={html => handleTextEditorChange('col1Text', html)}
            />
          </div>
          <div>{renderImageInput('Column one image')}</div>
          <div>
            <p className="text-lg font-medium">Column two</p>
            <input
              type="text"
              placeholder="Column two title"
              className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
              value={col2Title}
              name="col2Title"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <TextEditor
              value={col2Text ?? ''}
              onChange={html => handleTextEditorChange('col2Text', html)}
            />
          </div>
          <div>{renderImageInput('Column two image')}</div>
          <p className="text-lg font-medium">Column three</p>
          <div>
            <input
              type="text"
              placeholder="Column three title"
              className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
              value={col3Title}
              name="col3Title"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <TextEditor
              value={col3Text ?? ''}
              onChange={html => handleTextEditorChange('col3Text', html)}
            />
          </div>
          <div>{renderImageInput('Column three image')}</div>
        </div>
      )}

      {activeSubTab === 'EARN' && (
        <div className="space-y-6">
          <div>
            {/* <label className="block text-gray-700 mb-1">Title (required)</label> */}
            <input
              type="text"
              placeholder="Title"
              className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
              value={earnTitle}
              name="earnTitle"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Description</label>
            <TextEditor
              value={earnText}
              onChange={html => handleTextEditorChange('earnText', html)}
            />
          </div>
          <div>
            {/* <label className="block text-gray-700 mb-1">Header image</label> */}
            {renderImageInput('Header image')}
          </div>
        </div>
      )}

      {activeSubTab === 'REDEEM' && (
        <div className="space-y-6">
          <div>
            {/* <label className="block text-gray-700 mb-1">Title (required)</label> */}
            <input
              type="text"
              placeholder="Title"
              className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
              value={redeemTitle}
              name="redeemTitle"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Description</label>
            <TextEditor
              value={redeemText}
              onChange={html => handleTextEditorChange('redeemText', html)}
            />
          </div>
          <div>
            {/* <label className="block text-gray-700 mb-1">Header image</label> */}
            {renderImageInput('Header image')}
          </div>
        </div>
      )}

      {activeSubTab === 'CONTACT' && (
        <div className="space-y-6">
          <div>
            {/* <label className="block text-gray-700 mb-1">Title (required)</label> */}
            <input
              type="text"
              placeholder="Title"
              className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
              name="contactTitle"
              value={contactTitle}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Description</label>
            <TextEditor
              value={contactText}
              onChange={html => handleTextEditorChange('contactText', html)}
            />
          </div>
          <div>
            {/* <label className="block text-gray-700 mb-1">Header image</label> */}
            {renderImageInput('Header image')}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentForm;
