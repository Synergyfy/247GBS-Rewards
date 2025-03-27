'use client';

import dynamic from 'next/dynamic';
import { Sidebar } from './Sidebar/Sidebar';
import Navbar from './Navbar/Navbar';
import { useState, JSX } from 'react';
const Settings = dynamic(() => import('./Content/ProfileManagement/Settings'), { ssr: false });
const QRScanner = dynamic(() => import('./Content/Dashboard/QRCodeScanner'), { ssr: false });
const CustomersTab = dynamic(() => import('./Content/Dashboard/CustomersTab'), { ssr: false });
const AdminOnlyFeature = dynamic(() => import('./Content/Dashboard/AdminOnlyFeature'), { ssr: false });
const Earning = dynamic(() => import('./Content/Analytics/Earning'), { ssr: false });
const QRCodeScanHistory = dynamic(() => import('./Content/Analytics/QRCodeScanHistory'), { ssr: false });
const Spending = dynamic(() => import('./Content/Analytics/Spending'), { ssr: false });
const YourProfile = dynamic(() => import('./Content/ProfileManagement/YourProfile'), { ssr: false });
const Businesses = dynamic(() => import('./Content/ProfileManagement/Businesses'), { ssr: false });
const Staff = dynamic(() => import('./Content/ProfileManagement/Staff'), { ssr: false });
const NationalMembership = dynamic(() => import('./Content/ProfileManagement/NationalMembership'), { ssr: false });
const Consumers = dynamic(() => import('./Content/ProfileManagement/Consumers'), { ssr: false });
const AccountManagers = dynamic(() => import('./Content/ProfileManagement/AccountManagers'), { ssr: false });
const Agents = dynamic(() => import('./Content/ProfileManagement/Agents'), { ssr: false });
const Consultants = dynamic(() => import('./Content/ProfileManagement/Consultants'), { ssr: false });
const Segment = dynamic(() => import('./Content/ProfileManagement/Segment'), { ssr: false });
const McomPerks = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/McomPerks'), { ssr: false });
const QRCode = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/QRCode'), { ssr: false });
const McomCards = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/McomCards'), { ssr: false });
const NFCCardtap = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/NFCCardtap'), { ssr: false });
const NFCTags = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/NFCTags'), { ssr: false });
const Nearby = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/Nearby'), { ssr: false });
const Rewards = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/Rewards'), { ssr: false });
const Campaign = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/Campaign'), { ssr: false });
const MCOMAIBots = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/MCOMAIBots'), { ssr: false });
const SeasonalMarketingPeriods = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/SeasonalMarketingPeriods'), { ssr: false });
const ExcessStockAudit = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/ExcessStockAudit'), { ssr: false });
const SpareCapacityAudit = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/SpareCapacityAudit'), { ssr: false });
const McomNewsletter = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/McomNewsletter'), { ssr: false });
const WhiteLabelConsortium = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/WhiteLabelConsortium'), { ssr: false });
const Promotion = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/Promotion'), { ssr: false });
const McomSocialCommunity = dynamic(() => import('./Content/MCOMBOTSSolutionsAndProgrammes/McomSocialCommunity'), { ssr: false });
const McomPoints = dynamic(() => import('./Content/MCOMAccessandSettings/McomPoints'), { ssr: false });
const McomCredits = dynamic(() => import('./Content/MCOMAccessandSettings/McomCredits'), { ssr: false });
const McomStamps = dynamic(() => import('./Content/MCOMAccessandSettings/McomStamps'), { ssr: false });
const McomTokens = dynamic(() => import('./Content/MCOMAccessandSettings/McomTokens'), { ssr: false });
const McomWhiteLabelPardner = dynamic(() => import('./Content/MCOMAccessandSettings/McomTokens'), { ssr: false });
const McomExchangeAndRedeem = dynamic(() => import('./Content/MCOMAccessandSettings/McomTokens'), { ssr: false });

const componentsMap: { [key: string]: JSX.Element } = {
  'Settings': <Settings />,
  'QR Code Scanner': <QRScanner setScannedResult={() => {}} />,
  'Customers Tab': <CustomersTab />,
  'Admin only feature': <AdminOnlyFeature />,
  'Earning': <Earning />,
  'Spending': <Spending />,
  'QR Code Scan history': <QRCodeScanHistory />,
  'Your profile': <YourProfile />,
  'National Membership': <NationalMembership />,
  'Businesses': <Businesses />,
  'Staff': <Staff />,
  'Consumers': <Consumers />,
  'Agents': <Agents />,
  'Consultants': <Consultants />,
  'Segment': <Segment />,
  'Account Managers': <AccountManagers />,
  'Mcom Perks': <McomPerks />,
  'Promotion': <Promotion />,
  'QR Code': <QRCode />,
  'Mcom Cards': <McomCards />,
  'NFC Cardtap': <NFCCardtap />,
  'NFC Tags': <NFCTags />,
  'Mcom Social Community': <McomSocialCommunity />,
  'MCOM AI Bots': <MCOMAIBots />,
  'Nearby': <Nearby />,
  'Rewards': <Rewards />,
  'Campaign': <Campaign />,
  'Seasonal Marketing periods x4': <SeasonalMarketingPeriods />,
  'Excess Stock Audit': <ExcessStockAudit />,
  'Spare Capacity Audit': <SpareCapacityAudit />,
  'Mcom Newsletter': <McomNewsletter />,
  'White Label Consortium': <WhiteLabelConsortium />,
  'Mcom Points': <McomPoints />,
  'Mcom Credits': <McomCredits />,
  'Mcom Stamps': <McomStamps />,
  'Mcom Tokens': <McomTokens />,
  'Mcom White Label Pardner': <McomWhiteLabelPardner />,
  'Mcom Exchange and Redeem': <McomExchangeAndRedeem />,
};

export default function Page() {
  const [selectedComponent, setSelectedComponent] =
    useState<string>('Settings');

  // Function to update navbar title dynamically
  const handleSelect = (label: string) => {
    setSelectedComponent(label);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSelect={handleSelect} />
      <div className="flex-1 flex flex-col">
        <Navbar activeTab={selectedComponent} />
        <div className="flex-1 p-6 overflow-auto">
          {componentsMap[selectedComponent]}
        </div>
      </div>
    </div>
  );
}
