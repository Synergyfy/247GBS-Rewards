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

interface SocialFields {
  label: 'facebook' | 'twitter' | 'instagram' | 'whatsapp';
  icon: React.JSX.Element;
}

const SocialForm: React.FC = () => {
  const socialFields: SocialFields[] = [
    { label: 'facebook', icon: <FaFacebookSquare className="mr-2" /> },
    { label: 'twitter', icon: <FaSquareXTwitter className="mr-2" /> },
    { label: 'instagram', icon: <FaInstagramSquare className="mr-2" /> },
    { label: 'whatsapp', icon: <FaWhatsappSquare className="mr-2" /> },
  ];

  const socials = useSelector((state: RootState) => state.businessSocials);
  const dispatch = useDispatch();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(addSocial({ [name]: value }));
  };

  return (
    <div className="space-y-4">
      <p className="text-lg">Enter your business social media links here</p>
      {socialFields.map((field, index) => (
        <div key={index} className="flex items-center mt-4">
          {field.icon}
          <input
            placeholder={field.label.toLocaleUpperCase()}
            className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none ml-2"
            name={field.label}
            value={socials[field.label]}
            onChange={handleInputChange}
          />
        </div>
      ))}
    </div>
  );
};

export default SocialForm;
