'use client';

import React, { useEffect, useState } from 'react';
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
  };

  const handleOpenModal = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsOpen(true);
    }, 1500);
  };

  const handleCloseModal = () => {
    clearForm();
    setEditMode(false);
    setIsOpen(false);
  };

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
  }, [isSuccess, refetch, isError, error]);

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
      const { name, email } = staff;
      setName(name);
      setEmail(email);

      setEditMode(true);
      setIsOpen(true);

      setStaffId(id);
    }
  };

  return (
    <section>
      <div
        className="bg-red-600 w-[3rem] h-[3rem] rounded-full flex items-center justify-center absolute bottom-28 right-10"
        onClick={() => setIsOpen(true)}
      >
        <GoPlus className="text-white" />
      </div>
      {staffData && staffData.length < 1 && (
        <div className="px-24">
          <div className="px-24">
            <HiUserGroup className="w-40 h-40 text-[#2D3DFF]" />
            <p className="text-2xl">
              A Staff member can give customers loyalty points and redeem
              rewards. Staff members belong to one or more businesses.
            </p>
          </div>
          <div className="px-24 flex justify-end items-center">
            <p
              className="text-[#2D3DFF] font-bold text-xl cursor-pointer"
              onClick={handleOpenModal}
            >
              Create a Staff Member
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
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      >
        {fetchSuccess && fetchData.length > 0 && (
          <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-y-auto">
            <div className="flex justify-between items-center border-b p-6 pb-4">
              <div>
                <h2 className="text-2xl font-bold">Create Staff Member</h2>
                <p className="text-gray-600">
                  Create a staff members for your business
                </p>
              </div>
              <button onClick={handleCloseModal} className="text-2xl font-bold">
                X
              </button>
            </div>
            <div className="mt-4 px-6">
              {errorMsg && (
                <p className="text-red-600 text-lg my-3">{errorMsg}</p>
              )}
              <div className="mb-4">
                <label className=" mb-1 flex items-center gap-2">
                  Business (required)
                  <ToolTip content="Select the business you're creating this staff member for" />
                </label>
                <select
                  className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
                  onChange={e => setSelectedBusiness(e.target.value)}
                >
                  <option>Select a business</option>
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
              <label className=" mb-1 flex items-center gap-2">
                Staff name (required)
                <ToolTip content="Staff member fullname" />
              </label>
              <input
                type="text"
                placeholder="Enter the staff's full name"
                className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none mb-4"
                value={name}
                onChange={e => setName(e.target.value)}
              />

              {/* Email Input */}
              <label className=" mb-1 flex items-center gap-2">
                Staff Email (required)
                <ToolTip content="Staff memeber email address" />
              </label>
              <input
                type="email"
                placeholder="Staff member's email address"
                className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none mb-4"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />

              {/* Password Input */}
              <label className=" mb-1 flex items-center gap-2">
                Staff password (required)
                <ToolTip content="Password so staff member can access their account" />
              </label>
              <div className="relative mb-4">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Password (required)"
                  className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-2 cursor-pointer text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Avatar Preview */}
              {avatar && (
                <div className="relative flex justify-center mt-4">
                  <Image
                    src={avatar}
                    alt="Avatar Preview"
                    width={100}
                    height={100}
                    className="w-24 h-24 rounded-full border border-gray-300"
                  />
                  <button
                    onClick={handleRemoveAvatar}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              )}

              {/* Avatar Upload */}
              <div className="mb-4">
                <label className="block text-gray-700">Avatar</label>
                <div className="relative flex items-center border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none p-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="avatarInput"
                  />
                  <label
                    htmlFor="avatarInput"
                    className="cursor-pointer flex items-center"
                  >
                    <FaUserCircle className="text-gray-500 mr-2" size={24} />
                    <span className="text-gray-500">Upload Avatar</span>
                  </label>
                </div>
              </div>
            </div>

            {!editMode ? (
              <div className="flex justify-end border-t border-gray-300 mt-14 p-6 pt-4">
                <button
                  className="px-4 py-2 bg-transparent font-semibold text-[#2D3DFF] rounded"
                  onClick={handleSubmit}
                  disabled={isPending}
                >
                  {isPending ? 'CREATING...' : 'CREATE'}
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
        )}

        {fetchSuccess && fetchData.length === 0 && (
          <p>Create a business before creating a staff</p>
        )}
      </Dialog>

      {staffData && staffData.length > 0 && (
        <Table className="text-lg">
          <TableCaption>Your Staffs</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Action</TableHead>
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
                    <TableCell>
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <span onClick={() => handleEdit(id ?? '')}>
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
                                This action will delete this staff.
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

      <CNDialog
        open={openStepModal}
        onOpenChange={() => setOpenStepModal(!openStepModal)}
      >
        <DialogContent className="w-[20rem]">
          <DialogHeader>
            <DialogTitle>Step two completed</DialogTitle>
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

export default Staff;
