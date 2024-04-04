import React, { InputHTMLAttributes, RefObject, useCallback } from 'react';
import {
  areaMask,
  cardNumber,
  cellPhoneMask,
  cepMask,
  cpfMask,
  currencyMask,
  cvcCardMask,
  expiryDateMask,
  phoneMask,
  ufMask,
} from './masksCalculatorModal';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  mask:
  | 'cep'
  | 'currency'
  | 'cpf'
  | 'area'
  | 'cellPhone'
  | 'phone'
  | 'cardNumber'
  | 'expiryDate'
  | 'cvc'
  | 'uf';
  prefix?: string;
  className: string;
  ref?: RefObject<HTMLInputElement>;
  setPropertyValue?: any;
  setUseableAreaValue?: any;
  spanClassName?: string;
  onChange?: any;
}

const currencySpanClassName =
  'prefix-span absolute top-6 left-0 w-7 pt-1 pl-2 z-10 text-quaternary text-2xl leading-7 font-bold';

const MaskedInput: React.FC<InputProps> = ({
  mask,
  className,
  prefix,
  setPropertyValue,
  setUseableAreaValue,
  spanClassName = currencySpanClassName,
  onChange,
  ...props
}) => {
  const handleKeyUp = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (mask === 'cep') {
        cepMask(event);
      }
      if (mask === 'currency') {
        currencyMask(event);
      }
      if (mask === 'cpf') {
        cpfMask(event);
      }
      if (mask === 'area') {
        const newValue = areaMask(event);
        if (onChange) {
          onChange(newValue);
        }
      }
      if (mask === 'cellPhone') {
        cellPhoneMask(event);
      }
      if (mask === 'phone') {
        phoneMask(event);
      }
      if (mask === 'cardNumber') {
        cardNumber(event);
      }
      if (mask === 'expiryDate') {
        expiryDateMask(event);
      }
      if (mask === 'cvc') {
        cvcCardMask(event);
      }
      if (mask === 'uf') {
        ufMask(event);
      }
    },
    [mask, setPropertyValue]
  );

  return (
    <div className="relative">
      {prefix && <span className={spanClassName}>{prefix}</span>}
      <input
        id="input"
        {...props}
        onChange={handleKeyUp}
        className={className}
      ></input>
    </div>
  );
};

export default MaskedInput;
