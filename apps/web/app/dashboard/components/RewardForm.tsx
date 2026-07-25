import { useGetRewards } from '@/services/hooks/reward/hook';
import { updateRewards } from '@/store/features/campaign';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToolTip from './ToolTip';
import MultiSelect, { OptionType } from './MultiSelect';
import { RewardType } from '@/services/hooks/reward/types';
import { RootState } from '@/store/store';

const RewardForm: React.FC = () => {
  const rewardIds = useSelector((state: RootState) => state.createCampaign.rewardIds);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    rewardIds || []
  );

  const dispatch = useDispatch();

  const { data } = useGetRewards();

  const reformRewardType = (options: RewardType[]) => {
    if (options) {
      const newOptions: OptionType[] = options.map(option => ({
        label: option.title,
        value: option.id ?? '',
      }));

      return newOptions;
    }
    return [{ label: '', value: '' }];
  };

  useEffect(() => {
    if (selectedOptions.length > 0) {
      dispatch(updateRewards({ ids: selectedOptions }));
    }
  }, [selectedOptions, dispatch]);

  return (
    <div className="space-y-6">
      <p className="text-gray-600">Select the rewards that will be available for customers in this campaign.</p>
      {/* Rewards dropdown */}
      <div>
        <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
          Rewards (required)
          <ToolTip content="Select one or more rewards to attach to this campaign." />
        </label>

        {data ? (
          <MultiSelect
            options={reformRewardType(data)}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            text="Select rewards..."
          />
        ) : (
          <p className="text-sm text-gray-500 italic">Loading rewards...</p>
        )}

        {data && data.length === 0 && (
          <p className="text-sm text-red-500 mt-2">No rewards found. Please create a reward first.</p>
        )}
      </div>
    </div>
  );
};

export default RewardForm;
