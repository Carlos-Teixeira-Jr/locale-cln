import Link from 'next/link';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import { IData } from '../../../common/interfaces/property/propertyData';
import { capitalizeFirstLetter } from '../../../common/utils/strings/capitalizeFirstLetter';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { applyNumericMask } from '../../../common/utils/masks/numericMask';
Modal.setAppElement('#__next');

export interface IMessageModal {
  isOpen: boolean;
  setModalIsOpen: (isopen: boolean) => void;
  propertyInfo: IData;
}

export interface IFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const MessageModal: React.FC<IMessageModal> = ({
  isOpen,
  setModalIsOpen,
  propertyInfo,
}) => {
  const ownerName = capitalizeFirstLetter(propertyInfo?.ownerInfo.name);
  const portalClassName = `modal-${uuidv4()}`;
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState<IFormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const inputs = [
    {
      key: 'name',
      label: 'Nome',
      value: formData.name,
      error: errors.name,
      type: 'text',
      onChange: (event: any) => {
        const name = event.target.value;
        const onlyLetters = /^[a-zA-Z\s]*$/;
        if (onlyLetters.test(name)) {
          setFormData({ ...formData, name: name });
        }
      },
    },
    {
      key: 'phone',
      label: 'Telefone',
      value: formData.phone,
      error: errors.phone,
      type: 'tel',
      onChange: (event: any) => {
        const input = event.target;
        const value = input.value;
        const maskedValue = applyNumericMask(value, '(99) 99999-9999');
        const selectionStart = input.selectionStart || 0;
        const selectionEnd = input.selectionEnd || 0;
        const previousValue = input.value;
        // Verifica se o cursor está no final da string ou se um caractere foi removido
        if (selectionStart === previousValue.length || previousValue.length > maskedValue.length) {
          input.value = maskedValue;
        } else {
          // Caso contrário, restaura o valor anterior e move o cursor para a posição correta
          input.value = previousValue;
          input.setSelectionRange(selectionStart, selectionEnd);
        }
        setFormData({ ...formData, phone: maskedValue });
      },
    },
    {
      key: 'email',
      label: 'E-mail',
      value: formData.email,
      error: errors.email,
      type: 'email',
      onChange: (event: any) => {
        const email = event.target.value;
        setFormData({ ...formData, email: email });
      },
    },
    {
      key: 'message',
      label: 'Mensagem',
      value: formData.message,
      error: errors.message,
      type: 'text',
      onChange: (event: any) => {
        const onlyLetters = /^[a-zA-Z\s]+$/;
        if (onlyLetters.test(event.target.value)) {
          setFormData({ ...formData, message: event.target.value });
        }
      },
    },
  ];

  const handleModalField = async (event: any) => {
    event.preventDefault();

    const errorMessage = 'Este campo é obrigatório.';
    const invalidEmailError = 'O formato do e-mail informado não é válido.'

    const newErrors = {
      name: !formData.name ? errorMessage : '',
      email: !formData.email
        ? errorMessage
        : !validator.isEmail(formData.email)
        ? invalidEmailError
        : '',
      phone: !formData.phone.length ? errorMessage : '',
      message: !formData.message ? errorMessage : '',
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((item) => item !== '');

    if (hasErrors) {
      toast.error('Você esqueceu de preencher algum campo obrigatório!');
    } else {
      try {
        const body = {
          ownerId: propertyInfo.owner,
          propertyId: propertyInfo._id,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/message`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }
        );

        if (response.ok) {
          toast.success(
            'Sua mensagem foi enviada ao proprietário do imóvel com sucesso!'
          );
          setModalIsOpen(false);
        } else {
          toast.error(
            'Houve um problema ao tentar enviar a mensagem. Tente novamente mais tarde.',
            { className: 'z-[60]' }
          );
        }
      } catch (error) {
        console.log(error);
        toast.error(
          'Não foi possível se conectar ao servidor. Por favor, tente novamente mais tarde.',
          { className: 'z-[60]' }
        );
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setModalIsOpen(false)}
      contentLabel="Message modal"
      portalClassName={portalClassName}
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          zIndex: 50,
        },
        content: {
          zIndex: 40,
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          border: '1px solid #ccc',
          background: 'rgba(255, 255, 255)',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '30px',
          outline: 'none',
          padding: '10px',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          height: 'fit-content',
          width: isMobile ? '90%' : 'fit-content',
          margin: '0 auto 0 auto',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <div className="bg-quinary p-2">
        <h1 className="lg:w-fit lg:h-fit m-1 mt-0 font-bold md:text-xl text-quaternary">
          Mande uma mensagem para{' '}
          {ownerName ? ownerName : 'o responsável pelo imóvel.'}
        </h1>

        {inputs.map((input) => (
          <div key={input.key} className="py-2">
            <h2 className="font-bold lg:text-lg text-quaternary h-fit mx-2">
              {input.label}
            </h2>
            {input.key === 'message' ? (
              <textarea
                value={input.value}
                className="w-full h-fit md:m-2 mb-0 rounded-[10px] border border-quaternary bg-tertiary p-1 required:border-red-500 mr-0 md:mx-auto text-md text-quaternary font-semibold"
                onChange={input.onChange}
              />
            ) : (
              <input
                type={input.type}
                value={input.value}
                className="w-full h-fit md:m-2 lg:m-0 rounded-[10px] border border-quaternary bg-tertiary p-1 required:border-red-500 mr-0 md:mx-auto md:text-xl text-quaternary font-semibold"
                onChange={input.onChange}
              />
            )}
            {input.error && (
              <label className="text-sm text-red-500 mt-5">
                {input.error}
              </label>
            )}
          </div>
        ))}

        <div className="flex flex-col lg:grid items-center">
          <div className="my-auto flex flex-row align-baseline mb-2">
            <Link
              href="/userTerms"
              target="_blank"
              className="font-normal lg:text-sm text-sm leading-6 text-blue-600"
            >
              <p className="font-normal lg:text-sm text-sm leading-6 text-blue-600">
                Termos de uso & política de privacidade
              </p>
            </Link>
          </div>
          <div className="justify-center md:mb-2 lg:mb-auto">
            <button
              onClick={handleModalField}
              className="w-60 bg-primary rounded-[50px] p-2 gap-2.5 lg:float-right"
            >
              <p className="font-normal text-lg text-tertiary align-middle">
                Enviar
              </p>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MessageModal;
