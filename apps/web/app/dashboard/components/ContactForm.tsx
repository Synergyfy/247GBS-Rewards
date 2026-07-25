import { addContact } from '@/store/features/businessContact';
import { RootState } from '@/store/store';
import React, { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToolTip from './ToolTip';

interface ContactField {
  title: string;
  name:
    | 'email'
    | 'phoneNumber'
    | 'street'
    | 'website'
    | 'postalCode'
    | 'city'
    | 'state';
  tooltip: string;
  type?: string;
}

const ContactForm: React.FC = () => {
  const contactFields: ContactField[] = [
    {
      title: 'Email',
      name: 'email',
      tooltip: 'The primary contact email for business inquiries.',
      type: 'email'
    },
    {
      title: 'Phone Number',
      name: 'phoneNumber',
      tooltip: 'The primary contact phone number for your business.',
      type: 'tel'
    },
    {
      title: 'Website',
      name: 'website',
      tooltip: 'Your business official website URL.',
      type: 'url'
    },
    {
      title: 'Street',
      name: 'street',
      tooltip: 'The street address of your business location.',
      type: 'text'
    },
    {
      title: 'Postal Code',
      name: 'postalCode',
      tooltip: 'The postal or ZIP code for your business location.',
      type: 'text'
    },
    {
      title: 'City',
      name: 'city',
      tooltip: 'The city where your business is located.',
      type: 'text'
    },
    {
      title: 'State / Province',
      name: 'state',
      tooltip: 'The state, province, or region where your business is located.',
      type: 'text'
    },
  ];

  const contact = useSelector((state: RootState) => state.businessContact);
  const dispatch = useDispatch();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(addContact({ [name]: value }));
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600 mb-4">Fill your business contact details in this section.</p>
      {contactFields.map((field, index) => {
        const { title, name, tooltip, type } = field;
        return (
          <div key={index}>
             <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
                {title}
                <ToolTip content={tooltip} />
            </label>
            <input
              type={type || 'text'}
              placeholder={`Enter ${title.toLowerCase()}`}
              className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
              name={name}
              value={contact[name]}
              onChange={handleInputChange}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ContactForm;
