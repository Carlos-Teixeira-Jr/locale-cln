import { useIsMobile } from '../../../hooks/useIsMobile';
import GoogleIcon from '../../atoms/icons/googleIcon';

interface SocialAuthButtonProps {
  provider: 'google' | 'facebook';
  onClick: () => void;
}

const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
  provider,
  onClick,
}) => {
  const isMobile = useIsMobile();

  return (
    <button
      className={`bg-quinary md:w-fit h-fit rounded-full border-[1px] border-quaternary flex justify-center items-center mx-2 transition-colors duration-300 hover:bg-gray-200 hover:border-gray-500 p-2 gap-2`}
      onClick={onClick}
    >
      <div className="md:pl-0">
        <GoogleIcon width='40px' height='40px' />
      </div>
      {!isMobile && (
        <div>
          <p className="font-bold text-quaternary text-sm transition-colors duration-300 hover:text-gray-500">
            Continuar com o {provider === 'google' ? 'Google' : 'Facebook'}
          </p>
        </div>
      )}
    </button>
  );
};

export default SocialAuthButton;
