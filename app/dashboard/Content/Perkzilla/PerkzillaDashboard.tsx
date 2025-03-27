import React from 'react'
import FormFour from './FormFour';

const PerkzillaDashboard = ({ onBack }: { onBack: () => void }) => {
  const [showFormFour, setShowFFormFour] = React.useState(false);
  return (
    <div className="grid grid-col-3 gap-8">
          {showFormFour ? (
                <FormFour onBack={() => setShowFFormFour(false)} />
              ) : (
                <>
      <div className="flex flex-row p-4 justify-between">
        <div className="">Live Editor</div>
        <div className="flex flex-row gap-4">
          <button onClick={onBack} className="border border-[#5864FF] text-[#5864FF] rounded-lg py-2 px-4">
            Go Back
          </button>
          <button onClick={() => setShowFFormFour(true)} className="border border-[#5864FF] bg-[#5864FF] text-[#fff] rounded-lg px-4 py-2">
            Continue
          </button>
        </div>
      </div>
    
          </>
        )}
    </div>
  );
}

export default PerkzillaDashboard