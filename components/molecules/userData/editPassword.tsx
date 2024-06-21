import { useEffect, useState } from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import CheckIcon from '../../atoms/icons/checkIcon';
import EyeIcon from '../../atoms/icons/eyeIcon';
import TurnedOffEyeIcon from '../../atoms/icons/turnedOffEyeIcon';

type editPasswordErrorTypes = {
  [key: string]: string;
  password: string;
  passwordConfirmattion: string;
};

export interface IPasswordData {
  password: string;
  passwordConfirmattion: string;
}

interface IEditPassword {
  onPasswordUpdate: (password: IPasswordData) => void;
  error: editPasswordErrorTypes;
  passwordInputRefs?: any;
  onEditPasswordSwitchChange: (isEditPassword: boolean) => void;
}

const EditPassword = ({
  onPasswordUpdate,
  error,
  passwordInputRefs,
  onEditPasswordSwitchChange,
}: IEditPassword) => {
  const passwordErrorScroll = {
    ...passwordInputRefs,
  };

  const isMobile = useIsMobile();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [editPasswordIsOn, setEditPasswordIsOn] = useState(false);

  const [formData, setFormData] = useState({
    password: '',
    passwordConfirmattion: '',
  });

  const [errorFormData, setErrorFormData] = useState<editPasswordErrorTypes>({
    password: '',
    passwordConfirmattion: '',
  });

  const handlePasswordVisibility = (id: string) => {
    if (id === 'password') {
      setShowPassword(!showPassword);
    }
    if (id === 'passwordConfirmattion') {
      setShowPasswordConfirmation(!showPasswordConfirmation);
    }
  };

  useEffect(() => {
    const scrollToError = (errorKey: keyof typeof errorFormData) => {
      if (
        errorFormData[errorKey] !== '' &&
        passwordInputRefs[errorKey]?.current
      ) {
        passwordErrorScroll[errorKey]?.current.scrollIntoView({
          behavior: 'auto',
          block: 'center',
        });
      }
    };
    scrollToError('password');
    scrollToError('passwordConfirmattion');
  }, [errorFormData]);

  useEffect(() => {
    onPasswordUpdate(formData);
  }, [formData]);

  useEffect(() => {
    setErrorFormData(error);
  }, [error]);

  useEffect(() => {
    onEditPasswordSwitchChange(editPasswordIsOn);
  }, [editPasswordIsOn]);

  const inputs = [
    {
      key: 'password',
      label: 'Senha',
      value: formData.password,
      error: errorFormData.password,
      type: showPassword ? 'text' : 'password',
    },
    {
      key: 'passwordConfirmattion',
      label: 'Confirmação de Senha',
      value: formData.passwordConfirmattion,
      error: errorFormData.passwordConfirmattion,
      type: showPasswordConfirmation ? 'text' : 'password',
    },
  ];

  return (
    <div>
      <div className="flex md:justify-start mb-5 md:mb-0 md:mt-10">
        <div
          className={`w-7 h-7 border bg-tertiary rounded-[10px] drop-shadow-lg cursor-pointer shrink-0 ${editPasswordIsOn ? 'border-secondary' : 'border-quaternary'
            }`}
          onClick={() => {
            setEditPasswordIsOn(!editPasswordIsOn);
            setFormData({
              password: '',
              passwordConfirmattion: '',
            });
          }}
        >
          {editPasswordIsOn && (
            <CheckIcon
              fill="#F5BF5D"
              width="32"
              className={`pb-5 pr-1 ${editPasswordIsOn ? ' border-secondary' : ''
                }`}
            />
          )}
        </div>
        <h1 className="md:text-2xl text-xl mx-5 leading-10 text-quaternary font-bold md:mb-3">
          Alterar Senha
        </h1>
      </div>

      {editPasswordIsOn && (
        <div className="flex flex-col md:flex-row gap-10 mb-10">
          {inputs.map((input) => (
            <div key={input.key} className="w-full">
              <label className="text-xl font-normal text-quaternary">
                {input.label}
              </label>
              <div className="flex">
                <input
                  className="border w-full p-5 h-12 border-quaternary rounded-[10px] bg-tertiary font-bold text-lg text-quaternary leading-7 drop-shadow-xl"
                  type={input.type}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.trim();
                    if (!trimmedValue.includes(' ')) {
                      setFormData({
                        ...formData,
                        [input.key]: trimmedValue,
                      });
                    }
                  }}
                  maxLength={15}
                  value={input.value}
                  style={input.error ? { border: '1px solid red' } : {}}
                />
                <button
                  key={input.key}
                  className="w-fit mx-2 md:mx-0 md:p-2 md:mt-0 md:flex md:pb-2 md:pt-1"
                  onClick={() => {
                    handlePasswordVisibility(input.key);
                  }}
                  id={input.key}
                >
                  {input.key === 'password' ? (
                    showPassword ? (
                      <EyeIcon
                        fill="#6B7280"
                        width={!isMobile ? '40' : '30'}
                        height={!isMobile ? '40' : '30'}
                      />
                    ) : (
                      <TurnedOffEyeIcon
                        fill="#6B7280"
                        width={!isMobile ? '40' : '30'}
                        height={!isMobile ? '40' : '30'}
                      />
                    )
                  ) : showPasswordConfirmation ? (
                    <EyeIcon
                      fill="#6B7280"
                      width={!isMobile ? '40' : '30'}
                      height={!isMobile ? '40' : '30'}
                    />
                  ) : (
                    <TurnedOffEyeIcon
                      fill="#6B7280"
                      width={!isMobile ? '40' : '30'}
                      height={!isMobile ? '40' : '30'}
                    />
                  )}
                </button>
              </div>
              {Object.keys(errorFormData).includes(input.key) && (
                <span className="text-red-500 text-xs">
                  {errorFormData[input.key]}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditPassword;
