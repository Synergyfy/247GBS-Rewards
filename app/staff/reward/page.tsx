'use client';

import React, { useEffect } from 'react';
import HomeSection from '../components/HomeSection';
import { IconType } from 'react-icons';
import { FaHandHolding, FaQrcode } from 'react-icons/fa';
import { TbGiftCard } from 'react-icons/tb';
import MerchantEntersCodeModal from '../components/merchantEntersCodeModalReward';
import EnterCustomerNumberModal from '../components/enterCustomerNumberModalReward';
import ScanQRModal from '../components/scanQRModalReward';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { getCookieValue } from '@/services/getCookieValue';

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
    redeemText,
    redeemTitle,
    redeemStaffScanQR,
    redeemGiveStaffNumber,
    redeemStaffPersonalCode,
  } = useSelector((state: RootState) => state.createCampaign);
  const earnMethods = [
    {
      icon: FaQrcode,
      title: 'QR code',
      description:
        'The customer display a QR Code that can be scanned by staff members',
      ModalComponent: ScanQRModal,
      available: redeemStaffScanQR,
    },

    {
      icon: FaHandHolding,
      title: 'Merchant Enters Code',
      description:
        "Generate a code that staff member can enter on customer's phone.",
      ModalComponent: MerchantEntersCodeModal,
      available: redeemStaffPersonalCode,
    },
    {
      icon: TbGiftCard,
      title: 'Customer Number',
      description: 'Redeem a reward with customer number',
      ModalComponent: EnterCustomerNumberModal,
      available: redeemGiveStaffNumber,
    },
  ];

  return (
    <div>
      <HomeSection headerText={redeemTitle} description={redeemText} />

      <section className="w-full px-2 sm:px-[10rem] mt-7 ">
        <h3 className="font-medium text-xl sm:text-3xl">
          Get loyalty rewards.
        </h3>
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
