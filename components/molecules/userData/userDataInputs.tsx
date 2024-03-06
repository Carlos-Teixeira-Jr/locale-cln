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
  picture?: string;
  firstProperty?: any;
}

const UserDataInputs: React.FC<IUserDataInputs> = ({
  userData,
  isEdit,
  onUserDataUpdate,
  urlEmail,
  error,
  userDataInputRefs,
  picture,
  firstProperty,
}) => {
  const userDataErrorScroll = {
    ...userDataInputRefs,
  };
  const [images, setImages] = useState<any>('');

  const [isSameNumber, setIsSameNumber] = useState(true);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  const [succesModalIsOpen, setSuccesModalIsOpen] = useState(false);

  const phone = userData && userData?.owner ? userData?.owner.phone : '';

  const [formData, setFormData] = useState<IUserDataComponent>({
    username: firstProperty?.ownerInfo?.name
      ? firstProperty?.ownerInfo?.name
      : userData?.user?.username,
    email: firstProperty?.ownerInfo?.email
      ? firstProperty?.ownerInfo?.email
      : userData?.user?.email,
    cpf: userData ? userData?.user?.cpf : '',
    cellPhone: userData && userData.owner ? userData.owner.cellPhone : '',
    picture: picture ? picture : '',
    phone: userData && userData.owner ? userData.owner.phone : '',
    wppNumber: userData ? userData?.owner?.wppNumber : '',
  });

  useEffect(() => {
    if (urlEmail) {
      setFormData({ ...formData, email: urlEmail });
    }
  }, [urlEmail]);

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
        if (
          selectionStart === previousValue.length ||
          previousValue.length > maskedValue.length
        ) {
          input.value = maskedValue;
        } else {
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
        if (
          selectionStart === previousValue.length ||
          previousValue.length > maskedValue.length
        ) {
          input.value = maskedValue;
        } else {
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
        if (
          selectionStart === previousValue.length ||
          previousValue.length > maskedValue.length
        ) {
          input.value = maskedValue;
        } else {
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
      setFormData({ ...formData, picture: String(reader.result) });
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, picture: '' });

    const fileInput = document.getElementById(
      'uploadImages'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const classes = {
    title: 'text-lg font-normal text-quaternary leading-7',
    input:
      'border w-full p-5 h-12 border-quaternary rounded-[10px] bg-tertiary font-bold  text-sm md:text-base text-quaternary leading-7 drop-shadow-xl',
    error: 'text-red-500 text-xs',
  };

  return (
    <div className="mx-5">
      <h1 className="md:text-2xl text-lg leading-10 text-quaternary font-bold md:mb-10">
        {isEdit ? 'Dados Pessoais' : 'Informações para contratação'}
      </h1>
      <div className="my-5">
        <div className="flex flex-col justify-center items-center">
          <h1 className={classes.title}>Adicionar foto de perfil (Opcional)</h1>
          <div className="flex items-center">
            {formData.picture && (
              <Image
                key={
                  formData.picture
                    ? formData.picture
                    : `${formData.picture}`
                }
                id={formData.picture}
                src={formData.picture}
                index={0}
                onRemove={handleRemoveImage}
                alt={'Foto de perfil'}
              />
            )}
          </div>
          <label
            className="flex flex-row items-center justify-center px-6 w-56 h-12 border rounded-[50px] bg-secondary cursor-pointer mt-4 "
            htmlFor="uploadImages"
          >
            <CameraIcon />
            <span className="font-bold text-quinary text-lg">
              Adicionar foto
            </span>
          </label>
          <div className="hidden">
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
        <div>
          <div className="my-5 w-full" ref={inputs[0].ref}>
            <h3 className={classes.title}>{inputs[0].label}</h3>
            <input
              className={classes.input}
              onChange={inputs[0].onChange}
              value={inputs[0].value}
              required
              maxLength={inputs[0].maxLenght}
              style={userDataErrors.username ? { border: '1px solid red' } : {}}
            />
            {userDataErrors.username && (
              <span className={classes.error}>{userDataErrors.username}</span>
            )}
          </div>

          <div className="my-5 mx-auto flex flex-col md:flex-row w-full gap-5 md:gap-10">
            {inputs.slice(1, 3).map((input: Input) => (
              <div key={input.key} className="w-full" ref={input.ref}>
                <h3 className={classes.title}>{input.label}</h3>
                <input
                  className={classes.input}
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
                  <span className={classes.error}>
                    {userDataErrors[input.key]}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="my-5 mx-auto flex flex-col md:flex-row w-full gap-5 md:gap-10">
            {inputs.slice(3).map((input: Input) => (
              <div key={input.key} className="w-full" ref={input.ref}>
                <h3 className={classes.title}>{input.label}</h3>
                <input
                  className={classes.input}
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
                    <span className={classes.error}>
                      {userDataErrors[input.key]}
                    </span>
                  )}
              </div>
            ))}
          </div>
        </div>
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
              className={`text-base leading-10 font-normal cursor-pointer ${
                !isSameNumber ? 'text-secondary' : 'text-quaternary'
              }`}
            >
              Este não é o meu{' '}
              <span className="text-green-500 text-base font-semibold mr-2">
                WhatsApp
              </span>
            </h1>
            <WhatsAppIcon />
          </div>
        </div>

        <div className="flex flex-col">
          {!isSameNumber && (
            <div className="flex flex-col">
              <div
                className="md:max-w-[250px]"
                ref={userDataErrorScroll.whatsapp}
              >
                <h3 className="text-xl font-normal text-quaternary leading-7">
                  WhatsApp
                </h3>
                <input
                  style={
                    userDataErrors.whatsapp ? { border: '1px solid red' } : {}
                  }
                  className={classes.input}
                  value={formData.wppNumber}
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
                    setFormData({...formData, wppNumber: maskedValue});
                  }}
                />
                {userDataErrors.whatsapp && (
                  <span className={classes.error}>
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
