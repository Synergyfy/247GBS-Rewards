'use client';

import React, { useState } from 'react';
import ColorPicker from './ColorPicker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { updateCampaignField } from '@/store/features/campaign';
import ToolTip from './ToolTip';

type SubTab = 'BACKGROUND' | 'PRIMARY' | 'SECONDARY' | 'MOBILE MENU';

const ColorsForm: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('BACKGROUND');

  const dispatch = useDispatch();
  const {
    background,
    text,
    primaryBg,
    primaryText,
    secondaryBg,
    secondaryText,
    mobileNavActiveBg,
    mobileNavActiveText,
    mobileNavBg,
    mobileNavText,
  } = useSelector((state: RootState) => state.campaing);

  const handleColorChange = (name: string, color: string) => {
    dispatch(updateCampaignField({ [name]: color }));
  };

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex border-b border-gray-200 mb-6 space-x-2 overflow-x-auto">
        {(
          ['BACKGROUND', 'PRIMARY', 'SECONDARY', 'MOBILE MENU'] as SubTab[]
        ).map(tab => (
          <button
            key={tab}
            className={`pb-2 px-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeSubTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveSubTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeSubTab === 'BACKGROUND' && (
        <div className="space-y-6">
          <p className="text-gray-600 flex items-center gap-1">
            Customize the main background and text colors of your campaign website.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
               <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-700">Background</span>
                     <ToolTip content="The main background color of the page." />
               </div>
                <ColorPicker
                    color={background}
                    onChange={handleColorChange}
                    label="Background (Required)"
                    name="background"
                />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-700">Text</span>
                     <ToolTip content="The main text color." />
               </div>
                <ColorPicker
                    color={text}
                    onChange={handleColorChange}
                    label="Text (Required)"
                    name="text"
                />
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'PRIMARY' && (
        <div className="space-y-6">
          <p className="text-gray-600 flex gap-1 items-center">
             Customize the colors for the top navigation bar and footer.
          </p>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-700">Primary Background</span>
                     <ToolTip content="Background color for nav bar and footer." />
               </div>
                <ColorPicker
                color={primaryBg}
                label="Primary Background (Required)"
                onChange={handleColorChange}
                name="primaryBg"
                />
             </div>
             <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-700">Primary Text</span>
                     <ToolTip content="Text color for nav bar and footer." />
               </div>
                <ColorPicker
                color={primaryText}
                onChange={handleColorChange}
                label="Primary Text (Required)"
                name="primaryText"
                />
             </div>
          </div>
        </div>
      )}

      {activeSubTab === 'SECONDARY' && (
        <div className="space-y-6">
          <p className="text-gray-600">
            Customize colors for header backgrounds, footer social links, and overlays.
          </p>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-700">Secondary Background</span>
                     <ToolTip content="Secondary accent background color." />
               </div>
                <ColorPicker
                color={secondaryBg}
                onChange={handleColorChange}
                label="Secondary Background (Required)"
                name="secondaryBg"
                />
            </div>
            <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-700">Secondary Text</span>
                     <ToolTip content="Secondary accent text color." />
               </div>
                <ColorPicker
                color={secondaryText}
                onChange={handleColorChange}
                label="Secondary Text (Required)"
                name="secondaryText"
                />
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'MOBILE MENU' && (
        <div className="space-y-6">
          <p className="text-gray-600 flex items-center gap-1">
            Customize the appearance of the side menu on mobile devices.
          </p>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-700">Navigation Background</span>
                     <ToolTip content="Background color of the mobile menu." />
               </div>
                <ColorPicker
                color={mobileNavBg}
                name="mobileNavBg"
                onChange={handleColorChange}
                label="Navigation Background (Required)"
                />
            </div>
            <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-700">Navigation Text</span>
                     <ToolTip content="Text color of the mobile menu links." />
               </div>
                <ColorPicker
                color={mobileNavText}
                name="mobileNavText"
                onChange={handleColorChange}
                label="Navigation Text (Required)"
                />
            </div>
            <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-700">Active Item Background</span>
                     <ToolTip content="Background color of the active menu item." />
               </div>
                <ColorPicker
                color={mobileNavActiveBg}
                name="mobileNavActiveBg"
                onChange={handleColorChange}
                label="Navigation Active Background (Required)"
                />
            </div>
            <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-700">Active Item Text</span>
                     <ToolTip content="Text color of the active menu item." />
               </div>
                <ColorPicker
                color={mobileNavActiveText}
                name="mobileNavActiveText"
                onChange={handleColorChange}
                label="Navigation Active Text (Required)"
                />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorsForm;
