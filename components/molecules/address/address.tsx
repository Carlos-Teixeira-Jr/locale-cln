import { useEffect, useState } from 'react';
import { IAddress } from '../../../common/interfaces/property/propertyData';
import { OnErrorInfo } from '../uploadImages/uploadImages';
import { resetObjectToEmptyStrings } from '../../../common/utils/resetObjects';

interface ViaZipCodeData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
  complemento: string
}

export interface IAddressComponent {
  isEdit: boolean;
  address: IAddress
  onAddressUpdate: (updatedAddress: IAddress) => void;
  onErrorsInfo: OnErrorInfo
}

const Address: React.FC<IAddressComponent> = ({
  isEdit,
  address,
  onAddressUpdate,
  onErrorsInfo
}: IAddressComponent) => {

  const [shouldExecuteEffect, setShouldExecuteEffect] = useState(false);

  const [addressData, setAddressData] = useState<IAddress>({
    zipCode: isEdit ? address?.zipCode : '',
    city: isEdit ? address?.city : '',
    streetName: isEdit ? address?.streetName : '',
    streetNumber: isEdit ? address?.streetNumber : '',
    complement: address?.complement ? address?.complement : '',
    neighborhood: isEdit ? address?.neighborhood : '',
    uf: isEdit ? address?.uf : ''
  });

  const [viaZipCodeData, setViaZipCodeData] = useState<ViaZipCodeData>({
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    numero: '',
    complemento: ''
  });

  const [errors, setErrors] = useState({
    zipCode: '',
    uf: '',
    streetNumber: '',
    city: '',
    streetName: '',
    neighborhood: '',
  });

  // Processa a estrutura de dados de onErrosInfo para inserir no objeto errors;
  useEffect(() => {
    resetObjectToEmptyStrings(errors);
    if (onErrorsInfo) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [onErrorsInfo.prop]: onErrorsInfo.error,
      }));
    }
  }, [onErrorsInfo]);

  useEffect(() => {
    if (shouldExecuteEffect) {
      setAddressData({
        ...addressData,
        uf: viaZipCodeData.uf,
        streetName: viaZipCodeData.logradouro,
        city: viaZipCodeData.localidade,
        neighborhood: viaZipCodeData.bairro
      });
    }
  }, [viaZipCodeData]);

  useEffect(() => {
    // Define shouldExecuteEffect como true após a primeira renderização para mostrar os dados de endereço antes da alteração.
    setShouldExecuteEffect(true);
  }, [viaZipCodeData]);
  

  // Envia os dados de endereço para o componente pai;
  useEffect(() => {
    onAddressUpdate(addressData)
  }, [addressData]);

  const handleZipCodeBlur = () => {
    if (addressData.zipCode.length === 8) {
      fetch(`https://viacep.com.br/ws/${addressData.zipCode}/json/`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.erro) {
            setViaZipCodeData(data);
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
    setAddressData({...addressData, zipCode: formattedZipCode});
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const city = event.target.value;
    const formattedCity = city.replace(/-/g, '');
    const cityMask = formattedCity.replace(/\d/g, '');
    setAddressData({...addressData, city: cityMask});
  };

  const handleUFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uf = event.target.value;
    const formattedUF = uf.replace(/[^a-zA-Z]/g, '').toUpperCase();
    setAddressData({...addressData, uf: formattedUF});
  };

  const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const street = event.target.value;
    const formattedStreet = street.replace(/-/g, '');
    setAddressData({...addressData, streetName: formattedStreet});
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const number = event.target.value;
    const formattedNumber = number.replace(/-/g, '');
    const numberMask = formattedNumber.replace(/\D/g, '');
    setAddressData({...addressData, streetNumber: numberMask});
  };

  const handleNeighborhoodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const neighborhood = event.target.value;
    const formattedNeighborhood = neighborhood.replace(/-/g, '');
    setAddressData({...addressData, neighborhood: formattedNeighborhood});
  };

  const handleComplementChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const complement = event.target.value;
    const formattedComplement = complement.replace(/-/g, '');
    setAddressData({...addressData, complement: formattedComplement});
  };

  const formatCEP = (cep: string) => {
    const numericOnly = cep?.replace(/\D/g, '');
    if (numericOnly?.length !== 8) {
      return numericOnly;
    }
    return `${numericOnly?.substring(0, 5)}-${numericOnly.substring(5, 8)}`;
  };
  

  return (
    <div className="md:mx-0 lg:mx-auto w-96 md:w-full mx-auto max-w-[1215px]">
      <form>
        <div className="mt-10 mb-5">
          <h3 className="md:text-[32px] text-2xl text-quaternary font-semibold  leading-9 my-5">
            Endereço do Imóvel
          </h3>
          <label className="text-xl font-normal text-quaternary leading-7">
            CEP
          </label>
          <div className="md:flex grid grid-flow-row">
            <div>
              <input
                className="border border-quaternary rounded-[10px] h-12 sm:w-1/3 md:w-full text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-3"
                type="cep"
                value={formatCEP(addressData.zipCode)}
                onChange={handleZipCodeChange}
                onBlur={handleZipCodeBlur}
                maxLength={8}
                style={errors.zipCode ? { border: '1px solid red' } : {}}
                required
              />
              {errors.zipCode && (
                <span className="text-red-500 text-xs">{errors.zipCode}</span>
              )}
            </div>
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
              className="text-secondary text-xl font-normal md:mt-8 md:mx-6 md:ml-5 leading-8 mt-2 cursor-pointer"
              rel="noreferrer"
            >
              Não sei meu CEP
            </a>
          </div>
        </div>
        <div className="md:flex">
          <div className="md:flex flex-col md:mr-5 md:w-4/5">
            <label className="text-xl font-normal text-quaternary leading-7">
              Cidade
            </label>
            <input
              className="border border-quaternary rounded-[10px] w-full h-12 text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-[#CACACA] mt-3"
              value={viaZipCodeData.localidade ? viaZipCodeData.localidade : addressData.city}
              style={errors.city ? { border: '1px solid red' } : {}}
              onChange={handleCityChange}
              readOnly
            />
            {errors.city && (
              <span className="text-red-500 text-xs">{errors.city}</span>
            )}
          </div>
          <div className="flex flex-col md:ml-5 mt-5 md:mt-0 md:w-1/5">
            <label className="text-xl font-normal text-quaternary leading-7">
              UF
            </label>
            <input
              required
              style={errors.uf ? { border: '1px solid red' } : {}}
              className="border border-quaternary rounded-[10px] md:w-full w-[150px] h-12 text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-3"
              value={viaZipCodeData.uf ? viaZipCodeData.uf : addressData.uf}
              onChange={handleUFChange}
            />
            {errors.uf && (
              <span className="text-red-500 text-xs">{errors.uf}</span>
            )}
          </div>
        </div>
        <div className="md:flex mt-5">
          <div className="md:flex flex-col md:mr-5 md:w-4/5">
            <label className="text-xl font-normal text-quaternary leading-7">
              Logradouro
            </label>
            <input
              className="border border-quaternary rounded-[10px] w-full h-12 text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-[#CACACA] mt-3"
              value={viaZipCodeData.logradouro ? viaZipCodeData.logradouro : addressData.streetName}
              style={errors.streetName ? { border: '1px solid red' } : {}}
              onChange={handleStreetChange}
              readOnly
            />
            {errors.streetName && (
              <span className="text-red-500 text-xs">{errors.streetName}</span>
            )}
          </div>
          <div className="flex flex-col md:ml-5 md:w-1/5">
            <label className="text-xl font-normal text-quaternary leading-7 mt-5 md:mt-0">
              Número
            </label>
            <input
              required
              className="border border-quaternary rounded-[10px] md:w-full w-[150px] h-12 text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-3"
              value={viaZipCodeData.numero ? viaZipCodeData.numero : addressData.streetNumber}
              style={errors.streetNumber ? { border: '1px solid red' } : {}}
              onChange={handleNumberChange}
            />
            {errors.streetNumber && (
              <span className="text-red-500 text-xs">{errors.streetNumber}</span>
            )}
          </div>
        </div>
        <div className="lg:flex mt-5 mb-10">
          <div className="flex flex-col md:mr-5 md:w-full">
            <label className="text-xl font-normal text-quaternary leading-7">
              Complemento
            </label>
            <input
              className={`border border-quaternary rounded-[10px] h-12 text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-3`}
              onChange={handleComplementChange}
              value={addressData.complement}
            />
          </div>
          <div className="flex flex-col lg:ml-5 md:w-full mt-5 lg:mt-0">
            <label className="text-xl font-normal text-quaternary leading-7">
              Bairro
            </label>
            <input
              className={`border border-quaternary rounded-[10px] h-12 text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-[#CACACA] mt-3 `}
              value={viaZipCodeData.bairro ? viaZipCodeData.bairro : addressData.neighborhood}
              style={errors.neighborhood ? { border: '1px solid red' } : {}}
              onChange={handleNeighborhoodChange}
              readOnly
            />
            {errors.neighborhood && (
              <span className="text-red-500 text-xs">{errors.neighborhood}</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Address;
