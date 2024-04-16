import { useEffect, useState } from "react";
import AddIcon from "../../atoms/icons/addIcon";
import MinusIcon from "../../atoms/icons/minusIcon";
import LocaleLogo from "../../atoms/logos/locale";

interface ICreditsShopBoard {
  adCredits: number,
  highlightCredits: number,
  ownerId: string,
  handleCreditsChange: (credits: Credits) => void
}

export type Credits = {
  [key: string]: number,
  adCredits: number,
  highlightCredits: number,
}

const CreditsShopBoard = ({
  adCredits,
  highlightCredits = 0,
  handleCreditsChange
}: ICreditsShopBoard) => {

  const [credits, setCredits] = useState<Credits>({
    adCredits: adCredits,
    highlightCredits: highlightCredits === undefined ? 0 : highlightCredits
  });

  useEffect(() => {
    handleCreditsChange(credits);
  }, [credits]);

  const buttons = [
    {
      key: 'adCredits',
      label: 'Créditos de anúncio',
      value: credits.adCredits
    },
    {
      key: 'highlightCredits',
      label: 'Créditos de destaque',
      value: credits.highlightCredits
    },
  ];

  const handleClickMinus = (key: string) => {
    if (key === 'adCredits' && credits.adCredits > 0 && credits.adCredits > adCredits) {
      setCredits({ ...credits, adCredits: credits.adCredits - 1 });
    }
    if (key === 'highlightCredits' && credits.highlightCredits > 0 && credits.highlightCredits > highlightCredits) {
      setCredits({ ...credits, highlightCredits: credits.highlightCredits - 1 });
    }
  }

  const handleClickPlus = (key: string) => {
    console.log("🚀 ~ handleClickPlus ~ key:", key)
    if (key === 'adCredits' && credits.adCredits >= 0) {
      setCredits({ ...credits, adCredits: credits.adCredits + 1 });
    }
    if (key === 'highlightCredits' && credits.highlightCredits >= 0) {
      setCredits({ ...credits, highlightCredits: credits.highlightCredits + 1 });
    }
  }



  return (
    <section className="flex flex-col">
      <div className="w-full border border-quaternary bg-tertiary font-semibold text-quaternary text-2xl flex flex-col gap-2 py-5 px-20 shadow-lg">
        <h1 className="font-bold flex justify-center">
          Seu plano
          <span className="flex">
            <LocaleLogo />
            <AddIcon className="pb-2" width="35" fill={'#F5BF5D'} />
          </span>
        </h1>
        <div className="text-xl">
          <h2>
            {`Créditos de anúncio disponíveis: `}
            <span className="font-bold text-2xl">
              {`${adCredits}`}
            </span>
          </h2>
          <h2>
            {`Créditos para destacar anúncios: `}
            <span className="font-bold text-2xl">
              {credits.highlightCredits === undefined ? 0 : highlightCredits}
            </span>
          </h2>
        </div>

        <hr className="bg-quaternary h-[2px] mt-5" />

        <div className="flex w-full justify-between">
          <div>
            <h3>Itens</h3>
            <div className="text-sm mt-2">
              <p>
                {`x ${credits.adCredits - adCredits} - Créditos de anúncio`}
              </p>
              <p>
                {`x ${credits.highlightCredits - highlightCredits} - Créditos de destaque`}
              </p>
            </div>
          </div>
          <div>
            <h3>Valor</h3>
            <div className="text-sm mt-2">
              <p>
                {`R$ ${(credits.adCredits - adCredits) * 5}`}
              </p>
              <p>
                {`R$ ${(credits.highlightCredits - highlightCredits) * 10}`}
              </p>
            </div>
          </div>
        </div>

        <hr className="bg-quaternary h-[2px] mt-5" />

        <div className="flex w-full justify-between">
          <div>
            <h3>Total</h3>
          </div>
          <div>
            <p>{`R$ ${((credits.adCredits - adCredits) * 5) + ((credits.highlightCredits - highlightCredits) * 10)}`}</p>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-between my-10">
        {buttons.map((btn) => (
          <div key={btn.key}>
            <label className="text-lg font-bold text-center text-quaternary leading-7 lg:flex justify-center drop-shadow-lg">
              {btn.label}
            </label>
            <div className="flex my-5 justify-center">
              <div className="rounded-full md:w-10 md:h-10 w-7 h-7 border border-secondary hover:bg-gray-100 drop-shadow-xl md:flex justify-center hover:border-yellow-600 transition-colors ease-in-out duration-300">
                <p
                  className="text-secondary font-extrabold text-2xl flex align-middle justify-center md:leading-5 leading-[18px] cursor-pointer hover:text-yellow-600 focus:outline-none"
                  onClick={(e) => handleClickMinus(btn.key)}
                >
                  <MinusIcon width="35" className="pb-1 hover:text-yellow-600 transition-colors ease-in-out duration-300" />
                </p>
              </div>
              <span className="text-2xl text-quaternary font-bold drop-shadow-lg mx-3 leading-7 my-auto">
                {btn.value}
              </span>
              <div className="rounded-full md:w-10 md:h-10 w-7 h-7 border border-secondary drop-shadow-xl md:flex justify-center hover:bg-gray-100 hover:text-yellow-600 hover:border-yellow-600  transition-colors ease-in-out duration-300">
                <p
                  className="text-secondary font-extrabold text-2xl flex align-middle justify-center leading-[23px] cursor-pointer"
                  onClick={() => handleClickPlus(btn.key)}
                >
                  <AddIcon width="35" className="pb-1 hover:text-yellow-600 transition-colors ease-in-out duration-300" />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section >
  )
}

export default CreditsShopBoard