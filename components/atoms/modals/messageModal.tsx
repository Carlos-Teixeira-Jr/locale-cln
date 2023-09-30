import Link from 'next/link';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import PhoneInput from '../masks/masks';
Modal.setAppElement('#__next');

export interface IMessageModal {
  isOpen: boolean;
  setModalIsOpen: any;
}

export interface IFormData {
  name: string;
  telephone: string;
  email: string;
  message: string;
}

const MessageModal: React.FC<IMessageModal> = ({ isOpen, setModalIsOpen }) => {
  const portalClassName = `modal-${uuidv4()}`;
  const [formData, setFormData] = useState<IFormData>({
    name: '',
    telephone: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    telephone: '',
    email: '',
    message: '',
  });

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

  const handleModalField = async (event: any) => {
    event.preventDefault();

    const newErrors = { name: '', telephone: '', email: '', message: '' };

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
    setErrors(newErrors);

    if (
      newErrors.name ||
      newErrors.email ||
      newErrors.telephone ||
      newErrors.message
    ) {
      return;
    }

    try {
      setModalIsOpen(false);
      // const response = await fetch('/api/rota-que-recebe-os-dados', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      // const data = await response.json();
      setErrors({ name: '', telephone: '', email: '', message: '' });
      setFormData({ name: '', telephone: '', email: '', message: '' });
    } catch (error) {
      console.log(error);
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
        },
        content: {
          zIndex: 9999,
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
          height: 'auto',
          width: 'auto',
          margin: '0 auto 0 auto',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <div className="bg-quinary">
        <h1 className="lg:w-fit lg:h-fit m-[5px] mt-0 font-bold md:text-2xl text-quaternary">
          Mande uma mensagem para [NOME DO RESPONSAVEL PELO IMÓVEL]
        </h1>
        <p className="font-bold lg:text-xl text-quaternary w-[221px] h-fit mx-[10px] mt-5">
          NOME
        </p>
        <input
          placeholder="Digite seu nome..."
          type="text"
          name="name"
          value={formData.name}
          className="lg:w-[770px] w-[250px] sm:w-full lg:h-[44px] m-[10px] mb-0 rounded-[10px] border border-quaternary bg-tertiary p-2 required:border-red-500 mr-0 md:mx-auto text-xl text-quaternary font-semibold lg:mx-2"
          onChange={handleMessageNameMask}
          style={errors.name ? { border: '1px solid red' } : {}}
        />
        {errors.name && (
          <label className="mx-[10px] text-red-500 mt-5">{errors.name}</label>
        )}
        <p className="font-bold lg:text-xl text-quaternary w-[221px] h-fit mx-[10px] mt-5">
          TELEFONE
        </p>
        <PhoneInput
          mask="(99) 99999-9999"
          placeholder="Digite seu telefone..."
          type="tel"
          name="telephone"
          value={formData.telephone}
          className="lg:w-[770px] w-[250px] sm:w-full h-[44px] m-[10px] mb-0 rounded-[10px] border border-quaternary  text-xl text-quaternary font-semibold bg-tertiary p-2 required:border-red-500 md:mx-auto lg:mx-2"
          onChange={(event: any) =>
            setFormData({ ...formData, telephone: event.target.value })
          }
          style={errors.telephone ? { border: '1px solid red' } : {}}
        />
        {errors.telephone && (
          <label className="mx-[10px] text-red-500 mt-5">
            {errors.telephone}
          </label>
        )}
        <p className="font-bold lg:text-xl text-quaternary w-[221px] h-fit mx-[10px] mt-5">
          E-MAIL
        </p>
        <input
          placeholder="Digite seu email..."
          name="email"
          value={formData.email}
          className="lg:w-[770px] w-[250px] sm:w-full h-[44px] m-[10px] mb-0 rounded-[10px] border border-quaternary bg-tertiary p-2 required:border-red-500 md:mx-auto lg:mx-2 text-xl text-quaternary font-semibold"
          onChange={handleEmailChange}
          style={errors.email ? { border: '1px solid red' } : {}}
        />
        {errors.email && (
          <label className="mx-[10px] text-red-500 mt-5">{errors.email}</label>
        )}
        <div className="flex flex-col">
          <label className="font-bold lg:text-xl text-quaternary mx-[10px] mt-5 h-fit">
            Deixe sua mensagem
          </label>
          <textarea
            className="mx-2 mb-0 border border-quaternary mt-1 h-[100px] bg-tertiary rounded-[10px] p-2 required:border-red-500 text-xl text-quaternary font-semibold"
            name="message"
            value={formData.message}
            placeholder="Olá, gostaria de mais informações a respeito do imóvel [CÓDIGO DO IMÓVEL] BLA BLA BLA..."
            onChange={(event) =>
              setFormData({ ...formData, message: event.target.value })
            }
            style={errors.message ? { border: '1px solid red' } : {}}
          />
          {errors.message && (
            <label className="mx-[10px] text-red-500">{errors.message}</label>
          )}
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-2 items-center ml-2">
          <div className="my-auto flex flex-row align-baseline">
            <Link
              href="/userTerms"
              target="_blank"
              className="font-normal lg:text-xl text-sm leading-6 text-blue-600"
            >
              Termos de uso &{'  '}
            </Link>
            <Link
              href="/privacyPolicies"
              target="_blank"
              className="font-normal lg:text-xl text-sm leading-6 text-blue-600 ml-2"
            >
              politica de privacidade
            </Link>
          </div>
          <div className="justify-center md:mb-2 lg:mb-auto">
            <button
              onClick={handleModalField}
              className="w-[249px] h-[40px] bg-primary rounded-[50px] p-[10px] gap-2.5 mt-2.5 lg:float-right"
            >
              <p className="font-normal text-xl text-tertiary leading-6 align-middle">
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