import { useEffect, useState } from 'react';
import { IAddress } from '../../../common/interfaces/property/propertyData';

interface IUserAddress {
  address: IAddress;
  isEdit?: boolean;
  errors?: AddressErrorsTypes;
  addressInputRefs?: any;
  onAddressUpdate?: (updatedAddress: IAddress) => void;
}

interface ViaZipCodeData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
  complemento: string;
}

export type AddressErrorsTypes = {
  zipCode: string;
  uf: string;
  streetNumber: string;
  city: string;
  streetName: string;
};

const UserAddress = ({
  isEdit = false,
  errors,
  addressInputRefs,
  address,
  onAddressUpdate,
}: IUserAddress) => {
  const addressInputsErrorScroll = {
    ...addressInputRefs,
  };

  const [shouldExecuteEffect, setShouldExecuteEffect] = useState(false);

  const [addressData, setAddressData] = useState<IAddress>({
    zipCode: isEdit ? address?.zipCode! : '',
    city: isEdit ? address?.city! : '',
    streetName: isEdit ? address?.streetName! : '',
    streetNumber: isEdit ? address?.streetNumber! : '',
    complement: address?.complement ? address?.complement : '',
    neighborhood: isEdit ? address?.neighborhood! : '',
    uf: isEdit ? address?.uf! : '',
  });

  const [addressErrors, setAddressErrors] = useState({
    zipCode: '',
    uf: '',
    streetNumber: '',
    city: '',
    streetName: '',
  });

  useEffect(() => {
    setAddressErrors(errors!);
  }, [errors]);

  const [viaZipCodeData, setViaZipCodeData] = useState<ViaZipCodeData>({
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    numero: '',
    complemento: '',
  });

  useEffect(() => {
    const scrollToError = (errorKey: keyof typeof addressErrors) => {
      if (
        addressErrors[errorKey] !== '' &&
        addressInputRefs[errorKey]?.current
      ) {
        addressInputsErrorScroll[errorKey]?.current.scrollIntoView({
          behavior: 'auto',
          block: 'center',
        });
      }
    };

    scrollToError('zipCode');
    scrollToError('city');
    scrollToError('streetName');
    scrollToError('streetNumber');
    scrollToError('uf');
  }, [addressErrors]);

  useEffect(() => {
    if (shouldExecuteEffect) {
      setAddressData({
        ...addressData,
        uf: viaZipCodeData.uf,
        streetName: viaZipCodeData.logradouro,
        city: viaZipCodeData.localidade,
        neighborhood: viaZipCodeData.bairro,
      });
    }
  }, [viaZipCodeData]);

  useEffect(() => {
    setShouldExecuteEffect(true);
  }, [viaZipCodeData]);

  useEffect(() => {
    onAddressUpdate!(addressData);
  }, [addressData]);

  const handleZipCodeBlur = () => {
    if (addressData?.zipCode?.length === 8) {
      fetch(`https://viacep.com.br/ws/${addressData.zipCode}/json/`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.erro) {
            setViaZipCodeData(data);
            setAddressErrors({
              ...addressErrors,
              zipCode: '',
              uf: '',
              city: '',
              streetName: '',
            });
          } else {
            alert('CEP não encontrado.');
          }
        })
        .catch((error) => console.error(error));
    } else {
      alert('Formato de CEP inválido.');
    }
  };

  const handleZipCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cep = event.target.value;
    const formattedZipCode = cep.replace(/-/g, '');
    setAddressData({ ...addressData, zipCode: formattedZipCode });
    setAddressErrors({ ...addressErrors, zipCode: '' });
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const city = event.target.value;
    const formattedCity = city.replace(/-/g, '');
    const cityMask = formattedCity.replace(/\d/g, '');
    setAddressData({ ...addressData, city: cityMask });
    setAddressErrors({ ...addressErrors, city: '' });
  };

  const handleUFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uf = event.target.value;
    const formattedUF = uf.replace(/[^a-zA-Z]/g, '').toUpperCase();
    setAddressData({ ...addressData, uf: formattedUF });
    setAddressErrors({ ...addressErrors, uf: '' });
  };

  const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const street = event.target.value;
    const formattedStreet = street.replace(/-/g, '');
    setAddressData({ ...addressData, streetName: formattedStreet });
    setAddressErrors({ ...addressErrors, streetName: '' });
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const number = event.target.value;
    const formattedNumber = number.replace(/-/g, '');
    const numberMask = formattedNumber.replace(/\D/g, '');
    setAddressData({ ...addressData, streetNumber: numberMask });
    setAddressErrors({ ...addressErrors, streetNumber: '' });
  };

  const handleNeighborhoodChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const neighborhood = event.target.value;
    const formattedNeighborhood = neighborhood.replace(/-/g, '');
    setAddressData({ ...addressData, neighborhood: formattedNeighborhood });
  };

  const handleComplementChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const complement = event.target.value;
    const formattedComplement = complement.replace(/-/g, '');
    setAddressData({ ...addressData, complement: formattedComplement });
  };

  const formatCEP = (cep: string) => {
    const numericOnly = cep?.replace(/\D/g, '');
    if (numericOnly?.length !== 8) {
      return numericOnly;
    }
    return `${numericOnly?.substring(0, 5)}-${numericOnly.substring(5, 8)}`;
  };

  const classes = {
    title: 'text-lg font-normal text-quaternary leading-7',
    darkInput:
      'border border-quaternary rounded-[10px] w-full h-12 text-quaternary md:text-base text-sm font-bold px-5 drop-shadow-lg bg-[#CACACA] mt-3',
    error: 'text-red-500 text-xs',
  };

  return (
    <div className="px-5 lg:mx-auto w-full mx-auto max-w-[1215px]">
      <form>
        <div className="my-5 md:w-96">
          <h3 className="md:text-2xl text-lg text-quaternary font-semibold leading-9 my-5">
            Endereço
          </h3>
          <label className={classes.title}>CEP</label>
          <div className="flex flex-col w-full">
            <div
              ref={addressInputsErrorScroll.zipCode}
              className="flex flex-col w-full"
            >
              <input
                className="border border-quaternary rounded-[10px] h-12 sm:w-1/3 md:w-full text-quaternary md:text-base text-sm font-bold px-5 drop-shadow-lg bg-tertiary mt-3"
                type="cep"
                value={formatCEP(addressData.zipCode)}
                onChange={handleZipCodeChange}
                onBlur={handleZipCodeBlur}
                maxLength={8}
                style={addressErrors.zipCode ? { border: '1px solid red' } : {}}
                required
              />
              {addressErrors.zipCode && (
                <span className={classes.error}>{addressErrors.zipCode}</span>
              )}
            </div>
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
              className="text-secondary text-base underline font-normal leading-8 mt-2 cursor-pointer"
              rel="noreferrer"
            >
              Não sei meu CEP
            </a>
          </div>
        </div>
        <div className="md:flex">
          <div
            className="md:flex flex-col md:mr-5 md:w-4/5"
            ref={addressInputsErrorScroll.city}
          >
            <label className={classes.title}>Cidade</label>
            <input
              className={classes.darkInput}
              value={
                viaZipCodeData.localidade
                  ? viaZipCodeData.localidade
                  : addressData.city
              }
              style={addressErrors.city ? { border: '1px solid red' } : {}}
              onChange={handleCityChange}
              maxLength={30}
              readOnly
            />
            {addressErrors.city && (
              <span className={classes.error}>{addressErrors.city}</span>
            )}
          </div>
          <div
            className="flex flex-col md:ml-5 mt-5 md:mt-0 md:w-1/5"
            ref={addressInputsErrorScroll.uf}
          >
            <label className={classes.title}>UF</label>
            <input
              required
              style={addressErrors.uf ? { border: '1px solid red' } : {}}
              className="border border-quaternary rounded-[10px] md:w-full w-[150px] h-12 text-quaternary md:text-base text-sm font-bold px-5 drop-shadow-lg bg-tertiary mt-3"
              value={viaZipCodeData.uf ? viaZipCodeData.uf : addressData.uf}
              maxLength={2}
              onChange={handleUFChange}
            />
            {addressErrors.uf && (
              <span className={classes.error}>{addressErrors.uf}</span>
            )}
          </div>
        </div>
        <div className="md:flex mt-5">
          <div
            className="md:flex flex-col md:mr-5 md:w-4/5"
            ref={addressInputsErrorScroll.streetName}
          >
            <label className={classes.title}>Logradouro</label>
            <input
              className={classes.darkInput}
              value={
                viaZipCodeData.logradouro
                  ? viaZipCodeData.logradouro
                  : addressData.streetName
              }
              style={
                addressErrors.streetName ? { border: '1px solid red' } : {}
              }
              onChange={handleStreetChange}
              maxLength={30}
              readOnly
            />
            {addressErrors.streetName && (
              <span className={classes.error}>{addressErrors.streetName}</span>
            )}
          </div>
          <div
            className="flex flex-col md:ml-5 md:w-1/5"
            ref={addressInputsErrorScroll.streetNumber}
          >
            <label className={classes.title}>Número</label>
            <input
              required
              className="border border-quaternary rounded-[10px] md:w-full w-[150px] h-12 text-quaternary md:text-base text-sm font-bold px-5 drop-shadow-lg bg-tertiary mt-3"
              value={
                viaZipCodeData.numero
                  ? viaZipCodeData.numero
                  : addressData.streetNumber
              }
              style={
                addressErrors.streetNumber ? { border: '1px solid red' } : {}
              }
              maxLength={10}
              onChange={handleNumberChange}
            />
            {addressErrors.streetNumber && (
              <span className={classes.error}>
                {addressErrors.streetNumber}
              </span>
            )}
          </div>
        </div>
        <div className="lg:flex mt-5 mb-10">
          <div className="flex flex-col md:mr-5 md:w-full">
            <label className={classes.title}>Complemento</label>
            <input
              className={`border border-quaternary rounded-[10px] h-12 text-quaternary md:text-base text-sm font-bold px-5 drop-shadow-lg bg-tertiary mt-3`}
              onChange={handleComplementChange}
              value={addressData.complement}
              maxLength={50}
            />
          </div>
          <div className="flex flex-col lg:ml-5 md:w-full mt-5 lg:mt-0">
            <label className={classes.title}>Bairro</label>
            <input
              className={`border border-quaternary rounded-[10px] h-12 text-quaternary md:text-base text-sm font-bold px-5 drop-shadow-lg bg-[#CACACA] mt-3 `}
              value={
                viaZipCodeData.bairro
                  ? viaZipCodeData.bairro
                  : addressData.neighborhood
              }
              onChange={handleNeighborhoodChange}
              maxLength={30}
              readOnly
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserAddress;
