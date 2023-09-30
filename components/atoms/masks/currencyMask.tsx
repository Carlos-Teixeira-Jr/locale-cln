import React from 'react';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

type MoneyMaskProps = {
  value: any;
  className: string;
  onChange?: () => void;
};

const MoneyMask: React.FC<MoneyMaskProps> = ({
  value,
  className,
  onChange,
}) => {
  const numberMask = createNumberMask({
    prefix: 'R$ ',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 2,
  });

  return (
    <p>
      <MaskedInput
        mask={numberMask}
        placeholder="R$ 0,00"
        value={value}
        className={className}
        onChange={onChange}
        readOnly={false}
      />
    </p>
  );
};

export default MoneyMask;
