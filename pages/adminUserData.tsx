/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-undef */
import jwt, { JwtPayload } from 'jsonwebtoken';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import { useEffect, useRef, useState } from 'react';
import 'react-credit-cards/es/styles-compiled.css';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { IOwner, IOwnerData } from '../common/interfaces/owner/owner';
import { IPlan } from '../common/interfaces/plans/plans';
import {
  IAddress,
  IPropertyInfo,
} from '../common/interfaces/property/propertyData';
import { IUser, IUserDataComponent } from '../common/interfaces/user/user';
import { fetchJson } from '../common/utils/fetchJson';
import {
  ErrorToastNames,
  SuccessToastNames,
  showErrorToast,
  showSuccessToast,
} from '../common/utils/toasts';
import ArrowDownIcon from '../components/atoms/icons/arrowDownIcon';
import UserAddress from '../components/molecules/address/userAdress';
import PlansCardsHidden from '../components/molecules/cards/plansCards/plansCardHidden';
import CreditCard, {
  CreditCardForm,
} from '../components/molecules/userData/creditCard';
import DeleteAccount from '../components/molecules/userData/deleteAccount';
import EditPassword, {
  IPasswordData,
} from '../components/molecules/userData/editPassword';
import UserDataInputs from '../components/molecules/userData/userDataInputs';
import AdminHeader from '../components/organisms/adminHeader/adminHeader';
import SideMenu from '../components/organisms/sideMenu/sideMenu';
import { useIsMobile } from '../hooks/useIsMobile';
import { NextPageWithLayout } from './page';
Modal.setAppElement('#__next');

interface IAdminUserDataPageProps {
  selectedPlanCard: string;
  setSelectedPlanCard: (_selectedCard: string) => void;
  plans: IPlan[];
  userData: any;
  properties: IPropertyInfo;
  ownerData: IOwnerData;
  notifications: [];
}
const AdminUserDataPage: NextPageWithLayout<IAdminUserDataPageProps> = ({
  notifications,
  plans,
  userData,
  properties,
  ownerData,
}) => {
  const router = useRouter();
  const isOwner = properties?.docs?.length > 0 ? true : false;
  const [selectedPlan, setSelectedPlan] = useState(
    ownerData?.owner ? ownerData?.owner?.plan : ''
  );
  const [creditCardIsOpen, setCreditCardIsOpen] = useState(false);
  const [deleteAccountIsOpen, setDeleteAccountIsOpen] = useState(false);
  const [isEditPassword, setIsEditPassword] = useState(false);
  const [isAdminPage, setIsAdminPage] = useState(false);
  const isEdit = true;
  const isMobile = useIsMobile();
  const reversedCards = [...plans].reverse();
  const creditCardInfo = ownerData?.owner?.isNewCreditCard
    ? ownerData?.owner?.newCreditCardData.creditCard.number
    : ownerData?.owner?.creditCardInfo;
  const planObj = plans.find((plan) => plan._id === selectedPlan);

  const [formData, setFormData] = useState<IUserDataComponent>({
    username: '',
    email: '',
    cpf: '',
    cellPhone: '',
    phone: '',
    profilePicture: '',
  });
  const [formDataErrors, setFormDataErrors] = useState({
    username: '',
    email: '',
    cpf: '',
    cellPhone: '',
  });

  const [passwordFormData, setPasswordFormData] = useState({
    password: '',
    passwordConfirmattion: '',
  });

  const [passwordError, setPasswordErrors] = useState({
    password: '',
    passwordConfirmattion: '',
  });

  // Lida com o autoscroll das validações de erro dos inputs;
  const userDataInputRefs = {
    username: useRef<HTMLElement>(null),
    email: useRef<HTMLElement>(null),
    cpf: useRef<HTMLElement>(null),
    cellPhone: useRef<HTMLElement>(null),
  };
  const passwordInputRefs = {
    password: useRef<HTMLElement>(null),
    passwordConfimattion: useRef<HTMLElement>(null),
  };
  const [address, setAddress] = useState<IAddress>({
    zipCode: '',
    city: '',
    streetName: '',
    streetNumber: '',
    complement: '',
    neighborhood: '',
    uf: '',
  });
  const [addressErrors, setAddressErrors] = useState({
    zipCode: '',
    city: '',
    streetName: '',
    streetNumber: '',
    uf: '',
  });
  // Lida com o auto-scroll para os inputs de Address que mostrarem erro;
  const addressInputRefs = {
    zipCode: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    streetName: useRef<HTMLInputElement>(null),
    streetNumber: useRef<HTMLInputElement>(null),
    uf: useRef<HTMLInputElement>(null),
  };
  const creditCardErrors: CreditCardForm = {
    cardName: '',
    cardNumber: '',
    ccv: '',
    expiry: '',
  };
  // Lida com o auto-scroll para os inputs de creditCard que mostrarem erro;
  const creditCardInputRefs = {
    cardName: useRef<HTMLInputElement>(null),
    cardNumber: useRef<HTMLInputElement>(null),
    expiry: useRef<HTMLInputElement>(null),
    cvc: useRef<HTMLInputElement>(null),
  };
  useEffect(() => {
    const url = router.pathname;
    if (url === '/adminUserData') {
      setIsAdminPage(true);
    }
  }, [router.pathname]);
  const handleUpdateBtn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const error = 'Este campo é obrigatório';
    const emptyPasswordError =
      'Este campo é orbigatório caso deseje alterar a senha';
    const invalidPasswordConfimattion =
      'A senha e a confirmação de senha precisam ser iguais';
    const invalidPasswordLenght = 'A senha precisa ter pelo meno 6 caracteres';

    setFormDataErrors({
      username: '',
      email: '',
      cpf: '',
      cellPhone: '',
    });
    setAddressErrors({
      zipCode: '',
      city: '',
      streetName: '',
      streetNumber: '',
      uf: '',
    });

    setPasswordErrors({
      password: '',
      passwordConfirmattion: '',
    });

    const newFormDataErrors = {
      username: '',
      email: '',
      cpf: '',
      cellPhone: '',
    };
    const newAddressErrors = {
      zipCode: '',
      city: '',
      streetName: '',
      streetNumber: '',
      uf: '',
    };

    const newPasswordErrors = {
      password: '',
      passwordConfirmattion: '',
    };

    if (!formData.username) newFormDataErrors.username = error;
    if (!formData.email) newFormDataErrors.email = error;
    if (!formData.cpf) newFormDataErrors.cpf = error;
    if (!formData.cellPhone) newFormDataErrors.cellPhone = error;
    if (!address.zipCode) newAddressErrors.zipCode = error;
    if (!address.city) newAddressErrors.city = error;
    if (!address.uf) newAddressErrors.uf = error;
    if (!address.streetName) newAddressErrors.streetName = error;
    if (!address.streetNumber) newAddressErrors.streetNumber = error;

    if (isEditPassword) {
      if (!passwordFormData.password)
        newPasswordErrors.password = emptyPasswordError;
      if (!passwordFormData.passwordConfirmattion)
        newPasswordErrors.passwordConfirmattion = emptyPasswordError;
      if (passwordFormData.password !== passwordFormData.passwordConfirmattion)
        newPasswordErrors.password = invalidPasswordConfimattion;
      if (passwordFormData.password !== passwordFormData.passwordConfirmattion)
        newPasswordErrors.passwordConfirmattion = invalidPasswordConfimattion;
      if (passwordFormData.password.length < 6)
        newPasswordErrors.password = invalidPasswordLenght;
      if (passwordFormData.passwordConfirmattion.length < 6)
        newPasswordErrors.passwordConfirmattion = invalidPasswordLenght;
    }

    setFormDataErrors(newFormDataErrors);
    setAddressErrors(newAddressErrors);
    setPasswordErrors(newPasswordErrors);
    let combinedErrors;
    // Combina os erros de registro e endereço em um único objeto de erros
    if (isEditPassword) {
      combinedErrors = {
        ...newAddressErrors,
        ...newFormDataErrors,
        ...newPasswordErrors,
      };
    } else {
      combinedErrors = {
        ...newAddressErrors,
        ...newFormDataErrors,
      };
    }

    if (isEditPassword) combinedErrors;

    // Verifica se algum dos valores do objeto de erros combinados não é uma string vazia
    const hasErrors = Object.values(combinedErrors).some(
      (error) => error !== ''
    );
    if (!hasErrors) {
      const userFormData: IUser = {
        id: userData._id,
        address,
        username: formData.username,
        email: formData.email,
        cpf: formData.cpf,
        profilePicture: formData.profilePicture
          ? formData.profilePicture
          : 'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png',
      };

      const picture = formData.profilePicture
        ? formData.profilePicture
        : ownerData.owner?.profilePicture;

      const ownerFormData: IOwner = {
        id: ownerData.owner ? ownerData.owner._id : '',
        ownername: formData.username,
        phones: [formData.cellPhone, formData.phone],
        userId: userData._id,
        profilePicture: picture
          ? picture
          : 'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png',
        adCredits: ownerData.owner?.adCredits ? ownerData.owner?.adCredits : 0,
      };

      const editPasswordFormData = {
        password: passwordFormData.password ? passwordFormData.password : '',
        passwordConfirmattion: passwordFormData.passwordConfirmattion
          ? passwordFormData.passwordConfirmattion
          : '',
      };

      let body;
      if (isEditPassword) {
        body = {
          user: userFormData,
          owner: ownerFormData,
          password: editPasswordFormData,
        };
      } else {
        body = {
          user: userFormData,
          owner: ownerFormData,
          password: editPasswordFormData,
        };
      }

      try {
        toast.loading('Enviando...');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/user/edit-user`,
          {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify(body),
          }
        );
        if (response.ok) {
          toast.dismiss();
          showSuccessToast(SuccessToastNames.UserDataUpdate);

          router.push('/admin');
        } else {
          toast.dismiss();
          showErrorToast(ErrorToastNames.UserDataUpdate);
        }
      } catch (error) {
        toast.dismiss();
        showErrorToast(ErrorToastNames.ServerConnection);
      }
    } else {
      showErrorToast(ErrorToastNames.EmptyFields);
    }
  };

  console.log('endereço do user', userData.address);

  return (
    <div className="max-w-[1232px] mx-auto justify-center items-center">
      <div className="fixed z-50 top-0 w-full inset-x-0">
        <AdminHeader isOwnerProp={isOwner} />
      </div>
      <div className="flex flex-row items-center max-w-[1232px] justify-center">
        {!isMobile && (
          <div className="fixed left-0 top-20 sm:hidden hidden md:hidden lg:flex">
            <SideMenu isOwnerProp={isOwner} notifications={notifications} />
          </div>
        )}

        <div className="flex flex-col mt-16 lg:ml-80 max-w-[1232px] justify-center mx-5">
          <div className="my-5 lg:mx-10 md:mx-2 max-w-[1232px]">
            <div className="my-5">
              <UserDataInputs
                isEdit={isEdit}
                userData={ownerData}
                onUserDataUpdate={(updatedUserData: IUserDataComponent) => {
                  setFormData(updatedUserData);
                }}
                error={formDataErrors}
                userDataInputRefs={userDataInputRefs}
                profilePicPropertyData={
                  properties?.docs[properties?.docs?.length - 1]?.ownerInfo
                    ?.profilePicture &&
                  properties?.docs[properties?.docs?.length - 1]?.ownerInfo
                    .profilePicture
                }
              />

              <div className="mx-5 my-10">
                <EditPassword
                  onPasswordUpdate={(passwordData: IPasswordData) =>
                    setPasswordFormData(passwordData)
                  }
                  error={passwordError}
                  passwordInputRefs={passwordInputRefs}
                  onEditPasswordSwitchChange={(isEditPassword: boolean) =>
                    setIsEditPassword(isEditPassword)
                  }
                />
              </div>

              <h2 className="md:text-3xl text-2xl leading-10 text-quaternary font-bold mb-5 lg:mb-10 lg:mx-5">
                Dados de Cobrança
              </h2>
              <div className="grid sm:grid-cols-1 grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                {reversedCards.map(
                  ({
                    _id,
                    name,
                    price,
                    highlightAd,
                    commonAd,
                    smartAd,
                  }: IPlan) => (
                    <>
                      <PlansCardsHidden
                        selectedPlanCard={selectedPlan}
                        setSelectedPlanCard={(selectedCard: string) => {
                          setSelectedPlan(selectedCard);
                        }}
                        isAdminPage={isAdminPage}
                        key={_id}
                        name={name}
                        price={price}
                        commonAd={commonAd}
                        highlightAd={highlightAd}
                        smartAd={smartAd}
                        id={_id}
                        isEdit={isEdit}
                        userPlan={
                          ownerData?.owner ? ownerData?.owner?.plan : ''
                        }
                      />
                    </>
                  )
                )}
              </div>
              {/** Endereço do imóvel */}
              <div className="flex mt-1 md:mt-1">
                <UserAddress
                  isEdit={isEdit}
                  address={userData.address}
                  onAddressUpdate={(updateAddres: IAddress) =>
                    setAddress(updateAddres)
                  }
                  errors={addressErrors}
                  addressInputRefs={addressInputRefs}
                />
              </div>
              {/** Endereço do imóvel */}
            </div>
            <div className="lg:float-right flex md:justify-end justify-center md:w-[90%] lg:w-full mb-10 md:mr-16 lg:mr-5">
              <button
                className="bg-primary w-fit h-16 flex items-center text-quinary rounded-[10px] py-5 px-20 text-xl md:text-2xl font-extrabold transition-colors duration-300 hover:bg-red-600 hover:text-white"
                onClick={handleUpdateBtn}
              >
                Atualizar Dados
              </button>
            </div>
            <div className="lg:pt-20 pt-0.5 mx-4">
              <label className="flex flex-row items-center justify-between max-w-[1232px] h-12 bg-tertiary border-2 border-quaternary mt-10 px-8 md:text-3xl text-md text-quaternary rounded-xl font-bold transition bg-opacity-90 hover:bg-gray-300">
                Dados do Cartão de Crédito
                <span
                  className={`transition-transform transform`}
                  onClick={() => setCreditCardIsOpen(!creditCardIsOpen)}
                >
                  <ArrowDownIcon
                    width="13"
                    className={`cursor-pointer ${
                      creditCardIsOpen ? '' : 'rotate-180'
                    }`}
                  />
                </span>
              </label>
              <div className="bg-grey-lighter">
                {creditCardIsOpen && (
                  <CreditCard
                    isEdit={true}
                    error={creditCardErrors}
                    creditCardInputRefs={creditCardInputRefs}
                    creditCardInfo={creditCardInfo}
                    userInfo={formData}
                    customerId={ownerData?.owner?.customerId}
                    selectedPlan={planObj}
                    userAddress={address}
                    ownerData={ownerData}
                  />
                )}
              </div>
            </div>
            <div className="lg:pt-5 pt-0.5 mb-20 mx-4">
              <label className="flex flex-row items-center justify-between max-w-[1232px] h-12 bg-tertiary border-2 border-quaternary mt-10 px-8 md:text-3xl text-md text-quaternary rounded-xl font-bold transition bg-opacity-90 hover:bg-gray-300">
                Excluir conta
                <span
                  className={`transition-transform transform`}
                  onClick={() => setDeleteAccountIsOpen(!deleteAccountIsOpen)}
                >
                  <ArrowDownIcon
                    width="13"
                    className={`cursor-pointer ${
                      deleteAccountIsOpen ? '' : 'rotate-180'
                    }`}
                  />
                </span>
              </label>
              <div className="bg-grey-lighter">
                {deleteAccountIsOpen && <DeleteAccount />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminUserDataPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId =
    session?.user.data._id !== undefined
      ? session?.user.data._id
      : session?.user.id;
  let token = session?.user?.data?.access_token!!;
  let refreshToken = session?.user?.data.refresh_token;

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  } else {
    token = session?.user.data.access_token!!;
    refreshToken = session.user?.data.refresh_token;
    const decodedToken = jwt.decode(token) as JwtPayload;
    const isTokenExpired = decodedToken?.exp
      ? decodedToken?.exp <= Math.floor(Date.now() / 1000)
      : false;
    if (isTokenExpired) {
      const decodedRefreshToken = jwt.decode(refreshToken) as JwtPayload;
      const isRefreshTokenExpired = decodedRefreshToken?.exp
        ? decodedRefreshToken?.exp <= Math.floor(Date.now() / 1000)
        : false;
      if (isRefreshTokenExpired) {
        destroyCookie(context, 'next-auth.session-token');
        destroyCookie(context, 'next-auth.csrf-token');
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      } else {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                refresh_token: refreshToken,
              }),
            }
          );
          if (response.ok) {
            const data = await response.json();
            const newToken = data.access_token;
            const newRefreshToken = data.refresh_token;
            refreshToken = newRefreshToken;
            token = newToken;
            session.user.data.refresh_token = newRefreshToken;
            token = newToken;
            session.user.data.access_token = newToken;
          } else {
            console.log('Não foi possível atualizar o token.');
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    let ownerId;
    try {
      const ownerIdResponse = await fetch(
        `${baseUrl}/user/find-owner-by-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _id: userId }),
        }
      );
      if (ownerIdResponse.ok) {
        const ownerData = await ownerIdResponse.json();
        ownerId = ownerData?.owner?._id;
      }
    } catch (error) {
      console.error(error);
    }

    const [notifications, userData, ownerData, plans, properties] =
      await Promise.all([
        fetch(`${baseUrl}/notification/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .catch(() => []),
        fetch(`${baseUrl}/user/${userId}`)
          .then((res) => res.json())
          .catch(() => []),
        fetch(`${baseUrl}/user/find-owner-by-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _id: userId,
          }),
        })
          .then((res) => res.json())
          .catch(() => []),
        fetch(`${baseUrl}/plan`)
          .then((res) => res.json())
          .catch(() => []),
        fetch(`${baseUrl}/property/owner-properties`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ownerId,
            page: 1,
          }),
        })
          .then((res) => res.json())
          .catch(() => []),
        fetchJson(`${baseUrl}/notification/${userId}`),
        fetchJson(`${baseUrl}/user/${userId}`),
        fetchJson(`${baseUrl}/user/find-owner-by-user`),
        fetchJson(`${baseUrl}/plan`),
        fetchJson(`${baseUrl}/property/owner-properties`),
      ]);
    return {
      props: {
        notifications,
        userData,
        plans,
        properties,
        ownerData,
      },
    };
  }
}
