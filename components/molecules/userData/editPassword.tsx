import { useEffect, useState } from "react"

type editPasswordErrorTypes = {
  passwordError: string
  passwordConfirmattionError:string
}

interface IEditPassword {
  onPasswordUpdate: (password: string) => void
  error: editPasswordErrorTypes
  passwordInputRefs?: any
}

const EditPassword= ({
  onPasswordUpdate,
  error,
  passwordInputRefs
}: IEditPassword ) => {

  const passwordErrorScroll = {
    ...passwordInputRefs
  };

  const [formData, setFormData] = useState({
    password: '',
    passwordConfirmattion: ''
  });

  const [errorFormData, setErrorFormData] = useState({
    passwordError: '',
    passwordConfirmattionError: ''
  });

  // Realiza o auto-scroll para o input que apresenta erro;
  useEffect(() => {
    const scrollToError = (errorKey: keyof typeof errorFormData) => {
      if (errorFormData[errorKey] !== '' && passwordInputRefs[errorKey]?.current) {
        passwordErrorScroll[errorKey]?.current.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    };
    scrollToError('passwordError');
    scrollToError('passwordConfirmattionError');
  }, [errorFormData]);

  const inputs = [
    {
      key: 'password',
      label: 'Senha',
      value: formData.password,
      error: errorFormData.passwordError
    },
    {
      key: 'passwordConfirmattion',
      label: 'Confirmação de Senha',
      value: formData.passwordConfirmattion,
      error: errorFormData.passwordConfirmattionError
    }
  ]

  return (
    <div>
      <h1 className='md:text-3xl text-2xl leading-10 text-quaternary font-bold md:mb-10'>Alterar Senha</h1>
      <div className="flex gap-10">
        {inputs.map((input) => (
          <div key={input.key} className="w-full">
            <label className="text-xl font-normal text-quaternary">{input.label}</label>
            <input
              className="border w-full p-5 h-12 border-quaternary rounded-[10px] bg-tertiary font-bold text-xl md:text-2xl text-quaternary leading-7 drop-shadow-xl"
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  [input.key]: e.target.value,
                }))
              }
              value={inputs[0].value}
              style={input.error ? { border: '1px solid red' } : {}}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default EditPassword