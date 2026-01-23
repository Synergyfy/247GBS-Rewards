'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { BsGiftFill } from 'react-icons/bs';
import {
  MdDelete,
  MdOutlineCancel,
} from 'react-icons/md';
import { Dialog } from '@headlessui/react';
import { Bars } from 'react-loader-spinner';
import GeneralForm from '../../components/GeneralRewardsForm';
import DateRangeForm from '../../components/DateRangeForm';
import DescriptionForm from '../../components/DescriptionForm';
import ImagesForm from '../../components/ImagesForm';
import { RewardType } from '@/services/hooks/reward/types';
import {
  useCreateRewards,
  useDeleteReward,
  useGetRewards,
  useUpdateReward,
} from '@/services/hooks/reward/hook';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GoPlus } from 'react-icons/go';
import { IoCheckmarkDoneSharp, IoPencil, IoStatsChart } from 'react-icons/io5';
import RewardAnalytics from '@/app/loyalty-admin/components/RewardAnalytics';

import { compareDates, formatDateShort } from '@/app/helpers/formatDate';
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
import { FaTimes } from 'react-icons/fa';

const Rewards = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'GENERAL' | 'DATE RANGE' | 'DESCRIPTION' | 'IMAGES'
  >('GENERAL');

  // States for GENERAL tab
  const [title, setTitle] = useState('');
  const [pointsCost, setPointsCost] = useState<string>('');
  const [rewardValue, setRewardValue] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');

  // States for DATE RANGE tab
  const [activeFrom, setActiveFrom] = useState<Date>(new Date());
  const [expires, setExpires] = useState<Date>(new Date());

  const [errorMsg, setErrorMsg] = useState('');

  // State for DESCRIPTION tab
  const [description, setDescription] = useState('');

  // States for IMAGES tab
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<{
    additional1: string | null;
    additional2: string | null;
    additional3: string | null;
    additional4: string | null;
  }>({
    additional1: null,
    additional2: null,
    additional3: null,
    additional4: null,
  });

  const [rewardId, setRewardId] = useState<string>('');
  const [rewardToDelete, setRewardToDelete] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openStepModal, setOpenStepModal] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsRewardId, setAnalyticsRewardId] = useState('');


  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => setMainImagePreview(reader.result as string);
      reader.readAsDataURL(files[0]);
    }
  };

  const handleAdditionalImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof additionalImagePreviews
  ) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setAdditionalImagePreviews(prev => ({
          ...prev,
          [key]: reader.result as string,
        }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const removeMainImage = () => {
    setMainImagePreview(null);
  };

  const removeAdditionalImage = (key: keyof typeof additionalImagePreviews) => {
    setAdditionalImagePreviews(prev => ({ ...prev, [key]: null }));
  };

  const tabs: Array<'GENERAL' | 'DATE RANGE' | 'DESCRIPTION' | 'IMAGES'> = [
    'GENERAL',
    'DATE RANGE',
    'DESCRIPTION',
    'IMAGES',
  ];

  const handleOpenModal = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsOpen(true);
    }, 500);
  };

  const { data: rewardData, refetch } = useGetRewards();

  const { mutate, isSuccess, isPending } = useCreateRewards();

  const {
    mutate: deleteMutate,
    isSuccess: deleteSuccess,
    isPending: deletePending,
  } = useDeleteReward();

  const {
    mutate: updateMutate,
    isSuccess: updateSuccess,
    isPending: updatePending,
  } = useUpdateReward();

  useEffect(() => {
    if (isSuccess) {
      refetch();
      setIsOpen(false);
      setTimeout(() => {
        setOpenStepModal(true);
      }, 1000);
    }
  }, [isSuccess, refetch]);

  const clearForm = useCallback(() => {
    setTitle('');
    setActiveFrom(new Date());
    setDescription('');
    setExpires(new Date());
    setPointsCost('');
    setRewardValue('');
    setCurrency('');
    setMainImagePreview(null);
    setAdditionalImagePreviews({
      additional1: null,
      additional2: null,
      additional3: null,
      additional4: null,
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    clearForm();
    setEditMode(false);
    setIsOpen(false);
    setErrorMsg('');
  }, [clearForm]);

  useEffect(() => {
    if (updateSuccess) {
      refetch();
      handleCloseModal();
    }
  }, [updateSuccess, refetch, handleCloseModal]);

  useEffect(() => {
    if (deleteSuccess) {
      refetch();
      setOpenDeleteModal(false);
      setRewardToDelete('');
    }
  }, [deleteSuccess, refetch]);

  const handleSubmit = () => {
    // Process form data here as needed.

    if (!title) {
      setActiveTab('GENERAL');
      setErrorMsg('Title is required');
    } else if (!pointsCost) {
      setActiveTab('GENERAL');
      setErrorMsg('Enter the point cost for this reward');
    } else if (!rewardValue) {
      setActiveTab('GENERAL');
      setErrorMsg('What is the reward value for this reward');
    } else if (!activeFrom || !expires) {
      setActiveTab('DATE RANGE');
      setErrorMsg('What is the date range for this reward');
    } else if (activeFrom > expires) {
      setActiveTab('DATE RANGE');
      setErrorMsg('What is the date range for this reward');
    } else if (!currency) {
      setActiveTab('GENERAL');
      setErrorMsg('Select your preferred currency');
    }

    const dateRange = compareDates(activeFrom, expires);
    if (dateRange !== true) {
      setActiveTab('DATE RANGE');
      setErrorMsg(dateRange as string);
    } else {
      const data: RewardType = {
        title,
        activeFrom,
        expires,
        description,
        pointCost: pointsCost,
        rewardValue,
        currency,
      };

      mutate(data);
    }
  };

  const handleOpenDeleteModal = (id: string) => {
    if (!openDeleteModal) {
      setOpenDeleteModal(true);
      setRewardToDelete(id);
    }
  };

  const handleDelete = () => {
    if (!deletePending && rewardToDelete) deleteMutate(rewardToDelete);
  };

  const handleEdit = (id: string) => {
    const reward: RewardType | undefined = rewardData?.find(
      item => item.id === id
    );
    if (reward) {
      const {
        activeFrom,
        description,
        expires,
        pointCost,
        rewardValue,
        title,
        currency
      } = reward;
      setTitle(title);
      setActiveFrom(new Date(activeFrom));
      setDescription(description);
      setExpires(new Date(expires));
      setPointsCost(pointCost);
      setRewardValue(rewardValue);
      setCurrency(currency ?? '');

      setEditMode(true);
      setIsOpen(true);

      setRewardId(id);
    }
  };

  const handleViewAnalytics = (id: string) => {
    setAnalyticsRewardId(id);
    setShowAnalytics(true);
  };


  const processUpdate = () => {
    const reward: RewardType = {
      title,
      activeFrom,
      description,
      expires,
      pointCost: pointsCost,
      rewardValue,
      currency,
    };
    updateMutate({ id: rewardId, reward });
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6 min-h-[80vh] relative">
      {!rewardData ||
        (rewardData.length < 1 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
              <BsGiftFill className="w-20 h-20 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Rewards Found</h2>
            <p className="text-gray-500 max-w-md mb-8">
              You do not have any rewards yet. Create a reward so you can attach it to your campaign when you want to start one.
            </p>

            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              onClick={handleOpenModal}
            >
              <GoPlus className="text-xl" />
              Create a Reward
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
        ))}

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{editMode ? 'Edit Reward' : 'Create Reward'}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {editMode ? 'Update reward details.' : 'Create a new reward for your customers.'}
                </p>
              </div>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6 space-x-2 overflow-x-auto">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      className={`pb-2 px-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === tab
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {errorMsg && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
                    <p>{errorMsg}</p>
                  </div>
                )}

                <div className="mt-2">
                  {activeTab === 'GENERAL' && (
                    <GeneralForm
                      title={title}
                      pointsCost={pointsCost}
                      rewardValue={rewardValue}
                      currency={currency}
                      setTitle={setTitle}
                      setPointsCost={setPointsCost}
                      setRewardValue={setRewardValue}
                      setCurrency={setCurrency}
                    />
                  )}
                  {activeTab === 'DATE RANGE' && (
                    <DateRangeForm
                      activeFrom={activeFrom}
                      expires={expires}
                      setActiveFrom={setActiveFrom}
                      setExpires={setExpires}
                    />
                  )}
                  {activeTab === 'DESCRIPTION' && (
                    <DescriptionForm
                      description={description}
                      setDescription={setDescription}
                    />
                  )}
                  {activeTab === 'IMAGES' && (
                    <ImagesForm
                      mainImagePreview={mainImagePreview}
                      additionalImagePreviews={additionalImagePreviews}
                      handleMainImageUpload={handleMainImageUpload}
                      handleAdditionalImageUpload={handleAdditionalImageUpload}
                      removeMainImage={removeMainImage}
                      removeAdditionalImage={removeAdditionalImage}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
              <button
                className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={handleCloseModal}
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
                  {isPending ? 'Creating...' : 'Create Reward'}
                </button>
              ) : (
                <button
                  className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
                  onClick={processUpdate}
                  disabled={updatePending}
                >
                  {updatePending ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {rewardData && rewardData.length > 0 && (
        <div className="overflow-x-auto">
          <Table className="text-base">
            <TableCaption>A list of your rewards.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="text-center">Point Cost</TableHead>
                <TableHead>Active from</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Redemptions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewardData.map((item, i) => {
                const { title, activeFrom, expires, pointCost, id } = item;
                return (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{title}</TableCell>
                    <TableCell className="text-center">{pointCost}</TableCell>
                    <TableCell className="text-base">
                      {formatDateShort(activeFrom as string)}
                    </TableCell>
                    <TableCell className="text-base">
                      {formatDateShort(expires as string)}
                    </TableCell>
                    <TableCell>{0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleViewAnalytics(id ?? '')}
                          className="text-gray-500 hover:text-emerald-600 transition-colors p-1"
                          title="Analytics"
                        >
                          <IoStatsChart size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(id ?? '')}
                          className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                          title="Edit"
                        >
                          <IoPencil size={18} />
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
                              <DialogTitle>Are you absolutely sure?</DialogTitle>
                              <DialogDescription>
                                This action will delete the reward.
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
                                {deletePending ? 'Deleting...' : 'Delete'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </CNDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
      {rewardData && rewardData.length > 0 && (
        <button
          className="fixed bottom-8 right-8 bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-105 transition-all z-40"
          onClick={() => setIsOpen(true)}
          title="Add New Reward"
        >
          <GoPlus size={28} />
        </button>
      )}

      <CNDialog
        open={openStepModal}
        onOpenChange={() => setOpenStepModal(!openStepModal)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Progress Status</DialogTitle>
            <DialogDescription className="mt-3 text-lg text-gray-800 space-y-2">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                <span>Create a business</span>
                <IoCheckmarkDoneSharp className="text-green-600 text-xl" />
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                <span>Create a staff</span>
                <IoCheckmarkDoneSharp className="text-green-600 text-xl" />
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                <span>Create a reward</span>
                <IoCheckmarkDoneSharp className="text-green-600 text-xl" />
              </div>
              <div className="flex items-center justify-between p-2">
                <span>Create a campaign</span>
                <MdOutlineCancel className="text-gray-300 text-xl" />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant={'default'}
              onClick={() => setOpenStepModal(false)}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </CNDialog>
      <Dialog
        open={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center border-b px-8 py-5 bg-white">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-xl">
                  <IoStatsChart className="text-blue-600 text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Reward Performance</h2>
              </div>
              <button
                onClick={() => setShowAnalytics(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8 bg-gray-50/30">
              <RewardAnalytics rewardId={analyticsRewardId} />
            </div>

            <div className="border-t border-gray-100 px-8 py-5 bg-white flex justify-end">
              <button
                className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                onClick={() => setShowAnalytics(false)}
              >
                Got it
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
};

export default Rewards;
