import { useGetRewards } from '@/services/hooks/reward/hook';
import { updateRewards } from '@/store/features/campaign';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToolTip from './ToolTip';
import MultiSelect, { OptionType } from './MultiSelect';
import { RewardType } from '@/services/hooks/reward/types';
import { RootState } from '@/store/store';

const RewardForm: React.FC = () => {
  const rewardIds = useSelector((state: RootState) => state.campaing.rewardIds);
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
      {/* Rewards dropdown */}
      <div>
        <label className=" mb-1 flex items-center gap-2">
          Rewards (required)
          <ToolTip content="Select a reward for this campaign" />
        </label>
        <label className="block text-gray-700 mb-1"></label>

        {data && (
          <MultiSelect
            options={reformRewardType(data)}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            text="Select rewards for this campaign"
          />
        )}
      </div>
    </div>
  );
};

export default RewardForm;
