import React from 'react';
import ToolTip from './ToolTip';

interface GeneralFormProps {
  title: string;
  pointsCost: string | undefined;
  rewardValue: string | undefined;
  currency: string | undefined;
  setTitle: (val: string) => void;
  setPointsCost: (val: string) => void;
  setRewardValue: (val: string) => void;
  setCurrency: (val: string) => void;
}

const GeneralForm: React.FC<GeneralFormProps> = ({
  title,
  pointsCost,
  rewardValue,
  currency,
  setCurrency,
  setTitle,
  setPointsCost,
  setRewardValue,
}) => {
  return (
    <div className="space-y-6">
      <p>
        Enter the title, points code and other informations concering your
        rewards here.
      </p>
      <div>
        <label className=" mb-1 flex items-center gap-2">
          Title (required)
          <ToolTip content="This represents the title or name of the reward" />
        </label>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
        />
      </div>
      <div>
        <label className=" mb-1 flex items-center gap-2">
          Points Cost (required)
          <ToolTip content="This represents the amount of points it will cost a customer to redeem this reward" />
        </label>
        <input
          type="number"
          placeholder="Enter points cost"
          value={pointsCost ?? ''}
          onChange={e => setPointsCost(e.target.value)}
          className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-[30%]">
          <label className="mb-1 flex items-center gap-2">
            currency
            <ToolTip content="This is the currency this reward will be operated in" />
          </label>
          <select
            name="currency"
            className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
          >
            <option value="">Currency</option>
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
            <option value="¥">JPY (¥)</option>
            <option value="A$">AUD (A$)</option>
            <option value="C$">CAD (C$)</option>
            <option value="CHF">CHF (CHF)</option>
            <option value="¥">CNY (¥)</option>
            <option value="kr">SEK (kr)</option>
            <option value="NZ$">NZD (NZ$)</option>
            <option value="₹">INR (₹)</option>
            <option value="R$">BRL (R$)</option>
            <option value="₽">RUB (₽)</option>
            <option value="R">ZAR (R)</option>
            <option value="Mex$">MXN (Mex$)</option>
            <option value="S$">SGD (S$)</option>
            <option value="HK$">HKD (HK$)</option>
            <option value="kr">NOK (kr)</option>
            <option value="₩">KRW (₩)</option>
            <option value="₺">TRY (₺)</option>
            <option value="د.إ">AED (د.إ)</option>
            <option value="﷼">SAR (﷼)</option>
            <option value="zł">PLN (zł)</option>
            <option value="₴">UAH (₴)</option>
            <option value="₸">KZT (₸)</option>
            <option value="₫">VND (₫)</option>
            <option value="₱">PHP (₱)</option>
            <option value="₦">NGN (₦)</option>
            <option value="₡">CRC (₡)</option>
            <option value="₲">PYG (₲)</option>
            <option value="₪">ILS (₪)</option>
            <option value="₮">MNT (₮)</option>
            <option value="៛">KHR (៛)</option>
            <option value="﷼">QAR (﷼)</option>
            <option value="₭">LAK (₭)</option>
            <option value="₨">MUR (₨)</option>
            <option value="₩">KPW (₩)</option>
            <option value="₪">PSE (₪)</option>
            <option value="₮">TJS (₮)</option>
            <option value="₺">TRY (₺)</option>
            <option value="₼">AZN (₼)</option>
            <option value="₾">GEL (₾)</option>
            <option value="₴">PRB (₴)</option>
            <option value="₽">ABH (₽)</option>
            <option value="₽">SOS (₽)</option>
            <option value="₽">AMX (₽)</option>
          </select>
        </div>
        <div className="w-[calc(70%)]">
          <label className=" mb-1 flex items-center gap-2">
            Reward Value (required)
            <ToolTip content="This is the value customer will get once they have enough point to redeem the reward" />
          </label>
          <label className="block mb-1"></label>
          <input
            type="text"
            placeholder="Enter reward value"
            value={rewardValue}
            onChange={e => setRewardValue(e.target.value)}
            className="block w-full p-2 border-b-2 border-[#838383] focus:border-[#2D3DFF] outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralForm;
