'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { IoMdBusiness } from 'react-icons/io';
import {
  MdDelete,
  MdOutlineCancel,
  MdDownload,
  MdPrint
} from 'react-icons/md';
import { Dialog } from '@headlessui/react';
import { Bars } from 'react-loader-spinner';
import GeneralForm from '../../components/GeneralBusinessForm';
import ContactForm from '../../components/ContactForm';
import SocialForm from '../../components/SocialForm';
import LinksForm from '../../components/LinksForm';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  useCreateBusiness,
  useDeleteBusiness,
  useGetBusiness,
  useUpdateBusiness,
} from '@/services/hooks/business/hook';
import { BusinessType } from '@/app/interfaces/business.type';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GoPlus } from 'react-icons/go';
import { IoCheckmarkDoneSharp, IoPencil, IoSearchOutline } from 'react-icons/io5';
import { addGeneral, resetGeneral } from '@/store/features/businessGeneral';
import { addContact, resetContact } from '@/store/features/businessContact';
import { addLinks, resetLinks } from '@/store/features/businessLink';
import { addSocial, resetSocial } from '@/store/features/businessSocials';
import { errorType } from '@/services/hooks/auth/hook';

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
import { FaTimes, FaGlobe, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { FiUsers, FiTrendingUp, FiMapPin } from 'react-icons/fi';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/app/helpers/cropImage';
import Image from 'next/image';

const Businesses = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<
    'GENERAL' | 'CONTACT' | 'SOCIAL' | 'LINKS'
  >('GENERAL');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Cropping states
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const tabs: Array<'GENERAL' | 'CONTACT' | 'SOCIAL' | 'LINKS'> = [
    'GENERAL',
    'CONTACT',
    'SOCIAL',
    'LINKS',
  ];

  const [editMode, setEditMode] = useState<boolean>(false);
  const [updateBusinessId, setBusinessId] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string>('');

  const [businessToDelete, setBusinessToDelete] = useState<string>('');

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openStepModal, setOpenStepModal] = useState<boolean>(false);

  const { businessContact, businessGeneral, businessLinks, businessSocials } =
    useSelector((state: RootState) => state);

  const dispatch = useDispatch();

  const { isLoading, data: fetchData, refetch } = useGetBusiness();

  const filteredBusinesses = fetchData?.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { isPending, isSuccess, isError, error, mutate } = useCreateBusiness();

  const {
    isSuccess: deleteIsSuccess,
    mutate: deleteMutate,
    isPending: deletePending,
  } = useDeleteBusiness();

  const {
    isSuccess: updateSuccess,
    isPending: updatePending,
    mutate: updateMutate,
  } = useUpdateBusiness();

  const clearBusinessStore = useCallback(() => {
    dispatch(resetGeneral());
    dispatch(resetContact());
    dispatch(resetLinks());
    dispatch(resetSocial());
  }, [dispatch]);

  const handleDialogClose = useCallback(() => {
    clearBusinessStore();
    setIsOpen(false);
    setEditMode(false);
    setErrorMsg('');
  }, [clearBusinessStore]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      clearBusinessStore();
      handleDialogClose();

      setTimeout(() => {
        setOpenStepModal(true);
      }, 1000);
    }

    if (isError) {
      const errorData = error as unknown as errorType;
      const errMsg = errorData.response.data.error;
      setErrorMsg(errMsg);
    }
  }, [isSuccess, refetch, isError, error, clearBusinessStore, handleDialogClose]);

  useEffect(() => {
    if (deleteIsSuccess) {
      refetch();
      setOpenDeleteModal(false);
      setBusinessToDelete('');
    }
  }, [deleteIsSuccess, refetch]);

  useEffect(() => {
    if (updateSuccess) {
      refetch();
      handleDialogClose();
    }
  }, [updateSuccess, refetch, handleDialogClose]);

  const handleOpenDeleteModal = (id: string) => {
    if (!openDeleteModal) {
      setOpenDeleteModal(true);
      setBusinessToDelete(id);
    }
  };

  const handleOpenModal = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsOpen(true);
    }, 500);
  };

  const handleSubmit = () => {
    const { industry, name } = businessGeneral;
    const { phoneNumber, email, city, postalCode, state, street } =
      businessContact;
    if (!industry || !name) {
      setActiveTab('GENERAL');
      setErrorMsg('Please fill in business name and industry');
    } else if (
      !phoneNumber ||
      !email ||
      !city ||
      !postalCode ||
      !state ||
      !street
    ) {
      setActiveTab('CONTACT');
      setErrorMsg('Fill in contact details');
    } else {
      const business: BusinessType = {
        ...businessGeneral,
        phoneNumber: businessContact.phoneNumber,
        email: businessContact.email,
        address: businessContact,
        socials: businessSocials,
        links: businessLinks,
        profileImage: logoPreview || undefined
      };

      mutate(business);
    }
  };

  const handleDelete = () => {
    if (!deletePending) deleteMutate(businessToDelete);
  };

  const handleEdit = (id: string) => {
    const business: BusinessType | undefined = fetchData?.find(
      item => item.id === id
    );

    if (business) {
      const { name, industry, address, links, socials, email, phoneNumber, profileImage } =
        business;
      dispatch(addGeneral({ name, industry }));

      const { city, state, street, postalCode } = address;

      dispatch(
        addContact({
          email: email ?? '',
          phoneNumber: phoneNumber ?? '',
          city,
          state,
          street,
          postalCode,
        })
      );

      dispatch(addLinks(links));
      dispatch(addSocial({ ...socials }));
      setLogoPreview(profileImage || null);

      setBusinessId(id);
      setEditMode(true);
      setIsOpen(true);
    }
  };

  const processUpdate = () => {
    const business: BusinessType = {
      ...businessGeneral,
      phoneNumber: businessContact.phoneNumber,
      email: businessContact.email,
      address: businessContact,
      socials: businessSocials,
      links: businessLinks,
      profileImage: logoPreview || undefined
    };

    updateMutate({ id: updateBusinessId, business });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
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
        setLogoPreview(croppedImage);
        setIsCropModalOpen(false);
        setImageToCrop(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
  };

  const isLastTab = activeTab === tabs[tabs.length - 1];
  const isFirstTab = activeTab === tabs[0];

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
      setErrorMsg('');
    } else {
      if (editMode) {
        processUpdate();
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
      setErrorMsg('');
    }
  };

  const stats = [
    { label: 'Total Businesses', value: fetchData?.length || 0, icon: HiOutlineOfficeBuilding, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Unique Industries', value: new Set(fetchData?.map(b => b.industry)).size || 0, icon: FiTrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Regions', value: new Set(fetchData?.map(b => b.address.state)).size || 0, icon: FiMapPin, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <section className="space-y-8 pb-10">
      {/* Header & Stats Section */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Business Directory</h1>
            <p className="text-gray-500 mt-2 font-medium">Manage and monitor your business network efficiently.</p>
          </div>
          <button
            className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-black hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
            onClick={handleOpenModal}
          >
            <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
              <GoPlus className="text-xl" />
            </div>
            Create New Business
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className={`${stat.bg} p-6 rounded-3xl border border-white/50 flex items-center gap-5 transition-transform hover:scale-[1.02]`}>
              <div className={`p-4 rounded-2xl bg-white shadow-sm`}>
                <stat.icon className={`text-2xl ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        {/* Search & Filters */}
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md group">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, industry or email..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-medium text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
             <span className="text-sm font-bold text-gray-400 uppercase tracking-widest px-4">
               {filteredBusinesses?.length || 0} Results
             </span>
          </div>
        </div>

        {/* Content State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
             <Bars height="50" width="50" color="#000" />
             <p className="mt-4 font-bold text-gray-400 animate-pulse">Fetching your data...</p>
          </div>
        ) : (!fetchData || fetchData?.length < 1) ? (
          <div className="flex flex-col items-center justify-center py-32 text-center px-6">
            <div className="bg-gray-50 p-10 rounded-[3rem] mb-8 relative">
                 <HiOutlineOfficeBuilding className="w-24 h-24 text-gray-200" />
                 <div className="absolute -bottom-2 -right-2 bg-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-200">
                   <GoPlus className="text-white text-2xl" />
                 </div>
            </div>

            <h2 className="text-3xl font-black text-gray-900 mb-3">Your directory is empty</h2>
            <p className="text-gray-500 max-w-sm mb-10 leading-relaxed font-medium">
                Connect your first business entity to start launching loyalty campaigns and managing staff.
            </p>

            <button
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                onClick={handleOpenModal}
              >
                Get Started Now
              </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow className="border-none">
                  <TableHead className="py-5 font-bold text-gray-400 uppercase tracking-widest text-xs px-8">Business</TableHead>
                  <TableHead className="font-bold text-gray-400 uppercase tracking-widest text-xs">Contact Details</TableHead>
                  <TableHead className="font-bold text-gray-400 uppercase tracking-widest text-xs">Location</TableHead>
                  <TableHead className="font-bold text-gray-400 uppercase tracking-widest text-xs text-right px-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBusinesses?.map((item, i) => {
                  const { id, email, name, address, phoneNumber, industry, profileImage } = item;
                  const { street, city, state } = address;
                  return (
                    <TableRow key={i} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50">
                      <TableCell className="py-5 px-8">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                            {profileImage ? (
                               <Image src={profileImage} alt={name} fill className="object-cover" />
                            ) : (
                               <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                 <HiOutlineOfficeBuilding size={24} />
                               </div>
                            )}
                          </div>
                          <div>
                            <p className="font-black text-gray-900 text-lg">{name}</p>
                            <span className="inline-block mt-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                              {industry}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 text-sm text-gray-600">
                             <FaEnvelope className="text-gray-300" />
                             <span className="font-medium">{email}</span>
                           </div>
                           <div className="flex items-center gap-2 text-sm text-gray-600">
                             <FaPhoneAlt className="text-gray-300" />
                             <span className="font-medium">{phoneNumber}</span>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                           <FiMapPin className="text-gray-300" />
                           <span className="font-medium">{city}, {state}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 pl-6 truncate max-w-[150px]">{street}</p>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex items-center justify-end gap-2">
                          <button
                              onClick={() => handleEdit(id!)}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                              title="Edit"
                          >
                            <IoPencil size={18}/>
                          </button>
                          <CNDialog
                            open={openDeleteModal && businessToDelete === id}
                            onOpenChange={(open) => {
                              if(!open) {
                                setOpenDeleteModal(false);
                                setBusinessToDelete('');
                              } else {
                                handleOpenDeleteModal(id!);
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                               <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Delete">
                                  <MdDelete size={20} />
                               </button>
                            </DialogTrigger>
                            <DialogContent className="rounded-[2rem]">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-black">Delete Business?</DialogTitle>
                                <DialogDescription className="font-medium text-gray-500">
                                  This will permanently remove <span className="text-gray-900 font-bold">{name}</span> from your directory. This action is irreversible.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="mt-6 gap-3">
                                <Button
                                  type="button"
                                  variant={'outline'}
                                  onClick={() => setOpenDeleteModal(false)}
                                  className="rounded-xl font-bold h-12"
                                >
                                  Keep it
                                </Button>
                                <Button
                                  type="button"
                                  variant={'destructive'}
                                  onClick={handleDelete}
                                  disabled={deletePending}
                                  className="rounded-xl font-bold h-12"
                                >
                                  {deletePending ? 'Deleting...' : 'Yes, Delete'}
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

      <Dialog
        open={isOpen}
        onClose={handleDialogClose}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
             <Dialog.Panel className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex justify-between items-center border-b border-gray-100 px-10 py-8 bg-gray-50/50">
                    <div>
                    <h2 className="text-3xl font-black text-gray-900 leading-none">{editMode ? 'Update Business' : 'New Business'}</h2>
                    <p className="text-gray-500 text-sm mt-3 font-medium">
                        {editMode ? 'Refine your business profile details.' : 'Let&apos;s get your business on the map.'}
                    </p>
                    </div>
                    <button onClick={handleDialogClose} className="text-gray-400 hover:text-gray-900 transition-colors p-3 rounded-2xl hover:bg-white shadow-sm">
                     <FaTimes size={20} />
                    </button>
                </div>

          <div className="flex-1 overflow-y-auto">
             <div className="px-10 py-8">
                 {/* Tabs */}
                 <div className="flex border-b border-gray-100 mb-10 space-x-8 overflow-x-auto scrollbar-hide">
                    {tabs.map(tab => (
                        <button
                        key={tab}
                        className={`pb-4 px-1 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-4 ${
                            activeTab === tab
                            ? 'border-blue-600 text-gray-900'
                            : 'border-transparent text-gray-300 hover:text-gray-400'
                        }`}
                        onClick={() => setActiveTab(tab)}
                        >
                        {tab}
                        </button>
                    ))}
                </div>

                {errorMsg && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 mb-8 rounded-2xl flex items-center gap-3">
                        <div className="bg-red-500 p-1 rounded-full"><FaTimes className="text-white text-[10px]" /></div>
                        <p className="font-bold text-sm">{errorMsg}</p>
                    </div>
                )}

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'GENERAL' && (
                    <GeneralForm
                    logoPreview={logoPreview}
                    handleLogoUpload={handleLogoUpload}
                    removeLogo={removeLogo}
                    />
                )}
                {activeTab === 'CONTACT' && <ContactForm />}
                {activeTab === 'SOCIAL' && <SocialForm />}
                {activeTab === 'LINKS' && <LinksForm />}
                </div>
            </div>
          </div>

          <div className="border-t border-gray-100 px-10 py-6 flex justify-between items-center bg-gray-50/80">
             <button
                className="px-6 py-3 text-gray-400 font-bold hover:text-gray-900 transition-colors"
                onClick={handleDialogClose}
                disabled={isPending || updatePending}
              >
                Cancel
              </button>
             <div className="flex gap-4">
                {!isFirstTab && (
                  <button
                    className="px-8 py-3.5 text-gray-700 font-bold bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                    onClick={handleBack}
                    disabled={isPending || updatePending}
                  >
                    Back
                  </button>
                )}
                <button
                  className="px-10 py-3.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:scale-[1.02] transition-all shadow-xl shadow-blue-200 disabled:opacity-70 min-w-[160px]"
                  onClick={handleNext}
                  disabled={isPending || updatePending}
                >
                  {!isLastTab ? (
                    'Continue'
                  ) : editMode ? (
                    updatePending ? 'Updating...' : 'Save Changes'
                  ) : (
                    isPending ? 'Creating...' : 'Launch Business'
                  )}
                </button>
             </div>
          </div>
        </Dialog.Panel>
        </div>
      </Dialog>

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
              <div className="flex items-center justify-between p-2">
                 <span>Create a staff</span>
                 <MdOutlineCancel className="text-gray-300 text-xl" />
              </div>
              <div className="flex items-center justify-between p-2">
                 <span>Create a reward</span>
                 <MdOutlineCancel className="text-gray-300 text-xl" />
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

      {/* Crop Modal */}
      <Dialog
        open={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        className="relative z-[60]"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">Crop Logo</h3>
              <button onClick={() => setIsCropModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="relative h-80 w-full bg-gray-100">
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

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setIsCropModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  onClick={handleCropSave}
                >
                  Save Crop
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
};

export default Businesses;