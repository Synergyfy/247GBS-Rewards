'use client';

import React, { useEffect, useState } from 'react';
import { BsGiftFill } from 'react-icons/bs';
import { MdDelete, MdKeyboardArrowRight } from 'react-icons/md';
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
  // const [logoPreview, setLogoPreview] = useState<string | null>(null);

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

  const {} = useCreateCampaign;

  const handleOpenModal = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsOpen(true);
    }, 1500);
  };

  // const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (files && files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = () => setLogoPreview(reader.result as string);
  //     reader.readAsDataURL(files[0]);
  //   }
  // };

  // const removeLogo = () => {
  //   setLogoPreview(null);
  // };

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(resetCampaign());
    setIsOpen(false);
    setEditMode(false);
    setErrorMsg('');
  };

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
  }, [isSuccess, refetch]);

  useEffect(() => {
    if (updateSuccess) {
      refetch();
      handleClose();
    }
  }, [updateSuccess, refetch]);

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
    <section>
      {fetchData && fetchData?.length < 1 && (
        <div className="p-24">
          <div className="px-24">
            <BsGiftFill className="w-40 h-40 text-[#2D3DFF]" />
            <p className="text-2xl">You do not have any Campaign Setup</p>
          </div>
          <div className="px-24 flex justify-end items-center">
            <p
              className="text-[#2D3DFF] font-bold text-xl cursor-pointer"
              onClick={handleOpenModal}
            >
              Create a Campaign
            </p>
            <span>
              <MdKeyboardArrowRight
                className="text-[#2D3DFF] w-12 h-12 font-extrabold cursor-pointer"
                onClick={handleOpenModal}
              />
            </span>
          </div>

          {loading && (
            <div className="flex items-center text-center text-xl mt-10">
              <Bars
                height="80"
                width="80"
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
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      >
        {/*
          Adding max-h-[90vh] ensures that the modal panel will scroll if its content is too tall.
          This is especially helpful for the CONTENT tab's HOME sub-tab.
        */}
        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center border-b p-6 pb-4">
            <span>
              <h2 className="text-2xl font-bold">Create Campaign</h2>
              <p className="text-gray-600 w-[90%]">
                Create a campaign for your business so they can engage, earn
                points and use it to redeem rewards
              </p>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-2xl font-bold"
            >
              <FaTimes />
            </button>
          </div>
          <div className="mt-4">
            {/* Main Tabs */}
            <div className="flex border-b border-gray-300 mb-6">
              {tabs.map(tab => (
                <div
                  key={tab}
                  className={`px-4 py-2 cursor-pointer font-semibold ${
                    activeTab === tab
                      ? 'text-[#2D3DFF] border-b-4 border-[#2D3DFF]'
                      : 'text-gray-500'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </div>
              ))}
            </div>

            <div className="mt-2 px-6">
              {errorMsg && (
                <p className="text-red-600 text-lg my-3">{errorMsg}</p>
              )}
              {activeTab === 'GENERAL' && <GeneralForm />}
              {activeTab === 'REWARD' && <RewardForm />}
              {activeTab === 'SETTINGS' && <SettingsForm />}
              {activeTab === 'CONTENT' && <ContentForm />}
              {activeTab === 'COLORS' && <ColorsForm />}
            </div>
          </div>
          {!editMode ? (
            <div className="flex justify-end border-t border-gray-300 mt-20 p-6 pt-4">
              <button
                className="px-4 py-2 bg-transparent font-semibold text-[#2D3DFF] rounded"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? 'CREATING...' : 'CREATE'}
              </button>
              <button
                className="px-4 py-2 mr-2 bg-transparent font-semibold rounded"
                onClick={handleClose}
                disabled={isPending}
              >
                CLOSE
              </button>
            </div>
          ) : (
            <div className="flex justify-end border-t border-gray-300 mt-20 p-6 pt-4">
              <button
                className="px-4 py-2 bg-transparent font-semibold text-[#2D3DFF] rounded"
                onClick={processUpdate}
                disabled={updatePending}
              >
                {updatePending ? 'UPDATING...' : 'UPDATE'}
              </button>
              <button
                className="px-4 py-2 mr-2 bg-transparent font-semibold rounded"
                onClick={handleClose}
                disabled={updatePending}
              >
                CLOSE
              </button>
            </div>
          )}
        </Dialog.Panel>
      </Dialog>

      {fetchData && fetchData.length > 0 && (
        <Table className="">
          <TableCaption>Your Businesses</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead className="w-[10rem]">Sign up bonus</TableHead>
              <TableHead className="w-[6rem]">Customer</TableHead>
              <TableHead>Visit Campaign</TableHead>
              <TableHead>Action</TableHead>
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
                      <div className="flex gap-1">
                        <Link
                          href={`/staff/${uniqueCode ?? ''}/`}
                          target="_blank"
                        >
                          <p className="text-blue-800 font-medium hover:underline">
                            Staff
                          </p>
                        </Link>
                        |
                        <QRCodeSVG
                          value={`${baseUrl}campaign/${uniqueCode ?? ''}`}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <span onClick={() => handleEdit(id ?? '')}>
                          <IoPencil />
                        </span>
                        {/* <span onClick={() => handleDelete(id ?? '')}> */}
                        <CNDialog
                          open={openDeleteModal}
                          onOpenChange={() => handleOpenDeleteModal(id ?? '')}
                        >
                          <DialogTrigger>
                            <MdDelete />
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
                        {/* </span> */}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

            {isLoading && <p>Loading...</p>}
          </TableBody>
        </Table>
      )}

      <div
        className="bg-red-600 w-[3rem] h-[3rem] rounded-full flex items-center justify-center absolute bottom-28 right-10"
        onClick={() => setIsOpen(true)}
      >
        <GoPlus className="text-white" />
      </div>
    </section>
  );
};

export default Campaign;
