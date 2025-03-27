'use client';

import React from 'react';
import HomeSection from '../components/HomeSection';
import { IoMdCall } from 'react-icons/io';
import { RiExternalLinkFill } from 'react-icons/ri';
import { IconType } from 'react-icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { MdEmail } from 'react-icons/md';

interface ContactCardProps {
  icon: IconType;
  contact: string;
  footer: string;
}

const ContactCard: React.FC<ContactCardProps> = ({
  icon: Icon,
  contact,
  footer,
}) => {
  return (
    <div className=" bg-white px-3 py-2 rounded-t-md flex justify-between items-center gap-3 border-b">
      <div className="flex gap-3">
        <div className="w-[3rem] h-[3rem] bg-[#424242] items-center justify-center flex rounded-full ">
          <Icon className="text-2xl text-white" />
        </div>
        <span>
          <p>{contact}</p>
          <p>{footer}</p>
        </span>
      </div>
      <RiExternalLinkFill className="text-3xl   text-[#424242]" />
    </div>
  );
};

const Page = () => {
  const { contactText, contactTitle, business } = useSelector(
    (state: RootState) => state.campaing
  );

  const contacts = [
    { icon: IoMdCall, contact: business?.phoneNumber ?? '', footer: 'Call us' },
    { icon: MdEmail, contact: business?.email ?? '', footer: 'Email us' },
  ];
  return (
    <div>
      <HomeSection
        headerText={contactTitle || 'Contact Us'}
        description={contactText || 'Get in touch'}
      />
      <div className="w-full px-[10rem] mt-7">
        {contacts.map((contact, i) => {
          return (
            <ContactCard
              key={i}
              icon={contact.icon}
              contact={contact.contact}
              footer={contact.footer}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Page;
