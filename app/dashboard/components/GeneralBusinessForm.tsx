import React, { ChangeEvent } from 'react';
import { IoMdAttach } from 'react-icons/io';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { addGeneral } from '@/store/features/businessGeneral';
import ToolTip from './ToolTip';

interface GeneralFormProps {
  logoPreview: string | null;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeLogo: () => void;
}

const GeneralForm: React.FC<GeneralFormProps> = ({
  logoPreview,
  handleLogoUpload,
  removeLogo,
}) => {
  const { industry, name } = useSelector(
    (state: RootState) => state.businessGeneral
  );
  const dispatch = useDispatch();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    dispatch(addGeneral({ [name]: value }));
  };
  return (
    <div className="space-y-6">
      {/* Industry Field */}
      <div>
        <label className="mb-1 flex items-center gap-2 font-medium text-gray-700">
          Industry (required)
          <ToolTip content="Select the industry that best describes your business." />
        </label>
        <select
          className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          name="industry"
          value={industry}
          onChange={handleInputChange}
        >
          <option value="">Select an industry</option>
          <option value="Accounting and Legal">Accounting and Legal</option>
          <option value="Advertising">Advertising</option>
          <option value="Aerospace">Aerospace</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Automotive">Automotive</option>
          <option value="Banking and Finance">Banking and Finance</option>
          <option value="Bars and Nightclubs">Bars and Nightclubs</option>
          <option value="Biotechnology">Biotechnology</option>
          <option value="Broadcasting">Broadcasting</option>
          <option value="Business Services">Business Services</option>
          <option value="Commodities and Chemicals">
            Commodities and Chemicals
          </option>
          <option value="Communications">Communications</option>
          <option value="Computers and Hightech">Computers and Hightech</option>
          <option value="Construction">Construction</option>
          <option value="Defense">Defense</option>
          <option value="Energy">Energy</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Government">Government</option>
          <option value="Healthcare and Life Sciences">
            Healthcare and Life Sciences
          </option>
          <option value="Insurance">Insurance</option>
          <option value="Internet and Online">Internet and Online</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Marketing">Marketing</option>
          <option value="Media">Media</option>
          <option value="Nonprofit and Higher Education">
            Nonprofit and Higher Education
          </option>
          <option value="Other">Other</option>
          <option value="Pharmaceuticals">Pharmaceuticals</option>
          <option value="Photography">Photography</option>
          <option value="Professional services and Consulting">
            Professional services and Consulting
          </option>
          <option value="Real Estate">Real Estate</option>
          <option value="Restaurant and Catering">
            Restaurant and Catering
          </option>
          <option value="Retail and Wholesale">Retail and Wholesale</option>
          <option value="Software & Development">Software & Development</option>
          <option value="Sports">Sports</option>
          <option value="Transportation">Transportation</option>
        </select>
      </div>

      {/* Business Name Field */}
      <div>
        <label className="mb-1 flex items-center gap-2 font-medium text-gray-700">
          Business Name (required)
          <ToolTip content="Enter the official name of your business as you want it to appear." />
        </label>
        <input
          placeholder="e.g. Acme Corp"
          className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          name="name"
          value={name}
          onChange={handleInputChange}
        />
      </div>

      {/* Logo Upload Field */}
      <div>
        <label className="mb-2 flex items-center gap-2 font-medium text-gray-700">
            Business Logo
            <ToolTip content="Upload your business logo. Recommended size: 500x500px." />
        </label>
        <label className="flex items-center justify-center cursor-pointer w-full p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 hover:bg-gray-50 transition-all">
          <IoMdAttach className="mr-2 text-gray-500 text-xl" />
          <span className="text-gray-600">Click to upload logo</span>
          <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*"/>
        </label>
        {logoPreview && (
          <div className="relative w-32 h-32 border rounded-lg mt-4 shadow-sm overflow-hidden">
            <Image
              src={logoPreview}
              alt="Logo Preview"
              fill
              style={{ objectFit: 'cover' }}
            />
            <button
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
              onClick={removeLogo}
            >
              <FaTimes size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralForm;
