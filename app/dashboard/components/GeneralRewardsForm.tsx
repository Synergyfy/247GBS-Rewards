import React from 'react';
import ToolTip from './ToolTip';

interface GeneralFormProps {
  title: string;
  pointsCost: string | undefined;
  rewardValue: string | undefined;
  currency: string | undefined;
  quantityAvailable: number | undefined;
  setTitle: (val: string) => void;
  setPointsCost: (val: string) => void;
  setRewardValue: (val: string) => void;
  setCurrency: (val: string) => void;
  setQuantityAvailable: (val: number) => void;
}

const GeneralForm: React.FC<GeneralFormProps> = ({
  title,
  pointsCost,
  rewardValue,
  currency,
  quantityAvailable,
  setCurrency,
  setTitle,
  setPointsCost,
  setRewardValue,
  setQuantityAvailable,
}) => {
  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Enter the title, points cost and other information concerning your
        rewards here.
      </p>
      <div>
         <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
          Title (required)
          <ToolTip content="This represents the title or name of the reward" />
        </label>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
        />
      </div>
      <div>
         <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
          Points Cost (required)
          <ToolTip content="This represents the amount of points it will cost a customer to redeem this reward" />
        </label>
        <input
          type="number"
          placeholder="Enter points cost"
          value={pointsCost ?? ''}
          onChange={e => setPointsCost(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
        />
      </div>

      <div>
         <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
          Quantity Available (required)
          <ToolTip content="This represents the total quantity of this reward available for redemption" />
        </label>
        <input
          type="number"
          placeholder="Enter quantity available"
          value={quantityAvailable ?? ''}
          onChange={e => setQuantityAvailable(Number(e.target.value))}
          className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-full sm:w-1/3">
           <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
            Currency
            <ToolTip content="This is the currency this reward will be operated in" />
          </label>
          <select
            name="currency"
            className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
          >
            <option value="">Currency</option>
            <option value="$">USD ($)</option>
            <option value="â‚¬">EUR (â‚¬)</option>
            <option value="Â£">GBP (Â£)</option>
            <option value="Â¥">JPY (Â¥)</option>
            <option value="A$">AUD (A$)</option>
            <option value="C$">CAD (C$)</option>
            <option value="CHF">CHF (CHF)</option>
            <option value="Â¥">CNY (Â¥)</option>
            <option value="kr">SEK (kr)</option>
            <option value="NZ$">NZD (NZ$)</option>
            <option value="â‚¹">INR (â‚¹)</option>
            <option value="R$">BRL (R$)</option>
            <option value="â‚½">RUB (â‚½)</option>
            <option value="R">ZAR (R)</option>
            <option value="Mex$">MXN (Mex$)</option>
            <option value="S$">SGD (S$)</option>
            <option value="HK$">HKD (HK$)</option>
            <option value="kr">NOK (kr)</option>
            <option value="â‚©">KRW (â‚©)</option>
            <option value="â‚º">TRY (â‚º)</option>
            <option value="Ø¯.Ø¥">AED (Ø¯.Ø¥)</option>
            <option value="ï·¼">SAR (ï·¼)</option>
            <option value="zÅ‚">PLN (zÅ‚)</option>
            <option value="â‚´">UAH (â‚´)</option>
            <option value="â‚¸">KZT (â‚¸)</option>
            <option value="â‚«">VND (â‚«)</option>
            <option value="â‚±">PHP (â‚±)</option>
            <option value="â‚¦">NGN (â‚¦)</option>
            <option value="â‚¡">CRC (â‚¡)</option>
            <option value="â‚²">PYG (â‚²)</option>
            <option value="â‚ª">ILS (â‚ª)</option>
            <option value="â‚®">MNT (â‚®)</option>
            <option value="áŸ›">KHR (áŸ›)</option>
            <option value="ï·¼">QAR (ï·¼)</option>
            <option value="â‚­">LAK (â‚­)</option>
            <option value="â‚¨">MUR (â‚¨)</option>
            <option value="â‚©">KPW (â‚©)</option>
            <option value="â‚ª">PSE (â‚ª)</option>
            <option value="â‚®">TJS (â‚®)</option>
            <option value="â‚º">TRY (â‚º)</option>
            <option value="â‚¼">AZN (â‚¼)</option>
            <option value="â‚¾">GEL (â‚¾)</option>
            <option value="â‚´">PRB (â‚´)</option>
            <option value="â‚½">ABH (â‚½)</option>
            <option value="â‚½">SOS (â‚½)</option>
            <option value="â‚½">AMX (â‚½)</option>
          </select>
        </div>
        <div className="w-full sm:w-2/3">
           <label className="mb-1 flex items-center gap-2 font-medium text-gray-700 text-sm">
            Reward Value (required)
            <ToolTip content="This is the value customer will get once they have enough point to redeem the reward" />
          </label>
          <input
            type="text"
            placeholder="Enter reward value"
            value={rewardValue}
            onChange={e => setRewardValue(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralForm;
