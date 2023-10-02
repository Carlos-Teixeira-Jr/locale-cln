import { useState } from 'react';
import validator from 'validator';
import PhoneInput from '../components/atoms/masks/masks';
import { NextPageWithLayout } from './page';

interface ILocaleContact {
  name: string;
  telephone: string;
  email: string;
  message: string;
}

const LocaleContact: NextPageWithLayout = () => {
  const [error, setError] = useState({
    email: '',
    message: '',
    telephone: '',
    name: '',
  });

  const [formData, setFormData] = useState<ILocaleContact>({
    email: '',
    message: '',
    telephone: '',
    name: '',
  });

  const messageData = {
    email: formData.email,
    message: formData.message,
    name: formData.name,
    telephone: formData.telephone,
  };

  const handleMessageNameMask = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const onlyLetters = /^[a-zA-Z\s]+$/;
    if (onlyLetters.test(event.target.value)) {
      setFormData({ ...formData, name: event.target.value });
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setFormData({ ...formData, email: email });
  };

  const handleContactField = async (event: any) => {
    event.preventDefault();

    const newErrors = { email: '', message: '', name: '', telephone: '' };

    if (!formData.name) {
      newErrors.name = 'O campo nome é obrigatório.';
    }

    if (!formData.email) {
      newErrors.email = 'O campo e-mail é obrigatório.';
    }

    if (!validator.isEmail(formData.email)) {
      newErrors.email = 'E-mail invalido.';
    }

    if (formData.telephone.length < 14) {
      newErrors.telephone = 'O campo telefone está incompleto.';
    }

    if (!formData.message) {
      newErrors.message = 'O campo mensagem é obrigatório.';
    }

    setError(newErrors);

    if (
      newErrors.email ||
      newErrors.message ||
      newErrors.name ||
      newErrors.telephone
    ) {
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:3001/send-email-to-locale',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        }
      );
      setError({ email: '', message: '', name: '', telephone: '' });
      setFormData({
        email: '',
        message: '',
        name: '',
        telephone: '',
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-200 flex items-center justify-center w-full h-screen">
      <div className="bg-quinary flex flex-col items-center max-w-[1232px] h-fit rounded-lg p-3">
        <h1 className="lg:w-fit lg:h-fit m-[5px] mt-0 font-bold md:text-2xl text-quaternary">
          Mande uma mensagem para a Locale
        </h1>
        <div className="flex flex-col">
          <label className="font-bold lg:text-xl text-quaternary mx-[10px] mt-3 h-fit">
            Nome
          </label>
          <input
            placeholder="Digite seu nome..."
            name="name"
            value={formData.name}
            onChange={handleMessageNameMask}
            className="lg:w-[770px] w-[250px] h-[44px] m-[10px] mb-0 rounded-[10px] border border-quaternary bg-tertiary p-2 required:border-red-500 md:mx-auto lg:mx-2 text-lg text-quaternary font-semibold"
            style={error.name ? { border: '1px solid red' } : {}}
          />
          {error.name && (
            <label className="mx-[10px] text-red-500">{error.name}</label>
          )}
        </div>
        <div className="flex flex-col">
          <label className="font-bold lg:text-xl text-quaternary mx-[10px] mt-3 h-fit">
            Telefone
          </label>
          <PhoneInput
            mask="(99) 99999-9999"
            placeholder="Digite seu telefone..."
            type="tel"
            name="telephone"
            value={formData.telephone}
            className="lg:w-[770px] w-[250px] h-[44px] m-[10px] mb-0 rounded-[10px] border border-quaternary text-lg text-quaternary font-semibold bg-tertiary p-2 required:border-red-500 md:mx-auto lg:mx-2"
            onChange={(event: any) =>
              setFormData({ ...formData, telephone: event.target.value })
            }
            style={error.telephone ? { border: '1px solid red' } : {}}
          />
          {error.telephone && (
            <label className="mx-[10px] text-red-500">{error.telephone}</label>
          )}
        </div>
        <div className="flex flex-col">
          <label className="font-bold lg:text-xl text-quaternary mx-[10px] mt-3 h-fit">
            Email
          </label>
          <input
            placeholder="Digite seu email..."
            name="email"
            value={formData.email}
            onChange={handleEmailChange}
            className="lg:w-[770px] w-[250px] h-[44px] m-[10px] mb-0 rounded-[10px] border border-quaternary bg-tertiary p-2 required:border-red-500 md:mx-auto lg:mx-2 text-lg text-quaternary font-semibold"
            style={error.email ? { border: '1px solid red' } : {}}
          />
          {error.email && (
            <label className="mx-[10px] text-red-500">{error.email}</label>
          )}
        </div>
        <div className="flex flex-col">
          <label className="font-bold lg:text-xl text-quaternary mx-[10px] mt-3 h-fit">
            Deixe sua mensagem
          </label>
          <textarea
            className="mx-2 mb-0 border border-quaternary mt-1 lg:w-[770px] w-[250px] lg:h-[44px] bg-tertiary rounded-[10px] p-2 required:border-red-500 text-lg text-quaternary font-semibold"
            name="message"
            value={formData.message}
            placeholder={'Digite sua mensagem para a Locale.'}
            style={error.message ? { border: '1px solid red' } : {}}
            onChange={(event) =>
              setFormData({ ...formData, message: event.target.value })
            }
          />
          {error.message && (
            <label className="mx-[10px] text-red-500">{error.message}</label>
          )}
        </div>
        <div className="justify-center md:mb-2 lg:mb-auto">
          <button
            onClick={handleContactField}
            className="w-[250px] h-[40px] bg-primary rounded-[50px] p-[10px] gap-2.5 mt-3 lg:float-right"
          >
            <p className="font-normal text-xl text-tertiary leading-6 align-middle">
              Enviar
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocaleContact;
