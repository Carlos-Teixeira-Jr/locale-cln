import React, { InputHTMLAttributes } from 'react';
import MaskedInput from 'react-input-mask';

interface PhoneInputProps extends InputHTMLAttributes<HTMLInputElement> {
  mask: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ mask, ...props }) => {
  return <MaskedInput mask={mask} {...props} />;
};

export default PhoneInput;
