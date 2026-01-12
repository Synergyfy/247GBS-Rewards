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
        campaign.
      </p>
      {/* Business dropdown */}
      <div>
         <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
          Business (required)
          <ToolTip content="Select the business this campaign belongs to." />
        </label>
        <select
          name="businessId"
          className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          value={businessId}
          onChange={handleInputChange}
        >
          <option value="">Select Business</option>
          {data &&
            data?.map((item, i) => (
              <option value={item.id} key={i}>
                {item.name}
              </option>
            ))}
        </select>
      </div>
      <div>
         <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
          Campaign name (required)
          <ToolTip content="Enter a unique name for your campaign." />
        </label>
        <input
          type="text"
          placeholder="e.g. Summer Sale 2024"
          className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          name="name"
          value={name}
          onChange={handleInputChange}
        />
      </div>
      {/* Points for sign-up */}
      <div>
         <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
          Signup Point
          <ToolTip content="This is the amount of points customers receive instantly for signing up." />
        </label>
        <input
          type="number"
          placeholder="0"
          className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          name="signupPoints"
          value={signupPoints}
          onChange={handleInputChange}
        />
      </div>
      {/* Custom Domain */}
      <div>
         <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
            Custom domain
             <ToolTip content="Enter a custom domain for your campaign website (optional)." />
         </label>
        <input
          type="text"
          placeholder="e.g. campaign.yourbusiness.com"
          className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          name="customDomain"
          value={customDomain}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default GeneralForm;
