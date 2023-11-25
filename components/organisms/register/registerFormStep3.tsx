import { useRouter } from 'next/router';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Cards, { Focused } from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import Modal from 'react-modal';
import { scroller } from 'react-scroll';
import CheckIcon from '../../atoms/icons/checkIcon';
import MaskedInput from '../../atoms/masks/maskedInput';
import PaymentFailModal from '../../atoms/modals/paymentFailModal';
Modal.setAppElement('#__next');

interface ViaCepData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
}

interface IProps {
  selectedPlanCard: string;
  setSelectedPlanCard?: (selectedPlanCard: string) => void;
}

const RegisterFormStep3: React.FC<IProps> = ({ selectedPlanCard }) => {
  const [_successOnPayment, _setSuccessOnPayment] = useState(true);
  const router = useRouter();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [sameAddresCheckbox, setSameAddressCheckbox] = useState(true);
  const [anotherAddressCheckbox, setAnotherAddressCheckbox] = useState(false);
  const [missingFields, setMissingFields] = useState(false);
  const [cep, setCep] = useState('');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [complement, setComplement] = useState('');
  const [termsAreRead, setTermsAreRead] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    cellPhone: '',
    phone: '',
    plan: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    cpf: '',
    cellPhone: '',
    phone: '',
    plan: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    termsAreRead: '',
  });

  const [cvc, setCvc] = useState('');
  const [expiry, setExpiry] = useState('');
  const [focus, setFocus] = useState<Focused | undefined>();
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardFlag, setCardFlag] = useState('');

  const handleInputFocus = (e: any) => {
    setFocus(e.target.name as Focused);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const unmaskedCardNumber = value.replace(/\./g, '');

    switch (name) {
      case 'cardNumber':
        setCardNumber(unmaskedCardNumber);
        break;
      case 'expiry':
        setExpiry(value);
        break;
      case 'cvc':
        setCvc(value);
        break;
      case 'cardName':
        setCardName(value.replace(/\d/g, ''));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // atualiza o estado "focus" sempre que algum dos inputs é alterado
    setFocus(focus);
  }, [cvc, expiry, cardName, cardNumber]);

  useEffect(() => {
    if (cardNumber.substring(0, 1) === '4') {
      setCardFlag('visa');
    }
    if (cardNumber.substring(0, 1) === '5') {
      setCardFlag('mastercard');
    }
  }, [cardFlag, cardNumber]);

  useEffect(() => {
    if (selectedPlanCard === 'Free') {
      setFormData({ ...formData, plan: 'free' });
    } else if (selectedPlanCard === 'Básico') {
      setFormData({ ...formData, plan: 'basico' });
    } else if (selectedPlanCard === 'Locale Plus') {
      setFormData({ ...formData, plan: 'plus' });
    } else {
      setFormData({ ...formData, plan: '' });
    }
  }, [selectedPlanCard]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const maskedValue = value.replace(/\d/g, '');
    setFormData({ ...formData, name: maskedValue });
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData({ ...formData, email: value });
  };

  const handleCpfChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData({ ...formData, cpf: value });
  };

  const handleCellPhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData({ ...formData, cellPhone: value });
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData({ ...formData, phone: value });
  };

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
    district: '',
  });

  const handleAnotherAddressCheckbox = () => {
    setAnotherAddressCheckbox(!anotherAddressCheckbox);
    setSameAddressCheckbox(!sameAddresCheckbox);
  };

  const handleSameAddressCheckbox = () => {
    setSameAddressCheckbox(!sameAddresCheckbox);
    setAnotherAddressCheckbox(!anotherAddressCheckbox);
  };

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
    } else {
      alert('Formato de CEP inválido.');
    }
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const city = event.target.value;
    const formattedCity = city.replace(/-/g, '');
    const cityMask = formattedCity.replace(/\d/g, '');
    setCity(cityMask);
  };

  const handleUFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uf = event.target.value;
    const formattedUF = uf.replace(/-/g, '');
    setUf(formattedUF);
  };

  const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const street = event.target.value;
    const formattedStreet = street.replace(/-/g, '');
    setStreet(formattedStreet);
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const number = event.target.value;
    const formattedNumber = number.replace(/-/g, '');
    const numberMask = formattedNumber.replace(/\D/g, '');
    setNumber(numberMask);
  };

  const handleDistrictChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const district = event.target.value;
    const formattedDistrict = district.replace(/-/g, '');
    setDistrict(formattedDistrict);
  };

  const handleComplementChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const complement = event.target.value;
    const formattedComplement = complement.replace(/-/g, '');
    setComplement(formattedComplement);
  };

  const handleReadTermsClick = () => {
    setTermsAreRead(!termsAreRead);
  };

  const scrollToElement = (element: string) => {
    scroller.scrollTo(element, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -50,
    });
  };

  const handleContinueBtn = async () => {
    const submitFormData = {
      cep: cep,
      uf: viaCepData.uf ? viaCepData.uf : uf,
      number: number,
      city: viaCepData.localidade ? viaCepData.localidade : city,
      street: viaCepData.logradouro ? viaCepData.logradouro : street,
      district: viaCepData.bairro ? viaCepData.bairro : district,
      name: formData.name,
      email: formData.email,
      cpf: formData.cpf,
      cellPhone: formData.cellPhone,
      phone: formData.phone,
      plan: formData.plan,
      cvc: cvc,
      expiry: expiry,
      cardName: cardName,
      cardNumber: cardNumber,
      termsAreRead: termsAreRead,
      cardFlag: cardFlag,
    };

    const newErrors = {
      name: '',
      email: '',
      cpf: '',
      cellPhone: '',
      phone: '',
      plan: '',
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
      termsAreRead: '',
    };

    const newViaCepErrors = {
      cep: '',
      uf: '',
      number: '',
      city: '',
      street: '',
      district: '',
    };

    let firstError = null;

    if (sameAddresCheckbox) {
      if (!submitFormData.name) {
        newErrors.name = 'O campo nome é obrigatório.';
        if (!firstError) firstError = 'name';
      }
      if (!submitFormData.email) {
        newErrors.email = 'O campo email é obrigatório.';
        if (!firstError) firstError = 'email';
      }
      if (!submitFormData.cpf) {
        newErrors.cpf = 'O campo cpf está incompleto.';
        if (!firstError) firstError = 'cpf';
      }
      if (!submitFormData.cellPhone) {
        newErrors.cellPhone = 'O campo celular é obrigatório.';
        if (!firstError) firstError = 'cell-phone';
      }
      if (submitFormData.plan === '') {
        newErrors.plan = 'O campo plano é obrigatório.';
        if (!firstError) firstError = 'plan';
      }
      if (submitFormData.cardName === '') {
        newErrors.cardName = 'O nome do cartão é obrigatório.';
        if (!firstError) firstError = 'card-name';
      }
      if (submitFormData.cardNumber === '') {
        newErrors.cardNumber = 'O número do cartão é obrigatório.';
        if (!firstError) firstError = 'card-number';
      }
      if (submitFormData.expiry === '') {
        newErrors.expiry = 'A data de válidade do cartão é obrigatório.';
        if (!firstError) firstError = 'expiry';
      }
      if (submitFormData.cvc === '') {
        newErrors.cvc = 'O código de verificação do cartão é obrigatório.';
        if (!firstError) firstError = 'cvc';
      }
      if (submitFormData.termsAreRead === false) {
        newErrors.termsAreRead =
          'Você precisa ler os termos de contrato para avançar.';
        //if(!firstError) firstError = "terms";
      }
      setErrors(newErrors);
    } else {
      if (!submitFormData.name) {
        newErrors.name = 'O campo nome é obrigatório.';
        if (!firstError) firstError = 'name';
      }
      if (!submitFormData.email) {
        newErrors.email = 'O campo email é obrigatório.';
        if (!firstError) firstError = 'email';
      }
      if (!submitFormData.cpf) {
        newErrors.cpf = 'O campo cpf está incompleto.';
        if (!firstError) firstError = 'cpf';
      }
      if (!submitFormData.cellPhone) {
        newErrors.cellPhone = 'O campo celular é obrigatório.';
        if (!firstError) firstError = 'cell-phone';
      }
      if (submitFormData.plan === '') {
        newErrors.plan = 'O campo plano é obrigatório.';
        if (!firstError) firstError = 'plan';
      }
      if (submitFormData.cardName === '') {
        newErrors.cardName = 'O nome do cartão é obrigatório.';
        if (!firstError) firstError = 'card-name';
      }
      if (submitFormData.cardNumber === '') {
        newErrors.cardNumber = 'O número do cartão é obrigatório.';
        if (!firstError) firstError = 'card-number';
      }
      if (submitFormData.expiry === '') {
        newErrors.expiry = 'A data de válidade do cartão é obrigatório.';
        if (!firstError) firstError = 'expiry';
      }
      if (submitFormData.cvc === '') {
        newErrors.cvc = 'O código de verificação do cartão é obrigatório.';
        if (!firstError) firstError = 'cvc';
      }
      if (submitFormData.termsAreRead === false) {
        newErrors.termsAreRead =
          'Você precisa ler os termos de contrato para avançar.';
        //if(!firstError) firstError = "terms";
      }
      setErrors(newErrors);

      if (!submitFormData.cep) {
        newViaCepErrors.cep = 'O campo cep é obrigatório.';
        if (!firstError) firstError = 'cep';
      }
      if (!submitFormData.uf) {
        newViaCepErrors.uf = 'O campo UF é obrigatório';
        if (!firstError) firstError = 'uf';
      }
      if (!submitFormData.number) {
        newViaCepErrors.number = 'O compao número é obrigatório';
        if (!firstError) firstError = 'number';
      }
      if (!submitFormData.city) {
        newViaCepErrors.city = 'O campo cidade é obrigatório.';
        if (!firstError) firstError = 'city';
      }
      if (!submitFormData.street) {
        newViaCepErrors.street = 'O campo logradouro é obrigatório.';
        if (!firstError) firstError = 'street';
      }
      if (!submitFormData.district) {
        newViaCepErrors.district = 'O campo bairro é obrigatório.';
        if (!firstError) firstError = 'district';
      }
      setViaCepErrors(newViaCepErrors);
    }

    if (firstError) {
      scrollToElement(firstError);
    }

    // try {
    //   const paymentData = {
    //     cardNumber: cardNumber,
    //     cardName: cardName,
    //     expiry: expiry,
    //     cvc: cvc
    //   };

    //   const response = await fetch('/endpoint-da-api-que-recebe-os-dados-do-pagamento', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(paymentData)
    //   });

    //   if (response.ok) {
    //     console.log('Pagamento efetuado com sucesso!');
    //   } else {
    //     setModalIsOpen(true);
    //   }
    // } catch (error) {
    //   console.error('Ocorreu um erro ao enviar os dados do pagamento:', error);
    //   setModalIsOpen(true);
    // }

    if (
      !newErrors.name &&
      !newErrors.email &&
      !newErrors.cpf &&
      !newErrors.cellPhone &&
      !newErrors.plan &&
      !newErrors.termsAreRead &&
      (sameAddresCheckbox ||
        (!newViaCepErrors.cep &&
          !newViaCepErrors.city &&
          !newViaCepErrors.street &&
          !newViaCepErrors.district)) &&
      (selectedPlanCard == 'free' ||
        (!newErrors.cardName &&
          !newErrors.cardNumber &&
          !newErrors.expiry &&
          !newErrors.cvc))
    ) {
      router.push(
        `/register-step-3-5?cardFlag=${cardFlag ? cardFlag : ''}&plan=${
          formData.plan ? formData.plan : ''
        }`
      );
    } else {
      setMissingFields(true);
      setModalIsOpen(true);
    }
  };

  return (
    <div className="my-10 mx-2 lg:mx-0">
      <h1 className="md:text-4xl text-2xl leading-10 text-quaternary font-bold mb-10">
        Informações sobre o contato
      </h1>
      <div className="my-5">
        <div className="my-5">
          <h3 className="text-2xl text-quaternary font-bold leading-7">
            Nome Completo
          </h3>
          <input
            className="border lg:w-3/4 w-full p-5 h-[66px] my-5 border-quaternary rounded-[10px] bg-tertiary font-bold text-2xl text-quaternary leading-7 drop-shadow-xl flex"
            onChange={handleNameChange}
            id="name"
            value={formData.name}
            style={errors.name ? { border: '1px solid red' } : {}}
            required
          />
          {errors.name && (
            <span className="text-red-500 mt-2">{errors.name}</span>
          )}
        </div>
        <div className="my-5 lg:flex w-full">
          <div>
            <h3 className="text-2xl text-quaternary font-bold leading-7">
              E-mail
            </h3>
            <input
              className="border lg:w-[900px] p-5 w-full h-[66px] my-5 border-quaternary rounded-[10px] bg-tertiary font-bold text-2xl text-quaternary leading-7 drop-shadow-xl flex"
              onChange={handleEmailChange}
              type="e-mail"
              id="email"
              style={errors.email ? { border: '1px solid red' } : {}}
              required
            />
            {errors.email && (
              <span className="text-red-500 mt-2">{errors.email}</span>
            )}
          </div>
          <div className="lg:ml-10">
            <h3 className="text-2xl text-quaternary font-bold leading-7">
              CPF
            </h3>
            <MaskedInput
              className="border p-5 h-[66px] w-full my-5 border-quaternary rounded-[10px] bg-tertiary font-bold text-2xl text-quaternary leading-7 drop-shadow-xl"
              onChange={handleCpfChange}
              id="cpf"
              style={errors.cpf ? { border: '1px solid red' } : {}}
              required
              mask={'cpf'}
            />
            {errors.cpf && (
              <span className="text-red-500 mt-2">{errors.cpf}</span>
            )}
          </div>
        </div>
        <div className="my-5 lg:flex justify-between">
          <div className="flex flex-col w-full">
            <h3 className="text-2xl text-quaternary font-bold leading-7">
              Celular
            </h3>
            <MaskedInput
              className="border p-5 h-[66px] my-5 border-quaternary rounded-[10px] bg-tertiary font-bold text-2xl text-quaternary leading-7 drop-shadow-xl lg:mr-5"
              onChange={handleCellPhoneChange}
              id="cell-phone"
              style={errors.cellPhone ? { border: '1px solid red' } : {}}
              required
              mask={'cellPhone'}
            />
            {errors.cellPhone && (
              <span className="text-red-500 mt-2">{errors.cellPhone}</span>
            )}
          </div>
          <div className="flex flex-col w-full">
            <h3 className="text-2xl text-quaternary font-bold leading-7">
              Telefone
            </h3>
            <MaskedInput
              className="border p-5 h-[66px] my-5 border-quaternary rounded-[10px] bg-tertiary font-bold text-2xl text-quaternary leading-7 drop-shadow-xl lg:ml-5"
              onChange={handlePhoneChange}
              mask={'phone'}
            />
          </div>
        </div>
      </div>
      <div>
        <h2 className="md:text-4xl text-3xl leading-10 text-quaternary font-bold mb-10">
          Endereço de cobrança
        </h2>
        <div className="lg:flex">
          <div className="flex lg:w-3/6 my-5 lg:my-0">
            <div
              className={`w-[40px] h-[40px] shrink-0 rounded-full bg-tertiary drop-shadow-lg mr-5 flex justify-center cursor-pointer ${
                sameAddresCheckbox
                  ? 'border-[3px] border-secondary'
                  : 'border border-quaternary'
              }`}
              onClick={handleSameAddressCheckbox}
            >
              {sameAddresCheckbox && (
                <div className="bg-secondary w-[20px] h-[20px] rounded-full mt-[6.5px]  ml-[1.5px]"></div>
              )}
            </div>
            <p className="text-2xl text-quaternary font-bold leading-7 my-auto">
              Usar o mesmo endereço do imóvel
            </p>
          </div>
          <div className="flex">
            <div
              className={`w-[40px] h-[40px] shrink-0 rounded-full bg-tertiary drop-shadow-lg mr-5 flex justify-center cursor-pointer ${
                anotherAddressCheckbox
                  ? 'border-[3px] border-secondary'
                  : 'border border-quaternary'
              }`}
              onClick={handleAnotherAddressCheckbox}
            >
              {anotherAddressCheckbox && (
                <div className="bg-secondary w-[20px] h-[20px] rounded-full mt-[6.5px]  ml-[1.5px]"></div>
              )}
            </div>
            <p className="text-2xl text-quaternary font-bold leading-7 my-auto">
              Usar outro endereço
            </p>
          </div>
        </div>
      </div>

      {sameAddresCheckbox && (
        <div className="my-10 lg:w-1/2">
          <div className="border border-quaternary bg-tertiary p-5">
            <p className="text-2xl font-normal leading-7 text-quaternary mb-1">
              Rua Cavalcanti, 45
            </p>
            <p className="text-2xl font-normal leading-7 text-quaternary mb-1">
              Raboleiro
            </p>
            <p className="text-2xl font-normal leading-7 text-quaternary mb-1">
              Iguatu - Ceara
            </p>
            <p className="text-2xl font-normal leading-7 text-quaternary">
              CEP 63500-255
            </p>
          </div>
        </div>
      )}

      {anotherAddressCheckbox && (
        <div className="ml-5 mx-5 md:mx-0">
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
                    className="border border-quaternary rounded-[10px] h-[66px] sm:w-1/3 md:w-full text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                    type="cep"
                    id="cep"
                    value={cep}
                    onChange={handleCepChange}
                    onBlur={handleCepBlur}
                    maxLength={8}
                    style={viaCepErrors.cep ? { border: '1px solid red' } : {}}
                    required
                  />
                  {viaCepErrors.cep && (
                    <span className="text-red-500 mt-2">
                      {viaCepErrors.cep}
                    </span>
                  )}
                </div>
                <a
                  href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                  target="_blank"
                  className="text-secondary text-[24px] font-normal md:mt-8 md:mx-6 md:ml-5 leading-8 mt-10 cursor-pointer"
                  rel="noreferrer"
                >
                  Não sei meu CEP
                </a>
              </div>
            </div>
            <div className="md:flex">
              <div className="md:flex flex-col mr-5 md:w-4/5">
                <label className="text-[24px] font-normal text-quaternary leading-7">
                  Cidade
                </label>
                <input
                  className="border border-quaternary rounded-[10px] w-full h-[66px] text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                  value={viaCepData.localidade ? viaCepData.localidade : city}
                  style={viaCepErrors.city ? { border: '1px solid red' } : {}}
                  onChange={handleCityChange}
                  id="city"
                  required
                />
                {viaCepErrors.city && (
                  <span className="text-red-500 mt-2">{viaCepErrors.city}</span>
                )}
              </div>
              <div className="flex flex-col md:ml-5 mt-5 md:mt-0 md:w-1/5">
                <label className="text-[24px] font-normal text-quaternary leading-7">
                  UF
                </label>
                <MaskedInput
                  required
                  style={viaCepErrors.uf ? { border: '1px solid red' } : {}}
                  className="border border-quaternary rounded-[10px] md:w-full w-[150px] h-[66px] text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                  value={viaCepData.uf ? viaCepData.uf : uf}
                  onChange={handleUFChange}
                  id="uf"
                  mask={'uf'}
                />
                {viaCepErrors.uf && (
                  <span className="text-red-500 mt-2">{viaCepErrors.uf}</span>
                )}
              </div>
            </div>
            <div className="md:flex mt-10">
              <div className="md:flex flex-col mr-5 md:w-4/5">
                <label className="text-[24px] font-normal text-quaternary leading-7">
                  Logradouro
                </label>
                <input
                  required
                  className="border border-quaternary rounded-[10px] w-full h-[66px] text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                  value={viaCepData.logradouro ? viaCepData.logradouro : street}
                  style={viaCepErrors.street ? { border: '1px solid red' } : {}}
                  id="street"
                  onChange={handleStreetChange}
                />
                {viaCepErrors.street && (
                  <span className="text-red-500 mt-2">
                    {viaCepErrors.street}
                  </span>
                )}
              </div>
              <div className="flex flex-col md:ml-5 md:w-1/5">
                <label className="text-[24px] font-normal text-quaternary leading-7 mt-5 md:mt-0">
                  Número
                </label>
                <input
                  required
                  className="border border-quaternary rounded-[10px] md:w-full w-[150px] h-[66px] text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                  value={viaCepData.numero ? viaCepData.numero : number}
                  style={viaCepErrors.number ? { border: '1px solid red' } : {}}
                  id="number"
                  onChange={handleNumberChange}
                />
                {viaCepErrors.number && (
                  <span className="text-red-500 mt-2">
                    {viaCepErrors.number}
                  </span>
                )}
              </div>
            </div>
            <div className="lg:flex mt-10 mb-10">
              <div className="flex flex-col md:mr-5 md:w-full">
                <label className="text-[24px] font-normal text-quaternary leading-7">
                  Complemento
                </label>
                <input
                  className="border border-quaternary rounded-[10px] h-[66px] text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                  onChange={handleComplementChange}
                  value={complement}
                />
              </div>
              <div className="flex flex-col lg:ml-5 md:w-full mt-5 lg:mt-0">
                <label className="text-[24px] font-normal text-quaternary leading-7">
                  Bairro
                </label>
                <input
                  className="border border-quaternary rounded-[10px] h-[66px] text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                  value={viaCepData.bairro ? viaCepData.bairro : district}
                  style={
                    viaCepErrors.district ? { border: '1px solid red' } : {}
                  }
                  onChange={handleDistrictChange}
                  id="district"
                  required
                />
                {viaCepErrors.district && (
                  <span className="text-red-500 mt-2">
                    {viaCepErrors.district}
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>
      )}

      {selectedPlanCard != 'free' && (
        <div className="my-16">
          <h2 className="md:text-4xl text-3xl leading-10 text-quaternary font-bold mb-10 ml-5 md:ml-0">
            Forma de Pagamento
          </h2>
          <div className="flex">
            <div className="flex justify-start w-full">
              <div className="flex flex-col md:flex-row md:w-full md:mr-5 mx-auto">
                <div className="my-auto">
                  <Cards
                    cvc={cvc}
                    expiry={expiry}
                    focused={focus}
                    name={cardName}
                    number={cardNumber}
                  />
                </div>

                <form className="lg:flex flex-col w-full">
                  <div className="flex flex-col lg:mx-0 mx-auto">
                    <MaskedInput
                      type="tel"
                      name="cardNumber"
                      placeholder="Número do Cartão"
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      className={`border border-quaternary rounded-[10px] h-[66px] text-quaternary lg:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5 md:ml-5 mx-auto`}
                      style={
                        errors.cardNumber ? { border: '1px solid red' } : {}
                      }
                      required
                      id="card-number"
                      mask={'cardNumber'}
                    />
                    {errors.cardNumber && (
                      <span className="text-red-500 mt-2 ml-5">
                        {errors.cardNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <input
                      type="tel"
                      name="cardName"
                      placeholder="Nome do Cartão"
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      value={cardName}
                      className={`border border-quaternary rounded-[10px] h-[66px] text-quaternary lg:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5 md:ml-5`}
                      id="card-name"
                      style={errors.cardName ? { border: '1px solid red' } : {}}
                      required
                    />
                    {errors.cardName && (
                      <span className="text-red-500 mt-2 ml-5">
                        {errors.cardName}
                      </span>
                    )}
                  </div>

                  <div className="lg:flex">
                    <div className="flex flex-col">
                      <MaskedInput
                        type="tel"
                        name="expiry"
                        placeholder="Válido até..."
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        className={`border border-quaternary rounded-[10px] h-[66px] text-quaternary lg:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5 md:ml-5`}
                        style={errors.expiry ? { border: '1px solid red' } : {}}
                        id="expiry"
                        required
                        mask={'expiryDate'}
                      />
                      {errors.expiry && (
                        <span className="text-red-500 mt-2 ml-5">
                          {errors.expiry}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <MaskedInput
                        type="tel"
                        name="cvc"
                        placeholder="Código de verificação"
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        className={`border border-quaternary rounded-[10px] h-[66px] text-quaternary lg:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5 md:ml-5`}
                        style={errors.cvc ? { border: '1px solid red' } : {}}
                        required
                        id="cvc"
                        mask={'cvc'}
                      />
                      {errors.cvc && (
                        <span className="text-red-500 mt-2 ml-5">
                          {errors.cvc}
                        </span>
                      )}
                    </div>
                    {modalIsOpen && (
                      <PaymentFailModal
                        isOpen={modalIsOpen}
                        setModalIsOpen={setModalIsOpen}
                        paymentError="Ocorreu um erro ao efetuar o pagamento."
                      />
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="mt-10 bg-tertiary border border-quaternary md:p-16 p-5 flex flex-col"
        style={errors.plan ? { border: '1px solid red' } : {}}
      >
        <div className="flex justify-between mb-10">
          <p className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
            Plano Selecionado:
          </p>
          {selectedPlanCard === 'free' ? (
            <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
              Plano Free
            </span>
          ) : selectedPlanCard === 'basico' ? (
            <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
              Plano Básico
            </span>
          ) : selectedPlanCard === 'plus' ? (
            <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
              Plano Locale PLUS
            </span>
          ) : (
            <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
              ---
            </span>
          )}
        </div>
        <div className="flex justify-between mb-10">
          <p className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
            Valor do Plano:
          </p>
          {selectedPlanCard === 'free' ? (
            <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
              R$ 0,00
            </span>
          ) : selectedPlanCard === 'basico' ? (
            <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
              R$ 20,00
            </span>
          ) : selectedPlanCard === 'plus' ? (
            <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
              R$ 50,00
            </span>
          ) : (
            <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
              ---
            </span>
          )}
        </div>
        <hr className="border-b border-quaternary mb-10" />
        <div className="flex justify-between">
          <p className="text-2xl font-semibold leading-7 text-quaternary">
            Valor Total:
          </p>
          {selectedPlanCard === 'free' ? (
            <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
              R$ 0,00
            </span>
          ) : selectedPlanCard === 'basico' ? (
            <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
              R$ 20,00
            </span>
          ) : selectedPlanCard === 'plus' ? (
            <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
              R$ 50,00
            </span>
          ) : (
            <span className="md:text-2xl text-xl font-semibold leading-7 text-quaternary">
              ---
            </span>
          )}
        </div>
      </div>
      {errors.plan && <span className="text-red-500 mt-2">{errors.plan}</span>}
      <div className="lg:flex justify-between md:my-16">
        <div className="flex lg:w-1/2 mr-10 my-auto">
          <div
            className="w-[40px] h-[40px] shrink-0 border border-quaternary bg-tertiary rounded-[10px] drop-shadow-lg my-auto cursor-pointer"
            onClick={handleReadTermsClick}
            style={errors.termsAreRead ? { border: '1px solid red' } : {}}
          >
            {termsAreRead && (
              <CheckIcon fill="#F5BF5D" viewBox="100 180 960 960" />
            )}
          </div>
          <div className="flex flex-col">
            <p
              className="mx-5 md:text-2xl font-normal leading-7 my-auto"
              style={errors.termsAreRead ? { color: 'red' } : {}}
              id="terms"
            >
              Li e concordo com os termos descritos no contrato e políticas de
              qualidade.{' '}
              <a className="text-secondary cursor-pointer">
                Ler contrato referente ao plano
              </a>
            </p>
            {errors.termsAreRead && (
              <span className="text-red-500 mt-2 ml-5">
                {errors.termsAreRead}
              </span>
            )}
          </div>
        </div>
        <div className="my-16 lg:my-0 flex flex-col">
          <button
            className="bg-primary rounded-[10px] text-tertiary md:w-[470px] w-full h-[87px] p-auto text-4xl font-extrabold"
            onClick={handleContinueBtn}
          >
            Continuar
          </button>
          {missingFields && (
            <span className="text-red-500 mt-2">
              Você precisa preencher todos os campos obrigatórios para avançar.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterFormStep3;
