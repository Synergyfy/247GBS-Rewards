'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { IoMdBusiness } from 'react-icons/io';
import {
  MdDelete,
  MdOutlineCancel,
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GoPlus } from 'react-icons/go';
import { IoCheckmarkDoneSharp, IoPencil } from 'react-icons/io5';
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
import { FaTimes } from 'react-icons/fa';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/app/helpers/cropImage';

const Businesses = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
      const { name, industry, address, links, socials, email, phoneNumber } =
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

  return (
    <section className="bg-white rounded-lg shadow-sm p-6 min-h-[80vh] relative">
      <div className="flex justify-between items-center mb-6">
        <div></div>
        {fetchData && fetchData.length > 0 && (
          <button
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all flex items-center gap-2"
            onClick={handleOpenModal}
          >
            <GoPlus className="text-xl" />
            Create Business
          </button>
        )}
      </div>

      {(!fetchData || fetchData?.length < 1) && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
                 <IoMdBusiness className="w-20 h-20 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Business Found</h2>
            <p className="text-gray-500 max-w-md mb-8">
                A Business is an entity to which you can link staff members and loyalty campaigns. Let&apos;s start by setting up a Business.
            </p>

            <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                onClick={handleOpenModal}
              >
                <GoPlus className="text-xl"/>
                Create a Business
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
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
             <Dialog.Panel className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center border-b px-6 py-4">
                    <div>
                    <h2 className="text-xl font-bold text-gray-900">{editMode ? 'Edit Business' : 'Create Business'}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {editMode ? 'Update your business details.' : 'Set up your business profile to get started.'}
                    </p>
                    </div>
                    <button onClick={handleDialogClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                     <FaTimes size={20} />
                    </button>
                </div>

          <div className="flex-1 overflow-y-auto">
             <div className="px-6 py-4">
                 {/* Tabs */}
                 <div className="flex border-b border-gray-200 mb-6 space-x-4">
                    {tabs.map(tab => (
                        <button
                        key={tab}
                        className={`pb-2 px-1 text-sm font-medium transition-colors border-b-2 ${
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

                {errorMsg && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
                        <p>{errorMsg}</p>
                    </div>
                )}

                <div className="mt-2">
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

          <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50 rounded-b-xl">
             <button
                className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                onClick={handleDialogClose}
                disabled={isPending || updatePending}
              >
                Cancel
              </button>
             <div className="flex gap-3">
                {!isFirstTab && (
                  <button
                    className="px-5 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    onClick={handleBack}
                    disabled={isPending || updatePending}
                  >
                    Back
                  </button>
                )}
                <button
                  className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 min-w-[140px]"
                  onClick={handleNext}
                  disabled={isPending || updatePending}
                >
                  {!isLastTab ? (
                    'Next'
                  ) : editMode ? (
                    updatePending ? 'Updating...' : 'Update Business'
                  ) : (
                    isPending ? 'Creating...' : 'Create Business'
                  )}
                </button>
             </div>
          </div>
        </Dialog.Panel>
        </div>
      </Dialog>

      {fetchData && fetchData.length > 0 && (
        <div className="overflow-x-auto">
        <Table className="text-base">
          <TableCaption>A list of your registered businesses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading &&
              fetchData.map((item, i) => {
                const { id, email, name, address, phoneNumber } = item;
                const { street, city, state } = address;
                return (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{name}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>{`${street}, ${city}, ${state}`}</TableCell>
                    <TableCell>{phoneNumber}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={() => handleEdit(id)}
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
                                Delete Business?
                              </DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this business? This action cannot be undone.
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

            {isLoading && <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>}
          </TableBody>
        </Table>
        </div>
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
