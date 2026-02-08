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
import RewardPageForm from '../../components/RewardPageForm';
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GoPlus } from 'react-icons/go';
import { IoCheckmarkDoneSharp, IoPencil, IoStatsChart, IoSearchOutline } from 'react-icons/io5';
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
import { FaTimes, FaGift, FaCoins, FaCalendarAlt, FaTag } from 'react-icons/fa';
import { FiActivity } from 'react-icons/fi';
import { VoucherType } from '@/services/voucher.service';
import { useLoyaltyTiers, useMallTiers } from '@/services/hooks/useTiers';
import { RewardConfig } from '@/services/hooks/reward/types';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/app/helpers/cropImage';

const Rewards = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<
    'GENERAL' | 'DATE RANGE' | 'DESCRIPTION' | 'IMAGES' | 'EDIT SUCCESS PAGE'
  >('GENERAL');

  // Cropping states
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [currentCropType, setCurrentCropType] = useState<string | null>(null);

  // States for GENERAL tab
  const [title, setTitle] = useState('');
  const [pointsCost, setPointsCost] = useState<string>('');
  const [rewardValue, setRewardValue] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [quantityAvailable, setQuantityAvailable] = useState<number>(0);

  // States for Reward Type & Config
  const [rewardType, setRewardType] = useState<string>('STANDARD');
  const [tierId, setTierId] = useState('');
  const [durationDays, setDurationDays] = useState(30);
  const [url, setUrl] = useState('');
  const [site, setSite] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // States for EDIT REWARD PAGE tab
  const [rewardPageTitle, setRewardPageTitle] = useState('');
  const [rewardPageMessage, setRewardPageMessage] = useState('');
  const [rewardPageLink, setRewardPageLink] = useState('');

  // Data Hooks
  const { data: loyaltyTiers = [] } = useLoyaltyTiers();
  const { data: mallTiers = [] } = useMallTiers();

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

  const { data: rewardData, isLoading, refetch } = useGetRewards();

  const filteredRewards = rewardData?.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.pointCost.toString().includes(searchQuery)
  );

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
    setQuantityAvailable(0);
    setMainImagePreview(null);
    setAdditionalImagePreviews({
      additional1: null,
      additional2: null,
      additional3: null,
      additional4: null,
    });
    setRewardType('STANDARD');
    setTierId('');
    setDurationDays(30);
    setUrl('');
    setSite('');
    setUsername('');
    setPassword('');
    setRewardPageTitle('');
    setRewardPageMessage('');
    setRewardPageLink('');
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
    if (!title) {
      setActiveTab('GENERAL');
      setErrorMsg('Title is required');
    } else if (!pointsCost) {
      setActiveTab('GENERAL');
      setErrorMsg('Enter the point cost for this reward');
    } else if (!rewardValue) {
      setActiveTab('GENERAL');
      setErrorMsg('What is the reward value for this reward');
    } else if (quantityAvailable <= 0) {
      setActiveTab('GENERAL');
      setErrorMsg('Enter a valid quantity available');
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

    if (rewardType === VoucherType.MCOM_LOYALTY_TIER || rewardType === VoucherType.MCOM_MALL_TIER) {
      if (!tierId) {
        setActiveTab('GENERAL');
        setErrorMsg('Please select a tier');
        return;
      }
    } else if (rewardType === VoucherType.LINK) {
      if (!url) {
        setActiveTab('GENERAL');
        setErrorMsg('Please enter a URL');
        return;
      }
    } else if (rewardType === VoucherType.CREDENTIALS) {
      if (!site || !username || !password) {
        setActiveTab('GENERAL');
        setErrorMsg('Please fill in all credential fields');
        return;
      }
    }

    const dateRange = compareDates(activeFrom, expires);
    if (dateRange !== true) {
      setActiveTab('DATE RANGE');
      setErrorMsg(dateRange as string);
    } else {
      let config: RewardConfig = {};
      if (rewardType === VoucherType.MCOM_LOYALTY_TIER || rewardType === VoucherType.MCOM_MALL_TIER) {
        config = { tierId, durationDays: Number(durationDays) };
      } else if (rewardType === VoucherType.LINK) {
        config = { url };
      } else if (rewardType === VoucherType.CREDENTIALS) {
        config = { site, username, password };
      }

      const data: RewardType = {
        title,
        activeFrom,
        expires,
        description,
        pointCost: pointsCost,
        rewardValue,
        currency,
        quantityAvailable: Number(quantityAvailable),
        type: rewardType,
        config: rewardType === 'STANDARD' ? undefined : config,
        rewardPageTitle,
        rewardPageMessage,
        rewardPageLink,
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
        currency,
        quantityAvailable,
        type,
        config,
        rewardPageTitle,
        rewardPageMessage,
        rewardPageLink
      } = reward;
      setTitle(title);
      setActiveFrom(new Date(activeFrom));
      setDescription(description);
      setExpires(new Date(expires));
      setPointsCost(pointCost);
      setRewardValue(rewardValue);
      setCurrency(currency ?? '');
      setQuantityAvailable(quantityAvailable ?? 0);

      const rType = type || 'STANDARD';
      setRewardType(rType);

      if (config) {
        if (rType === VoucherType.MCOM_LOYALTY_TIER || rType === VoucherType.MCOM_MALL_TIER) {
          setTierId(config.tierId || '');
          setDurationDays(config.durationDays || 30);
        } else if (rType === VoucherType.LINK) {
          setUrl(config.url || '');
        } else if (rType === VoucherType.CREDENTIALS) {
          setSite(config.site || '');
          setUsername(config.username || '');
          setPassword(config.password || '');
        }
      }

      setRewardPageTitle(rewardPageTitle || '');
      setRewardPageMessage(rewardPageMessage || '');
      setRewardPageLink(rewardPageLink || '');

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
    let config: RewardConfig = {};
    if (rewardType === VoucherType.MCOM_LOYALTY_TIER || rewardType === VoucherType.MCOM_MALL_TIER) {
      config = { tierId, durationDays: Number(durationDays) };
    } else if (rewardType === VoucherType.LINK) {
      config = { url };
    } else if (rewardType === VoucherType.CREDENTIALS) {
      config = { site, username, password };
    }

    const reward: RewardType = {
      title,
      activeFrom,
      description,
      expires,
      pointCost: pointsCost,
      rewardValue,
      currency,
      quantityAvailable: Number(quantityAvailable),
      type: rewardType,
      config: rewardType === 'STANDARD' ? undefined : config,
      rewardPageTitle,
      rewardPageMessage,
      rewardPageLink,
    };
    updateMutate({ id: rewardId, reward });
  };

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setCurrentCropType('main');
        setIsCropModalOpen(true);
      };
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
        setImageToCrop(reader.result as string);
        setCurrentCropType(key);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      if (imageToCrop && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
        if (currentCropType === 'main') {
          setMainImagePreview(croppedImage);
        } else if (currentCropType) {
          setAdditionalImagePreviews(prev => ({
            ...prev,
            [currentCropType]: croppedImage,
          }));
        }
        setIsCropModalOpen(false);
        setImageToCrop(null);
        setCurrentCropType(null);
      }
    } catch (e) { console.error(e); }
  };

  const removeMainImage = () => setMainImagePreview(null);
  const removeAdditionalImage = (key: keyof typeof additionalImagePreviews) =>
    setAdditionalImagePreviews(prev => ({ ...prev, [key]: null }));

  const tabs: Array<'GENERAL' | 'DATE RANGE' | 'DESCRIPTION' | 'IMAGES' | 'EDIT SUCCESS PAGE'> = [
    'GENERAL', 'DATE RANGE', 'DESCRIPTION', 'IMAGES', 'EDIT SUCCESS PAGE'
  ];

  const handleOpenModal = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsOpen(true);
    }, 500);
  };

  const isLastTab = activeTab === tabs[tabs.length - 1];
  const isFirstTab = activeTab === tabs[0];

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
      setErrorMsg('');
    } else {
      if (editMode) { processUpdate(); } else { handleSubmit(); }
    }
  };

  const handleBack = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
      setErrorMsg('');
    }
  };

  const formatVoucherType = (t: string) => {
    if (t === 'STANDARD') return 'Standard';
    return t.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).replace('Mcom', 'MCom');
  };

  const stats = [
    { label: 'Total Rewards', value: rewardData?.length || 0, icon: FaGift, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Now', value: rewardData?.filter(r => new Date(r.expires) > new Date()).length || 0, icon: FiActivity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    {
      label: 'Total Value', value: rewardData?.reduce((acc, curr) => {
        const val = parseFloat(curr.rewardValue);
        return acc + (isNaN(val) ? 0 : val);
      }, 0).toLocaleString() || 0, icon: FaCoins, color: 'text-amber-600', bg: 'bg-amber-50', suffix: ' pts'
    },
  ];

  return (
    <section className="space-y-8 pb-10">
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-gray-500 tracking-tight">Reward Inventory</h1>
            <p className="text-gray-500 mt-2 font-medium italic opacity-80">Create and manage incentives for your loyal customers.</p>
          </div>
          <button
            className="bg-gray-800 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl shadow-gray-200 hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
            onClick={handleOpenModal}
          >
            <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
              <GoPlus className="text-xl" />
            </div>
            Create New Reward
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className={`${stat.bg} p-6 rounded-3xl border border-white/50 flex items-center gap-5 transition-transform hover:scale-[1.02]`}>
              <div className={`p-4 rounded-2xl bg-white shadow-sm`}>
                <stat.icon className={`text-2xl ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-semibold text-gray-600 mt-1">{stat.value}{stat.suffix}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md group">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by title, type or cost..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-medium text-gray-600 placeholder:text-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-widest px-4">
              {filteredRewards?.length || 0} Rewards Found
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Bars height="50" width="50" color="#94a3b8" />
            <p className="mt-4 font-semibold text-gray-400 animate-pulse">Syncing rewards...</p>
          </div>
        ) : (!rewardData || rewardData.length < 1) ? (
          <div className="flex flex-col items-center justify-center py-32 text-center px-6">
            <div className="bg-gray-50 p-10 rounded-[3rem] mb-8 relative">
              <FaGift className="w-24 h-24 text-gray-200" />
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-100">
                <GoPlus className="text-white text-2xl" />
              </div>
            </div>
            <h2 className="text-3xl font-semibold text-gray-500 mb-3">No rewards yet</h2>
            <p className="text-gray-400 max-w-sm mb-10 leading-relaxed font-medium">
              Set up your first reward to incentivize customer engagement and increase retention.
            </p>
            <button
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-semibold shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
              onClick={handleOpenModal}
            >
              Create My First Reward
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-none">
                  <TableHead className="py-5 font-semibold text-gray-400 uppercase tracking-widest text-[10px] px-8">Reward Details</TableHead>
                  <TableHead className="font-semibold text-gray-400 uppercase tracking-widest text-[10px]">Cost & Value</TableHead>
                  <TableHead className="font-semibold text-gray-400 uppercase tracking-widest text-[10px]">Validity Period</TableHead>
                  <TableHead className="font-semibold text-gray-400 uppercase tracking-widest text-[10px] text-right px-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRewards?.map((item, i) => {
                  const { title, activeFrom, expires, pointCost, id, type, rewardValue, currency } = item;
                  return (
                    <TableRow key={i} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50">
                      <TableCell className="py-5 px-8">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                              <FaGift size={24} />
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-500 text-lg">{title}</p>
                            <span className={`inline-block mt-1 px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-bold uppercase tracking-widest ${type && type !== 'STANDARD' ? 'text-indigo-500 bg-indigo-50' : ''}`}>
                              {formatVoucherType(type || 'STANDARD')}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="bg-amber-50 p-1.5 rounded-lg border border-amber-100/50">
                              <FaCoins className="text-amber-500 text-xs" />
                            </div>
                            <span className="font-semibold text-gray-500">{pointCost} <span className="text-[10px] text-gray-300 uppercase tracking-tighter">Points</span></span>
                          </div>
                          <p className="text-[11px] text-gray-400 pl-8 font-medium italic opacity-70">Value: {currency}{rewardValue}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-400 font-bold opacity-80">
                            <FaCalendarAlt className="text-gray-200" />
                            <span>{formatDateShort(activeFrom as string)} — {formatDateShort(expires as string)}</span>
                          </div>
                          {new Date(expires) < new Date() ? (
                            <span className="inline-block px-2 py-0.5 bg-red-50 text-red-400 rounded text-[9px] font-bold uppercase tracking-widest border border-red-100/50">Expired</span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-500 rounded text-[9px] font-bold uppercase tracking-widest border border-emerald-100/50">Active</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleViewAnalytics(id ?? '')}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-100 transition-all shadow-sm"
                            title="Analytics"
                          >
                            <IoStatsChart size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(id ?? '')}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:bg-blue-50 hover:text-blue-600 border border-gray-100 transition-all shadow-sm"
                            title="Edit"
                          >
                            <IoPencil size={18} />
                          </button>
                          <CNDialog
                            open={openDeleteModal && rewardToDelete === id}
                            onOpenChange={(open) => {
                              if (!open) {
                                setOpenDeleteModal(false);
                                setRewardToDelete('');
                              } else {
                                handleOpenDeleteModal(id!);
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-400 hover:bg-red-50 hover:text-red-600 border border-gray-100 transition-all shadow-sm" title="Delete">
                                <MdDelete size={20} />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="rounded-[2rem]">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold text-gray-800">Delete Reward?</DialogTitle>
                                <DialogDescription className="font-medium text-gray-400">
                                  This will permanently remove <span className="text-gray-700 font-bold">{title}</span> from your inventory.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="mt-6 gap-3">
                                <Button
                                  type="button"
                                  variant={'outline'}
                                  onClick={() => setOpenDeleteModal(false)}
                                  className="rounded-xl font-semibold h-12 text-gray-400"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  variant={'destructive'}
                                  onClick={handleDelete}
                                  disabled={deletePending}
                                  className="rounded-xl font-bold h-12"
                                >
                                  {deletePending ? 'Deleting...' : 'Delete Reward'}
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
      </div>

      <Dialog open={isOpen} onClose={handleCloseModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px]" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-50 px-10 py-8 bg-gray-50/30">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 leading-none">{editMode ? 'Edit Reward' : 'New Reward'}</h2>
                <p className="text-gray-400 text-sm mt-3 font-medium">
                  {editMode ? 'Update reward details and settings.' : 'Create a fresh incentive for your customers.'}
                </p>
              </div>
              <button onClick={handleCloseModal} className="text-gray-300 hover:text-gray-600 transition-colors p-3 rounded-2xl hover:bg-white shadow-sm">
                <FaTimes size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="px-10 py-8">
                <div className="flex border-b border-gray-50 mb-10 space-x-8 overflow-x-auto scrollbar-hide">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      className={`pb-4 px-1 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === tab
                        ? 'border-indigo-500 text-gray-700'
                        : 'border-transparent text-gray-200 hover:text-gray-300'
                        }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                {errorMsg && (
                  <div className="bg-red-50 border-l-4 border-red-400 text-red-600 p-5 mb-8 rounded-2xl flex items-center gap-3">
                    <div className="bg-red-400 p-1 rounded-full"><FaTimes className="text-white text-[8px]" /></div>
                    <p className="font-semibold text-sm">{errorMsg}</p>
                  </div>
                )}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {activeTab === 'GENERAL' && (
                    <div className="space-y-6">
                      <div>
                        <label className="mb-2 flex items-center gap-2 font-bold text-gray-500 text-[10px] uppercase tracking-[0.15em]">
                          <FaTag className="text-indigo-400" /> Reward Type
                        </label>
                        <select
                          className="block w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all font-medium text-gray-600"
                          value={rewardType}
                          onChange={e => { setRewardType(e.target.value); setTierId(''); }}
                        >
                          <option value="STANDARD">Standard Reward</option>
                          <option value={VoucherType.MCOM_LOYALTY_TIER}>MCom Loyalty Tier</option>
                          <option value={VoucherType.MCOM_MALL_TIER}>MCom Mall Tier</option>
                          <option value={VoucherType.LINK}>Download/Access Link</option>
                          <option value={VoucherType.CREDENTIALS}>Account Credentials</option>
                        </select>
                      </div>
                      {(rewardType === VoucherType.MCOM_LOYALTY_TIER || rewardType === VoucherType.MCOM_MALL_TIER) && (
                        <div className="p-6 bg-indigo-50/30 rounded-[2rem] border border-indigo-100/50 space-y-6">
                          <h4 className="font-bold text-[10px] text-indigo-400 uppercase tracking-widest">Tier Configuration</h4>
                          <div>
                            <label className="mb-2 block font-bold text-gray-500 text-[10px] uppercase tracking-[0.15em]">Target Tier</label>
                            <select
                              className="block w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all font-medium text-gray-600"
                              value={tierId}
                              onChange={e => setTierId(e.target.value)}
                            >
                              <option value="">Select Tier</option>
                              {(rewardType === VoucherType.MCOM_LOYALTY_TIER ? loyaltyTiers : mallTiers).map((t: { id: string; name: string }) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-2 block font-bold text-gray-500 text-[10px] uppercase tracking-[0.15em]">Duration (Days)</label>
                            <input
                              type="number"
                              className="block w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all font-medium text-gray-600"
                              value={durationDays}
                              onChange={e => setDurationDays(Number(e.target.value))}
                            />
                          </div>
                        </div>
                      )}
                      {rewardType === VoucherType.LINK && (
                        <div className="p-6 bg-indigo-50/30 rounded-[2rem] border border-indigo-100/50 space-y-4">
                          <div>
                            <label className="mb-2 block font-bold text-gray-500 text-[10px] uppercase tracking-[0.15em]">Target URL</label>
                            <input
                              type="text"
                              placeholder="https://..."
                              className="block w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all font-medium text-gray-600"
                              value={url}
                              onChange={e => setUrl(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                      {rewardType === VoucherType.CREDENTIALS && (
                        <div className="p-6 bg-indigo-50/30 rounded-[2rem] border border-indigo-100/50 space-y-6">
                          <div>
                            <label className="mb-2 block font-bold text-gray-500 text-[10px] uppercase tracking-[0.15em]">Site URL</label>
                            <input
                              type="text"
                              placeholder="https://..."
                              className="block w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all font-medium text-gray-600"
                              value={site}
                              onChange={e => setSite(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="mb-2 block font-bold text-gray-500 text-[10px] uppercase tracking-[0.15em]">Username</label>
                              <input
                                type="text"
                                className="block w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all font-medium text-gray-600"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="mb-2 block font-bold text-gray-500 text-[10px] uppercase tracking-[0.15em]">Password</label>
                              <input
                                type="text"
                                className="block w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all font-medium text-gray-600"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <GeneralForm
                        title={title}
                        pointsCost={pointsCost}
                        rewardValue={rewardValue}
                        currency={currency}
                        quantityAvailable={quantityAvailable}
                        setTitle={setTitle}
                        setPointsCost={setPointsCost}
                        setRewardValue={setRewardValue}
                        setCurrency={setCurrency}
                        setQuantityAvailable={setQuantityAvailable}
                      />
                    </div>
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
                  {activeTab === 'EDIT SUCCESS PAGE' && (
                    <RewardPageForm
                      title={rewardPageTitle}
                      message={rewardPageMessage}
                      link={rewardPageLink}
                      setTitle={setRewardPageTitle}
                      setMessage={setRewardPageMessage}
                      setLink={setRewardPageLink}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-50 px-10 py-6 flex justify-between items-center bg-gray-50/50">
              <button
                className="px-6 py-3 text-gray-300 font-bold hover:text-gray-500 transition-colors"
                onClick={handleCloseModal}
                disabled={isPending || updatePending}
              >
                Cancel
              </button>
              <div className="flex gap-4">
                {!isFirstTab && (
                  <button
                    className="px-8 py-3.5 text-gray-500 font-bold bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                    onClick={handleBack}
                    disabled={isPending || updatePending}
                  >
                    Back
                  </button>
                )}
                <button
                  className="px-10 py-3.5 bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-600 hover:scale-[1.02] transition-all shadow-xl shadow-indigo-50 disabled:opacity-70 min-w-[160px]"
                  onClick={handleNext}
                  disabled={isPending || updatePending}
                >
                  {!isLastTab ? 'Continue' : editMode ? (updatePending ? 'Updating...' : 'Save Changes') : (isPending ? 'Creating...' : 'Launch Reward')}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <CNDialog open={openStepModal} onOpenChange={() => setOpenStepModal(!openStepModal)}>
        <DialogContent className="sm:max-w-md border-none rounded-[2rem] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Progress Status</DialogTitle>
            <DialogDescription className="mt-3 text-lg text-gray-500 space-y-2">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                <span className="font-semibold text-emerald-700">Create a business</span>
                <IoCheckmarkDoneSharp className="text-emerald-600 text-2xl" />
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                <span className="font-semibold text-emerald-700">Create a staff</span>
                <IoCheckmarkDoneSharp className="text-emerald-600 text-2xl" />
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                <span className="font-semibold text-emerald-700">Create a reward</span>
                <IoCheckmarkDoneSharp className="text-emerald-600 text-2xl" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="font-semibold text-gray-400">Create a campaign</span>
                <MdOutlineCancel className="text-gray-300 text-2xl" />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button type="button" className="w-full h-12 rounded-xl bg-gray-800 font-bold" onClick={() => setOpenStepModal(false)}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </CNDialog>

      <Dialog open={showAnalytics} onClose={() => setShowAnalytics(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-50 px-8 py-6 bg-white">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100/50">
                  <IoStatsChart className="text-blue-500 text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Reward Performance</h2>
              </div>
              <button onClick={() => setShowAnalytics(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-50">
                <FaTimes size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-8 bg-gray-50/20">
              <RewardAnalytics rewardId={analyticsRewardId} />
            </div>
            <div className="border-t border-gray-50 px-8 py-5 bg-white flex justify-end">
              <button className="px-8 py-3 bg-gray-800 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg shadow-gray-200" onClick={() => setShowAnalytics(false)}>
                Got it
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={isCropModalOpen} onClose={() => setIsCropModalOpen(false)} className="relative z-[60]">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg flex flex-col overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-50 px-6 py-5 bg-gray-50/30">
              <h3 className="text-lg font-bold text-gray-800">Adjust Image</h3>
              <button onClick={() => setIsCropModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
            <div className="relative h-80 w-full bg-gray-900">
              {imageToCrop && (
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              )}
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button className="px-6 py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors" onClick={() => setIsCropModalOpen(false)}>
                  Cancel
                </button>
                <button className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100" onClick={handleCropSave}>
                  Apply Crop
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
};

export default Rewards;
