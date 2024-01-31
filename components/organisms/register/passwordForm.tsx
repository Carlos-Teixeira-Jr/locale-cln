import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { MouseEvent, useState } from 'react';
import { toast } from 'react-toastify';
import store from 'store';
import { IRegisterPropertyData_Step3 } from '../../../common/interfaces/property/register/register';
import { IStoredData } from '../../../common/interfaces/property/register/store';
import { sendRequest } from '../../../hooks/sendRequest';
import EyeIcon from '../../atoms/icons/eyeIcon';
import TurnedOffEyeIcon from '../../atoms/icons/turnedOffEyeIcon';

type PaymentData = {
  cardBrand: string;
  value: string;
};

type StoredData = {
  paymentData: PaymentData;
  propertyDataStep3: IRegisterPropertyData_Step3;
  storedData: IStoredData;
};

interface IPasswordForm {
  userEmail: string;
  storedData: StoredData;
}

const PasswordForm: React.FC<IPasswordForm> = ({ userEmail, storedData }) => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const email = userEmail ? userEmail : storedData.propertyDataStep3.email;

  const inputs = [
    {
      key: 'password',
      label: 'Senha',
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPassword(e.target.value),
      error: passwordError,
      visibility: showPassword,
      onClick: () => setShowPassword(!showPassword),
    },
    {
      key: 'passwordConfirmation',
      label: 'Confirmação de Senha',
      value: passwordConfirmation,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPasswordConfirmation(e.target.value),
      error: passwordConfirmationError,
      visibility: showPasswordConfirmation,
      onClick: () => setShowPasswordConfirmation(!showPasswordConfirmation),
    },
  ];

  const handleRegisterBtn = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setPasswordError('');
    setPasswordConfirmationError('');

    if (!password) {
      setPasswordError('Por favor, insira uma senha para cadastrar sua conta.');
    } else if (password.length <= 5) {
      setPasswordError('A senha precisa ter pelo menos 6 caracteres.');
    }
    if (passwordConfirmation === '') {
      setPasswordConfirmationError('Por favor, insira a confirmação de senha.');
    }
    if (!passwordConfirmation) {
      setPasswordConfirmationError('Por favor, insira a confirmação de senha.');
    } else if (password !== passwordConfirmation) {
      setPasswordConfirmationError(
        'A confirmação de senha precisa ser igual a senha.'
      );
    }

    if (!passwordError && !passwordConfirmationError) {
      try {
        toast.loading('Enviando...');
        const response = await sendRequest(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register`,
          'POST',
          {
            email,
            password,
            passwordConfirmation,
          }
        );

        if (!response.ok) {
          const data = await response.json();
          toast.error('Servidor respondeu com erro');
        } else {
          try {
            const signInResponse = await signIn('credentials', {
              email,
              password,
              redirect: false,
            }).then(({ ok, error }: any) => {
              if (ok) {
                toast.dismiss();
                store.remove('propertyData');
                store.remove('creditCard');
                store.remove('userAlreadyExists');
                router.push('/admin?page=1');
              } else {
                console.error(error);
                toast.dismiss();
                toast.error('Email ou senha inválidos.', { type: 'error' });
              }
            });

            if (signInResponse === null) {
              toast.warn('Dados de login inválidos ou usuário não encontrado');
            }
          } catch (error) {
            toast.dismiss();
            console.error(error);
            toast.error('Erro ao fazer login');
          }
        }
      } catch (error) {
        toast.dismiss();
        console.error(error);
        toast.error(
          'Não foi possível se conectar com o servidor. Por favor tente novamente mais tarde.'
        );
      }
    } else {
      toast.error('Você não inseriu a senha ou confirmação de senha');
    }
  };

  return (
    <div className="md:my-16 my-5 md:w-1/2 flex flex-col mx-5 md:mx-auto">
      {inputs.map((input) => (
        <div key={input.key} className="flex flex-col">
          <h2 className="text-2xl font-bold leading-7 text-quaternary mb-5">
            {input.label}
          </h2>
          <div className="flex mb-10">
            <input
              className="w-full h-12 border-[1px] border-quaternary rounded-lg drop-shadow-xl bg-tertiary text-quaternary md:p-5 text-xl font-semibold"
              type={showPassword ? 'text' : 'password'}
              value={input.value}
              onChange={input.onChange}
              style={input.error ? { border: '1px solid red' } : {}}
              maxLength={10}
            />
            {input.error && (
              <label className="mx-[10px] text-red-500 mt-5">
                {input.error}
              </label>
            )}
            <button className="mx-2" onClick={input.onClick}>
              {input.visibility ? (
                <EyeIcon
                  fill="#6B7280"
                  // width={!isMobile ? '40' : '30'}
                  // height={!isMobile ? '40' : '30'}
                />
              ) : (
                <TurnedOffEyeIcon
                  fill="#6B7280"
                  // width={!isMobile ? '40' : '30'}
                  // height={!isMobile ? '40' : '30'}
                />
              )}
            </button>
          </div>
        </div>
      ))}

      <button
        className="w-full bg-primary text-tertiary rounded-[10px] md:text-3xl text-2xl leading-10 py-5 font-extrabold"
        onClick={handleRegisterBtn}
      >
        Finalizar Cadastro
      </button>
    </div>
  );
};

export default PasswordForm;
