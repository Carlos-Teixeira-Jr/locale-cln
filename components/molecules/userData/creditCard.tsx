import { ChangeEvent, useEffect, useState } from "react";
import Cards, { Focused } from 'react-credit-cards';
import { applyNumericMask } from "../../../common/utils/masks/numericMask";
import { toast } from "react-toastify";
import 'react-credit-cards/es/styles-compiled.css';
import { ICreditCardInfo } from "../../../common/interfaces/owner/owner";
import { cardNumber } from "../../atoms/masks/masksCalculatorModal";

export type CreditCardForm = {
  cardName: string;
  cardNumber: string;
  cvc: string;
  expiry: string;
  [key: string]: string;
};

interface ICreditCard {
  isEdit: boolean
  onCreditCardUpdate?: (creditCard: CreditCardForm) => void
  error: any
  creditCardInputRefs?: any
  creditCardInfo?: ICreditCardInfo
}

const CreditCard = ({
  isEdit,
  onCreditCardUpdate,
  error,
  creditCardInputRefs,
  creditCardInfo
}: ICreditCard) => {

  const creditCardErrorScroll = {
    ...creditCardInputRefs
  }

  const [focus, setFocus] = useState<Focused | undefined>();
  const actualCreditCardNumber = creditCardInfo ? `---- ---- ---- ${creditCardInfo?.creditCardNumber}` : '';
  const [creditCardFormData, setCreditCardFormData] = useState<CreditCardForm>({
    cardName: '',
    cardNumber: creditCardInfo ? actualCreditCardNumber : '',
    cvc: '',
    expiry: '',
  });

  const [errors, setErrors] = useState<CreditCardForm>({
    cardName: '',
    cardNumber: '',
    cvc: '',
    expiry: '',
  });

  // Envia os dados do usuário para o componente pai;
  useEffect(() => {
    if (onCreditCardUpdate) {
      onCreditCardUpdate(creditCardFormData);
    }
  }, [creditCardFormData]);

  useEffect(() => {
    setErrors(error);
  }, [error]);

  // Realiza o auto-scroll para o input que apresenta erro;
  useEffect(() => {
    const scrollToError = (errorKey: keyof typeof errors) => {
      if (errors[errorKey] !== '' && creditCardInputRefs[errorKey]?.current) {
        creditCardErrorScroll[errorKey]?.current.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    };
  
    scrollToError('cardName');
    scrollToError('cardNumber');
    scrollToError('expiry');
    scrollToError('cvc');
  }, [errors]);
  

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: keyof CreditCardForm
  ) => {
    const value = e.target.value;
    if (fieldName === 'cardName') {
      const maskedValue = value.replace(/\d/g, '');
      setCreditCardFormData({ ...creditCardFormData, [fieldName]: maskedValue.toUpperCase() });
    } else if (fieldName === 'cardNumber') {
      const maskedValue = applyNumericMask(value, '9999999999999999');
      setCreditCardFormData({ ...creditCardFormData, [fieldName]: maskedValue });
    } else if (fieldName === 'cvc') {
      const maskedValue = value.replace(/\s/g, '').toUpperCase().slice(0, 4);
      setCreditCardFormData({ ...creditCardFormData, [fieldName]: maskedValue });
    }else {
      setCreditCardFormData({ ...creditCardFormData, [fieldName]: value });
    }
  };

  const inputs = [
    {
      key: 'cardNumber',
      ref: creditCardErrorScroll.cardNumber,
      name: 'cardNumber',
      type: 'string',
      label: 'Número do Cartão',
      value: creditCardFormData.cardNumber,
    },
    {
      key: 'cardName',
      ref: creditCardErrorScroll.cardName,
      name: 'cardName',
      type: 'text',
      label: 'Nome no Cartão',
      value: creditCardFormData.cardName,
    },
    {
      key: 'expiry',
      ref: creditCardErrorScroll.expiry,
      name: 'expiry',
      type: 'date',
      label: 'Validade',
      value: creditCardFormData.expiry,
    },
    {
      key: 'cvc',
      ref: creditCardErrorScroll.cvc,
      name: 'cvc',
      type: 'text',
      label: 'CVC',
      value: creditCardFormData.cvc,
    },
  ];

  const handleSubmit = async () => {

    setErrors({
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvc: ''
    });

    const newErrors = {
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvc: ''
    }
    
    const emptyFieldError = 'Este campo é obrigatório';
    const invalidCardNumberError = 'Insira o número completo do cartão';
    const regex = /^----/;

    console.log("🚀 ~ file: creditCard.tsx:154 ~ handleSubmit ~ regex.test(creditCardFormData.cardNumber):", regex.test(creditCardFormData.cardNumber))


    if (!creditCardFormData.cardName) newErrors.cardName = emptyFieldError;
    if (regex.test(creditCardFormData.cardNumber)) newErrors.cardNumber = invalidCardNumberError;
    if (!creditCardFormData.expiry) newErrors.expiry = emptyFieldError;
    if (!creditCardFormData.cvc) newErrors.cvc = emptyFieldError;

    // if (!creditCardFormData.cardNumber || creditCardFormData.cardNumber.length < 16) {
    //   setErrors((prevErrors) => ({...prevErrors, cardNumber: emptyFieldError}));
    // }
    // if (!creditCardFormData.expiry) {
    //   setErrors((prevErrors) => ({...prevErrors, expiry: emptyFieldError}));
    // }
    // if (!creditCardFormData.cvc || creditCardFormData.cardNumber.length < 3) {
    //   setErrors((prevErrors) => ({...prevErrors, cvc: emptyFieldError}));
    // }

    setErrors(newErrors);

    if(Object.values(errors).every((error) => error === '')) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
        const formattedCardNumber = creditCardFormData.cardNumber.replace(/\D/g, '');
        setCreditCardFormData({...creditCardFormData, cardNumber: formattedCardNumber});
        toast.loading('Enviando...');
        const response = await fetch(`${baseUrl}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(creditCardFormData)
        });
        if(response.ok) {
          toast.dismiss();
          toast.success('Dados do cartão atualizados com sucesso.');
        } else {
          toast.dismiss();
          toast.success('Não foi possível atualizar os dados de cartão de crédito. Por favor, tente mais tarde.');
        }
      } catch (error) {
        toast.dismiss();
        toast.error('Não foi posssível se conectar ao servidorno momento. Pro favor, tente mais tarde.')
      }
    }
  }

  return (
    <div className='md:w-[90%] w-full'>
      <h2 className="md:text-4xl text-2xl leading-10 text-quaternary font-bold mb-10 md:mt-16 mt-5 w-full">
        Formas de Pagamento
      </h2>

      <div className="lg:flex">
        <div className="my-auto">
          <Cards
            cvc={creditCardFormData.cvc}
            expiry={creditCardFormData.expiry}
            focused={focus}
            name={creditCardFormData.cardName}
            number={creditCardFormData.cardNumber}
          />
        </div>

        <form className="flex flex-col w-full">
          {inputs.map((input) => (
            <div key={input.key} className="flex flex-col lg:mx-0 w-full mx-auto" ref={input.ref}>
              <input
                type={input.type}
                name={input.name}
                placeholder={input.label}
                onChange={(e) => handleInputChange(e, input.name)}
                onFocus={(e) => setFocus(e.target.name as Focused)}
                value={
                  input.key !== 'cardNumber' 
                    ? creditCardFormData[input.name] 
                    : creditCardFormData[input.name].replace(/[^\d- ]/g, '')
                }
                className={`border border-quaternary rounded-[10px] h-12 text-quaternary lg:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5 lg:ml-5 w-full mr-1`}
                style={errors[input.key] !== '' ? { border: '1px solid red' } : {}}
                required
              />
              {Object.keys(errors).includes(input.key) && (
                <span className="text-red-500 text-xs lg:ml-5">{errors[input.key]}</span>
              )}
            </div>
          ))}
        </form>
      </div>
      
      {isEdit && (
        <div className="flex my-10 justify-center">
          <button className="bg-primary w-fit h-16 item text-quinary rounded-[10px] py-5 px-20 lg:ml-8 gap-3 text-2xl font-extrabold" onClick={handleSubmit}>
            Atualizar
          </button>
        </div>
      )}
      
    </div>
  )
}

export default CreditCard;