import React, { ChangeEvent, useEffect, useState } from 'react'
import { IUserDataComponent, IUserDataComponentErrors } from '../../../common/interfaces/user/user';
import ErrorOnUpdateModal from '../../atoms/modals/errorOnUpdateModal';
import SuccessOnUpdateModal from '../../atoms/modals/successOnUpdateModal';
import { OnErrorInfo } from '../uploadImages/uploadImages';
import { IOwnerData } from '../../../common/interfaces/owner/owner';
import { applyNumericMask } from '../../../common/utils/masks/numericMask';
import { resetObjectToEmptyStrings } from '../../../common/utils/resetObjects';

type Input = {
  key: string,
  label: string,
  value: string,
  onChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

interface IUserDataInputs {
  userData?: IOwnerData
  isEdit: boolean
  onUserDataUpdate: (updatedUserData: IUserDataComponent) => void;
  onErrorsInfo: OnErrorInfo
  urlEmail?: string | undefined
}

const userDataInputs: React.FC<IUserDataInputs> = ({
  userData, 
  isEdit,
  onUserDataUpdate,
  onErrorsInfo,
  urlEmail
}) => {

  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  const [succesModalIsOpen, setSuccesModalIsOpen] = useState(false);

  const [formData, setFormData] = useState<IUserDataComponent>({
    username: userData ? userData.user.username : '',
    email: userData ? userData.user.email : '',
    cpf: userData ? userData.user.cpf : '',
    cellPhone: userData && userData.owner ? userData.owner.phones[0] : '',
    phone: userData && userData.owner ? userData.owner.phones[1] : '',
  });

  useEffect(() => {
    if (urlEmail) {
      setFormData({...formData, email: urlEmail})
    }
  }, [urlEmail])
  

  const [errors, setErrors] = useState<IUserDataComponentErrors>({
    username: '',
    email: '',
    cpf: '',
    cellPhone: '',
    phone: '',
  });

  // Processa a estrutura de dados de onErrosInfo para inserir no objeto formDataErrors;
  useEffect(() => {
    setErrors({
      username: '',
      email: '',
      cpf: '',
      cellPhone: '',
      phone: '',
    });
    if (onErrorsInfo) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [onErrorsInfo.prop]: onErrorsInfo.error,
      }));
    }
  }, [onErrorsInfo]);

  // Envia os dados do usuário para o componente pai;
  useEffect(() => {
    onUserDataUpdate(formData);
  }, [formData]);

  const inputs: Input[] = [
    {
      key: 'username',
      label: 'Nome Completo',
      value: formData.username,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const maskedValue = value.replace(/[^A-Za-z]/g, '');
        setFormData({ ...formData, username: maskedValue });
        resetObjectToEmptyStrings(errors);
      },
    },
    {
      key: 'email',
      label: 'E-mail',
      value: formData.email,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormData({ ...formData, email: value });
        resetObjectToEmptyStrings(errors);
      },
    },
    {
      key: 'cpf',
      label: 'CPF',
      value: formData.cpf,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target;
        const value = input.value;
        const maskedValue = applyNumericMask(value, '999.999.999-99');
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
        setFormData({ ...formData, cpf: maskedValue });
        resetObjectToEmptyStrings(errors);
      },
    },        
    {
      key: 'cellPhone',
      label: 'Celular',
      value: formData.cellPhone,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
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
        setFormData({ ...formData, cellPhone: maskedValue });
        resetObjectToEmptyStrings(errors);
      },
    },    
    {
      key: 'phone',
      label: 'Telefone',
      value: formData.phone,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target;
        const value = input.value;
        const maskedValue = applyNumericMask(value, '(99) 9999-9999');
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
        resetObjectToEmptyStrings(errors);
      },
    },
  ];

  return (
    <div>
      <h1 className="md:text-3xl text-2xl leading-10 text-quaternary font-bold md:mb-10">
        {isEdit ? 'Dados Pessoais' : 'Informações para contratação'}
      </h1>
      <div className="my-5">
        <div>
          <div className="my-5 w-full">
            <h3 className="text-xl font-normal text-quaternary leading-7">
              {inputs[0].label}
            </h3>
            <input
              className="border w-full p-5 h-12 border-quaternary rounded-[10px] bg-tertiary font-bold text-xl md:text-2xl text-quaternary leading-7 drop-shadow-xl"
              onChange={inputs[0].onChange}
              value={inputs[0].value}
              required
              style={errors.username ? { border: '1px solid red' } : {}}
            />
            {errors.username && (
              <span className="text-red-500 text-xs">{errors.username}</span>
            )}
          </div>

          <div className="my-5 mx-auto flex flex-col md:flex-row w-full gap-5 md:gap-10">
            {inputs.slice(1, 3).map((input: Input) => (
              <div key={input.key} className="w-full">
                <h3 className="text-xl font-normal text-quaternary leading-7">
                  {input.label}
                </h3>
                <input
                  className="border w-full p-5 h-12 border-quaternary rounded-[10px] bg-tertiary font-bold text-xl md:text-2xl text-quaternary leading-7 drop-shadow-xl"
                  onChange={input.onChange}
                  value={input.value}
                  required
                  style={errors[input.key] !== '' ? { border: '1px solid red' } : {}}
                />
                {Object.keys(errors).includes(input.key) && (
                  <span className="text-red-500 text-xs">{errors[input.key]}</span>
                )}
              </div>
            ))}
          </div>

          <div className="my-5 mx-auto flex w-full gap-10">
            {inputs.slice(3).map((input: Input) => (
              <div key={input.key} className="w-full">
                <h3 className="text-xl font-normal text-quaternary leading-7">
                  {input.label}
                </h3>
                <input
                  className="border w-full p-5 h-12 border-quaternary rounded-[10px] bg-tertiary font-bold text-xl md:text-2xl text-quaternary leading-7 drop-shadow-xl"
                  onChange={input.onChange}
                  value={input.value}
                  required
                  style={errors[input.key] !== '' ? { border: '1px solid red' } : {}}
                />
                {Object.keys(errors).includes(input.key) && (
                  <span className="text-red-500 text-xs">{errors[input.key]}</span>
                )}
              </div>
            ))}
          </div>
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
  )
}

export default userDataInputs