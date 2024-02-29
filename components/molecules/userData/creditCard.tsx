import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import Cards, { Focused } from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import { toast } from 'react-toastify';
import {
  ICreditCardInfo,
  IOwnerData,
} from '../../../common/interfaces/owner/owner';
import { IPlan } from '../../../common/interfaces/plans/plans';
import { IAddress } from '../../../common/interfaces/property/propertyData';
import { IUserDataComponent } from '../../../common/interfaces/user/user';
import { applyNumericMask } from '../../../common/utils/masks/numericMask';

export type CreditCardForm = {
  cardName: string;
  cardNumber: string;
  ccv: string;
  expiry: string;
  cpfCnpj: string;
  [key: string]: string;
};

interface ICreditCard {
  isEdit: boolean;
  onCreditCardUpdate?: (creditCard: CreditCardForm) => void;
  error: any;
  creditCardInputRefs?: any;
  creditCardInfo?: ICreditCardInfo;
  userInfo?: IUserDataComponent;
  customerId?: any;
  selectedPlan?: IPlan;
  userAddress?: IAddress;
  ownerData?: IOwnerData;
  handleEmptyAddressError?: ((error: string) => void)
}

const CreditCard = ({
  isEdit,
  onCreditCardUpdate,
  error,
  creditCardInputRefs,
  creditCardInfo,
  userInfo,
  customerId,
  selectedPlan,
  userAddress,
  ownerData,
  handleEmptyAddressError
}: ICreditCard) => {

  const creditCardErrorScroll = {
    ...creditCardInputRefs,
  };

  const router = useRouter();

  const [focus, setFocus] = useState<Focused | undefined>();
  const actualCreditCardNumber = creditCardInfo
    ? `---- ---- ---- ${creditCardInfo?.creditCardNumber}`
    : '';
  const [creditCardFormData, setCreditCardFormData] = useState<CreditCardForm>({
    cardName: '',
    cardNumber: creditCardInfo ? actualCreditCardNumber : '',
    ccv: '',
    expiry: '',
    cpfCnpj: ''
  });

  const [emptyAddressError, setEmptyAddressError] = useState('');

  const [errors, setErrors] = useState<CreditCardForm>({
    cardName: '',
    cardNumber: '',
    ccv: '',
    expiry: '',
    cpfCnpj: ''
  });

  useEffect(() => {
    if (handleEmptyAddressError) handleEmptyAddressError(emptyAddressError)
  }, [emptyAddressError]);

  // Envia os dados do usuário para o componente pai;

  useEffect(() => {
    if (onCreditCardUpdate) onCreditCardUpdate(creditCardFormData);
  }, [creditCardFormData]);

  useEffect(() => {
    setErrors(error);
  }, [error]);

  useEffect(() => {
    const scrollToError = (errorKey: keyof typeof errors) => {
      if (errors[errorKey] !== '' && creditCardInputRefs[errorKey]?.current) {
        creditCardErrorScroll[errorKey]?.current.scrollIntoView({
          behavior: 'auto',
          block: 'center',
        });
      }
    };

    scrollToError('cardName');
    scrollToError('cardNumber');
    scrollToError('expiry');
    scrollToError('ccv');
    scrollToError('cpfCnpj');
  }, [errors]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: keyof CreditCardForm
  ) => {
    const value = e.target.value;
    if (fieldName === 'cardName') {
      const maskedValue = value.replace(/\d/g, '');
      setCreditCardFormData({
        ...creditCardFormData,
        [fieldName]: maskedValue.toUpperCase(),
      });
    } else if (fieldName === 'cardNumber') {
      const maskedValue = applyNumericMask(value, '9999999999999999');
      setCreditCardFormData({
        ...creditCardFormData,
        [fieldName]: maskedValue,
      });
    } else if (fieldName === 'ccv') {
      const maskedValue = value.replace(/\s/g, '').toUpperCase().slice(0, 4);
      setCreditCardFormData({
        ...creditCardFormData,
        [fieldName]: maskedValue,
      });
    } else if (fieldName === 'cpfCnpj') {
      const input = e.target;
      const value = input.value;
      const maskedValue = applyNumericMask(value, '999.999.999-99');
      const selectionStart = input.selectionStart || 0;
      const selectionEnd = input.selectionEnd || 0;
      const previousValue = input.value;
      // Verifica se o cursor está no final da string ou se um caractere foi removido
      if (
        selectionStart === previousValue.length ||
        previousValue.length > maskedValue.length
      ) {
        input.value = maskedValue;
      } else {
        // Caso contrário, restaura o valor anterior e move o cursor para a posição correta
        input.value = previousValue;
        input.setSelectionRange(selectionStart, selectionEnd);
      }
      setCreditCardFormData({
        ...creditCardFormData,
        [fieldName]: maskedValue,
      });
    } else {
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
      type: 'text',
      label: 'Validade',
      value: creditCardFormData.expiry,
    },
    {
      key: 'ccv',
      ref: creditCardErrorScroll.ccv,
      name: 'ccv',
      type: 'text',
      label: 'CCV',
      value: creditCardFormData.ccv,
    },
    {
      key: 'cpfCnpj',
      ref: creditCardErrorScroll.cpfCnpj,
      name: 'cpfCnpj',
      type: 'text',
      label: 'CPF/CNPJ',
      value: creditCardFormData.cpfCnpj,
    },
  ];

  const handleSubmit = async () => {

    setErrors({
      cardNumber: '',
      cardName: '',
      expiry: '',
      ccv: '',
      cpfCnpj: ''
    });

    const newErrors = {
      cardNumber: '',
      cardName: '',
      expiry: '',
      ccv: '',
      cpfCnpj: ''
    };

    const emptyFieldError = 'Este campo é obrigatório';
    const invalidCardNumberError = 'Insira o número completo do cartão';
    const regex = /^----/;
    const emptyAddress = 'Os dados de endereço precisam ser preenchidos para atualizar o cartão'

    if (!userAddress?.zipCode || !userAddress?.streetNumber) setEmptyAddressError(emptyAddress);
    if (!creditCardFormData.cardName) newErrors.cardName = emptyFieldError;
    if (regex.test(creditCardFormData.cardNumber))
      newErrors.cardNumber = invalidCardNumberError;
    if (!creditCardFormData.expiry) newErrors.expiry = emptyFieldError;
    if (!creditCardFormData.ccv) newErrors.ccv = emptyFieldError;
    if (!creditCardFormData.cpfCnpj) newErrors.cpfCnpj = emptyFieldError;

    setErrors(newErrors);

    if (Object.values(errors).every((error) => error === '')) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
        const formattedCardNumber = creditCardFormData.cardNumber.replace(
          /\D/g,
          ''
        );
        setCreditCardFormData({
          ...creditCardFormData,
          cardNumber: formattedCardNumber,
        });
        toast.loading('Enviando...');

        const body = {
          ...creditCardFormData,
          email: userInfo?.email,
          phone: userInfo?.cellPhone,
          plan: selectedPlan,
          zipCode: userAddress?.zipCode,
          streetNumber: userAddress?.streetNumber,
          owner: ownerData?.owner,
          customerId,
        };

        const response = await fetch(`${baseUrl}/user/edit-credit-card`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          toast.dismiss();
          toast.success('Dados do cartão atualizados com sucesso.');
          if (ownerData?.owner) {
            router.push('/admin?page=1');
          } else {
            router.push('/adminFavProperties?page=1');
          }
        } else {
          toast.dismiss();
          toast.error(
            'Não foi possível atualizar os dados de cartão de crédito. Por favor, tente mais tarde.'
          );
        }
      } catch (error) {
        toast.dismiss();
        toast.error(
          'Não foi posssível se conectar ao servidorno momento. Pro favor, tente mais tarde.'
        );
      }
    }
  };

  return (
    <div className="md:w-[90%] w-full">
      <h2 className="md:text-2xl text-lg leading-10 text-quaternary font-bold mb-5 md:mt-16 mt-5 w-full">
        Formas de Pagamento
      </h2>

      <div className="lg:flex">
        <div className="my-auto">
          <Cards
            cvc={creditCardFormData.ccv}
            expiry={creditCardFormData.expiry}
            focused={focus}
            name={creditCardFormData.cardName}
            number={creditCardFormData.cardNumber}
          />
        </div>

        <form className="flex flex-col w-full">
          {inputs.map((input) => (
            <div
              key={input.key}
              className="flex flex-col lg:mx-0 w-full mx-auto"
              ref={input.ref}
            >
              <input
                type={input.type}
                name={input.name}
                placeholder={input.label}
                onChange={(e) => handleInputChange(e, input.name)}
                onFocus={(e) => setFocus(e.target.name as Focused)}
                maxLength={input.key === 'expiry' ? 5 : undefined}
                value={
                  input.key === 'expiry'
                    ? creditCardFormData[input.name].replace(
                        /^(\d{2})(\d{2})$/,
                        '$1/$2'
                      )
                    : input.key !== 'cardNumber'
                    ? creditCardFormData[input.name]
                    : creditCardFormData[input.name].replace(/[^\d- ]/g, '')
                }
                className={`border border-quaternary rounded-[10px] h-12 text-quaternary md:text-base text-sm font-bold px-5 drop-shadow-lg bg-tertiary mt-5 lg:ml-5 w-full mr-1`}
                style={
                  errors[input.key] !== '' ? { border: '1px solid red' } : {}
                }
                required
              />
              {Object.keys(errors).includes(input.key) && (
                <span className="text-red-500 text-xs lg:ml-5">
                  {errors[input.key]}
                </span>
              )}
            </div>
          ))}
        </form>
      </div>

      {isEdit && (
        <div className="flex my-10 justify-center">
          <button
            className="bg-primary w-fit h-13 item text-quinary rounded-[10px] py-3 px-10 lg:ml-8 gap-3 text-lg font-extrabold transition-colors duration-300 hover:bg-red-600 hover:text-white"
            onClick={handleSubmit}
          >
            Atualizar
          </button>
        </div>
      )}
    </div>
  );
};

export default CreditCard;
