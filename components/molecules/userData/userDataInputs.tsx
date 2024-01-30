import React, { ChangeEvent, useEffect, useState } from 'react';
import { IOwnerData } from '../../../common/interfaces/owner/owner';
import {
  IUserDataComponent,
  IUserDataComponentErrors,
} from '../../../common/interfaces/user/user';
import { applyNumericMask } from '../../../common/utils/masks/numericMask';
import CameraIcon from '../../atoms/icons/cameraIcon';
import WhatsAppIcon from '../../atoms/icons/wppIcon';
import ErrorOnUpdateModal from '../../atoms/modals/errorOnUpdateModal';
import SuccessOnUpdateModal from '../../atoms/modals/successOnUpdateModal';
import Image from '../uploadImages/uploadProfilePic';

export type UserDataErrorsTypes = {
  username: string;
  email: string;
  cpf: string;
  cellPhone: string;
};

type Input = {
  key: string;
  label: string;
  value: string;
  ref?: any;
  maxLenght?: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

interface IUserDataInputs {
  userData?: IOwnerData;
  isEdit: boolean;
  onUserDataUpdate: (updatedUserData: IUserDataComponent) => void;
  urlEmail?: string | undefined;
  error: UserDataErrorsTypes;
  userDataInputRefs?: any;
  profilePicPropertyData?: string;
  firstProperty?: any;
}

const UserDataInputs: React.FC<IUserDataInputs> = ({
  userData,
  isEdit,
  onUserDataUpdate,
  urlEmail,
  error,
  userDataInputRefs,
  profilePicPropertyData,
  firstProperty,
}) => {
  const userDataErrorScroll = {
    ...userDataInputRefs,
  };
  const [images, setImages] = useState<any>('');

  // Whatsapp
  const [isSameNumber, setIsSameNumber] = useState(true);
  const [wppNumber, setWappNumber] = useState('');

  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  const [succesModalIsOpen, setSuccesModalIsOpen] = useState(false);

  const phone = userData && userData?.owner ? userData?.owner.phone : '';

  const [formData, setFormData] = useState<IUserDataComponent>({
    username: firstProperty.ownerInfo.name
      ? firstProperty.ownerInfo.name
      : userData?.user?.username,
    email: firstProperty.ownerInfo.email
      ? firstProperty.ownerInfo.email
      : userData?.user?.email,
    cpf: userData ? userData?.user?.cpf : '',
    cellPhone: userData && userData.owner ? userData.owner.cellPhone : '',
    profilePicture: firstProperty.ownerInfo.profilePicture
      ? firstProperty.ownerInfo.profilePicture
      : images,
    phone: wppNumber ? wppNumber : phone,
  });

  useEffect(() => {
    console.log('profilePicture:', formData.profilePicture);
  }, [formData.profilePicture]);

  // useEffect(() => {
  //   console.log('images (foto adicionada no input:', images);
  //   console.log(
  //     'profilePicture (foto que vai para o formulario do step3):',
  //     formData.profilePicture
  //   );
  //   setImages(images);
  //   setFormData({ ...formData, profilePicture: images });
  // }, [images]);

  // Pega o email da url caso o usuário tenha passado o mesmo no início do cadastro na pagina announcement;
  useEffect(() => {
    if (urlEmail) {
      setFormData({ ...formData, email: urlEmail });
    }
    console.log('numero do wpp:', wppNumber);
  }, [urlEmail, wppNumber]);

  const [userDataErrors, setUserDataErrors] =
    useState<IUserDataComponentErrors>({
      username: '',
      email: '',
      cpf: '',
      cellPhone: '',
    });

  useEffect(() => {
    setUserDataErrors(error);
  }, [error]);

  // Realiza o auto-scroll para o input que apresenta erro;
  useEffect(() => {
    const scrollToError = (errorKey: keyof typeof userDataErrors) => {
      if (
        userDataErrors[errorKey] !== '' &&
        userDataInputRefs[errorKey]?.current
      ) {
        userDataErrorScroll[errorKey]?.current.scrollIntoView({
          behavior: 'auto',
          block: 'center',
        });
      }
    };

    scrollToError('username');
    scrollToError('email');
    scrollToError('cpf');
    scrollToError('cellPhone');
  }, [userDataErrors]);

  // Envia os dados do usuário para o componente pai;
  useEffect(() => {
    onUserDataUpdate(formData);
  }, [formData]);

  const inputs: Input[] = [
    {
      key: 'username',
      label: 'Nome Completo',
      value: formData.username,
      maxLenght: 50,
      ref: userDataErrorScroll.username,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const maskedValue = value.replace(/[^A-Za-z\sÀ-ú]/g, '');
        setFormData({ ...formData, username: maskedValue });
      },
    },
    {
      key: 'email',
      label: 'E-mail',
      value: formData.email,
      maxLenght: 50,
      ref: userDataErrorScroll.email,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormData({ ...formData, email: value });
      },
    },
    {
      key: 'cpf',
      label: 'CPF',
      value: formData.cpf,
      ref: userDataErrorScroll.cpf,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target;
        const value = input.value;
        const maskedValue = applyNumericMask(value, '999.999.999-99');
        const selectionStart = input.selectionStart || 0;
        const selectionEnd = input.selectionEnd || 0;
        const previousValue = input.value;
        // Verifica se o cursor está no final da string ou se um caractere foi removido
        if (
          selectionStart === previousValue.length ||
          previousValue.length > maskedValue.length
        ) {
          input.value = maskedValue;
        } else {
          // Caso contrário, restaura o valor anterior e move o cursor para a posição correta
          input.value = previousValue;
          input.setSelectionRange(selectionStart, selectionEnd);
        }
        setFormData({ ...formData, cpf: maskedValue });
      },
    },
    {
      key: 'cellPhone',
      label: 'Celular',
      value: formData.cellPhone,
      ref: userDataErrorScroll.cellPhone,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target;
        const value = input.value;
        const maskedValue = applyNumericMask(value, '(99) 99999-9999');
        const selectionStart = input.selectionStart || 0;
        const selectionEnd = input.selectionEnd || 0;
        const previousValue = input.value;
        // Verifica se o cursor está no final da string ou se um caractere foi removido
        if (
          selectionStart === previousValue.length ||
          previousValue.length > maskedValue.length
        ) {
          input.value = maskedValue;
        } else {
          // Caso contrário, restaura o valor anterior e move o cursor para a posição correta
          input.value = previousValue;
          input.setSelectionRange(selectionStart, selectionEnd);
        }
        setFormData({ ...formData, cellPhone: maskedValue });
      },
    },
    {
      key: 'phone',
      label: 'Telefone residencial',
      value: formData.phone,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target;
        const value = input.value;
        const maskedValue = applyNumericMask(value, '(99) 9999-9999');
        const selectionStart = input.selectionStart || 0;
        const selectionEnd = input.selectionEnd || 0;
        const previousValue = input.value;
        // Verifica se o cursor está no final da string ou se um caractere foi removido
        if (
          selectionStart === previousValue.length ||
          previousValue.length > maskedValue.length
        ) {
          input.value = maskedValue;
        } else {
          // Caso contrário, restaura o valor anterior e move o cursor para a posição correta
          input.value = previousValue;
          input.setSelectionRange(selectionStart, selectionEnd);
        }
        setFormData({ ...formData, phone: maskedValue });
      },
    },
  ];

  const handleAddImage = (event: any) => {
    const files = event.target.files;

    if (files.length === 0) {
      return;
    }

    if (files.length > 1 || images) {
      alert('Você só pode adicionar uma imagem');
      return;
    }

    const file = files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      //setImages(reader.result);
      setFormData({ ...formData, profilePicture: String(reader.result) });
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    //setImages(null);
    setFormData({ ...formData, profilePicture: '' });

    const fileInput = document.getElementById(
      'uploadImages'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="mx-5">
      <h1 className="md:text-3xl text-2xl leading-10 text-quaternary font-bold md:mb-10">
        {isEdit ? 'Dados Pessoais' : 'Informações para contratação'}
      </h1>
      <div className="my-5">
        {/** ADICIONAR IMAGEM DE PERFIL */}
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-xl font-normal text-quaternary leading-7">
            Adicionar foto de perfil (Opcional)
          </h1>
          <div className="flex items-center">
            {formData.profilePicture && (
              <Image
                key={
                  formData.profilePicture
                    ? formData.profilePicture
                    : `${formData.profilePicture}`
                }
                id={formData.profilePicture}
                src={formData.profilePicture}
                index={0}
                onRemove={handleRemoveImage}
                alt={'Foto de perfil'}
              />
            )}
          </div>
          <label
            className="flex flex-row items-center px-6 w-64 h-12 border rounded-[50px] bg-secondary cursor-pointer mt-4 "
            htmlFor="uploadImages"
          >
            <CameraIcon />
            <span className="font-bold text-quinary text-2xl">
              Adicionar foto
            </span>
          </label>
          <div className="hidden">
            {' '}
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webm"
              multiple={false}
              onChange={handleAddImage}
              style={{ display: 'hidden' }}
              id="uploadImages"
              title=""
            />
          </div>
        </div>
        {/** FIM */}
        <div>
          <div className="my-5 w-full" ref={inputs[0].ref}>
            <h3 className="text-xl font-normal text-quaternary leading-7">
              {inputs[0].label}
            </h3>
            <input
              className="border w-full p-5 h-12 border-quaternary rounded-[10px] bg-tertiary font-bold text-xl md:text-2xl text-quaternary leading-7 drop-shadow-xl"
              onChange={inputs[0].onChange}
              value={inputs[0].value}
              required
              maxLength={inputs[0].maxLenght}
              style={userDataErrors.username ? { border: '1px solid red' } : {}}
            />
            {userDataErrors.username && (
              <span className="text-red-500 text-xs">
                {userDataErrors.username}
              </span>
            )}
          </div>

          <div className="my-5 mx-auto flex flex-col md:flex-row w-full gap-5 md:gap-10">
            {inputs.slice(1, 3).map((input: Input) => (
              <div key={input.key} className="w-full" ref={input.ref}>
                <h3 className="text-xl font-normal text-quaternary leading-7">
                  {input.label}
                </h3>
                <input
                  className="border w-full p-5 h-12 border-quaternary rounded-[10px] bg-tertiary font-bold text-xl md:text-2xl text-quaternary leading-7 drop-shadow-xl"
                  onChange={input.onChange}
                  value={input.value}
                  maxLength={
                    input.key === 'username' || input.key === 'email'
                      ? input.maxLenght
                      : undefined
                  }
                  required
                  style={
                    userDataErrors[input.key] !== ''
                      ? { border: '1px solid red' }
                      : {}
                  }
                />
                {Object.keys(userDataErrors).includes('input.key') && (
                  <span className="text-red-500 text-xs">
                    {userDataErrors[input.key]}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="my-5 mx-auto flex flex-col md:flex-row w-full gap-5 md:gap-10">
            {inputs.slice(3).map((input: Input) => (
              <div key={input.key} className="w-full" ref={input.ref}>
                <h3 className="text-xl font-normal text-quaternary leading-7">
                  {input.label}
                </h3>
                <input
                  className="border w-full p-5 h-12 border-quaternary rounded-[10px] bg-tertiary font-bold text-xl md:text-2xl text-quaternary leading-7 drop-shadow-xl"
                  onChange={input.onChange}
                  value={input.value}
                  maxLength={
                    input.key === 'username' || input.key === 'email'
                      ? input.maxLenght
                      : undefined
                  }
                  style={
                    Object.keys(userDataErrors).includes(input.key) &&
                    userDataErrors[input.key] !== ''
                      ? { border: '1px solid red' }
                      : {}
                  }
                />
                {Object.keys(userDataErrors).includes(input.key) &&
                  userDataErrors[input.key] !== '' && (
                    <span className="text-red-500 text-xs">
                      {userDataErrors[input.key]}
                    </span>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/**Whatsapp */}
        <div className="flex flex-row">
          <button
            className={` w-8 h-8 rounded-full bg-tertiary drop-shadow-lg mr-5 flex justify-center cursor-pointer ${
              !isSameNumber
                ? 'border-[3px] border-secondary'
                : 'border border-quaternary'
            }`}
            onClick={() => setIsSameNumber(!isSameNumber)}
          >
            {!isSameNumber && (
              <div className="bg-secondary w-4 h-4 rounded-full mt-[5px]"></div>
            )}
          </button>
          <div className="flex flex-row gap-1">
            <h1
              className={`text-lg leading-10 font-normal cursor-pointer ${
                !isSameNumber ? 'text-secondary' : 'text-quaternary'
              }`}
            >
              Este não é o meu{' '}
              <span className="text-green-500 text-lg font-semibold mr-2">
                WhatsApp
              </span>
            </h1>
            <WhatsAppIcon />
          </div>
        </div>

        <div className="flex flex-col">
          {!isSameNumber && (
            <div className="flex flex-col">
              <div className="max-w-[250px]" ref={userDataErrorScroll.whatsapp}>
                <h3 className="text-xl font-normal text-quaternary leading-7">
                  WhatsApp
                </h3>
                <input
                  style={
                    userDataErrors.whatsapp ? { border: '1px solid red' } : {}
                  }
                  className="border w-full p-5 h-12 border-quaternary rounded-[10px] bg-tertiary font-bold text-xl md:text-2xl text-quaternary leading-7 drop-shadow-xl"
                  value={wppNumber}
                  maxLength={200}
                  required={isSameNumber ? false : true}
                  onChange={(event) => {
                    const input = event.target;
                    const value = input.value;
                    const maskedValue = applyNumericMask(
                      value,
                      '(99) 99999-9999'
                    );
                    const selectionStart = input.selectionStart || 0;
                    const selectionEnd = input.selectionEnd || 0;
                    const previousValue = input.value;
                    if (
                      selectionStart === previousValue.length ||
                      previousValue.length > maskedValue.length
                    ) {
                      input.value = maskedValue;
                    } else {
                      input.value = previousValue;
                      input.setSelectionRange(selectionStart, selectionEnd);
                    }
                    setWappNumber(maskedValue);
                  }}
                />
                {userDataErrors.whatsapp && (
                  <span className="text-red-500 text-xs">
                    {userDataErrors.whatsapp}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {errorModalIsOpen ? (
        <ErrorOnUpdateModal
          errorModalIsOpen={errorModalIsOpen}
          setErrorModalIsOpen={setErrorModalIsOpen}
        />
      ) : (
        <SuccessOnUpdateModal
          successModalIsOpen={succesModalIsOpen}
          setSuccessModalIsOpen={setSuccesModalIsOpen}
        />
      )}
    </div>
  );
};

export default UserDataInputs;
