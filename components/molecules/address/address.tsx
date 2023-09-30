import { useEffect, useState } from 'react';
import MaskedInput from '../../atoms/masks/maskedInput';
import { IAddress } from '../../../common/interfaces/propertyData';

interface ViaCepData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
}

export interface IAddressComponent {
  editar: boolean;
  editarCep: string;
  editarCity: string;
  editarUf: string;
  editarStreet: string;
  editarNumber: string;
  editarNeighborhood: string;
  editarComplement: string;
  onAddressUpdate: (updatedAddress: IAddress) => void;
}

const Address: React.FC<IAddressComponent> = ({
  editar,
  editarCep,
  editarCity,
  editarUf,
  editarStreet,
  editarNumber,
  editarNeighborhood,
  editarComplement,
  onAddressUpdate
}: IAddressComponent) => {

  const [cep, setCep] = useState(editarCep || '');
  const [city, setCity] = useState(editarCity || '');
  const [uf, setUf] = useState(editarUf || '');
  const [street, setStreet] = useState(editarStreet || '');
  const [number, setNumber] = useState(editarNumber || '');
  const [neighborhood, setNeighborhood] = useState(editarNeighborhood || '');
  const [complement, setComplement] = useState(editarComplement || '');
  const [updatedAddress, setUpdatedAddress] = useState<IAddress>({
    zipCode: cep,
    city: city,
    streetName: street,
    number: number,
    complement: complement,
    neighborhood: neighborhood,
    uf: uf
  });

  const [errors, setErrors] = useState({
    cep: '',
    uf: '',
    number: '',
    city: '',
    street: '',
    neighborhood: '',
  });
  const [viaCepData, setViaCepData] = useState<ViaCepData>({
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    numero: '',
  });

  const [viaCepErrors, setViaCepErrors] = useState({
    cep: '',
    uf: '',
    number: '',
    city: '',
    street: '',
    neighborhood: '',
  });

  useEffect(() => {
    onAddressUpdate(updatedAddress)
  }, [updatedAddress])

  const handleCepBlur = () => {
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.erro) {
            setViaCepData(data);
          } else {
            alert('CEP não encontrado.');
          }
        })
        .catch((error) => console.error(error));
    } else {
      alert('Formato de CEP inválido.');
    }
  };

  const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cep = event.target.value;
    const formattedCep = cep.replace(/-/g, '');
    setCep(formattedCep);
    setUpdatedAddress({...updatedAddress, zipCode: formattedCep});
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const city = event.target.value;
    const formattedCity = city.replace(/-/g, '');
    const cityMask = formattedCity.replace(/\d/g, '');
    setCity(cityMask);
    setUpdatedAddress({...updatedAddress, city: cityMask});
  };

  const handleUFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uf = event.target.value;
    const formattedUF = uf.replace(/-/g, '');
    setUf(formattedUF);
    setUpdatedAddress({...updatedAddress, uf: formattedUF});
  };

  const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const street = event.target.value;
    const formattedStreet = street.replace(/-/g, '');
    setStreet(formattedStreet);
    setUpdatedAddress({...updatedAddress, streetName: formattedStreet});
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const number = event.target.value;
    const formattedNumber = number.replace(/-/g, '');
    const numberMask = formattedNumber.replace(/\D/g, '');
    setNumber(numberMask);
    setUpdatedAddress({...updatedAddress, number: numberMask});
  };

  const handleNeighborhoodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const neighborhood = event.target.value;
    const formattedNeighborhood = neighborhood.replace(/-/g, '');
    setNeighborhood(formattedNeighborhood);
    setUpdatedAddress({...updatedAddress, neighborhood: formattedNeighborhood});
  };

  const handleComplementChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const complement = event.target.value;
    const formattedComplement = complement.replace(/-/g, '');
    setComplement(formattedComplement);
    setUpdatedAddress({...updatedAddress, complement: formattedComplement});
  };

  // const handleContinueBtn = async () => {
  //   const submitFormData = {
  //     cep: cep,
  //     uf: viaCepData.uf ? viaCepData.uf : uf,
  //     number: number,
  //     city: viaCepData.localidade ? viaCepData.localidade : city,
  //     street: viaCepData.logradouro ? viaCepData.logradouro : street,
  //     neighborhood: viaCepData.bairro ? viaCepData.bairro : neighborhood,
  //     name: formData.name,
  //     email: formData.email,
  //     cpf: formData.cpf,
  //     cellPhone: formData.cellPhone,
  //     phone: formData.phone,
  //     plan: formData.plan,
  //     cvc: cvc,
  //     expiry: expiry,
  //     cardName: cardName,
  //     cardNumber: cardNumber,
  //     termsAreRead: termsAreRead
  //   };

  //   const newErrors = {
  //     cep: '',
  //     uf: '',
  //     number: '',
  //     city: '',
  //     street: '',
  //     neighborhood: '',
  //     name: '',
  //     email: '',
  //     cpf: '',
  //     cellPhone: '',
  //     phone: '',
  //     plan: '',
  //     cardName: '',
  //     cardNumber: '',
  //     expiry: '',
  //     cvc: '',
  //     termsAreRead: ''
  //   };

  //   if (!submitFormData.cep) {
  //     newErrors.cep = 'O campo cep é obrigatório.';
  //   }
  //   if(!submitFormData.uf){
  //     newErrors.uf = 'O campo UF é obrigatório';
  //   }
  //   if(!submitFormData.number){
  //     newErrors.number = 'O compao número é obrigatório';
  //   }
  //   if (!submitFormData.city) {
  //     newErrors.city = 'O campo cidade é obrigatório.';
  //   }
  //   if (!submitFormData.street) {
  //     newErrors.street = 'O campo logradouro está incompleto.';
  //   }
  //   if (!submitFormData.neighborhood) {
  //     newErrors.neighborhood = 'O campo bairro é obrigatório.';
  //   }

  return (
    <div className="ml-5 mx-5 md:mx-0">
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
              <MaskedInput
                mask={'cep'}
                className="border border-quaternary rounded-[10px] h-12 sm:w-1/3 md:w-full text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-3"
                type="cep"
                value={cep}
                onChange={handleCepChange}
                onBlur={handleCepBlur}
                maxLength={8}
                style={errors.cep ? { border: '1px solid red' } : {}}
                required
              />
              {errors.cep && (
                <span className="text-red-500 mt-2">{errors.cep}</span>
              )}
            </div>
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
              className="text-secondary text-xl font-normal md:mt-8 md:mx-6 md:ml-5 leading-8 mt-5 cursor-pointer"
              rel="noreferrer"
            >
              Não sei meu CEP
            </a>
          </div>
        </div>
        <div className="md:flex">
          <div className="md:flex flex-col mr-5 md:w-4/5">
            <label className="text-xl font-normal text-quaternary leading-7">
              Cidade
            </label>
            <input
              className="border border-quaternary rounded-[10px] w-full h-12 text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-3"
              value={viaCepData.localidade ? viaCepData.localidade : city}
              style={errors.city ? { border: '1px solid red' } : {}}
              onChange={handleCityChange}
              required
            />
            {errors.city && (
              <span className="text-red-500 mt-2">{errors.city}</span>
            )}
          </div>
          <div className="flex flex-col md:ml-5 mt-5 md:mt-0 md:w-1/5">
            <label className="text-xl font-normal text-quaternary leading-7">
              UF
            </label>
            <MaskedInput
              required
              style={errors.uf ? { border: '1px solid red' } : {}}
              className="border border-quaternary rounded-[10px] md:w-full w-[150px] h-12 text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-3"
              value={viaCepData.uf ? viaCepData.uf : uf}
              onChange={handleUFChange}
              mask={'uf'}
            />
            {errors.uf && (
              <span className="text-red-500 mt-2">{errors.uf}</span>
            )}
          </div>
        </div>
        <div className="md:flex mt-5">
          <div className="md:flex flex-col mr-5 md:w-4/5">
            <label className="text-xl font-normal text-quaternary leading-7">
              Logradouro
            </label>
            <input
              required
              className="border border-quaternary rounded-[10px] w-full h-12 text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-3"
              value={viaCepData.logradouro ? viaCepData.logradouro : street}
              style={errors.street ? { border: '1px solid red' } : {}}
              onChange={handleStreetChange}
            />
            {errors.street && (
              <span className="text-red-500 mt-2">{errors.street}</span>
            )}
          </div>
          <div className="flex flex-col md:ml-5 md:w-1/5">
            <label className="text-xl font-normal text-quaternary leading-7 mt-5 md:mt-0">
              Número
            </label>
            <input
              required
              className="border border-quaternary rounded-[10px] md:w-full w-[150px] h-12 text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-3"
              value={viaCepData.numero ? viaCepData.numero : number}
              style={errors.number ? { border: '1px solid red' } : {}}
              onChange={handleNumberChange}
            />
            {errors.number && (
              <span className="text-red-500 mt-2">{errors.number}</span>
            )}
          </div>
        </div>
        <div className="lg:flex mt-5 mb-10">
          <div className="flex flex-col md:mr-5 md:w-full">
            <label className="text-xl font-normal text-quaternary leading-7">
              Complemento
            </label>
            <input
              className="border border-quaternary rounded-[10px] h-12 text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-3"
              onChange={handleComplementChange}
              value={complement}
            />
          </div>
          <div className="flex flex-col lg:ml-5 md:w-full mt-5 lg:mt-0">
            <label className="text-xl font-normal text-quaternary leading-7">
              Bairro
            </label>
            <input
              className="border border-quaternary rounded-[10px] h-12 text-quaternary md:text-2xl text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-3"
              value={viaCepData.bairro ? viaCepData.bairro : neighborhood}
              style={errors.neighborhood ? { border: '1px solid red' } : {}}
              onChange={handleNeighborhoodChange}
              required
            />
            {errors.neighborhood && (
              <span className="text-red-500 mt-2">{errors.neighborhood}</span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Address;
