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
      <div className="flex text-sm border-b border-gray-300 mb-4 py-2 gap-4 bg-gray-100 shadow-lg rounded-lg">
        {(
          ['BACKGROUND', 'PRIMARY', 'SECONDARY', 'MOBILE MENU'] as SubTab[]
        ).map(tab => (
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
        ))}
      </div>

      {activeSubTab === 'BACKGROUND' && (
        <div className="space-y-6">
          <p className="text-lg flex items-center gap-1">
            Website Background and Text
            <ToolTip content="Specify the background and text color for your campaign page" />
          </p>
          <ColorPicker
            color={background}
            onChange={handleColorChange}
            label="Background (Required)"
            name="background"
          />

          <ColorPicker
            color={text}
            onChange={handleColorChange}
            label="Text (Required)"
            name="text"
          />
        </div>
      )}

      {activeSubTab === 'PRIMARY' && (
        <div className="space-y-6">
          <p className="text-lg flex gap-1 items-center">
            Top Navigation and Footer{' '}
            <ToolTip content="Specify the background and text color top navigation bar and footer" />
          </p>
          <div>
            <ColorPicker
              color={primaryBg}
              label="Primary Background (Required)"
              onChange={handleColorChange}
              name="primaryBg"
            />
            <ColorPicker
              color={primaryText}
              onChange={handleColorChange}
              label="Primary Text (Required)"
              name="primaryText"
            />
          </div>
        </div>
      )}

      {activeSubTab === 'SECONDARY' && (
        <div className="space-y-6">
          <p className="text-lg">
            Header background and footer social links. Opacity for image
            overlay.
          </p>
          <div>
            <ColorPicker
              color={secondaryBg}
              onChange={handleColorChange}
              label="Secondary Background (Required)"
              name="secondaryBg"
            />
            <ColorPicker
              color={secondaryText}
              onChange={handleColorChange}
              label="Secondary Text (Required)"
              name="secondaryText"
            />
          </div>
        </div>
      )}

      {activeSubTab === 'MOBILE MENU' && (
        <div className="space-y-6">
          <p className="text-lg flex items-center gap-1">
            Side menu on mobile devices.
            <ToolTip content="Specify the background and text color for your campaign page on mobile devices" />
          </p>
          <div>
            <ColorPicker
              color={mobileNavBg}
              name="mobileNavBg"
              onChange={handleColorChange}
              label="Navigation Background (Required)"
            />
            <ColorPicker
              color={mobileNavText}
              name="mobileNavText"
              onChange={handleColorChange}
              label="Navigation Text (Required)"
            />
            <ColorPicker
              color={mobileNavActiveBg}
              name="mobileNavActiveBg"
              onChange={handleColorChange}
              label="Navigation Active Background (Required)"
            />

            <ColorPicker
              color={mobileNavActiveText}
              name="mobileNavActiveText"
              onChange={handleColorChange}
              label="Navigation Active Text (Required)"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorsForm;
