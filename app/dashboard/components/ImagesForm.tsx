import React from "react";
import { IoMdAttach } from "react-icons/io";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import ToolTip from './ToolTip';

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
        <label className="mb-2 flex items-center gap-2 font-medium text-gray-700 text-sm">
          Main Image
          <ToolTip content="Upload the primary image for the reward." />
        </label>
        <label className="flex items-center justify-center cursor-pointer w-full p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 hover:bg-gray-50 transition-all">
          <IoMdAttach className="mr-2 text-gray-500 text-xl" />
          <span className="text-gray-600">Add from Gallery</span>
          <input
            type="file"
            className="hidden"
            onChange={handleMainImageUpload}
            accept="image/*"
          />
        </label>
        {mainImagePreview && (
          <div className="relative w-32 h-32 border rounded-lg mt-4 shadow-sm overflow-hidden">
            <Image
              src={mainImagePreview}
              alt="Main Image Preview"
              fill
              style={{ objectFit: 'cover' }}
            />
            <button
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
              onClick={removeMainImage}
            >
              <FaTimes size={12} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Additional Image 1 */}
        <div>
          <label className="mb-2 flex items-center gap-2 font-medium text-gray-700 text-sm">
            Additional Image 1
            <ToolTip content="Upload an additional image." />
          </label>
          <label className="flex items-center justify-center cursor-pointer w-full p-3 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 hover:bg-gray-50 transition-all">
            <IoMdAttach className="mr-2 text-gray-500" />
            <span className="text-sm text-gray-600">Add from Gallery</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleAdditionalImageUpload(e, "additional1")}
              accept="image/*"
            />
          </label>
          {additionalImagePreviews.additional1 && (
            <div className="relative w-full h-32 border rounded-lg mt-2 shadow-sm overflow-hidden">
              <Image
                src={additionalImagePreviews.additional1}
                alt="Additional Image 1 Preview"
                fill
                style={{ objectFit: 'cover' }}
              />
              <button
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                onClick={() => removeAdditionalImage("additional1")}
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Additional Image 2 */}
        <div>
          <label className="mb-2 flex items-center gap-2 font-medium text-gray-700 text-sm">
            Additional Image 2
            <ToolTip content="Upload an additional image." />
          </label>
          <label className="flex items-center justify-center cursor-pointer w-full p-3 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 hover:bg-gray-50 transition-all">
            <IoMdAttach className="mr-2 text-gray-500" />
            <span className="text-sm text-gray-600">Add from Gallery</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleAdditionalImageUpload(e, "additional2")}
              accept="image/*"
            />
          </label>
          {additionalImagePreviews.additional2 && (
            <div className="relative w-full h-32 border rounded-lg mt-2 shadow-sm overflow-hidden">
              <Image
                src={additionalImagePreviews.additional2}
                alt="Additional Image 2 Preview"
                fill
                style={{ objectFit: 'cover' }}
              />
              <button
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                onClick={() => removeAdditionalImage("additional2")}
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Additional Image 3 */}
        <div>
          <label className="mb-2 flex items-center gap-2 font-medium text-gray-700 text-sm">
            Additional Image 3
            <ToolTip content="Upload an additional image." />
          </label>
          <label className="flex items-center justify-center cursor-pointer w-full p-3 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 hover:bg-gray-50 transition-all">
            <IoMdAttach className="mr-2 text-gray-500" />
            <span className="text-sm text-gray-600">Add from Gallery</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleAdditionalImageUpload(e, "additional3")}
              accept="image/*"
            />
          </label>
          {additionalImagePreviews.additional3 && (
            <div className="relative w-full h-32 border rounded-lg mt-2 shadow-sm overflow-hidden">
              <Image
                src={additionalImagePreviews.additional3}
                alt="Additional Image 3 Preview"
                fill
                style={{ objectFit: 'cover' }}
              />
              <button
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                onClick={() => removeAdditionalImage("additional3")}
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Additional Image 4 */}
        <div>
          <label className="mb-2 flex items-center gap-2 font-medium text-gray-700 text-sm">
            Additional Image 4
            <ToolTip content="Upload an additional image." />
          </label>
          <label className="flex items-center justify-center cursor-pointer w-full p-3 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 hover:bg-gray-50 transition-all">
            <IoMdAttach className="mr-2 text-gray-500" />
            <span className="text-sm text-gray-600">Upload</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleAdditionalImageUpload(e, "additional4")}
              accept="image/*"
            />
          </label>
          {additionalImagePreviews.additional4 && (
            <div className="relative w-full h-32 border rounded-lg mt-2 shadow-sm overflow-hidden">
              <Image
                src={additionalImagePreviews.additional4}
                alt="Additional Image 4 Preview"
                fill
                style={{ objectFit: 'cover' }}
              />
              <button
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                onClick={() => removeAdditionalImage("additional4")}
              >
                <FaTimes size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagesForm;
