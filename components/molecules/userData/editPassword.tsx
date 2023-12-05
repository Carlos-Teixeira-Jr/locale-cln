import { useEffect, useState } from "react"
import EyeIcon from "../../atoms/icons/eyeIcon"
import TurnedOffEyeIcon from "../../atoms/icons/turnedOffEyeIcon"
import { useIsMobile } from "../../../hooks/useIsMobile"
import CheckIcon from "../../atoms/icons/checkIcon"

type editPasswordErrorTypes = {
  [key: string]: string;
  password: string
  passwordConfirmattion:string
}

export interface IPasswordData {
  password: string,
  passwordConfirmattion: string
}

interface IEditPassword {
  onPasswordUpdate: (password: IPasswordData) => void
  error: editPasswordErrorTypes
  passwordInputRefs?: any
  onEditPasswordSwitchChange: (isEditPassword: boolean) => void
}

const EditPassword= ({
  onPasswordUpdate,
  error,
  passwordInputRefs,
  onEditPasswordSwitchChange
}: IEditPassword ) => {

  const passwordErrorScroll = {
    ...passwordInputRefs
  };

  const isMobile = useIsMobile();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [editPasswordIsOn, setEditPasswordIsOn] = useState(false);

  const [formData, setFormData] = useState({
    password: '',
    passwordConfirmattion: ''
  });

  const [errorFormData, setErrorFormData] = useState<editPasswordErrorTypes>({
    password: '',
    passwordConfirmattion: ''
  });
  
  const handlePasswordVisibility = (id: string) => {
    if (id === 'password') {
      setShowPassword(!showPassword);
    }
    if (id === 'passwordConfirmattion') {
      setShowPasswordConfirmation(!showPasswordConfirmation);
    }
  };

  // Realiza o auto-scroll para o input que apresenta erro;
  useEffect(() => {
    const scrollToError = (errorKey: keyof typeof errorFormData) => {
      if (errorFormData[errorKey] !== '' && passwordInputRefs[errorKey]?.current) {
        passwordErrorScroll[errorKey]?.current.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    };
    scrollToError('password');
    scrollToError('passwordConfirmattion');
  }, [errorFormData]);

  // Envia as alterações de senha e confirmação para o componente mais externo;
  useEffect(() => {
    onPasswordUpdate(formData)
  }, [formData]);

  // Recebe os erros do componente externo e atualiza os erros neste componente;
  useEffect(() => {
    setErrorFormData(error);
  }, [error]);

  // Envia para o componente mais externo uma flag informando que o usuário deseja alterar a senha;
  useEffect(() => {
    onEditPasswordSwitchChange(editPasswordIsOn)
  }, [editPasswordIsOn]);
  
  const inputs = [
    {
      key: 'password',
      label: 'Senha',
      value: formData.password,
      error: errorFormData.password,
      type: showPassword ? 'text' : 'password'
    },
    {
      key: 'passwordConfirmattion',
      label: 'Confirmação de Senha',
      value: formData.passwordConfirmattion,
      error: errorFormData.passwordConfirmattion,
      type: showPasswordConfirmation ? 'text' : 'password'
    }
  ]

  return (
    <div>
      <div className="flex">
        <h1 className='md:text-3xl text-2xl leading-10 text-quaternary font-bold md:mb-10'>Alterar Senha</h1>
        <div
          className={`mx-5 w-12 h-12 border bg-tertiary rounded-[10px] drop-shadow-lg cursor-pointer shrink-0 ${
            editPasswordIsOn ? 'border-secondary' : 'border-quaternary'
          }`}
          onClick={() => {
            setEditPasswordIsOn(!editPasswordIsOn)
            setFormData({
              password: '',
              passwordConfirmattion: ''
            })
          }}
        >
          {editPasswordIsOn && (
            <CheckIcon
              fill="#F5BF5D"
              width="42"
              className={`pl-1 ${editPasswordIsOn ? ' border-secondary' : ''}`}
            />
          )}
        </div>
      </div>

      {editPasswordIsOn && (
        <div className="flex flex-col md:flex-row gap-10">
          {inputs.map((input) => (
            <div key={input.key} className="w-full">
              <label className="text-xl font-normal text-quaternary">{input.label}</label>
              <div className="flex">
                <input
                  className="border w-full p-5 h-12 border-quaternary rounded-[10px] bg-tertiary font-bold text-xl md:text-2xl text-quaternary leading-7 drop-shadow-xl"
                  type={input.type}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.trim();
                    if (!trimmedValue.includes(' ')) {
                      setFormData({
                        ...formData,
                        [input.key]: trimmedValue
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
                    handlePasswordVisibility(input.key)
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
                  ) : (
                    showPasswordConfirmation ? (
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
                  )}
                </button>
              </div>
              {Object.keys(errorFormData).includes(input.key) && (
                <span className="text-red-500 text-xs">{errorFormData[input.key]}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EditPassword