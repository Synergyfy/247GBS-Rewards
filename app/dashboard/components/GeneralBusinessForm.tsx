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
    <div>
      {/* Industry Field */}
      <div className="mt-6">
        <label className=" mb-1 flex items-center gap-2">
          Industry (required)
          <ToolTip content="What industry is your business in." />
        </label>
        <select
          className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
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
      <div className="mt-6">
        <label className="block text-gray-700 mb-1"></label>
        <label className=" mb-1 flex items-center gap-2">
          Business Name (required)
          <ToolTip content="What is the name of your business" />
        </label>
        <input
          placeholder="Business Name (required)"
          className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
          name="name"
          value={name}
          onChange={handleInputChange}
        />
      </div>

      {/* Logo Upload Field */}
      <div className="mt-6">
        <label className="flex items-center cursor-pointer w-full p-2 border-b-2 border-[#838383]">
          <IoMdAttach className="mr-2 text-gray-500" />
          Upload Business Logo
          <input type="file" className="hidden" onChange={handleLogoUpload} />
        </label>
        {logoPreview && (
          <div className="relative w-20 h-20 border rounded mt-2">
            <Image
              src={logoPreview}
              alt="Logo Preview"
              width={100}
              height={100}
              className="w-full h-full object-cover rounded-md border"
            />
            <button
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              onClick={removeLogo}
            >
              <FaTimes size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralForm;
