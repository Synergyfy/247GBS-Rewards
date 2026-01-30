'use client';

import React, { useEffect } from 'react';
import HomeSection from '../components/HomeSection';
import { IconType } from 'react-icons';
import { FaHandHolding, FaQrcode } from 'react-icons/fa';
import { RiMessage2Fill } from 'react-icons/ri';
import { TbGiftCard } from 'react-icons/tb';
import GenerateCodeModal from '../components/generateCodeModal';
import MerchantEntersCodeModal from '../components/merchantEntersCodeModal';
import EnterCustomerNumberModal from '../components/enterCustomerNumberModal';
import ScanQRModal from '../components/scanQRModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getCookieValue } from '@/services/getCookieValue';
import { useRouter } from 'next/navigation';

interface EarnMethodProps {
  icon: IconType;
  title: string;
  description: string;
  ModalComponent: React.ComponentType;
}
const EarnMethod: React.FC<EarnMethodProps> = ({
  icon: Icon,
  title,
  description,
  ModalComponent,
}) => {
  return (
    <div className="w-[273px] h-[15rem] text-center bg-white shadow-md flex flex-col items-center justify-center p-4 space-y- text-[#424242] cursor-pointer rounded">
      <Icon className="text-[5rem]" />
      <h3 className="font-medium text-xl">{title}</h3>
      <p className="text-lg text-[#757575]">{description}</p>
      <ModalComponent />
    </div>
  );
};

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getCookieValue('staffToken');
    if (!token) router.push('/staff/login');
  });

  const {
    earnText,
    earnTitle,
    earnEnterCode,
    earnGiveStaffNumber,
    earnStaffPersonalCode,
    earnStaffScanQR,
  } = useSelector((state: RootState) => state.createCampaign);
  const earnMethods = [
    {
      icon: FaQrcode,
      title: 'QR code',
      description:
        'The customer display a QR Code that can be scanned by staff members',
      ModalComponent: ScanQRModal,
      available: earnStaffScanQR,
    },
    {
      icon: RiMessage2Fill,
      title: 'Enter code',
      description: 'Generate a code that you can give to the customer',
      ModalComponent: GenerateCodeModal,
      available: earnEnterCode,
    },
    {
      icon: FaHandHolding,
      title: 'Merchant Enters Code',
      description:
        "Generate a code that staff member can enter on customer's phone.",
      ModalComponent: MerchantEntersCodeModal,
      available: earnStaffPersonalCode,
    },
    {
      icon: TbGiftCard,
      title: 'Customer Number',
      description: 'Add points to customer account using customer number',
      ModalComponent: EnterCustomerNumberModal,
      available: earnGiveStaffNumber,
    },
  ];

  return (
    <div>
      <HomeSection headerText={earnTitle} description={earnText} />

      <section className="w-full px-2 sm:px-[10rem] mt-7 ">
        <h3 className="font-medium text-xl sm:text-3xl">Get loyalty points</h3>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center flex-wrap mt-5">
          {earnMethods.map((method, i) => {
            if (method.available) {
              return (
                <span key={i}>
                  <EarnMethod {...method} />
                </span>
              );
            }
          })}
        </div>
      </section>
    </div>
  );
};

export default Page;
