import { addContact } from '@/store/features/businessContact';
import { RootState } from '@/store/store';
import React, { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
}

const ContactForm: React.FC = () => {
  const contactFields: ContactField[] = [
    { title: 'Email', name: 'email' },
    { title: 'Phone Number', name: 'phoneNumber' },
    { title: 'Website', name: 'website' },
    { title: 'Street', name: 'street' },
    { title: 'Postal Code', name: 'postalCode' },
    { title: 'City', name: 'city' },
    { title: 'State / Province', name: 'state' },
  ];

  const contact = useSelector((state: RootState) => state.businessContact);
  const dispatch = useDispatch();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(addContact({ [name]: value }));
  };

  return (
    <div className="space-y-4">
      <p>Fill your business contact details in this section.</p>
      {contactFields.map((field, index) => {
        const { title, name } = field;
        return (
          <div key={index}>
            {/* <label className="block text-gray-700 mb-1">{field}</label> */}
            <input
              placeholder={title}
              className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
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
