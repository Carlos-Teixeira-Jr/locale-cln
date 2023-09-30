import router from 'next/router';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { IData, PricesType } from '../common/interfaces/propertyData';
import ArrowDownIconcon from '../components/atoms/icons/arrowDownIcon';
import CheckIcon from '../components/atoms/icons/checkIcon';
import LinearStepper from '../components/atoms/stepper/stepper';
import AreaCalculatorModal from '../components/molecules/areaModal/areaModal';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';

interface ViaCepData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
  cep: string;
}

interface IErrors {
  zipCode: string;
  city: string;
  state: string;
  streetNumber: string;
  streetName: string;
  neighborhood: string;
  area: string;
  description: string;
  value: string;
}

const Register = () => {
  const [errors, setErrors] = useState<IErrors>({
    zipCode: '',
    city: '',
    state: '',
    streetNumber: '',
    streetName: '',
    neighborhood: '',
    area: '',
    description: '',
    value: '',
  });

  const [registration, setRegistration] = useState<IData>({
    _id: '',
    plan: '',
    highlighted: false,
    adType: 'comprar',
    adSubtype: 'residencial',
    propertyType: 'casa',
    propertySubtype: 'padrao',
    announcementCode: '1',
    address: {
      zipCode: '',
      city: '',
      state: '',
      streetName: '',
      streetNumber: '',
      complement: '',
      neighborhood: '',
    },
    description: '',
    metadata: [
      { type: 'bathroom', amount: 0 },
      { type: 'garage', amount: 0 },
      { type: 'bedroom', amount: 0 },
      { type: 'dependencies', amount: 0 },
      { type: 'suites', amount: 0 },
    ],
    geolocation: {
      _id: '',
      type: '',
      coordinates: [0, 0],
    },
    images: [''],
    isActive: {
      type: false,
    },
    owner: '',
    ownerInfo: {
      name: '',
      phones: [''],
      creci: '',
      email: '',
    },
    size: {
      width: 0,
      height: 0,
      area: 0,
    },
    tags: [''],
    condominiumTags: [''],
    prices: [{ type: PricesType.venda, value: 0 }],
    youtubeLink: '',
    acceptFunding: false,
  });

  // Basic value change functions
  const handleAdType = (event: any) => {
    setRegistration({
      ...registration,
      adType: event,
    });
  };

  const handleAdSubtype = (event: any) => {
    setRegistration({
      ...registration,
      adSubtype: event,
    });
  };

  const handlePropertyType = (event: any) => {
    setRegistration({
      ...registration,
      propertyType: event,
    });
  };

  const handlePropertySubType = (event: any) => {
    setRegistration({
      ...registration,
      propertySubtype: event,
    });
  };

  const handleDescription = (event: any) => {
    const { value } = event.target;
    setRegistration({
      ...registration,
      description: value,
    });
  };

  // Address functions
  const handleAddressZipCode = async (event: any) => {
    const { value } = event.target;

    try {
      if (value?.length === 9) {
        const location: ViaCepData = await fetch(
          `https://viacep.com.br/ws/${value.replace('-', '')}/json/`
        ).then((res) => res.json());
        if (location) {
          setRegistration({
            ...registration,
            address: {
              zipCode: location.cep,
              city: location.localidade,
              state: location.uf,
              streetName: location.logradouro,
              streetNumber: location.numero,
              complement: registration.address.complement,
              neighborhood: location.bairro,
            },
          });
        } else {
          {
            <span className="text-red-500 mt-2">CEP inválido.</span>;
          }
          {
            errors.zipCode && { border: '1px solid red' };
          }
        }
      } else {
        setRegistration({
          ...registration,
          address: { ...registration.address, zipCode: value },
        });
      }
    } catch {
      <span className="text-red-500 mt-2">
        Houve um problema ao encontrar o seu CEP.
      </span>;
    }
  };

  const maskedZipCode = () => {
    let zipCode = String(registration.address.zipCode);
    zipCode = zipCode.replace(/\D/g, '');
    zipCode = zipCode.replace(/^(\d{5})(\d)/, '$1-$2');
    return zipCode;
  };

  const handleAddressCity = (event: any) => {
    const { value } = event.target;
    const formattedCity = value.replace(/-/g, '');
    setRegistration({
      ...registration,
      address: { ...registration.address, city: formattedCity },
    });
  };

  const handleAddressState = (event: any) => {
    const { value } = event.target;
    setRegistration({
      ...registration,
      address: { ...registration.address, state: value },
    });
  };

  const maskedUF = () => {
    let uf = String(registration.address.state);
    uf = uf.replace(/\d/g, '');
    uf = uf.toUpperCase();
    uf = uf.substring(0, 2);
    return uf;
  };

  const handleAddressStreetName = (event: any) => {
    const { value } = event.target;
    const formattedStreet = value.replace(/-/g, '');
    setRegistration({
      ...registration,
      address: { ...registration.address, streetName: formattedStreet },
    });
  };

  const handleAddressStreetNumber = (event: any) => {
    const { value } = event.target;
    const formattedNumber = value.replace(/-/g, '');
    setRegistration({
      ...registration,
      address: { ...registration.address, streetNumber: formattedNumber },
    });
  };

  const handleAddressComplement = (event: any) => {
    const { value } = event.target;
    const formattedComplement = value.replace(/-/g, '');
    setRegistration({
      ...registration,
      address: { ...registration.address, complement: formattedComplement },
    });
  };

  const handleAddressNeighborhood = (event: any) => {
    const { value } = event.target;
    const formattedDistrict = value.replace(/-/g, '');
    setRegistration({
      ...registration,
      address: { ...registration.address, neighborhood: formattedDistrict },
    });
  };

  //  Metadata functions
  const handleMetadata = (element: any, type: '+' | '-') => {
    const metadata = registration.metadata.find(
      (meta) => meta.type === element
    );

    if (metadata) {
      metadata.amount = type === '+' ? ++metadata.amount : --metadata.amount;

      setRegistration({
        ...registration,
      });
    }
  };

  // Sizes functions

  const handleSizeArea = (event: any) => {
    const { value } = event.target;
    setRegistration({
      ...registration,
      size: { ...registration.size, area: value },
    });
  };

  const maskedArea = () => {
    let value = String(registration.size.area);
    value = value.replace(/\D/g, '');
    value += 'm²';
    return value;
  };

  // Modal
  const handleCalcSizeArea = (value: any) => {
    console.log(value);
    setRegistration({
      ...registration,
      size: { ...registration.size, area: value },
    });
  };

  // Prices functions
  const handlePricesValue = (type: PricesType, value: any) => {
    let registrationPrice = registration.prices.find(
      (price) => price.type === type
    );

    if (registrationPrice) {
      registrationPrice.value = value;
    } else {
      registration.prices.push({ type: type, value: value });
    }

    setRegistration({
      ...registration,
    });
  };

  const maskedPrice = (type: PricesType) => {
    let registrationPrice = registration.prices.find(
      (price) => price.type === type
    );
    let price = String(registrationPrice?.value);
    price = price.replace(/\D/g, '');
    price = price.replace(/(\d)(\d{2})$/, '$1,$2');
    price = price.replace(/(?=(\d{3})+(\D))\B/g, '.');
    return price;
  };

  // CSS classes
  const getSelectedClass = (selected: boolean): string => {
    return `w-44 h-[34px] rounded-full border-black text-quaternary font-bold text-xl ${
      selected ? 'bg-secondary text-quinary' : 'bg-tertiary text-quaternary'
    }`;
  };

  const getSelectedInputClass = (selected: boolean): string => {
    return `border border-quaternary rounded-[10px] h-12 md:w-[390px] text-quaternary text-2xl font-bold pr-5 md:px-5 drop-shadow-lg mt-8 text-right ${
      selected ? 'bg-[#CACACA]' : 'bg-tertiary'
    }`;
  };

  const getSelectedCheckboxClass = (selected: boolean): string => {
    return `pb-2 ${selected ? 'pb-2 border-secondary' : 'pb-2 hidden'}`;
  };

  const getSelectedCheckboxDivClass = (selected: boolean): string => {
    return `lg:ml-5 w-12 h-12 border bg-tertiary rounded-lg mt-8 drop-shadow-lg cursor-pointer ${
      selected ? 'border-secondary' : 'border-quaternary'
    }`;
  };

  const getSelectedFunding = (selected: boolean): string => {
    return `items-center w-12 h-12 border bg-tertiary rounded-lg mt-8 drop-shadow-lg cursor-pointer ${
      selected ? 'border-secondary' : 'border-quaternary'
    }`;
  };

  const refFirstSelect = useRef();
  const refSecondSelect = useRef();
  const [openFirstSelect, setOpenFirstSelect] = useState(false);
  const [openSecondSelect, setOpenSecondSelect] = useState(false);

  const [iptuCheckbox, setIptuCheckbox] = useState(false);
  const [funding, setFunding] = useState(false);
  const [condominiumCheckbox, setCondominiumCheckbox] = useState(false);
  const [iptuInputIsDisabled, setIptuInputIsDisabled] = useState(true);
  const [condominiumInputIsDisabled, setCondominiumInputIsDisabled] =
    useState(true);
  const [iptuCheckboxLabel, setIptuCheckboxLabel] = useState('Aplicar');
  const [condominiumCheckboxLabel, setCondominiumCheckboxLabel] =
    useState('Aplicar');

  const [viaCepData] = useState<ViaCepData>({
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    numero: '',
    cep: '',
  });

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);

    function handleClick(event: any) {
      if (refFirstSelect && refFirstSelect.current) {
        const myRef: any = refFirstSelect.current;
        if (!myRef.contains(event.target)) {
          setOpenFirstSelect(false);
        }
      }
    }
  });

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);

    function handleClick(event: any) {
      if (refSecondSelect && refSecondSelect.current) {
        const myRef: any = refSecondSelect.current;
        if (!myRef.contains(event.target)) {
          setOpenSecondSelect(false);
        }
      }
    }
  });

  const handleIptuCheckbox = () => {
    setIptuCheckboxLabel(iptuCheckbox ? 'Aplicar' : 'Remover');
    setIptuCheckbox(!iptuCheckbox);
    setIptuInputIsDisabled(!iptuInputIsDisabled);
  };

  const handleFundingCheckbox = () => {
    setFunding(!funding);
    setRegistration({
      ...registration,
      acceptFunding: !funding,
    });
  };

  const handleCondominiumCheckbox = () => {
    setCondominiumCheckboxLabel(condominiumCheckbox ? 'Aplicar' : 'Remover');
    setCondominiumCheckbox(!condominiumCheckbox);
    setCondominiumInputIsDisabled(!condominiumInputIsDisabled);
  };

  const handleSubmitForm = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const formData = {
      buyOrRent: registration.adType ? 'comprar' : 'alugar',
      commercialOrResidential: registration.adSubtype
        ? 'comercial'
        : 'residencial',
      zipCode: registration.address.zipCode,
      city: viaCepData.localidade
        ? viaCepData.localidade
        : registration.address.city,
      state: viaCepData.uf ? viaCepData.uf : registration.address.state,
      streetNumber: registration.address.streetNumber,
      streetName: viaCepData.logradouro
        ? viaCepData.logradouro
        : registration.address.streetName,
      neighborhood: viaCepData.bairro
        ? viaCepData.bairro
        : registration.address.neighborhood,
      area: registration.size.area,
      description: registration.description,
      value: registration.prices,
      funding: registration.acceptFunding,
    };

    let error: IErrors = errors;

    if (!formData.zipCode) {
      error.zipCode = 'O campo cep é obrigatório.';
    }
    if (!formData.state) {
      error.state = 'O campo UF é obrigatório';
    }
    if (!formData.city) {
      error.city = 'O campo cidade é obrigatório.';
    }
    if (!formData.streetName) {
      error.streetName = 'O campo logradouro é obrigatório.';
    }
    if (!formData.neighborhood) {
      error.neighborhood = 'O campo bairro é obrigatório.';
    }
    if (!formData.streetNumber) {
      error.streetNumber = 'O campo número é obrigatório';
    }
    if (!formData.area) {
      error.area = 'O campo área total é obrigatório.';
    }
    if (!formData.description) {
      error.description = 'O campo descrição é obrigatório.';
    }
    if (!formData.value) {
      error.value = 'O campo valor do imóvel é obrigatório.';
    }

    setErrors(error);

    if (
      !error.zipCode &&
      !error.state &&
      !error.city &&
      !error.streetName &&
      !error.neighborhood &&
      !error.streetNumber &&
      !error.area &&
      !error.description &&
      !error.value
    ) {
      console.log(formData);
      router.push('/registerStep2');
    }
  };

  // modal functions
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <div className="fixed z-10 top-0 w-full">
        <Header />
      </div>
      <AreaCalculatorModal
        open={open}
        handleClose={handleClose}
        handleSize={handleCalcSizeArea}
      />
      <div className="lg:mx-[100px]">
        <div className="md:mt-[150px] mt-[120px] md:mb-14 lg:mb-2 w-full mx-auto lg:mx-[100px] max-w-[1536px] xl:mx-auto">
          <LinearStepper isSubmited={false} sharedActiveStep={0} />
        </div>
        <div className="max-w-[1536px] mx-auto md:mx-auto lg:mx-[100px] xl:mx-auto flex flex-col justify-center">
          <div className="md:mb-10 mb-5">
            <h1 className="md:text-5xl text-xl text-center md:text-start font-bold text-quaternary leading-[56px] md:ml-5 lg:ml-0">
              Cadastre seu imóvel
            </h1>
          </div>
          <div className="mb-4 mx-4 lg:mx-0">
            <label className="text-lg text-quaternary font-semibold leading-9">
              O que você deseja?
            </label>
            <div className="flex flex-row rounded-full border bg-tertiary border-quaternary h-9.5 mt-2 w-[355px]">
              <div>
                <button
                  className={getSelectedClass(
                    registration.adType === 'comprar'
                  )}
                  onClick={() => handleAdType('comprar')}
                >
                  Comprar
                </button>
              </div>
              <div>
                <button
                  className={getSelectedClass(registration.adType === 'alugar')}
                  onClick={() => handleAdType('alugar')}
                >
                  Alugar
                </button>
              </div>
            </div>
          </div>
          <div className="my-4 mx-4 lg:mx-0">
            <label className="text-lg text-quaternary font-semibold leading-9">
              O seu imóvel é?
            </label>
            <div className="flex flex-row rounded-full bg-tertiary border border-quaternary h-9.5 mt-2 w-[355px]">
              <div>
                <button
                  className={getSelectedClass(
                    registration.adSubtype === 'comercial'
                  )}
                  onClick={() => handleAdSubtype('comercial')}
                >
                  Comercial
                </button>
              </div>
              <div>
                <button
                  className={getSelectedClass(
                    registration.adSubtype === 'residencial'
                  )}
                  onClick={() => handleAdSubtype('residencial')}
                >
                  Residencial
                </button>
              </div>
            </div>
          </div>
          <div className="my-10 md:flex grid grid-flow-row md:justify-between mx-5 lg:mx-0 gap-10">
            <div className="w-full">
              <div
                className="border border-quaternary rounded-[10px] h-12 md:w-full md:mb-0 md:mr-5 text-quaternary text-lg font-bold px-5 drop-shadow-lg bg-tertiary flex justify-between"
                ref={refFirstSelect as any}
                onClick={() => setOpenFirstSelect(!openFirstSelect)}
              >
                <p className="my-auto">{registration.propertyType}</p>
                <ArrowDownIconcon width="15" height="15" className="my-auto" />
              </div>
              <div
                className={`absolute z-50 w-[372px] lg:w-[551px] md:w-2/5 xl:w-[551px] mx-auto rounded-xl bg-tertiary overflow-hidden cursor-pointer shadow-md ${
                  openFirstSelect ? 'md:flex' : 'hidden'
                }`}
              >
                {/** dropdown propertyType */}
                <div className="flex flex-col w-full text-center font-normal text-base text-quaternary leading-5">
                  <span
                    className="translate-x-[1px] w-full h-[50px] rounded-t-xl hover:bg-quaternary hover:text-tertiary py-3"
                    onClick={() => handlePropertyType('apartamento')}
                  >
                    Apartamento
                  </span>
                  <span
                    id="casa"
                    className="translate-x-[1px] w-full h-[50px] hover:bg-quaternary hover:text-tertiary py-3"
                    onClick={() => handlePropertyType('casa')}
                  >
                    Casa
                  </span>
                  <span
                    id="condominio"
                    className="translate-x-[1px] w-full h-[50px] text-quaternary leading-5 hover:bg-quaternary hover:text-tertiary py-3"
                    onClick={() => handlePropertyType('casaDeCondominio')}
                  >
                    Casa de Condomínio
                  </span>
                  <span
                    id="casa-de-bairro"
                    className="translate-x-[1px] w-full h-[50px] text-quaternary leading-5 rounded-b-xl hover:bg-quaternary hover:text-tertiary py-3"
                    onClick={() => handlePropertyType('casaDeBairro')}
                  >
                    Casa de Bairro
                  </span>
                  <span
                    id="cobertura"
                    className="translate-x-[1px] w-full h-[50px] text-quaternary leading-5 rounded-b-xl hover:bg-quaternary hover:text-tertiary py-3"
                    onClick={() => handlePropertyType('cobertura')}
                  >
                    Cobertura
                  </span>
                  <span
                    id="fazenda-sitio-chacara"
                    className="translate-x-[1px] w-full h-[50px] text-quaternary leading-5 rounded-b-xl hover:bg-quaternary hover:text-tertiary py-3"
                    onClick={() => handlePropertyType('fazendaSitioChacara')}
                  >
                    Fazenda/Sítio/Chácara
                  </span>
                  <span
                    id="flat"
                    className="translate-x-[1px] w-full h-[50px] text-quaternary leading-5 rounded-b-xl hover:bg-quaternary hover:text-tertiary py-3"
                    onClick={() => handlePropertyType('flat')}
                  >
                    Flat
                  </span>
                  <span
                    id="lote-terreno"
                    className="translate-x-[1px] w-full h-[50px] text-quaternary leading-5 rounded-b-xl hover:bg-quaternary hover:text-tertiary py-3"
                    onClick={() => handlePropertyType('loteTerreno')}
                  >
                    Lote/Terreno
                  </span>
                  <span
                    id="sobrado"
                    className="translate-x-[1px] w-full h-[50px] text-quaternary leading-5 rounded-b-xl hover:bg-quaternary hover:text-tertiary py-3"
                    onClick={() => handlePropertyType('sobrado')}
                  >
                    Sobrado
                  </span>
                </div>
              </div>
            </div>
            {/** dropdown propertySubtype */}
            <div className="w-full">
              <div
                className="border border-quaternary rounded-[10px] h-12 md:w-full md:mb-0 text-quaternary text-lg font-bold px-5 drop-shadow-lg bg-tertiary flex justify-between "
                ref={refSecondSelect as any}
                onClick={() => setOpenSecondSelect(!openSecondSelect)}
              >
                <p className="my-auto">{registration.propertySubtype}</p>
                <ArrowDownIconcon width="15" height="15" className="my-auto" />
              </div>
              <div
                className={`absolute z-50 w-[372px] lg:w-[550px] md:w-2/5 xl:w-[551px] rounded-xl bg-tertiary overflow-hidden cursor-pointer shadow-md ${
                  openSecondSelect ? 'md:flex' : 'hidden'
                }`}
              >
                <div className="flex flex-col w-full text-center font-normal text-base text-quaternary leading-5">
                  <span
                    id="padrao"
                    className="translate-x-[1px] w-full h-[50px] rounded-t-xl hover:bg-quaternary hover:text-tertiary py-3"
                    onClick={() => handlePropertySubType('padrao')}
                  >
                    Padrão
                  </span>
                  <span
                    id="cobertura"
                    className="translate-x-[1px] w-full h-[50px] hover:bg-quaternary hover:text-tertiary py-3"
                    onClick={() => handlePropertySubType('cobertura')}
                  >
                    Cobertura
                  </span>
                  <span
                    id="flat"
                    className="translate-x-[1px] w-full h-[50px] text-quaternary leading-5 hover:bg-quaternary hover:text-tertiary py-3"
                    onClick={() => handlePropertySubType('flat')}
                  >
                    Flat
                  </span>
                  <span
                    id="kitnet-conjugado"
                    className="translate-x-[1px] w-full h-[50px] text-quaternary leading-5 rounded-b-xl hover:bg-quaternary hover:text-tertiary py-3"
                    onClick={() => handlePropertySubType('kitnetConjugado')}
                  >
                    Kitnet/Conjugado
                  </span>
                  <span
                    id="loft"
                    className="translate-x-[1px] w-full h-[50px] text-quaternary leading-5 rounded-b-xl hover:bg-quaternary hover:text-tertiary py-3"
                    onClick={() => handlePropertySubType('loft')}
                  >
                    Loft
                  </span>
                  <span
                    id="estudio"
                    className="translate-x-[1px] w-full h-[50px] text-quaternary leading-5 rounded-b-xl hover:bg-quaternary hover:text-tertiary py-3"
                    onClick={() => handlePropertySubType('estudio')}
                  >
                    Estúdio
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FORM DO VIACEP */}

          <div className="ml-5 mx-5 lg:mx-0">
            <form>
              <div className="my-10">
                <h3 className="md:text-[32px] text-xl text-quaternary font-semibold leading-9 my-5">
                  Endereço do Imóvel
                </h3>
                <label className="text-lg font-normal text-quaternary leading-7">
                  CEP
                </label>
                <div className="md:flex grid grid-flow-row">
                  <div>
                    <input
                      required
                      onChange={handleAddressZipCode}
                      value={maskedZipCode()}
                      className="border border-quaternary rounded-[10px] h-12 sm:w-1/3 md:w-full text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                      style={errors.zipCode ? { border: '1px solid red' } : {}}
                    />
                    {errors.zipCode && (
                      <span className="text-red-500 mt-2">
                        {errors.zipCode}
                      </span>
                    )}
                  </div>
                  <a
                    href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                    target="_blank"
                    className="text-secondary text-lg font-normal md:mt-8 md:mx-6 md:ml-5 leading-8 mt-10 cursor-pointer"
                    rel="noreferrer"
                  >
                    Não sei meu CEP
                  </a>
                </div>
              </div>
              <div className="md:flex">
                <div className="md:flex flex-col mr-5 md:w-4/5">
                  <label className="text-lg font-normal text-quaternary leading-7">
                    Cidade
                  </label>
                  <input
                    className="border border-quaternary rounded-[10px] w-full h-12 text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                    id="city"
                    value={
                      viaCepData.localidade
                        ? viaCepData.localidade
                        : registration.address.city
                    }
                    style={errors.city ? { border: '1px solid red' } : {}}
                    onChange={handleAddressCity}
                    required
                  />
                  {errors.city && (
                    <span className="text-red-500 mt-2">{errors.city}</span>
                  )}
                </div>
                <div className="flex flex-col md:ml-5 mt-5 md:mt-0 md:w-1/5">
                  <label className="text-lg font-normal text-quaternary leading-7">
                    UF
                  </label>
                  <input
                    required
                    style={errors.state ? { border: '1px solid red' } : {}}
                    className="border border-quaternary rounded-[10px] md:w-full w-[150px] h-12 text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                    value={maskedUF()}
                    id="uf"
                    onChange={handleAddressState}
                  />
                  {errors.state && (
                    <span className="text-red-500 mt-2">{errors.state}</span>
                  )}
                </div>
              </div>
              <div className="md:flex mt-10">
                <div className="md:flex flex-col mr-5 md:w-4/5">
                  <label className="text-lg font-normal text-quaternary leading-7">
                    Logradouro
                  </label>
                  <input
                    required
                    className="border border-quaternary rounded-[10px] w-full h-12 text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                    id="street"
                    value={
                      viaCepData.logradouro
                        ? viaCepData.logradouro
                        : registration.address.streetName
                    }
                    style={errors.streetName ? { border: '1px solid red' } : {}}
                    onChange={handleAddressStreetName}
                  />
                  {errors.streetName && (
                    <span className="text-red-500 mt-2">
                      {errors.streetName}
                    </span>
                  )}
                </div>
                <div className="flex flex-col md:ml-5 md:w-1/5">
                  <label className="text-lg font-normal text-quaternary leading-7 mt-5 md:mt-0">
                    Número
                  </label>
                  <input
                    required
                    className="border border-quaternary rounded-[10px] md:w-full w-[150px] h-12 text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                    type="number"
                    value={
                      viaCepData.numero
                        ? viaCepData.numero
                        : registration.address.streetNumber
                    }
                    style={
                      errors.streetNumber ? { border: '1px solid red' } : {}
                    }
                    onChange={handleAddressStreetNumber}
                  />
                  {errors.streetNumber && (
                    <span className="text-red-500 mt-2">
                      {errors.streetNumber}
                    </span>
                  )}
                </div>
              </div>
              <div className="lg:flex mt-10">
                <div className="flex flex-col md:mr-5 md:w-full">
                  <label className="text-lg font-normal text-quaternary leading-7">
                    Complemento
                  </label>
                  <input
                    className="border border-quaternary rounded-[10px] h-12 text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                    onChange={handleAddressComplement}
                    value={registration.address.complement}
                  />
                </div>
                <div className="flex flex-col lg:ml-5 md:w-full md:mt-10 lg:mt-0">
                  <label className="text-lg font-normal text-quaternary leading-7">
                    Bairro
                  </label>
                  <input
                    className="border border-quaternary rounded-[10px] h-12 text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                    id="district"
                    value={
                      viaCepData.bairro
                        ? viaCepData.bairro
                        : registration.address.neighborhood
                    }
                    style={
                      errors.neighborhood ? { border: '1px solid red' } : {}
                    }
                    onChange={handleAddressNeighborhood}
                    required
                  />
                  {errors.neighborhood && (
                    <span className="text-red-500 mt-2">
                      {errors.neighborhood}
                    </span>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* FORM DO VIACEP */}
          <div className="my-10 ml-5 lg:ml-0">
            <h3 className="text-xl text-quaternary font-semibold leading-9 my-5">
              Dados do Imóvel:
            </h3>
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-col lg:w-1/5 md:mr-5">
                <div className="flex flex-col md:flex-row">
                  <div className="flex flex-col">
                    <label className="text-lg font-normal text-quaternary leading-7">
                      Área Total
                    </label>
                    <input
                      required
                      className="border border-quaternary rounded-[10px] w-[242px] h-12 text-quaternary text-[26px] font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                      value={maskedArea()}
                      style={errors.value ? { border: '1px solid red' } : {}}
                      onChange={handleSizeArea}
                    />
                    <span
                      onClick={handleOpen}
                      className="text-secondary text-base font-semibold cursor-pointer mt-2 ml-8"
                    >
                      Calcular área para mim
                    </span>
                    {errors.description && (
                      <span className="text-red-500 mt-2">{errors.area}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:w-1/5 md:ml-5 mt-5 md:mt-0">
                <label className="text-lg font-normal text-quaternary leading-7">
                  Área Útil (opcional)
                </label>
                <input
                  className={
                    'border border-quaternary rounded-[10px] w-[242px] h-12 text-quaternary text-[26px] font-bold px-5 drop-shadow-lg bg-tertiary mt-5'
                  }
                />
              </div>
            </div>
          </div>
          {/** Metadata */}
          <div className="my-10 lg:flex grid grid-cols-2 md:grid-cols-3 w-full lg:justify-between">
            <div className="ml-5 lg:ml-0">
              <label className="text-lg font-normal text-quaternary leading-7 lg:flex justify-center drop-shadow-lg">
                Quartos:
              </label>
              <div className="flex my-5">
                <div className="rounded-full  w-10 h-10 border border-secondary drop-shadow-xl flex justify-center">
                  <p
                    className="text-secondary font-extrabold text-3xl  md:leading-7 leading-[18px] cursor-pointer"
                    onClick={() => {
                      if (
                        registration.metadata.find(
                          (data) => data.type === 'bedroom'
                        )?.amount ||
                        0 > 0
                      ) {
                        handleMetadata('bedroom', '-');
                      }
                    }}
                  >
                    -
                  </p>
                </div>
                <span className="text-lg text-quaternary font-bold drop-shadow-lg mx-5 leading-10">
                  {registration.metadata.find((data) => data.type === 'bedroom')
                    ?.amount || 0}
                </span>
                <div className="rounded-full w-10 h-10 border border-secondary drop-shadow-xl flex justify-center">
                  <p
                    className="text-secondary font-extrabold text-3xl  md:leading-7 leading-[18px] cursor-pointer"
                    onClick={() => handleMetadata('bedroom', '+')}
                  >
                    +
                  </p>
                </div>
              </div>
            </div>
            <div className="">
              <label className="text-lg font-normal text-quaternary leading-7 flex justify-center drop-shadow-lg">
                Banheiros:
              </label>
              <div className="flex justify-center my-5">
                <div className="rounded-full  w-10 h-10 border border-secondary drop-shadow-xl flex justify-center">
                  <p
                    className="text-secondary font-extrabold text-3xl  md:leading-7 leading-[18px] cursor-pointer"
                    onClick={() => {
                      if (
                        registration.metadata.find(
                          (data) => data.type === 'bathroom'
                        )?.amount ||
                        0 > 0
                      ) {
                        handleMetadata('bathroom', '-');
                      }
                    }}
                  >
                    -
                  </p>
                </div>
                <span className="text-lg text-quaternary font-bold drop-shadow-lg mx-5 leading-10">
                  {registration.metadata.find(
                    (data) => data.type === 'bathroom'
                  )?.amount || 0}
                </span>
                <div className="rounded-full  w-10 h-10 border border-secondary drop-shadow-xl flex justify-center">
                  <p
                    className="text-secondary font-extrabold text-3xl  md:leading-7 leading-[18px] cursor-pointer"
                    onClick={() => handleMetadata('bathroom', '+')}
                  >
                    +
                  </p>
                </div>
              </div>
            </div>
            <div className="ml-5 lg:ml-0">
              <label className="text-lg font-normal text-quaternary leading-7 flex justify-center text-start drop-shadow-lg">
                Vagas de Garagem:
              </label>
              <div className="flex md:justify-center my-5">
                <div className="rounded-full  w-10 h-10 border border-secondary drop-shadow-xl flex justify-center">
                  <p
                    className="text-secondary font-extrabold text-3xl  md:leading-7 leading-[18px] cursor-pointer"
                    onClick={() => {
                      if (
                        registration.metadata.find(
                          (data) => data.type === 'garage'
                        )?.amount ||
                        0 > 0
                      ) {
                        handleMetadata('garage', '-');
                      }
                    }}
                  >
                    -
                  </p>
                </div>
                <span className="text-lg text-quaternary font-bold drop-shadow-lg mx-5 leading-10">
                  {registration.metadata.find((data) => data.type === 'garage')
                    ?.amount || 0}
                </span>
                <div className="rounded-full  w-10 h-10 border border-secondary drop-shadow-xl flex justify-center">
                  <p
                    className="text-secondary font-extrabold text-3xl  md:leading-7 leading-[18px] cursor-pointer"
                    onClick={() => handleMetadata('garage', '+')}
                  >
                    +
                  </p>
                </div>
              </div>
            </div>
            <div className="md:ml-5 lg:ml-0">
              <label className="text-lg font-normal text-quaternary leading-7 flex justify-center md:justify-start lg:justify-center drop-shadow-lg">
                Dependências:
              </label>
              <div className="flex justify-center md:justify-start lg:justify-center md:my-5 mt-12">
                <div className="rounded-full  w-10 h-10 border border-secondary drop-shadow-xl flex justify-center">
                  <p
                    className="text-secondary font-extrabold text-3xl  md:leading-7 leading-[18px] cursor-pointer"
                    onClick={() => {
                      if (
                        registration.metadata.find(
                          (data) => data.type === 'dependencies'
                        )?.amount ||
                        0 > 0
                      ) {
                        handleMetadata('dependencies', '-');
                      }
                    }}
                  >
                    -
                  </p>
                </div>
                <p className="text-lg text-quaternary font-bold drop-shadow-lg mx-5 leading-10">
                  {registration.metadata.find(
                    (data) => data.type === 'dependencies'
                  )?.amount || 0}
                </p>
                <div className="rounded-full  w-10 h-10 border border-secondary drop-shadow-xl flex justify-center">
                  <p
                    className="text-secondary font-extrabold text-3xl  md:leading-7 leading-[18px] cursor-pointer"
                    onClick={() => handleMetadata('dependencies', '+')}
                  >
                    +
                  </p>
                </div>
              </div>
            </div>
            <div className="ml-5 md:ml-0">
              <label className="text-lg font-normal text-quaternary leading-7 flex md:justify-center drop-shadow-lg">
                Suítes:
              </label>
              <div className="flex my-5 md:justify-center">
                <div className="rounded-full  w-10 h-10 border border-secondary drop-shadow-xl flex justify-center">
                  <p
                    className="text-secondary font-extrabold text-3xl  md:leading-7 leading-[18px] cursor-pointer"
                    onClick={() => {
                      if (
                        registration.metadata.find(
                          (data) => data.type === 'suites'
                        )?.amount ||
                        0 > 0
                      ) {
                        handleMetadata('suites', '-');
                      }
                    }}
                  >
                    -
                  </p>
                </div>
                <p className="text-lg text-quaternary font-bold drop-shadow-lg mx-5 leading-10">
                  {registration.metadata.find((data) => data.type === 'suites')
                    ?.amount || 0}
                </p>
                <div className="rounded-full w-10 h-10 border border-secondary drop-shadow-xl flex justify-center">
                  <p
                    className="text-secondary font-extrabold text-3xl md:leading-7 leading-[20px] cursor-pointer"
                    onClick={() => handleMetadata('suites', '+')}
                  >
                    +
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="my-10">
            <div className="flex flex-col mx-5 lg:mx-0">
              <label className="text-lg font-normal text-quaternary leading-7 mb-5 drop-shadow-xl">
                Descrição do Imóvel:
              </label>
              <textarea
                className="bg-tertiary border border-quaternary rounded-[10px] h-[246px] drop-shadow-xl text-2xl p-2 font-semibold text-quaternary"
                value={registration.description}
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
            <h3 className="text-xl text-quaternary font-semibold leading-9 my-5 ml-5 lg:ml-0">
              Valores do Imóvel:
            </h3>
            <div className="md:flex my-5 ml-5 lg:ml-0">
              <div className="flex flex-col md:w-1/4 md:mr-5">
                <label className="text-lg font-normal text-quaternary leading-7">
                  Valor do
                  {registration.adType === 'comprar' ? ' imóvel' : ' aluguel'}
                </label>
                <input
                  value={maskedPrice(
                    registration.adType === 'comprar'
                      ? PricesType.venda
                      : PricesType.mensal
                  )}
                  className={
                    'border border-quaternary rounded-[10px] h-12 text-quaternary md:text-[26px] text-2xl font-bold pr-5 md:font-bold md:px-5 drop-shadow-lg bg-tertiary mt-5 text-right'
                  }
                  onChange={(e) =>
                    handlePricesValue(
                      registration.adType === 'comprar'
                        ? PricesType.venda
                        : PricesType.mensal,
                      e.target.value
                    )
                  }
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
                <label className="text-lg font-normal text-quaternary leading-7 ml-5 lg:ml-0">
                  Condomínio{' '}
                </label>
                <p className="text-lg font-light md:ml-2 text-quaternary leading-7">
                  {' '}
                  (valor mensal)
                </p>
              </div>
              <div className="lg:flex items-center w-[370px] lg:w-full ml-5 lg:ml-0">
                <input
                  value={maskedPrice(PricesType.condominio)}
                  className={getSelectedInputClass(!condominiumCheckbox)}
                  prefix={condominiumCheckbox ? 'R$' : ''}
                  onChange={(e) => {
                    handlePricesValue(PricesType.condominio, e.target.value);
                  }}
                />
                <div
                  className={getSelectedCheckboxDivClass(condominiumCheckbox)}
                  onClick={handleCondominiumCheckbox}
                >
                  <CheckIcon
                    fill="#F5BF5D"
                    width="42"
                    className={getSelectedCheckboxClass(condominiumCheckbox)}
                  />
                </div>
                <p className="text-lg font-light text-quaternary leading-7 md:mt-9  lg:ml-5">
                  {condominiumCheckboxLabel}
                </p>
              </div>
              <div className="flex  mt-10 ml-5 lg:ml-0">
                <label className="text-lg font-normal text-quaternary leading-7">
                  IPTU
                </label>
                <p className="text-lg font-light ml-2 text-quaternary leading-7">
                  {' '}
                  (valor anual)
                </p>
              </div>
              <div className="lg:flex items-center ml-5 lg:ml-0">
                <input
                  value={maskedPrice(PricesType.IPTU)}
                  className={getSelectedInputClass(!iptuCheckbox)}
                  prefix={iptuCheckbox ? 'R$' : ''}
                  onChange={(e) => {
                    handlePricesValue(PricesType.IPTU, e.target.value);
                  }}
                />
                <div
                  id="iptu-checkbox"
                  className={getSelectedCheckboxDivClass(iptuCheckbox)}
                  onClick={handleIptuCheckbox}
                >
                  <CheckIcon
                    fill="#F5BF5D"
                    width="42"
                    className={getSelectedCheckboxClass(iptuCheckbox)}
                  />
                </div>
                <p
                  id="iptu-checkbox-label"
                  className="text-lg font-light text-quaternary leading-7 md:mt-9 lg:ml-5"
                >
                  {iptuCheckboxLabel}
                </p>
              </div>
              <div className="flex items-center">
                <div
                  id="funding-checkbox"
                  className={getSelectedFunding(funding)}
                  onClick={handleFundingCheckbox}
                >
                  <CheckIcon
                    fill="#F5BF5D"
                    width="42"
                    className={getSelectedCheckboxClass(funding)}
                  />
                </div>
                <p
                  id="iptu-checkbox-label"
                  className="text-lg font-light text-quaternary leading-7 md:mt-9 lg:ml-5 "
                >
                  Aceito financiamento
                </p>
              </div>
            </div>
            <div className="flex items-end float-right md:py-10 max-w-[1536px]">
              <button
                className="md:w-48 h-14 text-tertiary text-xl md:font-extrabold bg-primary rounded-[10px] pb-1 gap-3 drop-shadow-xl px-3 md:px-0 mr-5 right-0"
                onClick={handleSubmitForm}
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-10">
        <Footer smallPage={false} />
      </div>
    </>
  );
};

export default Register;
