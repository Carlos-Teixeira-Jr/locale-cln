import { useEffect, useState } from 'react';
import Cards, { Focused } from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import MaskedInput from '../../atoms/masks/maskedInput';

interface ICreditCardForm {
  errosCardName: string;
  errorsCardNumber: string;
  errorsExpiry: string;
  errorsCvc: string;
  handleFocusProp: any;
  handleInputProp: any;
}

export default function PaymentForm({
  errosCardName,
  errorsCardNumber,
  errorsExpiry,
  errorsCvc,
  handleFocusProp,
  handleInputProp,
}: ICreditCardForm) {
  const [cvc, setCvc] = useState('');
  const [expiry, setExpiry] = useState('');
  const [focus, setFocus] = useState<Focused | undefined>();
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const handleInputFocus = (e: any) => {
    setFocus(e.target.name as Focused);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    switch (name) {
      case 'number':
        setNumber(value);
        break;
      case 'expiry':
        setExpiry(value);
        break;
      case 'cvc':
        setCvc(value);
        break;
      case 'name':
        setName(value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // atualiza o estado "focus" sempre que algum dos inputs é alterado
    setFocus(focus);
    console.log(focus);
  }, [cvc, expiry, name, number]);

  return (
    <div id="PaymentForm" className="flex flex-col md:flex-row w-full md:mr-5">
      <div className="my-auto">
        <Cards
          cvc={cvc}
          expiry={expiry}
          focused={focus}
          name={name}
          number={number}
        />
      </div>

      <form className="lg:flex flex-col w-full">
        <MaskedInput
          type="tel"
          name="cardNumber"
          placeholder="Número do Cartão"
          onChange={handleInputProp}
          onFocus={handleFocusProp}
          className={`border border-quaternary rounded-[10px] h-[66px] text-quaternary lg:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5 ml-5`}
          style={errorsCardNumber ? { border: '1px solid red' } : {}}
          required
          mask={'cardNumber'}
        />
        {errorsCardNumber && (
          <span className="text-red-500 mt-2 ml-5">{errorsCardNumber}</span>
        )}

        <input
          type="tel"
          name="cardName"
          placeholder="Nome do Cartão"
          onChange={handleInputProp}
          onFocus={handleFocusProp}
          value={name}
          className={`border border-quaternary rounded-[10px] h-[66px] text-quaternary lg:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5 ml-5`}
          style={errosCardName ? { border: '1px solid red' } : {}}
          required
        />
        {errosCardName && (
          <span className="text-red-500 mt-2 ml-5">{errosCardName}</span>
        )}

        <div className="lg:flex">
          <MaskedInput
            type="tel"
            name="expiry"
            placeholder="Válido até..."
            onChange={handleInputProp}
            onFocus={handleFocusProp}
            className={`border border-quaternary rounded-[10px] h-[66px] text-quaternary lg:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5 ml-5`}
            style={errorsExpiry ? { border: '1px solid red' } : {}}
            required
            mask={'expiryDate'}
          />
          {errorsExpiry && (
            <span className="text-red-500 mt-2 ml-5">{errorsExpiry}</span>
          )}

          <MaskedInput
            type="tel"
            name="cvc"
            placeholder="Código de verificação"
            onChange={handleInputProp}
            onFocus={handleFocusProp}
            className={`border border-quaternary rounded-[10px] h-[66px] text-quaternary lg:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5 ml-5`}
            style={errorsCvc ? { border: '1px solid red' } : {}}
            required
            mask={'cvc'}
          />
          {errorsCvc && (
            <span className="text-red-500 mt-2 ml-5">{errorsCvc}</span>
          )}
        </div>
      </form>
    </div>
  );
}
