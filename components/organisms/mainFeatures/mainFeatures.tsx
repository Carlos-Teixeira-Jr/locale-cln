/* eslint-disable no-unused-vars */
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import CheckIcon from '../../atoms/icons/checkIcon';
import propertyTypesData from '../../../data/propertyTypesData.json';
import { ISize, announcementSubtype, announcementType, propSubtype, propType } from '../../../common/interfaces/property/propertyData';
import { IEditPropertyMainFeatures } from '../../../common/interfaces/property/editPropertyData';
import AreaCalculatorModal from '../../molecules/areaModal/areaModal';

interface IMainFeatures {
  propertyId: string
  editarAdType: announcementType
  editarSubType: announcementSubtype
  editarPropertyType: propType; //Apt, house..
  editarPropertySubtype: propSubtype; //Flat, kitnet...
  editarSize: ISize
  editarNumBedroom: number;
  editarNumBathroom: number;
  editarNumGarage: number;
  editarNumDependencies: number;
  editarNumSuite: number;
  editarDescription: string;
  editarPropertyValue: string;
  editarCondominium: boolean;
  editarCondominiumValue: string;
  editarIptuValue: string;
  editarIptu: boolean;
  isEdit: boolean
  onMainFeaturesUpdate: (updatedFeatures: IEditPropertyMainFeatures) => void
  errors: any
  mainFeaturesInputRefs?: any
}

const MainFeatures: React.FC<IMainFeatures> = ({
  propertyId,
  editarAdType,
  editarSubType,
  editarPropertyType,
  editarPropertySubtype,
  editarSize,
  editarNumBedroom,
  editarNumBathroom,
  editarNumGarage,
  editarNumDependencies,
  editarNumSuite,
  editarDescription,
  editarPropertyValue,
  editarCondominium,
  editarCondominiumValue,
  editarIptuValue,
  editarIptu,
  isEdit,
  onMainFeaturesUpdate,
  errors,
  mainFeaturesInputRefs
}: IMainFeatures) => {
  console.log("🚀 ~ file: mainFeatures.tsx:62 ~ mainFeaturesInputRefs:", mainFeaturesInputRefs)

  const mainFeaturesErrorScroll = {
    ...mainFeaturesInputRefs
  }

  const [isBuy, setIsBuy] = useState(!isEdit ? true : (editarAdType === 'comprar' ? true : false));
  const [isRent, setIsRent] = useState(!isEdit ? false : (editarAdType === 'alugar' ? true : false));
  const [isCommercial, setIsCommercial] = useState(!isEdit ? true : (editarSubType === 'comercial' ? true : false));
  const [isResidential, setIsResidential] = useState(!isEdit ? false : (editarSubType === 'residencial' ? true : false));
  const [bathroomNumCount, setBathroomNumCount] = useState(isEdit ? editarNumBathroom : 0);
  const [bedroomNumCount, setBedroomNumCount] = useState(isEdit ? editarNumBedroom: 0);
  const [garageNumCount, setGarageNumCount] = useState(isEdit ? editarNumGarage : 0);
  const [dependenciesNumCount, setDependenciesNumCount] = useState(isEdit ? editarNumDependencies : 0);
  const [suitesNumCount, setSuitesNumCount] = useState(isEdit ? editarNumSuite : 0);

  const [propertyFeaturesData, setPropertyFeaturesData] = useState<IEditPropertyMainFeatures>({
    _id: isEdit ? propertyId : '',
    adType: isEdit ? editarAdType : (isBuy ? 'comprar' : 'alugar'),
    adSubtype: isEdit ? editarSubType : (isCommercial ? 'comercial' : 'residencial'),
    propertyType: isEdit ? editarPropertyType : 'casa',
    propertySubtype: isEdit ? editarPropertySubtype : 'padrao',
    description: isEdit ? editarDescription : '',
    size: {
      width: isEdit ? editarSize.width : 0,
      height: isEdit ? editarSize.height : 0,
      totalArea: isEdit ? editarSize.totalArea : 0,
      useableArea: isEdit ? editarSize.useableArea : 0
    },
    propertyValue: isEdit ? `${editarPropertyValue},00` : '',
    condominium: isEdit ? editarCondominium : false,
    iptu: isEdit ? editarIptu : false,
    condominiumValue: isEdit ? `${editarCondominiumValue},00` : '',
    iptuValue: isEdit ? editarIptuValue : '',
    metadata: [
      {
        type: 'bedroom',
        amount: bedroomNumCount
      },
      {
        type: 'bathroom',
        amount: bathroomNumCount
      },
      {
        type: 'garage',
        amount: garageNumCount
      },
      {
        type: 'dependencies',
        amount: dependenciesNumCount
      },
      {
        type: 'suites',
        amount: suitesNumCount
      },
    ],
  });

  // Atualiza o objeto que é enviado ao componente pai;
  useEffect(() => {
    onMainFeaturesUpdate(propertyFeaturesData)
  }, [propertyFeaturesData]);

  const [propertyFeaturesErrors, setPropertyFeaturesErrors] = useState({
    description: errors ? errors.description : '',
    totalArea: '',
    propertyValue: '',
    condominiumValue: '',
    iptuValue: '',
  });

  useEffect(() => {
    setPropertyFeaturesErrors(errors);
  }, [errors]);

  // Faz a rolagem automática para o input que apresentar erro;
  useEffect(() => {
    if (propertyFeaturesErrors.description !== '' && mainFeaturesInputRefs.description.current) {
      mainFeaturesErrorScroll.description.current.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
    if (propertyFeaturesErrors.totalArea !== '' && mainFeaturesInputRefs.totalArea.current) {
      mainFeaturesErrorScroll.totalArea.current.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
    if (propertyFeaturesErrors.propertyValue !== '' && mainFeaturesInputRefs.propertyValue.current) {
      mainFeaturesErrorScroll.propertyValue.current.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
    if (propertyFeaturesErrors.condominiumValue !== '' && mainFeaturesInputRefs.condominiumValue.current) {
      mainFeaturesErrorScroll.condominiumValue.current.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
    if (propertyFeaturesErrors.iptuValue !== '' && mainFeaturesInputRefs.iptuValue.current) {
      mainFeaturesErrorScroll.iptuValue.current.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  }, [propertyFeaturesErrors]);

  const handleBuy = () => {
    setIsBuy(true);
    setIsRent(false);
    setPropertyFeaturesData(prevData => ({
      ...prevData,
      adType: isBuy ? 'alugar' : 'comprar'
    }));
  };

  const handleRent = () => {
    setIsBuy(false);
    setIsRent(true);
    setPropertyFeaturesData(prevData => ({
      ...prevData,
      adType: isBuy ? 'alugar' : 'comprar'
    }));
  };

  const handleCommercial = () => {
    setIsCommercial(true);
    setIsResidential(false);
    setPropertyFeaturesData(prevData => ({
      ...prevData,
      adSubtype: isCommercial ? 'residencial' : 'comercial'
    }));
  };

  const handleResidential = () => {
    setIsCommercial(false);
    setIsResidential(true);
    setPropertyFeaturesData(prevData => ({
      ...prevData,
      adSubtype: isResidential ? 'comercial' : 'residencial'
    }));
  };

  const buyBtnClassName = `w-full md:w-44 rounded-full border-secondary text-quaternary font-bold text-xl ${
    isBuy ? 'bg-secondary text-quinary border' : 'bg-tertiary  text-quaternary'
  }`;

  const rentBtnClassName = `w-full md:w-44 rounded-full border-black text-quaternary font-bold text-xl ${
    isRent ? 'bg-secondary text-quinary' : 'bg-tertiary text-quaternary'
  }`;

  const commercialBtnClassName = `w-full md:w-44 rounded-full border-secondary text-quaternary font-bold text-xl ${
    isCommercial ? 'bg-secondary text-quinary' : 'bg-tertiary  text-quaternary'
  }`;

  const residentialBtnClassName = `w-full md:w-44 rounded-full border-black text-quaternary font-bold text-xl ${
    isResidential ? 'bg-secondary text-quinary' : 'bg-tertiary text-quaternary'
  }`;

  const handleAddClick = (key: string, counter: number, setCounter: Dispatch<SetStateAction<number>>) => {
    setCounter(counter + 1);
    const updatedMetadata = propertyFeaturesData.metadata.map(item => {
      if (item.type === key) {
        return { ...item, amount: counter + 1 };
      }
      return item;
    });
    setPropertyFeaturesData(prevState => ({
      ...prevState,
      metadata: updatedMetadata,
    }));
  };
  
  const handleMinusClick = (key: string, counter: number, setCounter: Dispatch<SetStateAction<number>>) => {
    if (counter > 0) {
      setCounter(counter - 1);
      const updatedMetadata = propertyFeaturesData.metadata.map(item => {
        if (item.type === key) {
          return { ...item, amount: counter - 1 };
        }
        return item;
      });
      setPropertyFeaturesData(prevState => ({
        ...prevState,
        metadata: updatedMetadata,
      }));
    }
  };

  const metadataButtons = [
    {
      key: 'bedroom',
      label: 'Quartos',
      clickAdd: () => handleAddClick('bedroom', bedroomNumCount, setBedroomNumCount),
      clickMinus: () => handleMinusClick('bedroom', bedroomNumCount, setBedroomNumCount),
      var: bedroomNumCount
    },
    {
      key: 'bathroom',
      label: 'Banheiros',
      clickAdd: () => handleAddClick('bathroom', bathroomNumCount, setBathroomNumCount),
      clickMinus: () => handleMinusClick('bathroom', bathroomNumCount, setBathroomNumCount),
      var: bathroomNumCount
    },
    {
      key: 'garage',
      label: 'Vagas de Garagem',
      clickAdd: () => handleAddClick('garage', garageNumCount, setGarageNumCount),
      clickMinus: () => handleMinusClick('garage', garageNumCount, setGarageNumCount),
      var: garageNumCount
    },
    {
      key: 'dependencies',
      label: 'Andares',
      clickAdd: () => handleAddClick('dependencies', dependenciesNumCount, setDependenciesNumCount),
      clickMinus: () => handleMinusClick('dependencies', dependenciesNumCount, setDependenciesNumCount),
      var: dependenciesNumCount
    },
    {
      key: 'suites',
      label: 'Suítes',
      clickAdd: () => handleAddClick('suites', suitesNumCount, setSuitesNumCount),
      clickMinus: () => handleMinusClick('suites', suitesNumCount, setSuitesNumCount),
      var: suitesNumCount
    },
  ];

  const maskedPrice = (value: string) => {
    let price = value;
    price = price.replace(/\D/g, '');
    price = price.replace(/(\d)(\d{2})$/, '$1,$2');
    price = price.replace(/(?=(\d{3})+(\D))\B/g, '.');
    return price;
  };

  // modal functions
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // Modal
  const handleCalcSizeArea = (value: number) => {
    setPropertyFeaturesData({
      ...propertyFeaturesData,
      size: { ...propertyFeaturesData.size, totalArea: value },
    });
  };

  return (
    <>
      <div className="max-w-[1215px] mx-auto">
        <div className="my-5 mx-4 lg:mx-0">
          <label className="md:text-3xl text-2xl text-quaternary font-semibold leading-9 md:mx-0">
            O que você deseja?
          </label>
          <div className="flex flex-row rounded-full border bg-tertiary border-quaternary h-8 mt-5 md:w-[355px] w-full">
            <button className={buyBtnClassName} onClick={handleBuy}>
              Comprar
            </button>
            <button className={rentBtnClassName} onClick={handleRent}>
              Alugar
            </button>
          </div>
        </div>
        <div className="my-5 mx-4 lg:mx-0">
          <label className="md:text-3xl text-2xl text-quaternary font-semibold leading-9 md:mx-0">
            O seu imóvel é?
          </label>
          <div className="flex flex-row rounded-full border bg-tertiary border-quaternary h-8 mt-5 md:w-[355px] w-full">
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

        <div className="mt-10 md:my-10 md:flex grid grid-flow-row md:justify-between mx-5 lg:mx-0">
          <select
            required
            className="border border-quaternary rounded-[10px] h-12 md:w-fit mb-10 md:mb-0 md:mr-5 text-quaternary text-xl font-bold px-5 drop-shadow-lg bg-tertiary"
            onChange={(e) => {
              const selectedValue = e.target.value;
              const selectedType = propertyTypesData.find(typeObj => typeObj.subTypes.includes(selectedValue));

              if (selectedType) {
                setPropertyFeaturesData({
                  ...propertyFeaturesData,
                  propertyType: selectedType.type,
                  propertySubtype: selectedValue
                });
              }
            }}
            value={propertyFeaturesData.propertySubtype}
          >
            {propertyTypesData.map((typeObj) => (
              <optgroup 
                key={typeObj.key} 
                label={typeObj.type}
              >
                {typeObj.subTypes.map((subType, index) => (
                  <option key={index} value={subType}>
                    {subType}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="my-5 ml-5 lg:ml-0">
          <h3 className="md:text-3xl text-2xl text-quaternary font-semibold leading-9 my-5">
            Dados do Imóvel:
          </h3>
          <div className="md:flex w-3/4">

            <div className="flex flex-col md:w-full md:mr-5 mt-5 md:mt-0" ref={mainFeaturesErrorScroll.totalArea}>
              <label className="text-2xl font-normal text-quaternary leading-7">
                Área Total
              </label>
              <input
                value={propertyFeaturesData.size.totalArea}
                placeholder='m²'
                className={'border border-quaternary rounded-[10px] h-12 w-full text-quaternary text-2xl font-bold p-2 md:font-bold drop-shadow-lg bg-tertiary mt-5'}
                style={propertyFeaturesErrors.totalArea ? { border: '1px solid red' } : {}}
                onChange={(e) => {
                  const numericValue = parseFloat(e.target.value); 
                  const totalArea = Number.isNaN(numericValue) ? 0 : numericValue;
              
                  setPropertyFeaturesData({
                    ...propertyFeaturesData,
                    size: {
                      ...propertyFeaturesData.size,
                      totalArea: totalArea
                    }
                  });
                  setPropertyFeaturesErrors({...propertyFeaturesErrors, totalArea: ''})
                }}
              />
              {propertyFeaturesErrors.totalArea && (
                <span className="text-red-500 mt-2 text-xs">{propertyFeaturesErrors.totalArea}</span>
              )}
              <span
                onClick={handleOpen}
                className="text-secondary text-base font-semibold cursor-pointer mt-2 hover:text-yellow-600 transition-colors duration-300 ease-in-out"
              >
                Calcular área para mim
              </span>
              <AreaCalculatorModal
                open={open}
                handleClose={handleClose}
                handleSize={handleCalcSizeArea}
              />
            </div>

            <div className="flex flex-col lg:w-full">
              <label className="text-2xl font-normal text-quaternary leading-7">
                Área Útil (opcional)
              </label>
              <input
                value={propertyFeaturesData.size.useableArea}
                placeholder='m²'
                className={'border border-quaternary rounded-[10px] h-12 w-full text-quaternary text-2xl font-bold p-2 md:font-bold drop-shadow-lg bg-tertiary mt-5'}
                onChange={(e) => {
                  const numericValue = parseFloat(e.target.value); 
                  const useableArea = Number.isNaN(numericValue) ? 0 : numericValue;
              
                  setPropertyFeaturesData({
                    ...propertyFeaturesData,
                    size: {
                      ...propertyFeaturesData.size,
                      useableArea: useableArea
                    }
                  });
                }}
              />
            </div>
          </div>
        </div>

        <div className="my-5 lg:flex grid grid-cols-2 md:grid-cols-3 w-full lg:justify-between">
          {metadataButtons.map((btn) => (
            <div className="ml-5 lg:ml-0 flex flex-col" key={btn.key}>
              <label className="text-lg font-normal text-center text-quaternary leading-7 lg:flex justify-center drop-shadow-lg">
                {btn.label}
              </label>
              <div className="flex my-5 justify-center">
                <div className="rounded-full md:w-8 md:h-8 w-8 h-8 border border-secondary drop-shadow-xl md:flex justify-center">
                  <p
                    className="text-secondary font-extrabold text-4xl md:leading-5 leading-[18px] cursor-pointer ml-1.5 md:ml-0"
                    onClick={btn.clickMinus}
                  >
                    -
                  </p>
                </div>
                <span className="text-2xl text-quaternary font-bold drop-shadow-lg mx-3 leading-7">
                  {btn.var}
                </span>
                <div className="rounded-full md:w-8 md:h-8 w-8 h-8 border border-secondary drop-shadow-xl md:flex justify-center">
                  <p
                    className="text-secondary font-extrabold text-4xl md:leading-5 leading-[20px] cursor-pointer"
                    onClick={btn.clickAdd}
                  >
                    +
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="my-5">
          <div className="flex flex-col mx-5 lg:mx-0" ref={mainFeaturesErrorScroll.description}>
            <label className="text-2xl font-normal text-quaternary leading-7 mb-5 drop-shadow-xl">
              Descrição do Imóvel:
            </label>
            <textarea
              className="bg-tertiary border border-quaternary rounded-[10px] h-40 drop-shadow-xl text-lg p-2 font-semibold text-quaternary"
              value={propertyFeaturesData.description}
              onChange={(e) => {
                setPropertyFeaturesData({...propertyFeaturesData, description: e.target.value});
                setPropertyFeaturesErrors({...propertyFeaturesErrors, description: ''})
              }}
              style={propertyFeaturesErrors.description ? { border: '1px solid red' } : {}}
              required
            />
            {propertyFeaturesErrors.description && (
              <span className="text-red-500 mt-2 text-xs">{propertyFeaturesErrors.description}</span>
            )}
          </div>
        </div>

        <div className="my-10">

          <h3 className="text-3xl text-quaternary font-semibold leading-9 my-5 ml-5 lg:ml-0">
            Valores do Imóvel:
          </h3>

          <div className="md:flex my-5 mx-4 md:ml-5 lg:ml-0">
            <div className="flex flex-col md:w-96 md:pr-6" ref={mainFeaturesErrorScroll.description}>
              <label className="text-2xl font-normal text-quaternary leading-7">
                {`${isBuy ? 'Valor do Imóvel' : 'Valor do Aluguel'}`}
              </label>
              <input
                value={maskedPrice(propertyFeaturesData.propertyValue)}
                placeholder='R$'
                className={'border border-quaternary rounded-[10px] h-12 w-full text-quaternary text-2xl font-bold p-2 md:font-bold drop-shadow-lg bg-tertiary mt-5'}
                style={propertyFeaturesErrors.propertyValue ? { border: '1px solid red' } : {}}
                onChange={(e) => {
                  setPropertyFeaturesData({...propertyFeaturesData,propertyValue: maskedPrice(e.target.value)});
                  setPropertyFeaturesErrors({...propertyFeaturesErrors, propertyValue: ''})
                } }
              />
              {propertyFeaturesErrors.propertyValue && (
                <span className="text-red-500 mt-2 text-xs">{propertyFeaturesErrors.propertyValue}</span>
              )}
            </div>
          </div>

          <div className="my-10">
            <div className="flex" ref={mainFeaturesErrorScroll.condominiumValue}>
              <label className="text-2xl font-normal text-quaternary leading-7 ml-5 lg:ml-0">
                Condomínio{' '}
              </label>
              <p className="text-2xl font-light md:ml-2 text-quaternary leading-7">
                {' '}
                (valor mensal)
              </p>
            </div>
            <div className="lg:flex w-96 lg:w-full mx-auto md::ml-5 lg:ml-0">
              <div className='flex flex-col'>
                <input
                  value={propertyFeaturesData.condominium ? maskedPrice(propertyFeaturesData.condominiumValue) : ''}
                  placeholder='R$'
                  className={`border border-quaternary rounded-[10px] h-12 lg:ml-0 md:ml-0 text-quaternary md:text-[26px] text-2xl font-bold md:px-2 drop-shadow-lg mt-5 p-2 ${
                      !propertyFeaturesData.condominium ? 'bg-[#CACACA]' : 'bg-tertiary'
                    }`
                  }
                  style={propertyFeaturesErrors.condominiumValue ? { border: '1px solid red' } : {}}
                  onChange={(e) => {
                    setPropertyFeaturesData({...propertyFeaturesData, condominiumValue: maskedPrice(e.target.value)});
                    setPropertyFeaturesErrors({...propertyFeaturesErrors, condominiumValue: ''});
                  }}
                />
                {propertyFeaturesErrors.condominiumValue && (
                  <span className="text-red-500 mt-2 text-xs">{propertyFeaturesErrors.condominiumValue}</span>
                )}
              </div>

              <div
                className={`lg:ml-5 w-12 h-12 border bg-tertiary rounded-[10px] mt-5 drop-shadow-lg cursor-pointer ${
                  !propertyFeaturesData.condominium ? 'border-secondary' : 'border-quaternary'
                }`}
                onClick={() => setPropertyFeaturesData({...propertyFeaturesData, condominium: !propertyFeaturesData.condominium})}
              >
                {!propertyFeaturesData.condominium && (
                  <CheckIcon
                    fill="#F5BF5D"
                    width="42"
                    className={`pl-1 ${!propertyFeaturesData.condominium ? ' border-secondary' : ''}`}
                  />
                )}
                
              </div>
              <p className="text-xl md:text-2xl font-light text-quaternary leading-7 mt-2 md:mt-9  lg:ml-5">
                {propertyFeaturesData.condominium ? 'Remover' : 'Aplicar'}
              </p>
            </div>
            <div className="flex mt-10 ml-5 lg:ml-0" ref={mainFeaturesErrorScroll.iptuValue}>
              <label className="text-2xl font-normal text-quaternary leading-7">
                IPTU
              </label>
              <p className="text-2xl font-light ml-2 text-quaternary leading-7">
                {' '}
                (valor anual)
              </p>
            </div>
            <div className="lg:flex w-96 mx-auto md:ml-5 lg:ml-0">
              <div className='flex flex-col'>
                <input
                  value={propertyFeaturesData.iptu ? maskedPrice(propertyFeaturesData.iptuValue) : ''}
                  placeholder='R$'
                  className={`border border-quaternary rounded-[10px] h-12 lg:ml-0 md:ml-0 text-quaternary md:text-[26px] text-2xl font-bold md:px-2 drop-shadow-lg mt-5 p-2 ${
                    !propertyFeaturesData.iptu ? 'bg-[#CACACA]' : 'bg-tertiary'
                  }`}
                  style={propertyFeaturesErrors.iptuValue ? { border: '1px solid red' } : {}}
                  onChange={(e) => {
                    setPropertyFeaturesData({...propertyFeaturesData, iptuValue: maskedPrice(e.target.value)});
                    setPropertyFeaturesErrors({...propertyFeaturesErrors, iptuValue: ''});
                  }}
                />

                {propertyFeaturesData.iptu && propertyFeaturesErrors.iptuValue && (
                  <span className="text-red-500 mt-2 text-xs">{propertyFeaturesErrors.iptuValue}</span>
                )}
              </div>
              
              <div
                className={`lg:ml-5 w-12 h-12 border bg-tertiary rounded-[10px] mt-5 drop-shadow-lg cursor-pointer shrink-0 ${
                  !propertyFeaturesData.iptu ? 'border-secondary' : 'border-quaternary'
                }`}
                onClick={() => {setPropertyFeaturesData({...propertyFeaturesData, iptu: !propertyFeaturesData.iptu})}}
              >
                {!propertyFeaturesData.iptu && (
                  <CheckIcon
                    fill="#F5BF5D"
                    width="42"
                    className={`pl-1 ${propertyFeaturesData.iptu ? ' border-secondary' : ''}`}
                  />
                )}
              </div>
              <p
                className="text-xl md:text-2xl font-light text-quaternary leading-7 mt-2 md:mt-9 lg:ml-5"
              >
                {!propertyFeaturesData.iptu ? 'Aplicar' : 'Remover'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainFeatures;
