'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { BsGiftFill } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { FaTimes } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import { Bars } from 'react-loader-spinner';

// Import the extracted form components
import GeneralForm from '../../components/GeneralCampaignForm';
import RewardForm from '../../components/RewardForm';
import SettingsForm from '../../components/SettingsForm';
import ContentForm from '../../components/ContentForm';
import ColorsForm from '../../components/ColorsForm';
import {
  useCreateCampaign,
  useDeleteCampaign,
  useGetCampaigns,
  useUpdateCampaign,
} from '@/services/hooks/campaign/hook';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { CampaignType } from '@/services/hooks/campaign/types';
import { IoPencil } from 'react-icons/io5';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { resetCampaign, updateCampaignField } from '@/store/features/campaign';
import { GoPlus } from 'react-icons/go';
import Link from 'next/link';

import {
  Dialog as CNDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';

type MainTab = 'GENERAL' | 'REWARD' | 'SETTINGS' | 'CONTENT' | 'COLORS';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Campaign: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<MainTab>('GENERAL');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [campaignId, setCampaignId] = useState('');
  const [editMode, setEditMode] = useState(false);

  const [campaignToDelete, setCampaignToDelete] = useState<string>('');
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const tabs: MainTab[] = [
    'GENERAL',
    'REWARD',
    'SETTINGS',
    'CONTENT',
    'COLORS',
  ];

  const handleOpenModal = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsOpen(true);
    }, 500);
  };

  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(resetCampaign());
    setIsOpen(false);
    setEditMode(false);
    setErrorMsg('');
  }, [dispatch]);

  const handleOpenDeleteModal = (id: string) => {
    if (!openDeleteModal) {
      setOpenDeleteModal(true);
      setCampaignToDelete(id);
    }
  };

  const campaign = useSelector(
    (state: RootState) => state.campaing
  ) as CampaignType;

  const { data: fetchData, isLoading, refetch } = useGetCampaigns();

  const { mutate, isPending, isSuccess } = useCreateCampaign();

  const {
    mutate: deleteMutate,
    isSuccess: deleteSuccess,
    isPending: deletePending,
  } = useDeleteCampaign();

  const {
    mutate: updateMutate,
    isSuccess: updateSuccess,
    isPending: updatePending,
  } = useUpdateCampaign();

  const handleSubmit = () => {
    const { businessId, name, signupPoints, rewardIds, topHeadline, topTitle } =
      campaign;
    if (!businessId) {
      setActiveTab('GENERAL');
      setErrorMsg('Select a business');
    } else if (!name) {
      setActiveTab('GENERAL');
      setErrorMsg('Campaign name is required');
    } else if (!signupPoints) {
      setActiveTab('GENERAL');
      setErrorMsg('Signup points is required');
    } else if (rewardIds.length < 1) {
      setActiveTab('REWARD');
      setErrorMsg('Select one or more rewards');
    } else if (!topHeadline || !topTitle) {
      setActiveTab('CONTENT');
      setErrorMsg('Top headline and title is required');
    } else mutate(campaign);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      handleClose();
    }
  }, [isSuccess, refetch, handleClose]);

  useEffect(() => {
    if (updateSuccess) {
      refetch();
      handleClose();
    }
  }, [updateSuccess, refetch, handleClose]);

  useEffect(() => {
    if (deleteSuccess) {
      refetch();
      setOpenDeleteModal(false);
      setCampaignToDelete('');
    }
  }, [deleteSuccess, refetch]);

  const handleDelete = () => {
    if (!deletePending) deleteMutate(campaignToDelete);
  };
  const handleEdit = (id: string) => {
    const campaign: CampaignType | undefined = fetchData?.find(
      item => item.id === id
    );

    if (campaign) {
      dispatch(updateCampaignField(campaign));

      setCampaignId(id);
      setEditMode(true);
      setIsOpen(true);
    }
  };

  const processUpdate = () => {
    const { business, rewardIds } = campaign;
    const businessId = business?.id || '';

    updateMutate({
      id: campaignId,
      campaign: { ...campaign, businessId, rewardIds },
    });
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6 min-h-[80vh] relative">
      {fetchData && fetchData?.length < 1 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
                <BsGiftFill className="w-20 h-20 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Campaigns Found</h2>
            <p className="text-gray-500 max-w-md mb-8">
               You do not have any Campaign Setup. Create a campaign for your business so they can engage, earn points and use it to redeem rewards.
            </p>

            <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                onClick={handleOpenModal}
              >
                <GoPlus className="text-xl"/>
                Create a Campaign
              </button>

          {loading && (
            <div className="flex items-center justify-center mt-6">
              <Bars
                height="40"
                width="40"
                color="#2D3DFF"
                ariaLabel="bars-loading"
              />
            </div>
          )}
        </div>
      )}

      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
             <Dialog.Panel className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                 <div className="flex justify-between items-center border-b px-6 py-4">
                    <div>
                    <h2 className="text-xl font-bold text-gray-900">{editMode ? 'Edit Campaign' : 'Create Campaign'}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                         {editMode ? 'Update your campaign details.' : 'Set up a new loyalty campaign.'}
                    </p>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                     <FaTimes size={20} />
                    </button>
                </div>

            <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-4">
                    {/* Main Tabs */}
                    <div className="flex border-b border-gray-200 mb-6 space-x-2 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                            key={tab}
                            className={`pb-2 px-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                                activeTab === tab
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab(tab)}
                            >
                            {tab}
                            </button>
                        ))}
                    </div>

                    <div className="mt-2">
                        {errorMsg && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
                                <p>{errorMsg}</p>
                            </div>
                        )}
                        {activeTab === 'GENERAL' && <GeneralForm />}
                        {activeTab === 'REWARD' && <RewardForm />}
                        {activeTab === 'SETTINGS' && <SettingsForm />}
                        {activeTab === 'CONTENT' && <ContentForm />}
                        {activeTab === 'COLORS' && <ColorsForm />}
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                 <button
                    className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={handleClose}
                    disabled={isPending || updatePending}
                  >
                    Cancel
                  </button>
                {!editMode ? (
                   <button
                   className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
                   onClick={handleSubmit}
                   disabled={isPending}
                 >
                   {isPending ? 'Creating...' : 'Create Campaign'}
                 </button>
                ) : (
                    <button
                    className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
                    onClick={processUpdate}
                    disabled={updatePending}
                  >
                    {updatePending ? 'Updating...' : 'Update Campaign'}
                  </button>
                )}
            </div>
        </Dialog.Panel>
        </div>
      </Dialog>

      {fetchData && fetchData.length > 0 && (
        <div className="overflow-x-auto">
            <Table className="text-base">
            <TableCaption>A list of your campaigns.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead className="text-center w-[120px]">Sign up bonus</TableHead>
                <TableHead className="text-center w-[100px]">Customer</TableHead>
                <TableHead>Visit Campaign</TableHead>
                <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {!isLoading &&
                fetchData.map((item, i) => {
                    const { id, business, name, signupPoints, uniqueCode } = item;
                    return (
                    <TableRow key={i}>
                        <TableCell className="font-medium">
                        {business?.name}
                        </TableCell>
                        <TableCell>{name}</TableCell>
                        <TableCell className="text-center">
                        {signupPoints}
                        </TableCell>
                        <TableCell className="text-center">{0}</TableCell>
                        <TableCell>
                        <div className="flex items-center gap-3">
                            <Link
                            href={`/staff/${uniqueCode ?? ''}/`}
                            target="_blank"
                            className="text-blue-600 font-medium hover:underline text-sm"
                            >
                            Staff View
                            </Link>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <div className="w-8 h-8">
                                <QRCodeSVG
                                    value={`${baseUrl}campaign/${uniqueCode ?? ''}`}
                                    size={32}
                                />
                            </div>
                        </div>
                        </TableCell>
                        <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => handleEdit(id ?? '')}
                                className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                                title="Edit"
                            >
                            <IoPencil size={18}/>
                            </button>
                            <CNDialog
                            open={openDeleteModal}
                            onOpenChange={() => handleOpenDeleteModal(id ?? '')}
                            >
                            <DialogTrigger asChild>
                                <button className="text-gray-500 hover:text-red-600 transition-colors p-1" title="Delete">
                                    <MdDelete size={20} />
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>
                                    Are you absolutely sure?
                                </DialogTitle>
                                <DialogDescription>
                                    This action will delete the campaign.
                                </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                <Button
                                    type="button"
                                    variant={'outline'}
                                    onClick={() => setOpenDeleteModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    variant={'destructive'}
                                    onClick={handleDelete}
                                    disabled={deletePending}
                                >
                                    {deletePending ? 'Deleting...' : 'Confirm'}
                                </Button>
                                </DialogFooter>
                            </DialogContent>
                            </CNDialog>
                        </div>
                        </TableCell>
                    </TableRow>
                    );
                })}

                {isLoading && <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>}
            </TableBody>
            </Table>
        </div>
      )}

       {fetchData && fetchData.length > 0 && (
          <button
            className="fixed bottom-8 right-8 bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-105 transition-all z-40"
            onClick={() => setIsOpen(true)}
            title="Add New Campaign"
        >
            <GoPlus size={28} />
        </button>
      )}

    </section>
  );
};

export default Campaign;
