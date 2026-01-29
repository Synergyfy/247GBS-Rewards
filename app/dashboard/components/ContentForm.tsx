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
  } = useSelector((state: RootState) => state.createCampaign);

  const dispatch = useDispatch();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(updateCampaignField({ [name]: value }));
  };

  const handleTextEditorChange = (name: string, value: string) => {
    dispatch(updateCampaignField({ [name]: value }));
  };

  // A helper to render an “upload field” similar to previous examples.
  const renderImageInput = (placeholder: string, tooltip: string) => (
    <div className="mt-4">
      <label className="mb-2 flex items-center gap-2 font-medium text-gray-700 text-sm">
        {placeholder}
        <ToolTip content={tooltip} />
      </label>
      <label className="flex items-center justify-center cursor-pointer w-full p-3 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 hover:bg-gray-50 transition-all">
        <IoMdAttach className="mr-2 text-gray-500" />
        <span className="text-sm text-gray-600">Upload Image</span>
        <input
          type="file"
          className="hidden"
        // Add onChange handler here if implemented
        />
      </label>
    </div>
  );

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex border-b border-gray-200 mb-6 space-x-2 overflow-x-auto">
        {(['TOP BAR', 'HOME', 'EARN', 'REDEEM', 'CONTACT'] as SubTab[]).map(
          tab => (
            <button
              key={tab}
              className={`pb-2 px-3 font-medium transition-colors border-b-2 whitespace-nowrap ${activeSubTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setActiveSubTab(tab)}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {activeSubTab === 'TOP BAR' && (
        <div className="space-y-6">
          <p className="text-gray-600">Enter the title and headline of your campaign that appears at the top.</p>
          <div>
            <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
              Top Title
              <ToolTip content="The title displayed at the very top of your campaign page." />
            </label>
            <input
              type="text"
              placeholder="e.g. Welcome"
              className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              value={topTitle}
              name="topTitle"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
              Headline
              <ToolTip content="The main headline text for your campaign." />
            </label>
            <input
              type="text"
              placeholder="e.g. Join our Loyalty Program"
              className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
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
            <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
              Home Title
              <ToolTip content="The title for the home section." />
            </label>
            <input
              type="text"
              placeholder="Title"
              className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              value={homeTitle}
              name="homeTitle"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
              Description
              <ToolTip content="The main content description for the home section." />
            </label>
            <TextEditor
              value={homeText}
              onChange={html => handleTextEditorChange('homeText', html)}
            />
          </div>
          <div>
            {renderImageInput('Header image', 'The header image for the home section.')}
          </div>

          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Columns</h3>
            <p className="text-gray-600 mb-4">
              The campaign home page may contain three columns with content.
            </p>
            <div>
              <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
                Columns title
                <ToolTip content="The overall title for the columns section." />
              </label>
              <input
                type="text"
                placeholder="Columns title"
                className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                value={columnsTitle}
                name="columnsTitle"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-4 border p-4 rounded-md bg-gray-50">
            <p className="text-lg font-medium text-blue-600">Column one</p>
            <div>
              <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
                Title
                <ToolTip content="Title for the first column." />
              </label>
              <input
                type="text"
                placeholder="Column one title"
                className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                value={col1Title}
                name="col1Title"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
                Content
                <ToolTip content="Content for the first column." />
              </label>
              <TextEditor
                value={col1Text ?? ''}
                onChange={html => handleTextEditorChange('col1Text', html)}
              />
            </div>
            <div>{renderImageInput('Column one image', 'Image for the first column.')}</div>
          </div>

          <div className="space-y-4 border p-4 rounded-md bg-gray-50">
            <p className="text-lg font-medium text-blue-600">Column two</p>
            <div>
              <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
                Title
                <ToolTip content="Title for the second column." />
              </label>
              <input
                type="text"
                placeholder="Column two title"
                className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                value={col2Title}
                name="col2Title"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
                Content
                <ToolTip content="Content for the second column." />
              </label>
              <TextEditor
                value={col2Text ?? ''}
                onChange={html => handleTextEditorChange('col2Text', html)}
              />
            </div>
            <div>{renderImageInput('Column two image', 'Image for the second column.')}</div>
          </div>

          <div className="space-y-4 border p-4 rounded-md bg-gray-50">
            <p className="text-lg font-medium text-blue-600">Column three</p>
            <div>
              <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
                Title
                <ToolTip content="Title for the third column." />
              </label>
              <input
                type="text"
                placeholder="Column three title"
                className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                value={col3Title}
                name="col3Title"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
                Content
                <ToolTip content="Content for the third column." />
              </label>
              <TextEditor
                value={col3Text ?? ''}
                onChange={html => handleTextEditorChange('col3Text', html)}
              />
            </div>
            <div>{renderImageInput('Column three image', 'Image for the third column.')}</div>
          </div>
        </div>
      )}

      {activeSubTab === 'EARN' && (
        <div className="space-y-6">
          <div>
            <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
              Title
              <ToolTip content="The title for the 'Earn' section." />
            </label>
            <input
              type="text"
              placeholder="Title"
              className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              value={earnTitle}
              name="earnTitle"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
              Description
              <ToolTip content="Instructions on how to earn points." />
            </label>
            <TextEditor
              value={earnText}
              onChange={html => handleTextEditorChange('earnText', html)}
            />
          </div>
          <div>
            {renderImageInput('Header image', 'Header image for the Earn section.')}
          </div>
        </div>
      )}

      {activeSubTab === 'REDEEM' && (
        <div className="space-y-6">
          <div>
            <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
              Title
              <ToolTip content="The title for the 'Redeem' section." />
            </label>
            <input
              type="text"
              placeholder="Title"
              className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              value={redeemTitle}
              name="redeemTitle"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
              Description
              <ToolTip content="Instructions on how to redeem rewards." />
            </label>
            <TextEditor
              value={redeemText}
              onChange={html => handleTextEditorChange('redeemText', html)}
            />
          </div>
          <div>
            {renderImageInput('Header image', 'Header image for the Redeem section.')}
          </div>
        </div>
      )}

      {activeSubTab === 'CONTACT' && (
        <div className="space-y-6">
          <div>
            <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
              Title
              <ToolTip content="The title for the 'Contact' section." />
            </label>
            <input
              type="text"
              placeholder="Title"
              className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              name="contactTitle"
              value={contactTitle}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
              Description
              <ToolTip content="Contact information or instructions." />
            </label>
            <TextEditor
              value={contactText}
              onChange={html => handleTextEditorChange('contactText', html)}
            />
          </div>
          <div>
            {renderImageInput('Header image', 'Header image for the Contact section.')}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentForm;
