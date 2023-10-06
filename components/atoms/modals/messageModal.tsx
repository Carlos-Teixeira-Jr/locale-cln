import Link from 'next/link';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import { toast } from 'react-toastify';
import { IData } from '../../../common/interfaces/property/propertyData';
import { capitalizeFirstLetter } from '../../../common/utils/strings/capitalizeFirstLetter';
Modal.setAppElement('#__next');

export interface IMessageModal {
  isOpen: boolean;
  setModalIsOpen: (isopen: boolean) => void;
  propertyInfo: IData
}

export interface IFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const MessageModal: React.FC<IMessageModal> = ({ isOpen, setModalIsOpen, propertyInfo }) => {

  const ownerName = propertyInfo ? capitalizeFirstLetter(propertyInfo?.ownerInfo.name) : 'o responsável pelo imóvel';
  const portalClassName = `modal-${uuidv4()}`;
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
      label: "Nome",
      value: formData.name,
      error: errors.name,
      onChange: (event: any) => {
        const name = event.target.value;
        setFormData({ ...formData, name: name });
      }
    },
    {
      key: 'phone',
      label: "Telefone",
      value: formData.phone,
      error: errors.phone,
      onChange: (event: any) => {
        setFormData({ ...formData, phone: event.target.value })
      }
    },
    {
      key: 'email',
      label: "E-mail",
      value: formData.email,
      error: errors.email,
      onChange: (event: any) => {
        const email = event.target.value;
        setFormData({ ...formData, email: email });
      }
    },
    {
      key: 'message',
      label: "Mensagem",
      value: formData.message,
      error: errors.message,
      onChange: (event: any) => {
        const onlyLetters = /^[a-zA-Z\s]+$/;
        if (onlyLetters.test(event.target.value)) {
          setFormData({ ...formData, message: event.target.value });
        }
      }
    },
  ];

  const handleModalField = async (event: any) => {
    event.preventDefault();

    setErrors({
      name: '',
      email: '',
      phone: '',
      message: ''
    });

    const errorMessage = 'Este campo é obrigatório.'
    const newErrors = { name: '', phone: '', email: '', message: '' };

    if (!formData.name) newErrors.name = errorMessage;
    if (!formData.email) newErrors.email = errorMessage;
    if (!validator.isEmail(formData.email)) newErrors.email = errorMessage;
    if (!formData.phone.length) newErrors.phone = errorMessage;
    if (!formData.message) newErrors.message = errorMessage;

    setErrors(newErrors);

    if (
      newErrors.name ||
      newErrors.email ||
      newErrors.phone ||
      newErrors.message
    ) {
      toast.error('Você esqueceu de preencher algum campo obrigatário!');
    }

    try {
      console.log("🚀 ~ file: messageModal.tsx:121 ~ handleModalField ~ formData:", formData)

      const baseUrl = process.env.BASE_API_URL;
      const response = await fetch(`${baseUrl}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Sua mensagem foi enviada ao proprietário do imóvel com sucesso!');
      }
    } catch (error) {
      console.log(error);
      toast.error('Não foi possível se conectar ao servidor. Por favor, tente novamente mais tarde.');
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
          zIndex: 999999
        },
        content: {
          zIndex: 9999999999,
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
          width: 'fit-content',
          margin: '0 auto 0 auto',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <div className="bg-quinary">
        <h1 className="lg:w-fit lg:h-fit m-1 mt-0 font-bold md:text-xl text-quaternary">
          Mande uma mensagem para {ownerName}
        </h1>

        {inputs.map((input) => (
          <div key={input.key} className='p-2'>
            <h2 className="font-bold lg:text-lg text-quaternary h-fit mx-2">{input.label}</h2>
            {input.key === 'message' ? (
              <textarea
                value={input.value}
                className='w-full h-fit m-2 mb-0 rounded-[10px] border border-quaternary bg-tertiary p-1 required:border-red-500 mr-0 md:mx-auto text-md text-quaternary font-semibold'
                onChange={input.onChange}
              />
            ) : (
              <input
                type='text'
                value={input.value}
                className='w-full h-fit m-2 mb-0 rounded-[10px] border border-quaternary bg-tertiary p-1 required:border-red-500 mr-0 md:mx-auto text-xl text-quaternary font-semibold'
                onChange={input.onChange}
              />
            )}
            {input.error && (
              <label className="mx-[10px] text-red-500 mt-5">{input.error}</label>
            )}
          </div>
        ))}

        <div className="flex flex-col lg:grid lg:grid-cols-2 items-center ml-2">
          <div className="my-auto flex flex-row align-baseline">
            <Link
              href="/userTerms"
              target="_blank"
              className="font-normal lg:text-sm text-sm leading-6 text-blue-600"
            >
              Termos de uso &{'  '}
            </Link>
            <Link
              href="/privacyPolicies"
              target="_blank"
              className="font-normal lg:text-sm text-sm leading-6 text-blue-600 ml-2"
            >
              politica de privacidade
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