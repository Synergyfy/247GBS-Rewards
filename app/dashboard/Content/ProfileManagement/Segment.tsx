'use client';

import React, { useEffect, useState } from 'react';
import { RiShapesFill } from 'react-icons/ri';
import { MdDelete, MdKeyboardArrowRight } from 'react-icons/md';
import { Dialog } from '@headlessui/react';
import { Bars } from 'react-loader-spinner';
import {
  useCreateSegment,
  useDeleteSegment,
  useGetBusiness,
  useGetSegments,
  useUpdateSegment,
} from '@/services/hooks/business/hook';
import {
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from '@/components/ui/table';
import { GoPlus } from 'react-icons/go';
import { IoPencil } from 'react-icons/io5';
import { SegmentType } from '@/app/interfaces/business.type';

const Segment = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<string>('');
  const [name, setName] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [segmentId, setSegmentId] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);

  const { isSuccess: fetchSuccess, data: fetchData } = useGetBusiness();
  const { data: segmentData, isLoading, refetch } = useGetSegments();

  const { isPending, isSuccess, mutate } = useCreateSegment();

  const {
    mutate: deleteMutate,
    isSuccess: deleteSuccess,
    isPending: deletePending,
  } = useDeleteSegment();

  const {
    mutate: updateMutate,
    isSuccess: updateSuccess,
    isPending: updatePending,
  } = useUpdateSegment();

  useEffect(() => {
    if (isSuccess) {
      refetch();
      setIsOpen(false);
    }
  }, [isSuccess, refetch]);

  const handleCloseModal = () => {
    clearForm();
    setEditMode(false);
    setIsOpen(false);
  };

  useEffect(() => {
    if (updateSuccess) {
      refetch();
      handleCloseModal();
    }
  }, [updateSuccess, refetch]);

  useEffect(() => {
    if (deleteSuccess) {
      refetch();
    }
  }, [deleteSuccess, refetch]);

  const handleDelete = (id: string) => {
    if (!deletePending) deleteMutate(id);
  };

  const clearForm = () => {
    setName('');
    setSelectedBusiness('');
  };

  const handleOpenModal = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsOpen(true);
    }, 1500);
  };

  const handleSubmit = () => {
    if (!name || !selectedBusiness) {
      setErrorMsg('Enter segment name and select a business');
      return;
    }
    mutate({ name, businessId: selectedBusiness });
  };

  const handleEdit = (id: string) => {
    const segment: SegmentType | undefined = segmentData?.find(
      item => item.id === id
    );
    if (segment) {
      const { name, businessId } = segment;
      setName(name);
      setSelectedBusiness(businessId);

      setEditMode(true);
      setIsOpen(true);

      setSegmentId(id);
    }
  };

  const processUpdate = () => {
    const segment: SegmentType = {
      name,
      businessId: selectedBusiness,
    };
    updateMutate({ id: segmentId, segment });
  };

  return (
    <section>
      {segmentData && segmentData.length < 1 && (
        <div className="p-24">
          <div className="flex flex-col px-24 gap-6">
            <RiShapesFill className="w-40 h-40 text-[#2D3DFF]" />
            <h1 className="font-semibold text-2xl">
              Looks like you don&apos;t have any segments
            </h1>
            <p className="text-base">
              Segments allow you to gain insight into the behaviour of your
              customers. When a customer claims loyalty points or redeems a
              reward, a staff member can select one or more segments. This can
              be any label relevant to your business. For example, you can have
              segments such as &quot;Vegetarian&quot;, &quot;Male&quot; or
              &quot;Female&quot;, or a location. The use of segments is
              optional, and segments are not visible to customers.
            </p>
          </div>
          <div className="px-24 mt-4 flex justify-end items-center">
            <p
              className="text-[#2D3DFF] font-bold text-xl cursor-pointer"
              onClick={handleOpenModal}
            >
              + CREATE SEGMENT
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

      <div
        className="bg-red-600 w-[3rem] h-[3rem] rounded-full flex items-center justify-center absolute bottom-28 right-10"
        onClick={() => setIsOpen(true)}
      >
        <GoPlus className="text-white" />
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      >
        {fetchSuccess && fetchData.length > 0 && (
          <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-y-auto">
            <div className="flex justify-between items-center border-b p-6 pb-4">
              <h2 className="text-2xl font-bold">Create Segment</h2>
              <button onClick={handleCloseModal} className="text-2xl font-bold">
                X
              </button>
            </div>
            <div className=" flex flex-col mt-4 px-6 gap-4">
              {errorMsg && (
                <p className="text-red-600 text-lg my-3">{errorMsg}</p>
              )}
              <input
                type="text"
                placeholder="Name (required)"
                className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
                value={name}
                onChange={e => setName(e.target.value)}
              />
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
            {!editMode ? (
              <div className="flex justify-end border-t border-gray-300 mt-20 p-6 ">
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
      </Dialog>

      {segmentData && segmentData.length > 0 && (
        <Table className="text-lg">
          <TableCaption>Your Segments</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading &&
              segmentData.map((item, i) => {
                const { name, id } = item;
                return (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{name}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <span onClick={() => handleEdit(id ?? '')}>
                          <IoPencil />
                        </span>
                        <span onClick={() => handleDelete(id ?? '')}>
                          <MdDelete />
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

            {isLoading && <p>Loading...</p>}
          </TableBody>
        </Table>
      )}
    </section>
  );
};

export default Segment;
