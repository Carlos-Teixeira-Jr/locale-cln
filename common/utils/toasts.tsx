// toastUtils.ts
import { toast, ToastOptions } from 'react-toastify';

type ToastMessage = {
  message: string;
  options?: ToastOptions;
};


export enum SuccessToastNames {
  PasswordRecovery = 'passwordRecovery',
  SendMessage = 'sendMessage',
  VerificationCode = 'verificationCode',
  CreditCardUpdate = 'creditCardUpdate',
  HighlightProperty = 'highlightProperty',
  FavouriteProperty = 'favouriteProperty',
  UserDataUpdate = 'userDataUpdate',
  PropertyUpdate = 'propertyUpdate'
}

export enum ErrorToastNames {
  ServerConnection = 'serverConnection',
  EmptyFields = 'emptyFields',
  SendMessage = 'sendMessage',
  VerificationCode = 'verificationCode',
  CreditCardUpdate = 'creditCardUpdate',
  HighlightProperty = 'highlightProperty',
  ActivateProperty = 'activateProperty',
  FavouriteProperty = 'favouriteProperty',
  UserDataUpdate = 'userDataUpdate',
  PropertyUpdate = 'propertyUpdate'
}

const successToastMessages: Record<SuccessToastNames, ToastMessage> = {
  [SuccessToastNames.PasswordRecovery]: {
    message: 'Recuperação de senha enviada para o e-mail com sucesso!',
    options: {
      autoClose: 7000,
    },
  },
  [SuccessToastNames.SendMessage]: {
    message: 'Sua mensagem foi enviada com sucesso!',
    options: {
      autoClose: 7000,
    },
  },
  [SuccessToastNames.VerificationCode]: {
    message: 'Novo código de verificação enviado.',
    options: {
      autoClose: 7000,
    },
  },
  [SuccessToastNames.CreditCardUpdate]: {
    message: 'Dados do cartão atualizados com sucesso.',
    options: {
      autoClose: 7000,
    },
  },
  [SuccessToastNames.HighlightProperty]: {
    message: 'Anúncio destacado com sucesso.',
    options: {
      autoClose: 7000,
    },
  },
  [SuccessToastNames.FavouriteProperty]: {
    message: 'Imóvel favoritado com sucesso.',
    options: {
      autoClose: 7000,
    },
  },
  [SuccessToastNames.UserDataUpdate]: {
    message: 'Dados do usuário atualizados com sucesso.',
    options: {
      autoClose: 7000,
    },
  },
  [SuccessToastNames.PropertyUpdate]: {
    message: 'Imóvel atualizado com sucesso.',
    options: {
      autoClose: 7000,
    },
  },
};

const errorToastMessages: Record<ErrorToastNames, ToastMessage> = {
  [ErrorToastNames.ServerConnection]: {
    message: 'Ocorreu um erro ao se conectar com o servidor!',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.EmptyFields]: {
    message: 'Você esqueceu de preencher algum campo obrigatório!',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.SendMessage]: {
    message: 'Houve um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde!',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.VerificationCode]: {
    message: 'O código de verificação informado não corresponde ao código enviado para o e-mail de cadastro.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.CreditCardUpdate]: {
    message: 'Não foi possível atualizar os dados de cartão de crédito. Por favor, tente mais tarde.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.HighlightProperty]: {
    message: 'Não foi possível destacar o anúncio.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.ActivateProperty]: {
    message: 'Não foi possível desativar o anúncio.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.FavouriteProperty]: {
    message: 'Imóvel removido dos favoritos.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.UserDataUpdate]: {
    message: 'Houve um erro na atualização dos dados deste usuário. Por favor tente novamente.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.PropertyUpdate]: {
    message: 'Houve um erro na atualização dos dados deste imóvel. Por favor tente novamente.',
    options: {
      autoClose: 7000,
    },
  },
};

export const showSuccessToast = (name: SuccessToastNames, customOptions?: ToastOptions) => {
  const { message, options } = successToastMessages[name] || { message: 'Mensagem não encontrada' };
  const mergedOptions = { ...options, ...customOptions };
  toast.success(message, mergedOptions);
};

export const showErrorToast = (name: ErrorToastNames, customOptions?: ToastOptions) => {
  const { message, options } = errorToastMessages[name] || { message: 'Mensagem não encontrada' };
  const mergedOptions = { ...options, ...customOptions };
  toast.error(message, mergedOptions);
};
