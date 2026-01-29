import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { updateRewardPageContent } from '@/store/features/campaign';

interface RewardPageFormProps {
    title?: string;
    message?: string;
    link?: string;
    setTitle?: (value: string) => void;
    setMessage?: (value: string) => void;
    setLink?: (value: string) => void;
}

const RewardPageForm: React.FC<RewardPageFormProps> = ({ title, message, link, setTitle, setMessage, setLink }) => {
    const dispatch = useDispatch();
    const campaign = useSelector((state: RootState) => state.createCampaign);

    // Determine values to use (props or Redux)
    const currentTitle = title !== undefined ? title : campaign.rewardPageTitle;
    const currentMessage = message !== undefined ? message : campaign.rewardPageMessage;
    const currentLink = link !== undefined ? link : campaign.rewardPageLink;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'rewardPageTitle') {
            if (setTitle) setTitle(value);
            else dispatch(updateRewardPageContent({ rewardPageTitle: value }));
        } else if (name === 'rewardPageMessage') {
            if (setMessage) setMessage(value);
            else dispatch(updateRewardPageContent({ rewardPageMessage: value }));
        } else if (name === 'rewardPageLink') {
            if (setLink) setLink(value);
            else dispatch(updateRewardPageContent({ rewardPageLink: value }));
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h3 className="text-blue-800 font-semibold mb-1">Customize Success Page</h3>
                <p className="text-blue-600 text-sm">
                    Customize the message your customers see after successfully redeeming a reward.
                    Leave blank to use the default system message.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Title Input */}
                <div className="space-y-2">
                    <label htmlFor="rewardPageTitle" className="block text-sm font-medium text-gray-700">
                        Success Page Title
                    </label>
                    <input
                        type="text"
                        id="rewardPageTitle"
                        name="rewardPageTitle"
                        value={currentTitle || ''}
                        onChange={handleChange}
                        placeholder="e.g., Congratulations!"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500">
                        The main heading displayed on the success screen.
                    </p>
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                    <label htmlFor="rewardPageMessage" className="block text-sm font-medium text-gray-700">
                        Success Page Message
                    </label>
                    <textarea
                        id="rewardPageMessage"
                        name="rewardPageMessage"
                        value={currentMessage || ''}
                        onChange={handleChange}
                        placeholder="e.g., You have successfully claimed your reward!"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    />
                    <p className="text-xs text-gray-500">
                        A subtitle or message providing more details.
                    </p>
                </div>

                {/* Link Input */}
                <div className="space-y-2">
                    <label htmlFor="rewardPageLink" className="block text-sm font-medium text-gray-700">
                        Success Page Button Link
                    </label>
                    <input
                        type="text"
                        id="rewardPageLink"
                        name="rewardPageLink"
                        value={currentLink || ''}
                        onChange={handleChange}
                        placeholder="e.g., https://yourwebsite.com/welcome"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500">
                        The link the button will point to on the success page.
                    </p>
                </div>
            </div>

            {/* Preview Section (Optional visualization) */}
            <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Preview</h4>
                <div className="bg-gray-100 p-8 rounded-xl flex justify-center">
                    <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-sm text-center border">
                        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-2xl">🎉</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {currentTitle || 'Congratulations!'}
                        </h2>
                        <p className="text-gray-500 mb-6">
                            {currentMessage || 'You have a new reward!'}
                        </p>
                        {currentLink && (
                            <div className="mt-4 p-3 bg-blue-600 text-white rounded-xl font-bold text-sm">
                                Custom Link Button
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RewardPageForm;
