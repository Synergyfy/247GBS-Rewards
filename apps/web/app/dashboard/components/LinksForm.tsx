import { addLink } from '@/store/features/businessLink';
import { RootState } from '@/store/store';
import React, { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToolTip from './ToolTip';

const LinksForm: React.FC = () => {
  const linkFields = [
    { name: 'Website', tooltip: 'URL to your main company website.' },
    { name: 'LinkedIn', tooltip: 'URL to your LinkedIn company profile.' },
    { name: 'YouTube', tooltip: 'URL to your YouTube channel.' },
    { name: 'NFC LINK', tooltip: 'Link associated with your NFC tags.' },
    { name: 'MobileVcard', tooltip: 'Link to your digital business card (vCard).' },
  ];
  const links = useSelector((state: RootState) => state.businessLinks);
  const dispatch = useDispatch();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(addLink({ text: name, url: value }));
  };

  const findValue = (text: string) => {
    const link = links.find(link => link.text === text);
    return link?.url;
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Links that show in the footer of the campaign website. For example,
        links to the company website, or a specific page with additional
        information about the loyalty campaign.
      </p>
      <div className="space-y-4">
        {linkFields.map((field, index) => (
          <div key={index}>
             <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
                {field.name}
                <ToolTip content={field.tooltip} />
            </label>
            <input
              placeholder={`Enter ${field.name} URL`}
              className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              name={field.name}
              value={findValue(field.name) || ''}
              onChange={handleInputChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinksForm;
