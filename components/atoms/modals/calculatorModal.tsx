import React, { ChangeEvent, useState } from 'react';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import { useIsMobile } from '../../../hooks/useIsMobile';
import MoneyMask from '../masks/currencyMask';
import MaskedInput from '../masks/maskedInput';

Modal.setAppElement('#__next');

export interface ICalculatorModal {
  isOpen: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
  props: string;
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
  const [entryValue, setEntryValue] = useState('');
  const [parcelNumber, setParcelNumber] = useState('240');
  const [feePercentage, setFeePercentage] = useState(9);
  const [financedValue, setFinancedValue] = useState(0);
  const [showFirstParcel, setShowFirstParcel] = useState<number | string>(0);
  const [showLastParcel, setShowLastParcel] = useState<number | string>(0);
  const isMobile = useIsMobile();

  const handleEntryValue = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const entryValue = inputValue.replace(/[^\d]/g, '');
    setEntryValue(entryValue);
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

  const maskedPrice = (value: string) => {
    let price = value;
    price = price.replace(/\D/g, ''); // Remove tudo que não é dígito
    price = price.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos a cada 3 dígitos
    return price;
  };

  const handleEntryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const formattedValue = maskedPrice(rawValue);
    setEntryValue(formattedValue);
  };

  const handleCalculateBtnClick = () => {
    const financedValue = priceValue - Number(entryValue);
    const amortization = financedValue / Number(parcelNumber);
    const firstParcelOperation =
      amortization +
      (feePercentage / 12 / 100) * (financedValue - (1 - 1) * amortization);
    const lastParcelOperation =
      amortization +
      (feePercentage / 12 / 100) *
      (financedValue - (Number(parcelNumber) - 1) * amortization);

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
          top: '55%',
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
          width: isMobile ? '90%' : 'auto',
          margin: '0 auto 0 auto',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          zIndex: 999999999
        },
      }}
    >
      <div className="bg-tertiary z-50">
        <h1 className="font-extrabold md:text-2xl text-quaternary text-center align-middle">
          Simulação de Financiamento <br />
          (SAC)
        </h1>
        <div className='my-1'>
          <div className='flex gap-2 flex-col md:flex-row'>
            <div className='flex flex-col'>
              <p className="font-bold text-xl leading-7 text-quaternary mb-2">
                Valor do imóvel
              </p>
              <MaskedInput
                mask={'currency'}
                prefix="R$"
                value={`${priceValue}`}
                onChange={handlePriceChange}
                className={
                  'border-quaternary bg-tertiary drop-shadow-lg rounded-[10px] text-quaternary text-2xl leading-7 w-full md:w-[315px] h-[38px] border-[1px] mb-1 md:mb-5 font-bold text-right px-2'
                }
                spanClassName="prefix-span absolute left-0 w-7 pt-1 pl-2 z-10 text-quaternary text-2xl leading-7 font-bold"
              />
            </div>

            <div className='flex flex-col'>
              <p className="font-bold text-xl leading-7 text-quaternary mb-2">
                Valor de entrada
              </p>

              <input
                value={entryValue}
                placeholder="R$"
                maxLength={30}
                className={
                  'border-quaternary bg-tertiary drop-shadow-lg rounded-[10px] text-quaternary text-2xl leading-7 md:w-[315px] h-[38px] border-[1px] mb-1 md:mb-5 font-bold text-right px-2'
                }
                onChange={handleEntryChange}
              />
            </div>
          </div>
          <div className='flex flex-col md:flex-row gap-3'>
            <div className='flex flex-col'>
              <p className="font-bold text-xl leading-7 text-quaternary mb-2">
                Parcelar (meses)
              </p>
              <select
                className="border-quaternary bg-tertiary drop-shadow-lg rounded-[10px] text-quaternary text-2xl leading-7 w-full md:w-[315px] h-[38px] border-[1px] font-bold text-right px-2"
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
            <div className="ml-auto flex flex-col">

              <p className="font-bold text-xl leading-7 text-quaternary mb-2">
                Juros anual
              </p>
              <input
                className="border-quaternary bg-tertiary drop-shadow-lg rounded-[10px] text-quaternary text-2xl leading-7 w-full md:w-[315px] h-[38px] border-[1px] font-bold text-right px-2"
                value={`${feePercentage}%`}
                onChange={handleFeePercentage}
              />
            </div>
          </div>

        </div>
        <div className="grid grid-flow-row">
          <button
            className="w-full h-13 rounded-[10px] bg-primary p-2.5 ml-auto text-tertiary font-extrabold text-xl my-3"
            onClick={handleCalculateBtnClick}
          >
            Calcular
          </button>
        </div>

        <div>
          <div className="bg-quaternary rounded-tl-[30px] md:w-full h-fit">
            <p className="text-tertiary text-center text-xl h-[28px] font-bold">
              Resultados
            </p>
          </div>
          <div className="grid grid-cols-3 border-quaternary border-l-2">
            <div className="border-r-2 border-quaternary">
              <div className=" border-quaternary font-bold text-quaternary text-lg md:text-xl text-center">
                Valor financiado
              </div>
              <div className="border-quaternary border-y-2">
                <p className="h-fit font-bold text-quaternary text-xl text-center">
                  <MoneyMask
                    value={financedValue}
                    className={
                      'w-full md:w-[150px] bg-transparent flex mx-auto text-center'
                    }
                  />
                </p>
              </div>
            </div>
            <div className="border-r-2 border-quaternary">
              <div className="font-bold text-quaternary text-lg md:text-xl text-center">
                Primeira parcela
              </div>
              <div className="border-quaternary border-y-2">
                <p className="h-fit font-bold text-quaternary text-lg md:text-xl text-center">{`R$ ${showFirstParcel}`}</p>
              </div>
            </div>
            <div>
              <div className="border-r-2 border-quaternary text-quaternary text-lg md:text-xl font-bold text-center">
                Última parcela
              </div>
              <div className="border-quaternary border-y-2 border-r-2 rounded-br-[30px]">
                <p className="h-fit font-bold text-quaternary text-lg md:text-xl text-center ">{`R$ ${showLastParcel}`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CalculatorModal;
