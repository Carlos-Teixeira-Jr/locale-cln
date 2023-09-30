import { ChangeEvent, useEffect, useState } from "react";
import Cards, { Focused } from 'react-credit-cards';
import { applyNumericMask } from "../../../common/utils/masks/numericMask";
import { toast } from "react-toastify";
import { OnErrorInfo } from "../uploadImages/uploadImages";
import { resetObjectToEmptyStrings } from "../../../common/utils/resetObjects";

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
  onErrorInfo?: OnErrorInfo
}


const CreditCard = ({
  isEdit,
  onCreditCardUpdate,
  onErrorInfo
}: ICreditCard) => {

  const [focus, setFocus] = useState<Focused | undefined>();
  const [creditCardFormData, setCreditCardFormData] = useState<CreditCardForm>({
    cardName: '',
    cardNumber: '',
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

  // Processa a estrutura de dados de onErrosInfo para inserir no objeto formDataErrors;
  useEffect(() => {
    resetObjectToEmptyStrings(errors);
    if (onErrorInfo) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [onErrorInfo.prop]: onErrorInfo.error,
      }));
    }
  }, [onErrorInfo]);

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
      name: 'cardNumber',
      type: 'number',
      label: 'Número do Cartão',
      value: creditCardFormData.cardNumber,
    },
    {
      key: 'cardName',
      name: 'cardName',
      type: 'text',
      label: 'Nome no Cartão',
      value: creditCardFormData.cardName,
    },
    {
      key: 'expiry',
      name: 'expiry',
      type: 'date',
      label: 'Validade',
      value: creditCardFormData.expiry,
    },
    {
      key: 'cvc',
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
    
    const errorsMessage = 'Este campo é obrigatório';

    if (!creditCardFormData.cardName) {
      setErrors((prevErrors) => ({...prevErrors, cardName: errorsMessage}));
    }
    if (!creditCardFormData.cardNumber || creditCardFormData.cardNumber.length < 16) {
      setErrors((prevErrors) => ({...prevErrors, cardNumber: errorsMessage}));
    }
    if (!creditCardFormData.expiry) {
      setErrors((prevErrors) => ({...prevErrors, expiry: errorsMessage}));
    }
    if (!creditCardFormData.cvc || creditCardFormData.cardNumber.length < 3) {
      setErrors((prevErrors) => ({...prevErrors, cvc: errorsMessage}));
    }

    if(Object.values(errors).every((error) => error === '')) {
      try {
        toast.loading('Enviando...');
        const response = await fetch('http://localhost:3001/api-de-pagamento', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(creditCardFormData)
        });
        if(response.ok) {
          toast.dismiss();
          toast.success('Dados do cartão atualizados com sucesso.');
        }
      } catch (error) {
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
            <div key={input.key} className="flex flex-col lg:mx-0 w-full mx-auto">
              <input
                type={input.type}
                name={input.name}
                placeholder={input.label}
                onChange={(e) => handleInputChange(e, input.name)}
                onFocus={(e) => setFocus(e.target.name as Focused)}
                value={creditCardFormData[input.name]}
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
          <button className="bg-primary w-fit h-16 item text-quinary rounded-[10px] py-5 px-20 gap-3 text-2xl font-extrabold" onClick={handleSubmit}>
            Atualizar
          </button>
        </div>
      )}
      
    </div>
  )
}

export default CreditCard;