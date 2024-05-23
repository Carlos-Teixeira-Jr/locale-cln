import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CheckIcon from "../../atoms/icons/checkIcon";

export interface ICoupons {
  onUseCouponSwitchChange: (isUseCoupon: boolean) => void;
  couponInputRefs?: any;
  error: string
  onCouponChange: (coupon: string) => void;
}

const Coupons = ({
  onUseCouponSwitchChange,
  couponInputRefs,
  error,
  onCouponChange
}: ICoupons) => {

  const couponErrorScroll = {
    ...couponInputRefs,
  };

  const { pathname } = useRouter();

  const [useCoupon, setUseCoupon] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState(error);
  const isAdminPage = pathname === '/adminUserData' ? true : false;

  useEffect(() => {
    onCouponChange(coupon)
  }, [coupon]);

  useEffect(() => {
    const scrollToError = (errorKey: typeof coupon) => {
      if (
        errorKey !== '' &&
        couponInputRefs?.current
      ) {
        couponErrorScroll?.current.scrollIntoView({
          behavior: 'auto',
          block: 'center',
        });
      }
    };
    scrollToError('coupon');
  }, [coupon]);

  useEffect(() => {
    onUseCouponSwitchChange(useCoupon);
  }, [useCoupon])

  return (
    <div className={`flex flex-col md:mt-3 md:mb-10`}>
      <div className={`flex  ${isAdminPage ? '' : 'justify-start md:justify-center px-5 my-5 md:my-0 md:mt-10'}`}>
        <div
          className={`w-10 h-10 border z-0 bg-tertiary rounded-[10px] drop-shadow-lg cursor-pointer my-auto shrink-0 ${useCoupon ? 'border-secondary' : 'border-quaternary'
            }`}
          onClick={() => {
            setUseCoupon(!useCoupon);
          }}
        >
          {useCoupon && (
            <CheckIcon
              fill="#F5BF5D"
              width="36"
              className={`pl-1 pb-2 ${useCoupon ? ' border-secondary' : ''
                }`}
            />
          )}
        </div>
        <h3 className="md:text-2xl text-xl mx-5 leading-10 text-quaternary font-bold my-auto">
          Usar cupom de desconto
        </h3>
      </div>

      {useCoupon && (
        <input
          type="text"
          key={coupon}
          value={coupon}
          style={couponError ? { border: '1px solid red' } : {}}
          maxLength={15}
          placeholder="Insira seu código de desconto..."
          className={`border p-5 h-12 mb-5 md:my-5 border-quaternary rounded-[10px] bg-tertiary font-bold text-lg text-quaternary leading-7 drop-shadow-xl ${isAdminPage ? 'md:w-1/2' : 'md:mx-auto mx-5 md:w-1/3'}`}
          onChange={(e) => setCoupon(e.target.value)}
        />
      )}
      {couponError && (
        <span className="text-red-500 text-xs">
          {couponError}
        </span>
      )}
    </div>
  )
}

export default Coupons;