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
  PropertyUpdate = 'propertyUpdate',
  DeleteUser = 'deleteUser',
  UploadedImage = 'uploadedImage',
  RemoveImage = 'removeImage',
  CreditsSuccess = 'creditsSuccess'
}

export enum ErrorToastNames {
  InvalidLoginData = 'invalidLoginData',
  UpdateFavourites = 'updateFavourites',
  PasswordRecovery = 'passwordRecovery',
  ServerConnection = 'serverConnection',
  EmptyFields = 'emptyFields',
  SendMessage = 'sendMessage',
  VerificationCode = 'verificationCode',
  CreditCardUpdate = 'creditCardUpdate',
  HighlightProperty = 'highlightProperty',
  ActivateProperty = 'activateProperty',
  EmptyCredits = 'empotyCredits',
  FavouriteProperty = 'favouriteProperty',
  UserDataUpdate = 'userDataUpdate',
  PropertyUpdate = 'propertyUpdate',
  DeleteUser = 'deleteUser',
  EmailAlreadyInUse = 'emailAlreadyInUse',
  AdActivation = 'adActivation',
  AdDeActivation = 'adDeActivation',
  EmailNotFound = 'emailNotFound',
  ImagesMaxLimit = 'imagesMaxLimit',
  LoadImages = 'loadImages',
  ImageUploadError = 'imageUploadError',
  SendImages = 'sendImages',
  ImagesTotalSizeLimit = 'imagesTotalSizeLimit',
  ImagesUploadError = 'imagesUpload',
  UserNotFound = 'Nenhum usuário encontrado com o email ou senha informados.',
  EmptyCreditCardInfo = 'emptyCreditCArdInfo',
  OwnerImageUpload = 'ownerImageUpload',
  EmailNotVerified = 'emailNotVerified',
  InvalidRegisterData = 'invalidRegisterData',
  SamePlanError = 'samePlanError',
  FilterError = 'filterError',
  EmptyFilterFields = 'emptyFilterDields',
  InvalidAnnouncementCode = 'invalidAnnouncementCode',
  AlreadyInLoginPage = 'alreadyInLoginPage'
}

export enum InfoToastNames {
  AnnouncementInfo = 'announcementInfo',
  SelectYourPlan = 'selectYourPlan'
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
  [SuccessToastNames.DeleteUser]: {
    message: 'Usuário excluído com sucesso.',
    options: {
      autoClose: 7000,
    },
  },
  [SuccessToastNames.UploadedImage]: {
    message: 'Imagem adicionada com sucesso ao IndexedDB.',
    options: {
      autoClose: 7000,
    },
  },
  [SuccessToastNames.RemoveImage]: {
    message: 'Imagem removida com sucesso do IndexedDB.',
    options: {
      autoClose: 7000,
    },
  },
  [SuccessToastNames.CreditsSuccess]: {
    message: 'Compra de créditos realizada com sucesso.',
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
    message: 'Algum campo obrigatório não foi preenchido corretamente!',
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
  [ErrorToastNames.EmailNotVerified]: {
    message: 'O seu email ainda não foi verificado. Insira o código de verificação que foi enviado para o seu email no momento do cadastro.',
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
  [ErrorToastNames.DeleteUser]: {
    message: 'Houve um erro ao excluir o usuário. Por favor tente novamente mais tarde.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.EmailAlreadyInUse]: {
    message: "O e-mail informado já está associado a outra conta. Por favor, faça login com seu e-mail para acessar sua conta.",
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.AdActivation]: {
    message: 'Não foi possível alterar o status de ativação deste imóvel. Verifique se você ainda tem créditos restantes para realizar essa operação.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.AdDeActivation]: {
    message: 'Não foi possível alterar o status de ativação deste imóvel. Por favor, tente novamente mais tarde.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.EmailNotFound]: {
    message: 'Não há nenhuma conta vinculada a esse e-mail.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.ImagesMaxLimit]: {
    message: 'Você já alcançou o limite máximo de 30 fotos.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.LoadImages]: {
    message: 'Erro ao carregar as fotos do imóvel.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.ImageUploadError]: {
    message: 'Erro ao adicionar a imagem ao IndexedDB.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.SendImages]: {
    message: 'Erro ao enviar as fotos.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.ImagesTotalSizeLimit]: {
    message: 'O tamanho total dos arquivos excede 800 MB. Tente enviar fotos menores ou insira elas depois no menu de edição de anúncio.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.ImagesUploadError]: {
    message: 'Houve um erro ao fazer o upload das imagens. Por favor, tente novamente.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.EmptyCredits]: {
    message: 'Você não tem mais créditos para destacar este anúncio.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.UserNotFound]: {
    message: 'Nenhum usuário encontrado com o e-mail ou senha informados.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.EmptyCreditCardInfo]: {
    message: 'Algum dos dados do cartão de crédito não foi informado.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.OwnerImageUpload]: {
    message: 'Houve um erro ao cadastrar a imagem do proprietário do imóvel.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.InvalidRegisterData]: {
    message: 'Algum dos dados de cadastro está incorreto. Verifique e tente novamente.',
    options: {
      autoClose: 7000,
    },
  },
  [ErrorToastNames.SamePlanError]: {
    message: 'Você selecionou o mesmo plano que já foi contratado e ainda possui créditos. Por favor, selecione outro plano.',
    options: {
      autoClose: 5000,
    },
  },
  [ErrorToastNames.PasswordRecovery]: {
    message: 'Não foi possível enviar a recuperação de senha. Por favor, tente novamente mais tarde.',
    options: {
      autoClose: 5000,
    },
  },
  [ErrorToastNames.UpdateFavourites]: {
    message: 'Não foi possível atualizar seus favoritos. Por favor, tente novamente mais tarde.',
    options: {
      autoClose: 5000,
    },
  },
  [ErrorToastNames.InvalidLoginData]: {
    message: 'Email ou senha inválidos.',
    options: {
      autoClose: 5000,
    },
  },
  [ErrorToastNames.FilterError]: {
    message: 'Houve um problema ao filtrar seus anúncios. Por favor tente novamente mais tarde.',
    options: {
      autoClose: 5000,
    },
  },
  [ErrorToastNames.EmptyFilterFields]: {
    message: 'Preencha um dos campos do filtro.',
    options: {
      autoClose: 5000,
    },
  },
  [ErrorToastNames.InvalidAnnouncementCode]: {
    message: 'Nenhum anúncio encontrado com o código informado.',
    options: {
      autoClose: 5000,
    },
  },
  [ErrorToastNames.AlreadyInLoginPage]: {
    message: 'Insira seus dados para fazer login ou cadastre uma conta.',
    options: {
      autoClose: 5000,
    },
  },
};

const infoToastMessages: Record<InfoToastNames, ToastMessage> = {
  [InfoToastNames.AnnouncementInfo]: {
    message: 'Para anunciar, você pode inserir seu e-mail durante o processo de cadastro do imóvel ou optar por se cadastrar agora usando sua conta do Google.',
    options: {
      autoClose: 7000,
    },
  },
  [InfoToastNames.SelectYourPlan]: {
    message: 'Selecione um dos planos abaixo',
    options: {
      autoClose: 4000,
    },
  },
}

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

export const showInfoToast = (name: InfoToastNames, customOptions?: ToastOptions) => {
  const { message, options } = infoToastMessages[name] || { message: 'Mensagem não encontrada' };
  const mergedOptions = { ...options, ...customOptions };
  toast.info(message, mergedOptions);
};
