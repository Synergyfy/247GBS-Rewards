'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Audit from '@/public/StockAudit/audit.png';
import { useCreateSSOEntry } from '@/services/hooks/auth/hook';

const ExcessStockAudit = () => {
  const auditBaseURL = process.env.NEXT_PUBLIC_AUDIT_BASE_URL;
  const { isSuccess, isError, error, data, mutate, isPending } =
    useCreateSSOEntry();

  const handleClick = () => {
    if (!isPending) mutate();
  };

  useEffect(() => {
    if (isSuccess) {
      if (auditBaseURL) {
        const auditUrl = `${auditBaseURL}auditcalculator?ssoId=${encodeURIComponent(
          data
        )}`;
        window.open(auditUrl, '_blank');
      }
    } else if (isError) console.error(error);
  }, [isSuccess, auditBaseURL, data, isError, error]);

  return (
    <div className="flex flex-col items-center space-y-8">
      <h1 className="text-4xl font-bold">Welcome to Excess Stock Audit</h1>
      <Image src={Audit} alt="Audit Image" className="w-1/2 h-auto" />
      <button
        className="bg-blue-500 text-white py-2 px-8 border-2 w-1/6 border-[#000] rounded-full  cursor-pointer"
        onClick={handleClick}
      >
        <span className="text-[#fff] font-semibold text-xl">Explore</span>
      </button>
    </div>
  );
};

export default ExcessStockAudit;
