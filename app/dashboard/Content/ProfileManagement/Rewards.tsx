'use client';

import React, { useEffect, useState } from 'react';
import { BsGiftFill } from 'react-icons/bs';
import {
  MdDelete,
  MdKeyboardArrowRight,
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
import { IoCheckmarkDoneSharp, IoPencil } from 'react-icons/io5';
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
    }, 1500);
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

  useEffect(() => {
    if (updateSuccess) {
      refetch();
      handleCloseModal();
    }
  }, [updateSuccess, refetch]);

  useEffect(() => {
    if (deleteSuccess) {
      refetch();
      setOpenDeleteModal(false);
      setRewardToDelete('');
    }
  }, [deleteSuccess, refetch]);

  const clearForm = () => {
    setTitle('');
    setActiveFrom(new Date());
    setDescription('');
    setExpires(new Date());
    setPointsCost('');
    setRewardValue('');
  };

  const handleCloseModal = () => {
    clearForm();
    setEditMode(false);
    setIsOpen(false);
  };
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
      setErrorMsg(dateRange);
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
      } = reward;
      setTitle(title);
      setActiveFrom(new Date(activeFrom));
      setDescription(description);
      setExpires(new Date(expires));
      setPointsCost(pointCost);
      setRewardValue(rewardValue);

      setEditMode(true);
      setIsOpen(true);

      setRewardId(id);
    }
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
    <section>
      {!rewardData ||
        (rewardData.length < 1 && (
          <div className="p-24">
            <div className="px-24">
              <BsGiftFill className="w-40 h-40 text-[#2D3DFF]" />
              <p className="text-2xl">You do not have any rewards yet</p>
            </div>
            <div className="px-24 flex justify-end items-center">
              <p
                className="text-[#2D3DFF] font-bold text-xl cursor-pointer"
                onClick={handleOpenModal}
              >
                Create a Reward
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
        ))}

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      >
        <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-y-auto">
          <div className="flex justify-between items-center border-b p-6 pb-4">
            <div>
              <h2 className="text-2xl font-bold">Create Reward</h2>
              <p className="w-[90%] text-gray-600">
                Create a reward so you can attach it to your campaign when you
                want to start one.
              </p>
            </div>
            <button onClick={handleCloseModal} className="text-xl font-bold">
              X
            </button>
          </div>

          <div className="mt-4">
            <div className="flex border-b border-gray-300 mb-10">
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

            <div className="px-6">
              {errorMsg && (
                <p className="text-red-600 text-lg my-3">{errorMsg}</p>
              )}
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

          {!editMode ? (
            <div className="flex justify-end border-t border-gray-300 mt-20 p-6 pt-4">
              <button
                className="px-4 py-2 bg-transparent font-semibold text-[#2D3DFF] rounded"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? 'CREATING' : 'CREATE'}
              </button>
              <button
                className="px-4 py-2 mr-2 bg-transparent font-semibold rounded"
                onClick={handleCloseModal}
                disabled={isPending}
              >
                CLOSE
              </button>
            </div>
          ) : (
            <div className="flex justify-end border-t border-gray-300 mt-14 p-6 pt-4">
              <button
                className="px-4 py-2 bg-transparent font-semibold text-[#2D3DFF] rounded"
                onClick={processUpdate}
                disabled={updatePending}
              >
                {!updatePending ? 'Save Changes' : 'Saving...'}
              </button>
              <button
                className="px-4 py-2 mr-2 bg-transparent font-semibold rounded"
                onClick={handleCloseModal}
                disabled={updatePending}
              >
                CLOSE
              </button>
            </div>
          )}
        </Dialog.Panel>
      </Dialog>

      {rewardData && rewardData.length > 0 && (
        <Table className="text-lg">
          <TableCaption>Rewards</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="w-[100px]">Point Cost</TableHead>
              <TableHead>Active from</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Redemptions</TableHead>
              <TableHead>Actions</TableHead>
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
          </TableBody>
        </Table>
      )}
      <div
        className="bg-red-600 w-[3rem] h-[3rem] rounded-full flex items-center justify-center absolute bottom-28 right-10"
        onClick={() => setIsOpen(true)}
      >
        <GoPlus className="text-white" />
      </div>
      <CNDialog
        open={openStepModal}
        onOpenChange={() => setOpenStepModal(!openStepModal)}
      >
        <DialogContent className="w-[20rem]">
          <DialogHeader>
            <DialogTitle>Step one completed</DialogTitle>
            <DialogDescription className="mt-3 text-lg text-gray-800">
              <p className="flex items-center gap-1">
                Create a business{' '}
                <IoCheckmarkDoneSharp className="text-darkGreen" />
              </p>
              <p className="flex items-center gap-1">
                Create a staff{' '}
                <IoCheckmarkDoneSharp className="text-darkGreen" />
              </p>
              <p className="flex items-center gap-1">
                Create a reward{' '}
                <IoCheckmarkDoneSharp className="text-darkGreen" />
              </p>
              <p className="flex items-center gap-1">
                Create a campaign <MdOutlineCancel className="text-red-700" />
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant={'outline'}
              onClick={() => setOpenStepModal(false)}
            >
              close
            </Button>
          </DialogFooter>
        </DialogContent>
      </CNDialog>
    </section>
  );
};

export default Rewards;
