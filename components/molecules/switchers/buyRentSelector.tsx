import { useState } from 'react';

type BuyOrRent = {
  isBuy: boolean;
  isRent: boolean;
}

type BuyRentSelectorType = {
  buyOrRent: BuyOrRent,
  onBuyRentChange: (updatedBuyOrRent: BuyOrRent) => void;
}

const BuyRentSelector = ({
  buyOrRent,
  onBuyRentChange
}: BuyRentSelectorType) => {

  console.log("🚀 ~ buyOrRent:", buyOrRent)
  const [buyOrRentOptions, setBuyOrRentOptions] = useState(buyOrRent);

  const handleBuy = () => {
    const updatedBuyOrRent = {
      isBuy: true,
      isRent: false
    };
    setBuyOrRentOptions(updatedBuyOrRent);
    onBuyRentChange(updatedBuyOrRent);
  };

  const handleRent = () => {
    const updatedBuyOrRent = {
      isBuy: false,
      isRent: true
    };
    setBuyOrRentOptions(updatedBuyOrRent);
    onBuyRentChange(updatedBuyOrRent);
  };

  const getButtonClassName = (selected: keyof BuyOrRent) =>
    `w-full h-[34px] md:h-fit lg:h-[33px] rounded-full border-black text-quaternary font-bold lg:text-md transition-all ${buyOrRentOptions[selected]
      ? 'bg-secondary text-quinary border border-secondary'
      : 'bg-tertiary text-quaternary'
    }`;

  return (
    <div className="w-full mx-auto flex flex-col gap-2 md:gap-0">
      <label className="text-base">O que procura?</label>
      <div className="flex flex-row rounded-full border border-quaternary lg:h-9 w-full mx-auto md:mt-3 lg:mt-2 justify-center">
        <div className="w-full">
          <button className={getButtonClassName('isBuy')} onClick={handleBuy}>
            Comprar
          </button>
        </div>
        <div className="w-full">
          <button className={getButtonClassName('isRent')} onClick={handleRent}>
            Alugar
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuyRentSelector;
