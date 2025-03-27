'use client';

import React from 'react';
import { IconType } from 'react-icons';
import { FaHandHolding, FaQrcode } from 'react-icons/fa';
import { TbGiftCard } from 'react-icons/tb';
import QRCodeModal from './qrcodeModalReward';
import VerifyCodeModal from './enterCodeReward';
import CustomerNumberModal from './customerNumberModalReward';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

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

const RewardSection = () => {
  const { redeemStaffScanQR, redeemGiveStaffNumber, redeemStaffPersonalCode } =
    useSelector((state: RootState) => state.campaing);

  const earnMethods = [
    {
      icon: FaQrcode,
      title: 'QR code',
      description:
        'The customer display a QR Code that can be scanned by staff members',
      ModalComponent: QRCodeModal,
      available: redeemStaffScanQR,
    },

    {
      icon: FaHandHolding,
      title: 'Enter Merchant Code',
      description: 'Enter code given by the staff to redeem',
      ModalComponent: VerifyCodeModal,
      available: redeemStaffPersonalCode,
    },
    {
      icon: TbGiftCard,
      title: 'Customer Number',
      description: 'Redeem a reward with customer number',
      ModalComponent: CustomerNumberModal,
      available: redeemGiveStaffNumber,
    },
  ];

  return (
    <div>
      <section className="w-full px-2 sm:px-[10rem] mt-7 ">
        <h3 className="font-medium text-xl sm:text-3xl">Redeem Reward</h3>
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

export default RewardSection;
