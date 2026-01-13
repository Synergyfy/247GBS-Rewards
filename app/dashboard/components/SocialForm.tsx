import { addSocial } from '@/store/features/businessSocials';
import { RootState } from '@/store/store';
import React, { ChangeEvent } from 'react';
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaWhatsappSquare,
} from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import ToolTip from './ToolTip';

interface SocialFields {
  label: 'facebook' | 'twitter' | 'instagram' | 'whatsapp';
  icon: React.JSX.Element;
  tooltip: string;
}

const SocialForm: React.FC = () => {
  const socialFields: SocialFields[] = [
    {
        label: 'facebook',
        icon: <FaFacebookSquare className="mr-2 text-blue-600 text-xl" />,
        tooltip: 'Enter your Facebook page URL.'
    },
    {
        label: 'twitter',
        icon: <FaSquareXTwitter className="mr-2 text-black text-xl" />,
        tooltip: 'Enter your X (Twitter) profile URL.'
    },
    {
        label: 'instagram',
        icon: <FaInstagramSquare className="mr-2 text-pink-600 text-xl" />,
        tooltip: 'Enter your Instagram profile URL.'
    },
    {
        label: 'whatsapp',
        icon: <FaWhatsappSquare className="mr-2 text-green-600 text-xl" />,
        tooltip: 'Enter your WhatsApp business number or link.'
    },
  ];

  const socials = useSelector((state: RootState) => state.businessSocials);
  const dispatch = useDispatch();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(addSocial({ [name]: value }));
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600">Enter your business social media links here so customers can connect with you.</p>
      {socialFields.map((field, index) => (
        <div key={index}>
            <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 uppercase text-sm">
                {field.label}
                <ToolTip content={field.tooltip} />
            </label>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    {field.icon}
                </div>
                <input
                    placeholder={`https://${field.label}.com/...`}
                    className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none ml-2 transition-colors"
                    name={field.label}
                    value={socials[field.label]}
                    onChange={handleInputChange}
                />
            </div>
        </div>
      ))}
    </div>
  );
};

export default SocialForm;
