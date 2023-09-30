import React, { ChangeEvent, useState } from 'react';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import MoneyMask from '../masks/currencyMask';
import MaskedInput from '../masks/maskedInput';

Modal.setAppElement('#__next');

export interface ICalculatorModal {
  isOpen: boolean;
  setModalIsOpen: any;
  props: any;
}

const CalculatorModal: React.FC<ICalculatorModal> = ({
  isOpen,
  setModalIsOpen,
  props,
}) => {
  const portalClassName = `modal-${uuidv4()}`;

  const propertyValueSubstring = props.substring(3);
  const propertyValueToNumber = parseFloat(propertyValueSubstring);
  const [priceValue, setPriceValue] = useState(propertyValueToNumber);
  const formattedEntryValue = priceValue * 0.2;
  const [entryValue, setEntryValue] = useState(formattedEntryValue);
  const [parcelNumber, setParcelNumber] = useState('240');
  const [feePercentage, setFeePercentage] = useState(9);
  const [financedValue, setFinancedValue] = useState(0);
  const [showFirstParcel, setShowFirstParcel] = useState<number | string>(0);
  const [showLastParcel, setShowLastParcel] = useState<number | string>(0);

  const handleEntryValue = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    const entryValue = inputValue.replace(/[^\d]/g, '');
    const entryValueToNumber = parseFloat(entryValue);
    const formattedEntryValue = entryValueToNumber * 0.2;
    setEntryValue(formattedEntryValue);
  };

  const handleParcelNumber = (event: ChangeEvent<HTMLSelectElement>) => {
    const inputValue = event.target.value;
    setParcelNumber(inputValue);
  };

  const handleFeePercentage = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    const inputSubstring = inputValue.substring(0, inputValue.length - 1);
    const feePercentage =
      inputSubstring === '' ? 0 : parseFloat(inputSubstring);
    if (!isNaN(feePercentage)) {
      setFeePercentage(feePercentage);
    }
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    const inputSubstring = inputValue.substring(3);
    const priceValue = parseFloat(inputSubstring);
    if (!isNaN(priceValue)) {
      setPriceValue(priceValue);
    }
  };

  const handleCalculateBtnClick = () => {
    const parcelNumberToNumber = parseFloat(parcelNumber);
    const financedValue = priceValue - entryValue;
    const amortization = financedValue / parcelNumberToNumber;
    const firstParcelOperation =
      amortization +
      (feePercentage / 12 / 100) * (financedValue - (1 - 1) * amortization);
    const lastParcelOperation =
      amortization +
      (feePercentage / 12 / 100) *
        (financedValue - (parcelNumberToNumber - 1) * amortization);

    setFinancedValue(financedValue);
    setShowFirstParcel(firstParcelOperation.toFixed(2));
    setShowLastParcel(lastParcelOperation.toFixed(2));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="Calculator modal"
      portalClassName={portalClassName}
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          border: '1px solid #ccc',
          background: '#F7F7F6',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '30px',
          outline: 'none',
          padding: '20px',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          height: 'auto',
          width: 'auto',
          margin: '0 auto 0 auto',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <div className="bg-tertiary">
        <h1 className="font-extrabold md:text-[40px] text-quaternary leading-[49px] text-center align-middle mb-5">
          Simulação de Financiamento <br />
          (SAC)
        </h1>
        <div>
          <div className="md:grid md:grid-cols-2 my-10 md:my-0">
            <div className="mt-10 mb-10">
              <p className="font-bold text-2xl leading-7 text-quaternary mb-2">
                Valor do imóvel
              </p>
              <MaskedInput
                mask={'currency'}
                prefix="R$"
                value={`${priceValue}`}
                onChange={handlePriceChange}
                className={
                  'border-quaternary bg-tertiary drop-shadow-lg rounded-[10px] text-quaternary text-2xl leading-7 md:w-[315px] h-[38px] border-[1px] mb-5 font-bold text-right px-2'
                }
                spanClassName="prefix-span absolute left-0 w-7 pt-1 pl-2 z-10 text-quaternary text-2xl leading-7 font-bold"
              />
              <p className="font-bold text-2xl leading-7 text-quaternary mb-2">
                Parcelar (meses)
              </p>
              <select
                className="border-quaternary bg-tertiary drop-shadow-lg rounded-[10px] text-quaternary text-2xl leading-7 w-[315px] h-[38px] border-[1px] font-bold text-right px-2"
                onChange={handleParcelNumber}
              >
                <option className="font-bold" value="240">
                  240
                </option>
                <option className="font-bold" value="360">
                  360
                </option>
              </select>
            </div>
            <div className="ml-auto mt-10">
              <p className="font-bold text-2xl leading-7 text-quaternary mb-2">
                Valor de entrada
              </p>
              <MaskedInput
                mask={'currency'}
                prefix="R$"
                value={entryValue}
                onChange={handleEntryValue}
                className={
                  'border-quaternary bg-tertiary drop-shadow-lg rounded-[10px] text-quaternary text-2xl leading-7 md:w-[315px] h-[38px] border-[1px] mb-5 font-bold text-right px-2'
                }
                spanClassName="prefix-span absolute left-0 w-7 pt-1 pl-2 z-10 text-quaternary text-2xl leading-7 font-bold"
              />
              <p className="font-bold text-2xl leading-7 text-quaternary mb-2">
                Juros anual
              </p>
              <input
                className="border-quaternary bg-tertiary drop-shadow-lg rounded-[10px] text-quaternary text-2xl leading-7 md:w-[315px] h-[38px] border-[1px] font-bold text-right px-2"
                value={`${feePercentage}%`}
                onChange={handleFeePercentage}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-flow-row">
          <button
            className="w-[315px] h-[67px] rounded-[10px] bg-primary p-2.5  ml-auto text-tertiary font-extrabold text-xl leading-6 mb-10"
            onClick={handleCalculateBtnClick}
          >
            Calcular
          </button>
        </div>

        <div>
          <div className="bg-quaternary rounded-tl-[30px] md:w-[669px] h-[48px] py-2">
            <p className="text-tertiary text-center text-xl h-[28px] font-bold">
              Resultados
            </p>
          </div>
          <div className="grid grid-cols-3 border-quaternary border-l-2">
            <div className="border-r-2 border-quaternary">
              <div className=" border-quaternary font-bold text-quaternary text-2xl leading-7 text-center my-2">
                Valor financiado
              </div>
              <div className="border-quaternary border-y-2">
                <p className="h-[44px] font-bold text-quaternary text-2xl leading-7 text-center pt-2">
                  <MoneyMask
                    value={financedValue}
                    className={
                      'w-[150px] bg-transparent flex mx-auto text-center'
                    }
                  />
                </p>
              </div>
            </div>
            <div className="border-r-2 border-quaternary">
              <div className="font-bold text-quaternary text-2xl leading-7 text-center my-2">
                Primeira parcela
              </div>
              <div className="border-quaternary border-y-2">
                <p className="h-[44px] font-bold text-quaternary text-2xl leading-7 text-center pt-2">{`R$ ${showFirstParcel}`}</p>
              </div>
            </div>
            <div>
              <div className="border-r-2 border-quaternary text-quaternary text-2xl leading-7 font-bold text-center py-2">
                Última parcela
              </div>
              <div className="border-quaternary border-y-2 border-r-2 rounded-br-[30px]">
                <p className="h-[44px] font-bold text-quaternary text-2xl leading-7 text-center pt-2">{`R$ ${showLastParcel}`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CalculatorModal;
