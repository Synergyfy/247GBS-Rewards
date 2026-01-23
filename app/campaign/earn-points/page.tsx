'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Hash, Hand, User, Info } from "lucide-react";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { getCookieValue } from '@/services/getCookieValue';

// Modals
import QRCodeModal from '../components/qrcodeModal';
import VerifyCodeModal from '../components/enterCode';
import VerifyMerchantCodeModal from '../components/enterCodeMerchant';
import CustomerNumberModal from '../components/customerNumberModal';

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
  } = useSelector((state: RootState) => state.campaing);

  const earnMethods = [
    {
      icon: QrCode,
      title: 'QR Code',
      description: 'Show your unique QR code to the merchant to scan and add points.',
      ModalComponent: QRCodeModal,
      available: earnStaffScanQR,
    },
    {
      icon: Hash,
      title: 'Enter Code',
      description: 'Enter the code provided by the merchant to claim your points.',
      ModalComponent: VerifyCodeModal,
      available: earnEnterCode,
    },
    {
      icon: Hand,
      title: 'Merchant Enters Code',
      description: 'Hand your phone to the merchant to enter their secure code.',
      ModalComponent: VerifyMerchantCodeModal,
      available: earnStaffPersonalCode,
    },
    {
      icon: User,
      title: 'Customer Number',
      description: 'Provide your customer number to the merchant to add points.',
      ModalComponent: CustomerNumberModal,
      available: earnGiveStaffNumber,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            {earnTitle || 'Earn Points'}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            {earnText || 'Choose your preferred method to collect points and unlock exciting rewards.'}
          </p>
        </div>

        {/* Earn Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {earnMethods.map((method, index) => {
            if (!method.available) return null;
            return (
              <Card key={index} className="group relative overflow-hidden bg-white border-none shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 rounded-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-[#2D3DFF] opacity-0 group-hover:opacity-100 transition-opacity" />

                <CardHeader className="p-8 pb-4 text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-50 text-[#2D3DFF] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#2D3DFF] group-hover:text-white transition-all duration-500 shadow-sm">
                    <method.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{method.title}</CardTitle>
                </CardHeader>

                <CardContent className="p-8 pt-0 flex flex-col h-full">
                  <CardDescription className="text-base text-gray-500 text-center mb-8 flex-grow leading-relaxed">
                    {method.description}
                  </CardDescription>

                  <div className="mt-auto">
                    <method.ModalComponent />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alternative Actions / Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Info className="w-4 h-4" />
            Having trouble? Please contact merchant support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
