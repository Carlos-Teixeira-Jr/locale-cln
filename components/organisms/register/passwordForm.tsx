import bcrypt from 'bcryptjs';
import React, { ChangeEvent, MouseEvent, useState } from 'react';
import EyeIcon from '../../atoms/icons/eyeIcon';
import TurnedOffEyeIcon from '../../atoms/icons/turnedOffEyeIcon';

const PasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [token, setToken] = useState('');
  const [passwordHash, setPasswordHash] = useState<string>('');
  const [errors, setErrors] = useState({
    password: '',
    passwordConfirmation: '',
  });

  const handleOnChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setPassword(password);
  };

  const handleOnChangePasswordConfirmation = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const password = event.target.value;
    setPasswordConfirmation(password);
  };

  const handlePasswordVisibility = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const handlePasswordConfirmationVisibility = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setShowPasswordConfirmation(!showPasswordConfirmation);
  };

  const handleRegisterBtn = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const newErrors = { password: '', passwordConfirmation: '' };

    if (!password) {
      newErrors.password = 'O campo senha é obrigatório.';
    }
    if (!passwordConfirmation) {
      newErrors.passwordConfirmation =
        'O campo confirmação de senha é obrigatório.';
    }
    setErrors(newErrors);

    if (newErrors.password || newErrors.passwordConfirmation) {
      return;
    }

    let data;
    try {
      if (password === passwordConfirmation) {
        data = password;

        const saltRounds = 10;
        const passwordHash = bcrypt.hashSync(data, saltRounds);
        setPasswordHash(passwordHash);
        console.log(passwordHash);
      }
    } catch (error) {
      console.error('A confirmação de senha não é igual a senha digitada');
    }
  };

  return (
    <div className="md:my-16 my-5 w-fit flex flex-col mx-auto">
      <h2 className="text-2xl font-bold leading-7 text-quaternary mb-5">
        Senha
      </h2>
      <div className="flex">
        <div className="flex flex-col mb-10">
          <input
            className="md:w-[518px] w-[244px] md:h-[66px] border-[1px] border-quaternary rounded-[10px] drop-shadow-xl bg-tertiary text-quaternary md:p-5 text-2xl font-semibold"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handleOnChangePassword}
            style={errors.password ? { border: '1px solid red' } : {}}
          />
          {errors.password && (
            <label className="mx-[10px] text-red-500 mt-5">
              {errors.password}
            </label>
          )}
        </div>

        <button
          className="md:p-2 ml-2 md:mt-0 md:flex mx-auto self-start"
          onClick={handlePasswordVisibility}
        >
          {showPassword ? (
            <EyeIcon fill="#6B7280" />
          ) : (
            <TurnedOffEyeIcon fill="#6B7280" />
          )}
        </button>
      </div>

      <h2 className="text-2xl font-bold leading-7 text-quaternary mb-5">
        Confirmar Senha
      </h2>
      <div className="flex mb-5">
        <div className="flex flex-col mb-10">
          <input
            className="md:w-[518px] w-[244px] md:h-[66px] border-[1px] border-quaternary rounded-[10px] drop-shadow-xl bg-tertiary text-quaternary md:p-5 text-2xl font-semibold"
            type={showPasswordConfirmation ? 'text' : 'password'}
            value={passwordConfirmation}
            onChange={handleOnChangePasswordConfirmation}
            style={
              errors.passwordConfirmation ? { border: '1px solid red' } : {}
            }
          />
          {errors.passwordConfirmation && (
            <label className="mx-[10px] text-red-500 mt-5">
              {errors.passwordConfirmation}
            </label>
          )}
        </div>

        <button
          className="md:p-2 ml-2 md:mt-0 md:flex mx-auto self-start"
          onClick={handlePasswordConfirmationVisibility}
        >
          {showPasswordConfirmation ? (
            <EyeIcon fill="#6B7280" />
          ) : (
            <TurnedOffEyeIcon fill="#6B7280" />
          )}
        </button>
      </div>
      <button
        className="h-[87px] md:w-[525px] bg-primary text-tertiary rounded-[10px] md:text-4xl text-2xl leading-10 font-extrabold"
        onClick={handleRegisterBtn}
      >
        Finalizar Cadastro
      </button>
    </div>
  );
};

export default PasswordForm;
