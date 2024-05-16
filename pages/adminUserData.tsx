/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-undef */
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import 'react-credit-cards/es/styles-compiled.css';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { IMessagesByOwner } from '../common/interfaces/message/messages';
import { CreditCardType, IOwner, IOwnerData } from '../common/interfaces/owner/owner';
import { IPlan } from '../common/interfaces/plans/plans';
import {
  IAddress,
  IPropertyInfo,
} from '../common/interfaces/property/propertyData';
import { IUser, IUserDataComponent } from '../common/interfaces/user/user';
import { fetchJson } from '../common/utils/fetchJson';
import { defaultProfileImage } from '../common/utils/images/defaultImage/defaultImage';
import { clearIndexDB, getAllImagesFromDB } from '../common/utils/indexDb';
import {
  ErrorToastNames,
  showErrorToast,
  showSuccessToast,
  SuccessToastNames
} from '../common/utils/toasts';
import ArrowDownIcon from '../components/atoms/icons/arrowDownIcon';
import Loading from '../components/atoms/loading';
import UserAddress from '../components/molecules/address/userAdress';
import { PlansCardsHidden } from '../components/molecules/cards';
import Coupons from '../components/molecules/coupons/coupons';
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
  properties: IPropertyInfo;
  ownerData: IOwnerData;
  notifications: [];
  messages: IMessagesByOwner
}

type AddressErrors = {
  [key: string]: string;
  zipCode: string;
  city: string;
  streetName: string;
  streetNumber: string;
  uf: string;
}

type EditUserBody = {
  user: IUser,
  owner: IOwner,
  password?: {
    password: string,
    passwordConfirmattion: string
  },
  creditCard?: CreditCardType;
  coupon?: string
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

const AdminUserDataPage: NextPageWithLayout<IAdminUserDataPageProps> = ({
  notifications,
  plans,
  properties,
  ownerData,
  messages
}) => {

  const router = useRouter();
  const isMobile = useIsMobile();
  const userData = ownerData?.user;
  const reversedCards = [...plans].reverse();
  const isOwner = properties?.docs?.length > 0 ? true : false;
  const [selectedPlan, setSelectedPlan] = useState(
    ownerData?.owner ? ownerData?.owner?.plan : ''
  );
  const selectedPlanData = plans.find((plan) => plan._id === selectedPlan);
  const [creditCardIsOpen, setCreditCardIsOpen] = useState(false);
  const [deleteAccountIsOpen, setDeleteAccountIsOpen] = useState(false);
  const [isEditPassword, setIsEditPassword] = useState(false);
  const [isAdminPage, setIsAdminPage] = useState(false);
  const isEdit = true;
  const [loading, setLoading] = useState(false);
  const unreadMessages = messages?.docs?.length > 0 ? messages?.docs?.filter((message) => !message.isRead) : [];
  const plusPlan = plans.find((e) => e.name === 'Locale Plus');
  const ownerIsPlus = ownerData?.owner?.plan === plusPlan?._id ? true : false;
  console.log("🚀 ~ ownerIsPlus:", ownerIsPlus)
  const [useCoupon, setUseCoupon] = useState(false);
  const [coupon, setCoupon] = useState('');
  const hasProperties = properties?.docs?.length > 0 ? true : false;

  // Mostrar os dados do cartão na tela;
  const creditCardInfo = ownerData?.owner?.paymentData?.creditCardInfo
    ? ownerData?.owner?.paymentData?.creditCardInfo
    : {
      creditCardBrand: '',
      creditCardNumber: '',
      creditCardToken: ''
    };

  // Dados do cartão de crédito usado nesse update;
  const [creditCard, setCreditCard] = useState<CreditCardForm>({
    cardName: '',
    cardNumber: '',
    ccv: '',
    expiry: '',
    cpfCnpj: '366.422.100-18'
  })

  const planObj = plans.find((plan) => plan._id === selectedPlan);

  const [formData, setFormData] = useState<IUserDataComponent>({
    username: '',
    email: '',
    cpf: '366.422.100-18',
    cellPhone: '(53) 99177-4545',
    phone: '',
    picture: {
      id: '1',
      src: ownerData?.user?.picture
    },
    wppNumber: ''
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

  const [couponError, setCouponError] = useState('');
  const [planError, setPlanError] = useState('');

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

  const couponInputRef = useRef<HTMLElement>(null);

  const [address, setAddress] = useState<IAddress>({
    // zipCode: userData ? userData.address?.zipCode : '',
    zipCode: '96215-180',
    city: userData ? userData.address?.city : '',
    streetName: userData ? userData.address?.streetName : '',
    // streetNumber: userData ? userData.address?.streetNumber : '',
    streetNumber: '123',
    complement: userData ? userData.address?.complement : '',
    neighborhood: userData ? userData.address?.neighborhood : '',
    uf: userData ? userData.address?.uf : '',
  });

  const [addressErrors, setAddressErrors] = useState<AddressErrors>({
    zipCode: '',
    city: '',
    streetName: '',
    streetNumber: '',
    uf: '',
  });

  const addressInputRefs = {
    zipCode: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    streetName: useRef<HTMLInputElement>(null),
    streetNumber: useRef<HTMLInputElement>(null),
    uf: useRef<HTMLInputElement>(null),
  };

  const [creditCardErrors, setCreditCardErrors] = useState<CreditCardForm>({
    cardName: '',
    cardNumber: '',
    ccv: '',
    expiry: '',
    cpfCnpj: ''
  })

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
    const emptyCreditCardError = 'Há algum dado do cartão de crédito faltando';
    const invalidCouponError = 'Cupom de desconto inválido.'
    const samePlanError = 'O plano selecionado é o mesmo que você já contratou e você ainda possui créditos.'

    let newCreditCardError = '';
    let newCouponError = '';
    let newPlanError = '';

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

    setCreditCardErrors({
      cardName: '',
      cardNumber: '',
      expiry: '',
      ccv: '',
      cpfCnpj: ''
    });

    setCouponError('');
    setPlanError('');

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
    if (
      selectedPlan !== '' &&
      selectedPlan !== ownerData?.owner?.plan
      && planObj?.name !== 'Free'
      && Object.values(creditCard).some((value) => value === '')
      && !useCoupon
    ) {
      newCreditCardError = emptyCreditCardError;
    }
    if (
      selectedPlan !== '' &&
      selectedPlan !== null &&
      selectedPlan === ownerData?.owner?.plan &&
      !useCoupon
    ) {
      newPlanError = samePlanError;
    }
    if (useCoupon && !coupon) newCouponError = invalidCouponError

    setFormDataErrors(newFormDataErrors);
    setAddressErrors(newAddressErrors);
    setPasswordErrors(newPasswordErrors);
    setCouponError(newCouponError);

    // Insere a mensagem de erro nos inputs vazios do form de credit card;
    Object.keys(creditCard).forEach((e) => {
      if (creditCardErrors[e] !== '') {
        setCreditCardErrors({ ...creditCardErrors, [e]: newCreditCardError })
      }
    })

    setCreditCardIsOpen(true);

    let combinedErrors;

    if (isEditPassword) {
      combinedErrors = {
        ...newAddressErrors,
        ...newFormDataErrors,
        ...newPasswordErrors,
        newPlanError
      };
    } else {
      combinedErrors = {
        ...newAddressErrors,
        ...newFormDataErrors,
        newPlanError
      };
    }

    if (useCoupon) {
      combinedErrors = {
        ...combinedErrors,
        newCouponError,
        newPlanError
      }
    }

    if (isEditPassword) combinedErrors;

    const hasErrors = Object.values(combinedErrors).some(
      (error) => error !== ''
    );

    if (newCreditCardError === '') {
      if (newPlanError !== '') {
        showErrorToast(ErrorToastNames.SamePlanError)
        return
      }
      if (!hasErrors) {
        const userFormData: IUser = {
          id: userData._id,
          address,
          username: formData.username,
          email: formData.email,
          // cpf: formData.cpf,
          cpf: '366.422.100-18',
        };

        const ownerFormData: IOwner = {
          _id: ownerData?.owner ? ownerData.owner._id : '',
          ownername: formData.username,
          phone: formData.phone,
          // cellPhone: formData.cellPhone,
          cellPhone: '(53) 99177-4545',
          userId: userData._id,
          email: formData.email ? formData.email : '',
          adCredits: ownerData.owner?.adCredits ? ownerData.owner?.adCredits : 0,
          plan: selectedPlan
        };

        const editPasswordFormData = {
          password: passwordFormData.password ? passwordFormData.password : '',
          passwordConfirmattion: passwordFormData.passwordConfirmattion
            ? passwordFormData.passwordConfirmattion
            : '',
        };

        let body: EditUserBody;

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
          };
        }

        if (selectedPlanData?.name !== 'Free') {
          body.creditCard = {
            cardName: creditCard.cardName,
            cardNumber: creditCard.cardNumber,
            expiry: creditCard.expiry,
            ccv: creditCard.ccv,
            cpfCnpj: creditCard.cpfCnpj
          }
        }

        if (useCoupon) {
          body = {
            ...body,
            coupon
          }
        }

        const indexDbImages = (await getAllImagesFromDB()) as {
          id: string;
          data: Blob;
          name: string;
        }[];

        const imagesForm = new FormData();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
        let file;

        if (indexDbImages.length > 0) {
          file = new File(
            [indexDbImages[0].data],
            `${indexDbImages[0].name}`
          );
        } else {
          file = new File([], '');
        }

        imagesForm.append('images', file);

        imagesForm.append('userId', ownerData?.user?._id);

        setLoading(true);

        if (indexDbImages.length > 0) {
          if (indexDbImages.length > 0) {
            file = new File(
              [indexDbImages[0].data],
              `${indexDbImages[0].name}`
            );
          } else {
            file = new File([], '');
          }

          try {
            const imagesResponse = await fetch(
              `${baseUrl}/property/upload-profile-image/user`,
              {
                method: 'POST',
                body: imagesForm,
              }
            );

            if (imagesResponse.ok) {
              clearIndexDB();
            } else {
              clearIndexDB();
              showErrorToast(ErrorToastNames.ImagesUploadError);
            }
          } catch (error) {
            clearIndexDB();
            showErrorToast(ErrorToastNames.ImageUploadError);
          }
        }

        try {
          toast.loading('Enviando...');
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/user/edit-user`,
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
            router.push('/adminFavProperties?page=1');
          } else {
            setLoading(false);
            toast.dismiss();
            showErrorToast(ErrorToastNames.UserDataUpdate);
          }
        } catch (error) {
          setLoading(false);
          toast.dismiss();
          showErrorToast(ErrorToastNames.ServerConnection);
        }
      } else {
        setLoading(false);
        showErrorToast(ErrorToastNames.EmptyFields);
      }
    } else {
      showErrorToast(ErrorToastNames.EmptyCreditCardInfo);
    }
  };

  const classes = {
    root: 'max-w-[1232px] mx-auto justify-center items-center',
    sideMenuContainer: 'flex flex-row items-center max-w-[1232px] justify-center',
    sideMenu: 'fixed left-0 top-7 sm:hidden hidden md:hidden xl:flex',
    buttonContainer:
      'lg:float-right flex md:justify-end justify-center md:w-[90%] lg:w-full mb-10 md:mr-16 lg:mr-5',
    button:
      `w-72 h-16 flex items-center justify-center text-quinary rounded-[10px] py-3 px-10 text-lg font-extrabold ${loading ?
        'bg-red-200' :
        'bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white'
      }`,
    accordion:
      'flex flex-row items-center justify-between max-w-[1232px] h-12 bg-tertiary border-2 border-quaternary mt-10 px-8 text-lg text-quaternary rounded-xl font-bold transition bg-opacity-90 hover:bg-gray-300',
    plans:
      'grid sm:grid-cols-1 grid-cols-1 md:grid-cols-3 xl:grid-cols-3 md:gap-6',
    h2: 'md:text-2xl text-lg leading-10 text-quaternary font-bold mb-5 lg:mb-10 mx-5',
    userData: 'my-5 lg:mx-10 md:mx-2 max-w-[1232px]',
    content: 'flex flex-col mt-16 xl:ml-80 max-w-[1232px] justify-center md:mx-5',
  };

  return (
    <div className={classes.root}>
      <div className="fixed z-50 top-0 w-full inset-x-0">
        <AdminHeader isOwnerProp={isOwner} ownerData={ownerData} isPlus={ownerIsPlus} />
      </div>

      <div className={classes.sideMenuContainer}>
        {!isMobile && (
          <div className={classes.sideMenu}>
            <SideMenu
              isOwnerProp={isOwner}
              notifications={notifications}
              unreadMessages={unreadMessages}
              isPlus={ownerIsPlus}
              hasProperties={hasProperties}
            />
          </div>
        )}

        <div className={classes.content}>
          <div className={classes.userData}>
            <div className="my-5">
              <UserDataInputs
                isEdit={isEdit}
                ownerData={ownerData}
                onUserDataUpdate={(updatedUserData: IUserDataComponent) => {
                  setFormData(updatedUserData);
                }}
                error={formDataErrors}
                userDataInputRefs={userDataInputRefs}
                picture={formData.picture ? formData.picture : { id: '1', src: defaultProfileImage }}
              />
              <div className="mx-5 mt-10">
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

                <Coupons
                  onCouponChange={(coupon: string) => setCoupon(coupon)}
                  onUseCouponSwitchChange={(isUseCoupon: boolean) => setUseCoupon(isUseCoupon)}
                  couponInputRefs={couponInputRef}
                  error={couponError}
                />

              </div>

              <h2 className={classes.h2}>Dados de Cobrança</h2>
              <div className={classes.plans}>
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
                        userPlan={ownerData?.owner ? ownerData?.owner?.plan : ''}
                        plans={[]}
                      />
                    </>
                  )
                )}
              </div>

              <div className="flex mt-1 md:mt-1">
                <UserAddress
                  isEdit={isEdit}
                  address={userData?.address}
                  onAddressUpdate={(updateAddres: IAddress) =>
                    setAddress(updateAddres)
                  }
                  errors={addressErrors}
                  addressInputRefs={addressInputRefs}
                />
              </div>
            </div>

            <div className={classes.buttonContainer}>
              <button className={classes.button} onClick={handleUpdateBtn} disabled={loading}>
                <span className={`${loading ? 'mr-5' : 'flex text-center'}`}>Atualizar dados</span>
                {loading && <Loading />}
              </button>
            </div>

            <div className="lg:pt-20 pt-0.5 mx-4">
              <label className={classes.accordion}>
                Dados do Cartão de Crédito
                <span
                  className={`transition-transform transform`}
                  onClick={() => setCreditCardIsOpen(!creditCardIsOpen)}
                >
                  <ArrowDownIcon
                    width="13"
                    className={`cursor-pointer ${creditCardIsOpen ? '' : 'rotate-180'
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
                    customerId={ownerData?.owner?.paymentData?.customerId}
                    selectedPlan={planObj}
                    userAddress={address}
                    ownerData={ownerData}
                    handleEmptyAddressError={(error: string) => {
                      const updatedErrors: AddressErrors = {
                        zipCode: '',
                        city: '',
                        streetName: '',
                        streetNumber: '',
                        uf: ''
                      };
                      for (const key in addressErrors) {
                        if (Object.prototype.hasOwnProperty.call(addressErrors, key)) {
                          if (addressErrors[key] === '') {
                            updatedErrors[key] = error;
                          } else {
                            updatedErrors[key] = addressErrors[key];
                          }
                        }
                      }
                      // Atualiza o estado com o objeto de erros atualizado
                      setAddressErrors(updatedErrors);
                    }}
                    onCreditCardUpdate={(creditCard: CreditCardType) => setCreditCard(creditCard)}
                  />
                )}
              </div>
            </div>

            <div className="lg:pt-5 pt-0.5 mb-20 mx-4">
              <label className={classes.accordion}>
                Excluir conta
                <span
                  className={`transition-transform transform`}
                  onClick={() => setDeleteAccountIsOpen(!deleteAccountIsOpen)}
                >
                  <ArrowDownIcon
                    width="13"
                    className={`cursor-pointer ${deleteAccountIsOpen ? '' : 'rotate-180'
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
  const page = Number(context.query.page);
  let ownerId;

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const ownerIdResponse = await fetch(
      `${baseUrl}/user/find-owner-by-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      }
    );
    if (ownerIdResponse.ok) {
      const ownerData = await ownerIdResponse.json();
      ownerId = ownerData?.owner?._id;
    } else {
      return {
        redirect: {
          destination: '/adminFavProperties?page=1',
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.error(error);
  }

  const [notifications, userData, ownerData, plans, properties, messages] =
    await Promise.all([
      fetch(`${baseUrl}/notification/user/${userId}`, {
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
        body: JSON.stringify({ userId }),
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
      fetch(`${baseUrl}/message/find-all-by-ownerId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId,
          page,
        }),
      })
        .then((res) => res.json())
        .catch(() => []),
      fetchJson(`${baseUrl}/notification/user/${userId}`),
      fetchJson(`${baseUrl}/user/${userId}`),
      fetchJson(`${baseUrl}/user/find-owner-by-user`),
      fetchJson(`${baseUrl}/plan`),
      fetchJson(`${baseUrl}/property/owner-properties`),
      fetchJson(`${baseUrl}/message/find-all-by-ownerId`),
    ]);

  return {
    props: {
      notifications,
      userData,
      plans,
      properties,
      ownerData,
      messages
    },
  };
}
