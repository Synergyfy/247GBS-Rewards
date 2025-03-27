import React from "react";
import { IoMdAttach } from "react-icons/io";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";

interface AdditionalImages {
  additional1: string | null;
  additional2: string | null;
  additional3: string | null;
  additional4: string | null;
}

interface ImagesFormProps {
  mainImagePreview: string | null;
  additionalImagePreviews: AdditionalImages;
  handleMainImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAdditionalImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof AdditionalImages
  ) => void;
  removeMainImage: () => void;
  removeAdditionalImage: (key: keyof AdditionalImages) => void;
}

const ImagesForm: React.FC<ImagesFormProps> = ({
  mainImagePreview,
  additionalImagePreviews,
  handleMainImageUpload,
  handleAdditionalImageUpload,
  removeMainImage,
  removeAdditionalImage,
}) => {
  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div>
        <label className="flex items-center cursor-pointer p-2 border-b-2 border-[#838383]">
          <IoMdAttach className="mr-2 text-gray-500" />
          Main image
          <input
            type="file"
            className="hidden"
            onChange={handleMainImageUpload}
          />
        </label>
        {mainImagePreview && (
          <div className="relative w-20 h-20 border rounded mt-2">
            <Image
              src={mainImagePreview}
              alt="Main Image Preview"
              width={100}
              height={100}
              className="w-full h-full object-cover rounded-md border"
            />
            <button
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              onClick={removeMainImage}
            >
              <FaTimes size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Additional Image 1 */}
      <div>
        <label className="flex items-center cursor-pointer p-2 border-b-2 border-[#838383]">
          <IoMdAttach className="mr-2 text-gray-500" />
          Additional image1
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleAdditionalImageUpload(e, "additional1")}
          />
        </label>
        {additionalImagePreviews.additional1 && (
          <div className="relative w-20 h-20 border rounded mt-2">
            <Image
              src={additionalImagePreviews.additional1}
              alt="Additional Image 1 Preview"
              width={100}
              height={100}
              className="w-full h-full object-cover rounded-md border"
            />
            <button
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              onClick={() => removeAdditionalImage("additional1")}
            >
              <FaTimes size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Additional Image 2 */}
      <div>
        <label className="flex items-center cursor-pointer p-2 border-b-2 border-[#838383]">
          <IoMdAttach className="mr-2 text-gray-500" />
          Additional image2
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleAdditionalImageUpload(e, "additional2")}
          />
        </label>
        {additionalImagePreviews.additional2 && (
          <div className="relative w-20 h-20 border rounded mt-2">
            <Image
              src={additionalImagePreviews.additional2}
              alt="Additional Image 2 Preview"
              width={100}
              height={100}
              className="w-full h-full object-cover rounded-md border"
            />
            <button
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              onClick={() => removeAdditionalImage("additional2")}
            >
              <FaTimes size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Additional Image 3 */}
      <div>
        <label className="flex items-center cursor-pointer p-2 border-b-2 border-[#838383]">
          <IoMdAttach className="mr-2 text-gray-500" />
          Additional image3
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleAdditionalImageUpload(e, "additional3")}
          />
        </label>
        {additionalImagePreviews.additional3 && (
          <div className="relative w-20 h-20 border rounded mt-2">
            <Image
              src={additionalImagePreviews.additional3}
              alt="Additional Image 3 Preview"
              width={100}
              height={100}
              className="w-full h-full object-cover rounded-md border"
            />
            <button
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              onClick={() => removeAdditionalImage("additional3")}
            >
              <FaTimes size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Additional Image 4 */}
      <div>
        <label className="flex items-center cursor-pointer p-2 border-b-2 border-[#838383]">
          <IoMdAttach className="mr-2 text-gray-500" />
          Additional image4
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleAdditionalImageUpload(e, "additional4")}
          />
        </label>
        {additionalImagePreviews.additional4 && (
          <div className="relative w-20 h-20 border rounded mt-2">
            <Image
              src={additionalImagePreviews.additional4}
              alt="Additional Image 4 Preview"
              width={100}
              height={100}
              className="w-full h-full object-cover rounded-md border"
            />
            <button
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              onClick={() => removeAdditionalImage("additional4")}
            >
              <FaTimes size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesForm;
