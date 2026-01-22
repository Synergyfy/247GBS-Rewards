'use client';

import React, { useEffect } from 'react';
import HomeSection from '../components/HomeSection';
import { IconType } from 'react-icons';
import { FaHandHolding, FaQrcode } from 'react-icons/fa';
import { BsQrCodeScan } from 'react-icons/bs';
import { RiMessage2Fill } from 'react-icons/ri';
import { TbGiftCard } from 'react-icons/tb';
import VerifyCodeModal from '../components/enterCode';
import CustomerNumberModal from '../components/customerNumberModal';
import QRCodeModal from '../components/qrcodeModal';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { getCookieValue } from '@/services/getCookieValue';
import VerifyMerchantCodeModal from '../components/enterCodeMerchant';
import ScanStoreQRModal from '../components/scanStoreQRModal';

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
    <div className="w-[273px] h-[15rem] text-center bg-white shadow-md flex flex-col items-center justify-between p-4 space-y- text-[#424242] cursor-pointer rounded">
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
    const token = getCookieValue('customerToken');
    if (!token) router.push('/campaign/login');
  }, [router]);

  const {
    earnTitle,
    earnText,
    earnEnterCode,
    earnGiveStaffNumber,
    earnStaffPersonalCode,
    earnStaffScanQR,
    earnUserScanQR,
  } = useSelector((state: RootState) => state.campaing);
  const earnMethods = [
    {
      icon: BsQrCodeScan,
      title: 'Scan Store QR',
      description: 'Use your camera to scan the QR code in the store.',
      ModalComponent: ScanStoreQRModal,
      available: earnUserScanQR,
    },
    {
      icon: FaQrcode,
      title: 'QR code',
      description: 'Click this button and show the QR code to the merchant.',
      ModalComponent: QRCodeModal,
      available: earnStaffScanQR,
    },
    {
      icon: RiMessage2Fill,
      title: 'Enter code',
      description:
        'Enter the code you received from the merchant to claim the points.',
      ModalComponent: VerifyCodeModal,
      available: earnEnterCode,
    },
    {
      icon: FaHandHolding,
      title: 'Merchant Enters Code',
      description:
        'Hand over your phone so that the merchant can enter the code.',
      ModalComponent: VerifyMerchantCodeModal,
      available: earnStaffPersonalCode,
    },
    {
      icon: TbGiftCard,
      title: 'Customer Number',
      description:
        'Provide your customer number so the merchant can add points.',
      ModalComponent: CustomerNumberModal,
      available: earnGiveStaffNumber,
    },
  ];
  return (
    <div>
      <HomeSection
        headerText={earnTitle || 'Earn Points'}
        description={earnText || 'Get points for every dollar you spend.'}
      />

      <section className="w-full px-2 sm:px-[10rem] mt-7 ">
        <h3 className="font-medium text-xl sm:text-3xl">Get loyalty points</h3>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center flex-wrap mt-5">
          {earnMethods.map((method, i) => {
            if (method.available) {
              return <EarnMethod key={i} {...method} />;
            }
          })}
        </div>
      </section>
    </div>
  );
};

export default Page;
