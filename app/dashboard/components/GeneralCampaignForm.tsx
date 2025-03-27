import { useGetBusiness } from '@/services/hooks/business/hook';
import { updateCampaignField } from '@/store/features/campaign';
import { RootState } from '@/store/store';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToolTip from './ToolTip';

const GeneralForm: React.FC = () => {
  const { businessId, name, signupPoints, customDomain } = useSelector(
    (state: RootState) => state.campaing
  );

  const dispatch = useDispatch();

  const handleInputChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    dispatch(updateCampaignField({ [name]: value }));
  };

  const { data } = useGetBusiness();
  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        This section is where you provide the general information of your
        campaign.{' '}
      </p>
      {/* Business dropdown */}
      <div>
        <label className=" mb-1 flex items-center gap-2">
          Business (required)
          <ToolTip content="Staff member fullname" />
        </label>
        <select
          name="businessId"
          className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
          value={businessId}
          onChange={handleInputChange}
        >
          <option value="">Select Business</option>
          {/* Add your options here */}
          {data &&
            data?.map((item, i) => (
              <option value={item.id} key={i}>
                {item.name}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label className=" mb-1 flex items-center gap-2">
          Campaign name (required)
          <ToolTip content="Enter the campaign's name" />
        </label>
        <input
          type="text"
          placeholder="Campaign Name"
          className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
          name="name"
          value={name}
          onChange={handleInputChange}
        />
      </div>
      {/* Points for sign-up */}
      <div>
        <label className=" mb-1 flex items-center gap-2">
          Signup Point
          <ToolTip content="This is the amount of points customers receive for signing up" />
        </label>
        <input
          type="number"
          placeholder="Points Customer receive for signing up (required)"
          className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
          name="signupPoints"
          value={signupPoints}
          onChange={handleInputChange}
        />
      </div>
      {/* Custom Domain */}
      <div>
        {/* <label className="block text-gray-700 mb-1">Custom domain</label> */}
        <input
          type="text"
          placeholder="Custom domain"
          className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
          name="customDomain"
          value={customDomain}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default GeneralForm;
