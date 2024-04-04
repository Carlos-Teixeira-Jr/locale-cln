import Link from 'next/link';
import { useState } from 'react';
import validator from 'validator';
import { ErrorToastNames, SuccessToastNames, showErrorToast, showSuccessToast } from '../common/utils/toasts';
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

  const handleMessageNameMask = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const onlyLetters = /^[a-zA-Z\s]+$/;

    if (event.target.value === '' || onlyLetters.test(event.target.value)) {
      setFormData({ ...formData, name: event.target.value });
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const email = event.target.value;
    setFormData({ ...formData, email: email });
  };

  const handleContactField = async (event: any) => {
    event.preventDefault();
    const errorMessage = 'Este campo é obrigatório.';
    const invalidEmailError = 'O formato do e-mail informado não é válido.'
    const incompletePhoneNumber = 'O npumero do telefone está incompleto.'

    const newErrors = { email: '', message: '', name: '', telephone: '' };

    if (!formData.name) {
      newErrors.name = errorMessage;
    }

    if (!formData.email) {
      newErrors.email = errorMessage;
    }

    if (!validator.isEmail(formData.email)) {
      newErrors.email = invalidEmailError;
    }

    if (formData.telephone.length < 14) {
      newErrors.telephone = incompletePhoneNumber;
    }

    if (!formData.message) {
      newErrors.message = errorMessage;
    }

    setError(newErrors);

    if (
      newErrors.email ||
      newErrors.message ||
      newErrors.name ||
      newErrors.telephone
    ) {
      showErrorToast(ErrorToastNames.EmptyFields);
    } else {
      try {
        const messageData = {
          email: formData.email,
          message: formData.message,
          name: formData.name,
          telephone: formData.telephone,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/send-email-to-locale`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
          }
        );

        if (response.ok) {
          showSuccessToast(SuccessToastNames.SendMessage);
          setError({ email: '', message: '', name: '', telephone: '' });
          setFormData({
            email: '',
            message: '',
            name: '',
            telephone: '',
          });
        } else {
          showErrorToast(ErrorToastNames.SendMessage)
        }
      } catch (error) {
        console.log(error);
        showErrorToast(ErrorToastNames.ServerConnection);
      }
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
            className="lg:w-[770px] md:w-96 w-[250px] h-[44px] m-[10px] mb-0 rounded-[10px] border border-quaternary bg-tertiary p-2 required:border-red-500 md:mx-auto lg:mx-2 text-lg text-quaternary font-semibold"
            maxLength={30}
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
            className="lg:w-[770px] md:w-96 w-[250px] h-10 m-[10px] mb-0 rounded-[10px] border border-quaternary text-lg text-quaternary font-semibold bg-tertiary p-2 required:border-red-500 md:mx-auto lg:mx-2"
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
            maxLength={30}
            className="lg:w-[770px] md:w-96 w-[250px] h-[44px] m-[10px] mb-0 rounded-[10px] border border-quaternary bg-tertiary p-2 required:border-red-500 md:mx-auto lg:mx-2 text-lg text-quaternary font-semibold"
            style={error.email ? { border: '1px solid red' } : {}}
          />
          {error.email && (
            <label className="mx-[10px] text-red-500">{error.email}</label>
          )}
        </div>
        <div className="flex flex-col">
          <label className="font-bold lg:text-xl text-quaternary mx-[10px] mt-3">
            Deixe sua mensagem
          </label>
          <textarea
            className="mx-2 mb-0 border border-quaternary mt-1 lg:w-[770px] md:w-96 w-[250px] md:h-40 lg:h-20 bg-tertiary rounded-[10px] p-2 required:border-red-500 text-lg text-quaternary font-semibold"
            name="message"
            maxLength={500}
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
        <div className="flex justify-between w-full md:mb-2 gap-5 lg:mb-auto">
          <Link href={'/'}>
            <button
              className="md:w-52 w-28 h-10 bg-primary rounded-[50px] gap-2.5 mt-3 lg:float-right hover:bg-red-600 hover:text-tertiary hover:shadow-lg transition-all duration-200"
            >
              <p className="font-normal text-xl text-tertiary align-middle">
                Voltar
              </p>
            </button>
          </Link>
          <button
            onClick={handleContactField}
            className="md:w-52 w-28 h-10 bg-primary rounded-[50px] gap-2.5 mt-3 lg:float-right hover:bg-red-600 hover:text-tertiary hover:shadow-lg transition-all duration-200"
          >
            <p className="font-normal text-xl text-tertiary align-middle">
              Enviar
            </p>
          </button>

        </div>
      </div>
    </div>
  );
};

export default LocaleContact;
