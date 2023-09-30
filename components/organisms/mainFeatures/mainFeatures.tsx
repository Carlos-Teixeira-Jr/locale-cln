/* eslint-disable no-unused-vars */
import { useState } from 'react';
import CheckIcon from '../../atoms/icons/checkIcon';
import MaskedInput from '../../atoms/masks/maskedInput';
import { ISize, propSubtype } from '../../../common/interfaces/propertyData';

interface IFeatures {
  editarPropertyType: string; //Apt, house..
  editarPropertySubtype: propSubtype; //Flat, kitnet...
  editarUseableArea: ISize;
  editarTotalArea: ISize;
  editarNumBedroom: number;
  editarNumBathroom: number;
  editarNumParkingSpaces: number;
  editarNumFloors: number;
  editarNumSuite: number;
  editarDescription: string;
  editarPropertyValue: string;
  editarCondominium: boolean;
  editarCondominiumValue: string;
  editarIptuValue: string;
  editarIptu: boolean;
}

const MainFeatures: React.FC<IFeatures> = ({
  editarPropertyType,
  editarPropertySubtype,
  editarUseableArea,
  editarTotalArea,
  editarNumBedroom,
  editarNumBathroom,
  editarNumParkingSpaces,
  editarNumFloors,
  editarNumSuite,
  editarDescription,
  editarPropertyValue,
  editarCondominium,
  editarCondominiumValue,
  editarIptuValue,
  editarIptu,
}: IFeatures) => {
  const [isBuy, setIsBuy] = useState(true);
  const [isRent, setIsRent] = useState(false);
  const [isCommercial, setIsCommercial] = useState(true);
  const [isResidential, setIsResidential] = useState(false);
  const [firstSelectValue, setFirstSelectValue] = useState(
    editarPropertyType || 'apartamento'
  );
  const [secondSelectValue, setSecondSelectValue] = useState<propSubtype | string>(
    editarPropertySubtype || 'padrao'
  );
  const [useableAreaValue, setUseableAreaValue] = useState<ISize | number>(
    editarUseableArea.area || 0
  );
  const [totalAreaValue, setTotalAreaValue] = useState<ISize | number>(editarTotalArea ? editarTotalArea.height * editarTotalArea.width : 0);
  const [description, setDescription] = useState(editarDescription || '');
  const [iptuCheckbox, setIptuCheckbox] = useState(editarIptu || false);
  const [condominiumCheckbox, setCondominiumCheckbox] = useState(
    editarCondominium || false
  );
  const [iptuInputIsDisabled, setIptuInputIsDisabled] = useState(true);
  const [condominiumInputIsDisabled, setCondominiumInputIsDisabled] = useState(
    editarCondominium || false
  );
  const [bathroomNumCount, setBathroomNumCount] = useState(
    editarNumBathroom || 0
  );
  const [bedroomNumCount, setBedroomNumCount] = useState(editarNumBedroom || 0);
  const [parkingSpacesNumCount, setParkingSpacesNumCount] = useState(
    editarNumParkingSpaces || 0
  );
  const [floorsNumCount, setFloorsNumCount] = useState(editarNumFloors || 0);
  const [suitesNumCount, setSuitesNumCount] = useState(editarNumSuite || 0);
  const [propertyValue, setPropertyValue] = useState(editarPropertyValue || '');
  const [condominiumFeeValue, setCondominiumValue] = useState(
    editarCondominiumValue || ''
  );
  const [iptuValue, setIptuValue] = useState(editarIptuValue || '');
  const [iptuCheckboxLabel, setIptuCheckboxLabel] = useState('Aplicar');
  const [condominiumCheckboxLabel, setCondominiumCheckboxLabel] =
    useState('Aplicar');
  const [errors, setErrors] = useState({
    cep: '',
    uf: '',
    number: '',
    city: '',
    street: '',
    district: '',
    useableArea: '',
    bedroomNum: '',
    bathroomNum: '',
    paringSpacesNum: '',
    floorsNum: '',
    suitesNum: '',
    description: '',
    value: '',
  });

  const handleBuy = () => {
    setIsBuy(true);
    setIsRent(false);
  };

  const handleRent = () => {
    setIsBuy(false);
    setIsRent(true);
  };

  const handleCommercial = () => {
    setIsCommercial(true);
    setIsResidential(false);
  };

  const handleResidential = () => {
    setIsCommercial(false);
    setIsResidential(true);
  };

  const handleFirstSelect: React.MouseEventHandler<HTMLSelectElement> = (
    event
  ) => {
    const selectedOption = event.currentTarget.value;
    setFirstSelectValue(selectedOption);
  };

  const handleSecondSelect: React.MouseEventHandler<HTMLSelectElement> = (
    event
  ) => {
    const selectedOption = event.currentTarget.value;
    setSecondSelectValue(selectedOption);
  };

  const handleUseableArea = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setUseableAreaValue(value);
  };

  const handleTotalArea = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setTotalAreaValue(value);
  };

  const handleDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setDescription(value);
  };

  const handleIptuCheckbox = () => {
    setIptuCheckboxLabel(iptuCheckbox ? 'Aplicar' : 'Remover');
    setIptuCheckbox(!iptuCheckbox);
    setIptuInputIsDisabled(!iptuInputIsDisabled);
  };

  const handleCondominiumCheckbox = () => {
    setCondominiumCheckboxLabel(condominiumCheckbox ? 'Aplicar' : 'Remover');
    setCondominiumCheckbox(!condominiumCheckbox);
    setCondominiumInputIsDisabled(!condominiumInputIsDisabled);
  };

  const handlePropertyValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setPropertyValue(event.target.value);
  };

  const handleCondominiumValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    let value = event.target.value;
    setCondominiumValue(value);
  };

  const handleIptuValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    let value = event.target.value;
    setIptuValue(value);
  };

  const iptuDivClassName = `lg:ml-5 w-[44px] h-[44px] border bg-tertiary rounded-[10px] mt-8 drop-shadow-lg cursor-pointer ${
    iptuCheckbox ? 'border-secondary' : 'border-quaternary'
  }`;

  const condominiumDivClassName = `lg:ml-5 w-[44px] h-[44px] border bg-tertiary rounded-[10px] mt-8 drop-shadow-lg cursor-pointer ${
    condominiumCheckbox ? 'border-secondary' : 'border-quaternary'
  }`;

  const iptuInputClassName = `border border-quaternary rounded-[10px] h-12  md:ml-0 md:w-[390px] text-quaternary md:text-[26px] text-2xl font-bold pr-5 md:px-5 drop-shadow-lg mt-5 text-right ${
    iptuInputIsDisabled ? 'bg-[#CACACA]' : 'bg-tertiary'
  }`;

  const condominiumInputClassName = `border border-quaternary rounded-[10px] h-12 lg:ml-0 md:ml-0 md:w-[390px] text-quaternary md:text-[26px] text-2xl font-bold pr-5 md:px-5 drop-shadow-lg mt-5 text-right ${
    condominiumInputIsDisabled ? 'bg-[#CACACA]' : 'bg-tertiary'
  }`;

  const buyBtnClassName = `w-44 rounded-full border-secondary text-quaternary font-bold text-xl ${
    isBuy ? 'bg-secondary text-quinary border' : 'bg-tertiary  text-quaternary'
  }`;

  const rentBtnClassName = `w-44 rounded-full border-black text-quaternary font-bold text-xl ${
    isRent ? 'bg-secondary text-quinary' : 'bg-tertiary text-quaternary'
  }`;

  const commercialBtnClassName = `w-44 rounded-full border-secondary text-quaternary font-bold text-xl ${
    isCommercial ? 'bg-secondary text-quinary' : 'bg-tertiary  text-quaternary'
  }`;

  const residentialBtnClassName = `w-44 rounded-full border-black text-quaternary font-bold text-xl ${
    isResidential ? 'bg-secondary text-quinary' : 'bg-tertiary text-quaternary'
  }`;

  const iptuCheckboxClassname = `pb-2 ${
    iptuCheckbox ? 'pb-2 border-secondary' : 'pb-2 hidden'
  }`;

  const condominiumCheckboxClassname = `pb-2 ${
    condominiumCheckbox ? 'pb-2 border-secondary' : 'pb-2 hidden'
  }`;

  const metadataButtons = [
    {
      key: 'bedroom',
      label: 'Quartos',
      clickAdd: () => setBedroomNumCount(bedroomNumCount + 1),
      clickMinus: () => bedroomNumCount > 0 && setBedroomNumCount(bedroomNumCount - 1),
      var: bedroomNumCount
    },
    {
      key: 'bathroom',
      label: 'Banheiros',
      clickAdd: () => setBathroomNumCount(bathroomNumCount + 1),
      clickMinus: () => bathroomNumCount > 0 && setBathroomNumCount(bathroomNumCount - 1),
      var: bathroomNumCount
    },
    {
      key: 'parkingSpaces',
      label: 'Vagas de Garagem',
      clickAdd: () => setParkingSpacesNumCount(parkingSpacesNumCount + 1),
      clickMinus: () => parkingSpacesNumCount > 0 && setParkingSpacesNumCount(parkingSpacesNumCount - 1),
      var: parkingSpacesNumCount
    },
    {
      key: 'floors',
      label: 'Andares',
      clickAdd: () => setFloorsNumCount(floorsNumCount + 1),
      clickMinus: () => floorsNumCount > 0 && setFloorsNumCount(floorsNumCount - 1),
      var: floorsNumCount
    },
    {
      key: 'suites',
      label: 'Suítes',
      clickAdd: () => setSuitesNumCount(suitesNumCount + 1),
      clickMinus: () => suitesNumCount > 0 && setSuitesNumCount(suitesNumCount - 1),
      var: suitesNumCount
    },
  ]

  return (
    <>
      <div className="max-w-[1215px] mx-auto">
        <div className="my-10 mx-4 lg:mx-0">
          <label className="md:text-[32px] text-2xl text-quaternary font-semibold leading-9 md:mx-0">
            O que você deseja?
          </label>
          <div className="flex flex-row rounded-full border bg-tertiary border-quaternary h-10 mt-5 w-[355px]">
            <button className={buyBtnClassName} onClick={handleBuy}>
              Comprar
            </button>
            <button className={rentBtnClassName} onClick={handleRent}>
              Alugar
            </button>
          </div>
        </div>
        <div className="my-10 mx-4 lg:mx-0">
          <label className="md:text-[32px] text-2xl text-quaternary font-semibold leading-9 md:mx-0">
            O seu imóvel é?
          </label>
          <div className="flex flex-row rounded-full border bg-tertiary border-quaternary h-10 mt-5 w-[355px]">
            <button
              className={commercialBtnClassName}
              onClick={handleCommercial}
            >
              Comercial
            </button>
            <button
              className={residentialBtnClassName}
              onClick={handleResidential}
            >
              Residencial
            </button>
          </div>
        </div>
        <div className="my-10 md:flex grid grid-flow-row md:justify-between mx-5 lg:mx-0">
          <select
            required
            className="border border-quaternary rounded-[10px] h-12 md:w-full mb-10 md:mb-0 md:mr-5 text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-tertiary"
            onClick={() => handleFirstSelect}
          >
            <option value={'apartamento'}>Apartamento</option>
            <option value={'casa'}>Casa</option>
            <option value={'casaDeCondominio'}>Casa de condomínio</option>
            <option value={'casaDeBairro'}>Casa de bairro</option>
            <option value={'cobertura'}>Cobertura</option>
            <option value={'fazendaSitioChacara'}>Fazenda/Sítio/Chácara</option>
            <option value={'flat'}>Flat</option>
            <option value={'loteTerreno'}>Lote/Terreno</option>
            <option value={'sobrado'}>Sobrado</option>
          </select>
          <select
            required
            className="border border-quaternary rounded-[10px] h-12 md:w-full md:ml-5 text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-tertiary"
            onClick={() => handleSecondSelect}
          >
            <option value={'padrao'}>Padrão</option>
            <option value={'cobertura'}>Cobertura</option>
            <option value={'flat'}>Flat</option>
            <option value={'kitnetConjugado'}>Kitnet/Conjugado</option>
            <option value={'loft'}>Loft</option>
            <option value={'estudio'}>Estúdio</option>
          </select>
        </div>

        {/* FORM DO VIACEP */}

        <div className="my-10 ml-5 lg:ml-0">
          <h3 className="md:text-[32px] text-2xl text-quaternary font-semibold leading-9 my-5">
            Dados do Imóvel:
          </h3>
          <div className="md:flex">
            <div className="flex flex-col lg:w-1/5 md:mr-20">
              <label className="text-[24px] font-normal text-quaternary leading-7">
                Área Útil
              </label>
              <MaskedInput
                mask={'area'}
                onChange={handleUseableArea}
                setUseableAreaValue={setUseableAreaValue}
                required
                className={
                  'border border-quaternary rounded-[10px] w-[242px] h-12 text-quaternary text-[26px] font-bold px-5 drop-shadow-lg bg-tertiary mt-5'
                }
                style={errors.value ? { border: '1px solid red' } : {}}
              />
              {errors.useableArea && (
                <span className="text-red-500 mt-2">{errors.useableArea}</span>
              )}
            </div>
            <div className="flex flex-col md:w-1/5 md:ml-5 mt-5 md:mt-0">
              <label className="text-[24px] font-normal text-quaternary leading-7">
                Área Total
              </label>
              <MaskedInput
                mask={'area'}
                onChange={handleTotalArea}
                required
                className={
                  'border border-quaternary rounded-[10px] w-[242px] h-12 text-quaternary text-[26px] font-bold px-5 drop-shadow-lg bg-tertiary mt-5'
                }
              />
            </div>
          </div>
        </div>

        <div className="my-10 lg:flex grid grid-cols-2 md:grid-cols-3 w-full lg:justify-between">
          {metadataButtons.map((btn) => (
            <div className="ml-5 lg:ml-0" key={btn.key}>
              <label className="text-lg font-normal text-quaternary leading-7 lg:flex justify-center drop-shadow-lg">
                {btn.label}
              </label>
              <div className="flex my-5 justify-center">
                <div className="rounded-full md:w-10 md:h-10 w-10 h-10 border border-secondary drop-shadow-xl md:flex justify-center">
                  <p
                    className="text-secondary font-extrabold text-5xl md:leading-7 leading-[18px] cursor-pointer ml-1.5 md:ml-0"
                    onClick={btn.clickMinus}
                  >
                    -
                  </p>
                </div>
                <span className="text-2xl text-quaternary font-bold drop-shadow-lg mx-3 leading-10">
                  {btn.var}
                </span>
                <div className="rounded-full md:w-10 md:h-10 w-10 h-10 border border-secondary drop-shadow-xl md:flex justify-center">
                  <p
                    className="text-secondary font-extrabold text-5xl md:leading-7 leading-[20px] cursor-pointer"
                    onClick={btn.clickAdd}
                  >
                    +
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="my-10">
          <div className="flex flex-col mx-5 lg:mx-0">
            <label className="text-[24px] font-normal text-quaternary leading-7 mb-5 drop-shadow-xl">
              Descrição do Imóvel:
            </label>
            <textarea
              className="bg-tertiary border border-quaternary rounded-[10px] h-40 drop-shadow-xl text-xl p-2 font-semibold text-quaternary"
              onChange={handleDescription}
              style={errors.value ? { border: '1px solid red' } : {}}
              required
            />
            {errors.description && (
              <span className="text-red-500 mt-2">{errors.description}</span>
            )}
          </div>
        </div>
        <div className="my-10">
          <h3 className="text-[32px] text-quaternary font-semibold leading-9 my-5 ml-5 lg:ml-0">
            Valores do Imóvel:
          </h3>
          <div className="md:flex my-5 ml-5 lg:ml-0">
            <div className="flex flex-col md:w-1/4 md:mr-5">
              <label className="text-[24px] font-normal text-quaternary leading-7">
                {`${isBuy ? 'Valor do Imóvel' : 'Valor do Aluguel'}`}
              </label>
              <MaskedInput
                mask={'currency'}
                value={propertyValue}
                setPropertyValue={setPropertyValue}
                onChange={handlePropertyValueChange}
                prefix="R$"
                className={'border border-quaternary rounded-[10px] h-12 text-quaternary md:text-[26px] text-2xl font-bold pr-5 md:font-bold md:px-5 drop-shadow-lg bg-tertiary mt-5 text-right'}
                style={errors.value ? { border: '1px solid red' } : {}}
                required
              />
              {errors.value && (
                <span className="text-red-500 mt-2">{errors.value}</span>
              )}
            </div>
          </div>
          <div className="my-10">
            <div className="flex">
              <label className="text-[24px] font-normal text-quaternary leading-7 ml-5 lg:ml-0">
                Condomínio{' '}
              </label>
              <p className="text-[24px] font-light md:ml-2 text-quaternary leading-7">
                {' '}
                (valor mensal)
              </p>
            </div>
            <div className="lg:flex w-[370px] lg:w-full ml-5 lg:ml-0">
              <MaskedInput
                className={condominiumInputClassName}
                mask={'currency'}
                prefix={condominiumCheckbox ? 'R$' : ''}
                value={condominiumFeeValue}
                onChange={handleCondominiumValueChange}
                disabled={condominiumCheckbox ? false : true}
                required
              />
              <div
                className={condominiumDivClassName}
                onClick={() => handleCondominiumCheckbox}
              >
                <CheckIcon
                  fill="#F5BF5D"
                  width="42"
                  className={condominiumCheckboxClassname}
                />
              </div>
              <p className="text-[24px] font-light text-quaternary leading-7 md:mt-9  lg:ml-5">
                {condominiumCheckboxLabel}
              </p>
            </div>
            <div className="flex mt-10 ml-5 lg:ml-0">
              <label className="text-[24px] font-normal text-quaternary leading-7">
                IPTU
              </label>
              <p className="text-[24px] font-light ml-2 text-quaternary leading-7">
                {' '}
                (valor anual)
              </p>
            </div>
            <div className="lg:flex ml-5 lg:ml-0">
              <MaskedInput
                className={iptuInputClassName}
                mask={'currency'}
                prefix={iptuCheckbox ? 'R$' : ''}
                value={iptuValue}
                onChange={handleIptuValueChange}
                disabled={iptuCheckbox ? false : true}
                required
              />
              <div
                id="iptu-checkbox"
                className={iptuDivClassName}
                onClick={() => handleIptuCheckbox}
              >
                <CheckIcon
                  fill="#F5BF5D"
                  width="42"
                  className={iptuCheckboxClassname}
                />
              </div>
              <p
                id="iptu-checkbox-label"
                className="text-[24px] font-light text-quaternary leading-7 md:mt-9 lg:ml-5"
              >
                {iptuCheckboxLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainFeatures;
