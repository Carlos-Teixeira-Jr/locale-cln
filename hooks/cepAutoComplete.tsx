import { useState } from 'react';
import MaskedInput from '../components/atoms/masks/maskedInput';

interface ViaCepData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
}

interface IProps {
  handleFindCep?: any;
  className: string;
  cepStyle?: any;
  cityStyle?: any;
  UFStyle?: any;
  streetStyle?: any;
  numberStyle?: any;
  districtStyle?: any;
  streetError?: any;
  UFError?: any;
  cityError?: any;
  cepError?: any;
}

const ViaCep = ({
  handleFindCep,
  className,
  cepStyle,
  cityStyle,
  UFStyle,
  streetStyle,
  numberStyle,
  districtStyle,
  streetError,
  UFError,
  cityError,
  cepError,
}: IProps) => {
  const [cep, setCep] = useState('');
  const [viaCepData, setViaCepData] = useState<ViaCepData>({
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    numero: '',
  });

  const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cep = event.target.value;
    const formattedCep = cep.replace(/-/g, '');
    setCep(formattedCep);
  };

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
      console.log(viaCepData);
    } else {
      alert('Formato de CEP inválido.');
    }
  };

  return (
    <div className="ml-5 mx-5 lg:mx-0">
      <form>
        <div className="my-10">
          <h3 className="md:text-[32px] text-3xl text-quaternary font-semibold  leading-9  my-5">
            Endereço do Imóvel
          </h3>
          <label className="text-[24px] font-normal text-quaternary leading-7">
            CEP
          </label>
          <div className="md:flex grid grid-flow-row">
            <div>
              <MaskedInput
                mask={'cep'}
                className={className}
                type="cep"
                value={cep}
                onChange={handleCepChange}
                onBlur={handleCepBlur}
                maxLength={8}
                style={cepStyle}
                required
                setPropertyValue={undefined}
              />
              {cepError && (
                <span className="text-red-500 mt-2">{cepError}</span>
              )}
            </div>
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
              className="text-secondary text-[24px] font-normal md:mt-8 md:mx-6 md:ml-5 leading-8 mt-10 cursor-pointer"
              onChange={handleFindCep}
              rel="noreferrer"
            >
              Não sei meu CEP
            </a>
          </div>
        </div>
        <div className="md:flex">
          <div className="md:flex flex-col mr-5 md:w-full">
            <label className="text-[24px] font-normal text-quaternary leading-7">
              Cidade
            </label>
            <input
              className="border border-quaternary rounded-[10px] w-full h-[66px] text-quaternary text-[26px] font-bold md:px-5 drop-shadow-lg bg-tertiary mt-5"
              value={viaCepData.localidade}
              style={cityStyle}
              maxLength={15}
              required
            />
            {cityError && (
              <span className="text-red-500 mt-2">{cityError}</span>
            )}
          </div>
          <div className="flex flex-col md:ml-5 mt-5 md:mt-0 md:w-1/5">
            <label className="text-[24px] font-normal text-quaternary leading-7">
              UF
            </label>
            <input
              required
              style={UFStyle}
              maxLength={2}
              className="border border-quaternary rounded-[10px] md:w-full w-[150px] h-[66px] text-quaternary text-[26px] font-bold md:px-5 drop-shadow-lg bg-tertiary mt-5"
              value={viaCepData.uf}
            />
            {UFError && <span className="text-red-500 mt-2">{UFError}</span>}
          </div>
        </div>
        <div className="md:flex mt-10">
          <div className="md:flex flex-col mr-5 md:w-full">
            <label className="text-[24px] font-normal text-quaternary leading-7">
              Logradouro
            </label>
            <input
              required
              className="border border-quaternary rounded-[10px] h-[66px] text-quaternary text-[26px] font-bold md:px-5 drop-shadow-lg bg-tertiary mt-5"
              value={viaCepData.logradouro}
              style={streetStyle}
            />
            {streetError && (
              <span className="text-red-500 mt-2">{streetError}</span>
            )}
          </div>
          <div className="flex flex-col md:ml-5 md:w-1/5">
            <label className="text-[24px] font-normal text-quaternary leading-7 mt-5 md:mt-0">
              Número
            </label>
            <input
              required
              className="border border-quaternary rounded-[10px] md:w-full w-[150px] h-[66px] text-quaternary text-[26px] font-bold md:px-5 drop-shadow-lg bg-tertiary mt-5"
              value={viaCepData.numero}
              style={numberStyle}
            />
          </div>
        </div>
        <div className="md:flex mt-10">
          <div className="flex flex-col md:mr-5 md:w-full">
            <label className="text-[24px] font-normal text-quaternary leading-7">
              Complemento
            </label>
            <input className="border border-quaternary rounded-[10px] h-[66px] text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5" />
          </div>
          <div className="md:flex flex-col lg:ml-5 w-4/5 md:w-full mt-5 md:mt-0">
            <label className="text-[24px] font-normal text-quaternary leading-7">
              Bairro
            </label>
            <input
              className="border border-quaternary rounded-[10px] h-[66px] text-quaternary text-[26px] font-bold md:px-5 drop-shadow-lg bg-tertiary mt-5"
              value={viaCepData.bairro}
              style={districtStyle}
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ViaCep;
