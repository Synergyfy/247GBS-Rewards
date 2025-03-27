'use client';

import React, { useEffect, useState } from 'react';
import { IoMdBusiness } from 'react-icons/io';
import {
  MdDelete,
  MdKeyboardArrowRight,
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

const Businesses = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'GENERAL' | 'CONTACT' | 'SOCIAL' | 'LINKS'
  >('GENERAL');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

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

  const clearBusinessStore = () => {
    dispatch(resetGeneral());
    dispatch(resetContact());
    dispatch(resetLinks());
    dispatch(resetSocial());
  };

  const handleOpenModal = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsOpen(true);
    }, 1500);
  };

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
  }, [isSuccess, refetch, isError, error]);

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
  }, [updateSuccess, refetch]);

  const handleOpenDeleteModal = (id: string) => {
    if (!openDeleteModal) {
      setOpenDeleteModal(true);
      setBusinessToDelete(id);
    }
  };

  const handleSubmit = () => {
    const { industry, name } = businessGeneral;
    const { phoneNumber, email, city, postalCode, state, street } =
      businessContact;
    if (!industry || !name) {
      setActiveTab('GENERAL');
      setErrorMsg('Please fill in busienss name and industry');
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

  const handleDialogClose = () => {
    clearBusinessStore();
    setIsOpen(false);
    setEditMode(false);
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
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(files[0]);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
  };

  return (
    <section>
      {!fetchData ||
        (fetchData?.length < 1 && (
          <div className="p-24">
            <div className="px-24">
              <IoMdBusiness className="w-40 h-40 text-[#2D3DFF]" />
              <p className="text-2xl">
                A Business is an entity to which you can link staff members and
                loyalty campaigns. Let&apos;s start by setting up a Business
              </p>
            </div>
            <div className="px-24 flex justify-end items-center">
              <p
                className="text-[#2D3DFF] font-bold text-xl cursor-pointer"
                onClick={handleOpenModal}
              >
                Create a Business
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
              <h2 className="text-2xl font-bold">Create Business</h2>
              <p className="text-gray-600 text-sm w-[90%]">
                Create a business here so you can have access to options like
                linking staff members and loyalty campaigns
              </p>
            </div>
            <button onClick={handleDialogClose} className="text-2xl font-bold">
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
            <div className="mt-2 px-6">
              {errorMsg && (
                <p className="text-red-600 text-lg my-3">{errorMsg}</p>
              )}
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
                onClick={handleDialogClose}
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
                {updatePending ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                className="px-4 py-2 mr-2 bg-transparent font-semibold rounded"
                onClick={handleDialogClose}
                disabled={updatePending}
              >
                CLOSE
              </button>
            </div>
          )}
        </Dialog.Panel>
      </Dialog>

      {fetchData && fetchData.length > 0 && (
        <Table className="text-lg">
          <TableCaption>Your Businesses</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Action</TableHead>
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
                    <TableCell className="text-base">{`${street} ${city} ${state}`}</TableCell>
                    <TableCell>{phoneNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <span onClick={() => handleEdit(id)}>
                          <IoPencil />
                        </span>
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
                                This action will delete this business.
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
                Create a staff <MdOutlineCancel className="text-red-700" />
              </p>
              <p className="flex items-center gap-1">
                Create a reward <MdOutlineCancel className="text-red-700" />
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

export default Businesses;
