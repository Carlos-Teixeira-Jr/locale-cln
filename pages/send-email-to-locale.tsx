import Link from 'next/link';
import { useRef, useState } from 'react';
import validator from 'validator';
import { ErrorToastNames, SuccessToastNames, showErrorToast, showSuccessToast } from '../common/utils/toasts';
import Loading from '../components/atoms/loading';
import PhoneInput from '../components/atoms/masks/masks';
import { NextPageWithLayout } from './page';

interface ILocaleContact {
  name: string;
  telephone: string;
  email: string;
  message: string;
}

type InputType = {
  key: number;
  placeholder: string;
  name: keyof ILocaleContact;
  type: string;
  label: string;
  value: string;
  className: string;
  maxLength?: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: any;
}

const LocaleContact: NextPageWithLayout = () => {

  const telephoneRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<ILocaleContact>({
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

  const inputs: InputType[] = [
    {
      key: 0,
      placeholder: "Digite seu nome...",
      name: "name",
      type: "text",
      label: "Nome",
      value: formData.name,
      className: "lg:w-[770px] md:w-96 w-[250px] h-[44px] m-[10px] mb-0 rounded-[10px] border border-quaternary bg-tertiary p-2 required:border-red-500 md:mx-auto lg:mx-2 text-lg text-quaternary font-semibold",
      maxLength: 30,
      onChange: (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        const onlyLetters = /^[a-zA-Z\s]+$/;
        if (event.target.value === '' || onlyLetters.test(event.target.value)) {
          setFormData({ ...formData, name: event.target.value });
        }
      }
    },
    {
      key: 1,
      placeholder: "Digite seu telefone...",
      name: "telephone",
      type: "tel",
      label: "Telefone",
      value: formData.telephone,
      className: "lg:w-[770px] md:w-96 w-[250px] h-10 m-[10px] mb-0 rounded-[10px] border border-quaternary text-lg text-quaternary font-semibold bg-tertiary p-2 required:border-red-500 md:mx-auto lg:mx-2",
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, telephone: event.target.value }),
      ref: telephoneRef,
    },
    {
      key: 2,
      placeholder: "Digite seu email...",
      name: "email",
      type: "email",
      label: "Email",
      value: formData.email,
      className: "lg:w-[770px] md:w-96 w-[250px] h-[44px] m-[10px] mb-0 rounded-[10px] border border-quaternary bg-tertiary p-2 required:border-red-500 md:mx-auto lg:mx-2 text-lg text-quaternary font-semibold",
      maxLength: 50,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        const email = event.target.value;
        setFormData({ ...formData, email: email });
      }
    },
  ];

  const handleSubmit = async () => {
    setLoading(true);

    const errorMessage = 'Este campo é obrigatório.';
    const invalidEmailError = 'O formato do e-mail informado não é válido.'
    const incompletePhoneNumber = 'O número do telefone está incompleto.'

    const newErrors = { email: '', message: '', name: '', telephone: '' };

    if (!formData.name) newErrors.name = errorMessage;
    if (!formData.email) newErrors.email = errorMessage;
    if (!validator.isEmail(formData.email)) newErrors.email = invalidEmailError;
    if (formData.telephone.length < 14) newErrors.telephone = incompletePhoneNumber;
    if (!formData.message) newErrors.message = errorMessage;

    setError(newErrors);

    if (
      newErrors.email ||
      newErrors.message ||
      newErrors.name ||
      newErrors.telephone
    ) {
      showErrorToast(ErrorToastNames.EmptyFields);
      setLoading(false);
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
          setLoading(false);
        } else {
          showErrorToast(ErrorToastNames.SendMessage);
          setLoading(false);
        }
      } catch (error) {
        showErrorToast(ErrorToastNames.ServerConnection);
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-gray-200 flex flex-col items-center justify-center w-full h-screen">
      <div className="bg-quinary flex flex-col items-center max-w-[1232px] h-fit rounded-lg p-3">
        <h1 className="lg:w-fit lg:h-fit m-[5px] mt-0 font-bold md:text-2xl text-quaternary">
          Mande uma mensagem para a Locale
        </h1>

        {inputs.map((input) => {
          if (input.name !== "telephone") {
            return (
              <div className="flex flex-col" key={input.key}>
                <label className="font-bold lg:text-xl text-quaternary mx-[10px] mt-3 h-fit">
                  {input.label}
                </label>
                <input
                  placeholder={input.placeholder}
                  name={input.name}
                  type={input.type}
                  value={input.value}
                  onChange={input.onChange}
                  className={input.className}
                  maxLength={input.maxLength}
                  style={error[input.name] ? { border: '1px solid red' } : {}}
                />
                {error.name && (
                  <label className="mx-[10px] text-red-500 text-sm">{error[input.name]}</label>
                )}
              </div>
            )
          } else {
            return (
              <div className="flex flex-col" key={input.key}>
                <label className="font-bold lg:text-xl text-quaternary mx-[10px] mt-3 h-fit">
                  {input.label}
                </label>
                <PhoneInput
                  mask="(99) 99999-9999"
                  placeholder={input.placeholder}
                  type={input.type}
                  name={input.name}
                  value={input.value}
                  className={input.className}
                  onChange={input.onChange}
                  style={error.telephone ? { border: '1px solid red' } : {}}
                  inputRef={telephoneRef}
                />
                {error.telephone && (
                  <label className="mx-[10px] text-red-500 text-sm">{error.telephone}</label>
                )}
              </div>
            )
          }
        })}

        <label className="font-bold lg:text-xl text-quaternary mx-[10px] mt-3 lg:w-[770px]">
          Deixe sua mensagem
        </label>
        <textarea
          className="mx-2 mb-0 border border-quaternary mt-1 lg:w-[770px] md:w-96 w-[250px] md:h-40 lg:h-28 bg-tertiary rounded-[10px] p-2 required:border-red-500 text-lg text-quaternary font-semibold"
          name="message"
          maxLength={900}
          value={formData.message}
          placeholder={'Digite sua mensagem para a Locale.'}
          style={error.message ? { border: '1px solid red' } : {}}
          onChange={(event) =>
            setFormData({ ...formData, message: event.target.value })
          }
        />
        {error.message && (
          <label className="mx-[10px] text-red-500 text-sm lg:w-[770px]">{error.message}</label>
        )}

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
            onClick={handleSubmit}
            disabled={loading}
            className={`md:w-52 w-28 h-10 flex justify-center rounded-[50px] md:gap-2.5 mt-3 lg:float-right hover:text-tertiary hover:shadow-lg transition-all duration-200 ${loading ? 'bg-red-300' : 'hover:bg-red-600 bg-primary'}`}
          >
            <p className={`font-normal text-xl text-tertiary align-middle transition-transform my-auto ${loading ? 'transform -translate-x-2' : 'transform -translate-x-0'}`}>
              Enviar
            </p>
            {loading && <span className='pt-1'><Loading /></span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocaleContact;
