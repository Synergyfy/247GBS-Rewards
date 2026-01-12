'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { HiUserGroup } from 'react-icons/hi2';
import {
  MdDelete,
  MdKeyboardArrowRight,
  MdOutlineCancel,
} from 'react-icons/md';
import { Dialog } from '@headlessui/react';
import { Bars } from 'react-loader-spinner';
import { FaUserCircle, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import {
  useCreateStaff,
  useDeleteStaff,
  useGetBusiness,
  useGetStaffs,
  useUpdateStaff,
} from '@/services/hooks/business/hook';
import { StaffType } from '@/app/interfaces/business.type';
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
import ToolTip from '../../components/ToolTip';

const Staff = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const { isSuccess: fetchSuccess, data: fetchData } = useGetBusiness();

  const { data: staffData, refetch, isLoading } = useGetStaffs();

  const { isPending, isSuccess, isError, error, mutate } = useCreateStaff();

  const [staffId, setStaffId] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);

  const [errorMsg, setErrorMsg] = useState<string>('');

  const [staffToDelete, setStaffToDelete] = useState<string>('');

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openStepModal, setOpenStepModal] = useState<boolean>(false);

  const {
    mutate: deleteMutate,
    isSuccess: deleteSuccess,
    isPending: deletePending,
  } = useDeleteStaff();

  const {
    mutate: updateMutate,
    isSuccess: updateSuccess,
    isPending: updatePending,
  } = useUpdateStaff();

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setSelectedBusiness('');
    setAvatar(null);
  };

  const handleOpenModal = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsOpen(true);
    }, 500);
  };

  const handleCloseModal = useCallback(() => {
    clearForm();
    setEditMode(false);
    setIsOpen(false);
    setErrorMsg('');
  }, []);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      handleCloseModal();
      setTimeout(() => {
        setOpenStepModal(true);
      }, 1000);
    }
    if (isError) {
      const errorData = error as unknown as errorType;
      const errMsg = errorData.response.data.error;
      setErrorMsg(errMsg);
    }
  }, [isSuccess, refetch, isError, error, handleCloseModal]);

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
      setStaffToDelete('');
    }
  }, [deleteSuccess, refetch]);

  const handleOpenDeleteModal = (id: string) => {
    if (!openDeleteModal) {
      setOpenDeleteModal(true);
      setStaffToDelete(id);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = () => {
    if (!name) {
      setErrorMsg("Enter this staff's name");
    } else if (!email) {
      setErrorMsg("Enter this staff's email address");
    } else if (!password) {
      setErrorMsg("Enter this staff's password");
    } else if (!selectedBusiness) {
      setErrorMsg('Please select a business');
    } else {
      const staff: StaffType = {
        name,
        email,
        password,
        businessId: selectedBusiness,
        isActive: true,
      };
      mutate(staff);
    }
  };

  const processUpdate = () => {
    const staff: StaffType = {
      name,
      email,
      password,
      businessId: selectedBusiness,
      isActive: true,
    };
    updateMutate({ id: staffId, staff });
  };

  const handleDelete = () => {
    if (!deletePending) deleteMutate(staffToDelete);
  };

  const handleEdit = (id: string) => {
    const staff: StaffType | undefined = staffData?.find(
      item => item.id === id
    );
    if (staff) {
      const { name, email, businessId } = staff;
      setName(name);
      setEmail(email);
      setSelectedBusiness(businessId || '');

      setEditMode(true);
      setIsOpen(true);

      setStaffId(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 min-h-[80vh] relative">
      {staffData && staffData.length < 1 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-blue-50 p-6 rounded-full mb-6">
                <HiUserGroup className="w-20 h-20 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Staff Members Found</h2>
            <p className="text-gray-500 max-w-md mb-8">
              A Staff member can give customers loyalty points and redeem
              rewards. Staff members belong to one or more businesses.
            </p>

           <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                onClick={handleOpenModal}
              >
                <GoPlus className="text-xl"/>
                Create a Staff Member
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
        {fetchSuccess && fetchData && (
          <Dialog.Panel className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{editMode ? 'Edit Staff Member' : 'Create Staff Member'}</h2>
                <p className="text-gray-500 text-sm mt-1">
                   {editMode ? 'Update staff member details.' : 'Add a new staff member to your business.'}
                </p>
              </div>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {errorMsg && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
                   <p>{errorMsg}</p>
                </div>
              )}

              <div className="space-y-4">
                  <div>
                    <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
                        Business (required)
                        <ToolTip content="Select the business you're creating this staff member for" />
                    </label>
                    <select
                    className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    onChange={e => setSelectedBusiness(e.target.value)}
                    value={selectedBusiness}
                    >
                    <option value="">Select a business</option>
                    {fetchData.map(item => {
                        return (
                        <option value={item.id} key={item.id}>
                            {item.name}
                        </option>
                        );
                    })}
                    </select>
                </div>

                {/* Name Input */}
                <div>
                    <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
                        Staff name (required)
                        <ToolTip content="Enter the full name of the staff member." />
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. John Doe"
                        className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>

                {/* Email Input */}
                <div>
                     <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
                        Staff Email (required)
                        <ToolTip content="The email address used for login and notifications." />
                    </label>
                    <input
                        type="email"
                        placeholder="e.g. john@example.com"
                        className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                {/* Password Input */}
                <div>
                     <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
                        Staff password (required)
                        <ToolTip content="Secure password for the staff member's account access." />
                    </label>
                    <div className="relative">
                        <input
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Enter password"
                        className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors pr-10"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        />
                        <span
                        className="absolute right-3 top-3.5 cursor-pointer text-gray-400 hover:text-gray-600"
                        onClick={togglePasswordVisibility}
                        >
                        {passwordVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </span>
                    </div>
                </div>

                {/* Avatar Preview */}
                <div className="flex flex-col items-center justify-center pt-2">
                    {avatar ? (
                        <div className="relative">
                        <Image
                            src={avatar}
                            alt="Avatar Preview"
                            width={100}
                            height={100}
                            className="w-24 h-24 rounded-full border-4 border-gray-100 shadow-sm object-cover"
                        />
                        <button
                            onClick={handleRemoveAvatar}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                        >
                            <FaTimes size={12} />
                        </button>
                        </div>
                    ) : (
                         <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400">
                             <FaUserCircle size={48} />
                         </div>
                    )}
                </div>

                {/* Avatar Upload */}
                <div>
                    <label className="mb-2 flex items-center gap-2 font-medium text-gray-700 text-sm">
                         Avatar
                         <ToolTip content="Upload a profile picture for the staff member." />
                    </label>
                    <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="avatarInput"
                    />
                    <label
                        htmlFor="avatarInput"
                        className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <FaUserCircle className="text-gray-500 mr-2" size={20} />
                        <span className="text-gray-600 font-medium text-sm">Upload Avatar</span>
                    </label>
                    </div>
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
                   {isPending ? 'Creating...' : 'Create Staff'}
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
        )}

        {fetchSuccess && (!fetchData || fetchData.length === 0) && (
             <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
                 <h3 className="text-lg font-bold text-gray-900 mb-2">No Business Found</h3>
                 <p className="text-gray-600 mb-6">Please create a business before adding staff members.</p>
                 <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Close
                 </button>
             </Dialog.Panel>
        )}
      </Dialog>

      {staffData && staffData.length > 0 && (
         <div className="overflow-x-auto">
            <Table className="text-base">
            <TableCaption>A list of your staff members.</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {!isLoading &&
                staffData.map((item, i) => {
                    const { email, name, id } = item;
                    return (
                    <TableRow key={i}>
                        <TableCell className="font-medium">{name}</TableCell>
                        <TableCell>{email}</TableCell>
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
                                    Delete Staff Member?
                                </DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this staff member? This action cannot be undone.
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

                {isLoading && <TableRow><TableCell colSpan={3} className="text-center py-8">Loading...</TableCell></TableRow>}
            </TableBody>
            </Table>
        </div>
      )}

       {staffData && staffData.length > 0 && (
          <button
            className="fixed bottom-8 right-8 bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-105 transition-all z-40"
            onClick={() => setIsOpen(true)}
            title="Add New Staff"
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
    </div>
  );
};

export default Staff;
