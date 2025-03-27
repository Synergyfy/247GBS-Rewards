import { addLink } from '@/store/features/businessLink';
import { RootState } from '@/store/store';
import React, { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const LinksForm: React.FC = () => {
  const linkFields = [
    'Website',
    'LinkedIn',
    'YouTube',
    'NFC LINK',
    'MobileVcard',
  ];
  const links = useSelector((state: RootState) => state.businessLinks);
  const dispatch = useDispatch();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    dispatch(addLink({ text: name, url: value }));
  };

  const findValue = (text: string) => {
    const link = links.find(link => link.text === text);
    return link?.url;
  };
  return (
    <div>
      <p className="text-gray-600 mb-4">
        Links that show in the footer of the campaign website. For example,
        links to the company website, or a specific page with additional
        information about the loyalty campaign.
      </p>
      <div className="space-y-6">
        {linkFields.map((field, index) => (
          <div key={index}>
            {/* <label className="block text-gray-700 mb-1">{field}</label> */}
            <input
              placeholder={field}
              className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
              name={field}
              value={findValue(field) || ''}
              onChange={handleInputChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinksForm;
