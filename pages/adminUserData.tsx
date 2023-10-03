import { useRouter } from 'next/router';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { useEffect, useRef, useState } from 'react';
import 'react-credit-cards/es/styles-compiled.css';
import Modal from 'react-modal';
import PlansCardsHidden from '../components/molecules/cards/plansCards/plansCardHidden';
import AdminHeader from '../components/organisms/adminHeader/adminHeader';
import SideMenu from '../components/organisms/sideMenu/sideMenu';
import { NextPageWithLayout } from './page';
import { getSession } from 'next-auth/react';
import { destroyCookie } from 'nookies';
import Address from '../components/molecules/address/address';
import { IAddress, IPropertyInfo } from '../common/interfaces/property/propertyData';
import UserDataInputs from '../components/molecules/userData/userDataInputs';
import { IUser, IUserDataComponent } from '../common/interfaces/user/user';
import CreditCard, { CreditCardForm } from '../components/molecules/userData/creditCard';
import ArrowDownIcon from '../components/atoms/icons/arrowDownIcon';
import { useIsMobile } from '../hooks/useIsMobile';
import { toast } from 'react-toastify';
import { IOwner, IOwnerData } from '../common/interfaces/owner/owner';
import { fetchJson } from '../common/utils/fetchJson';
import { IPlan } from '../common/interfaces/plans/plans';
import { GetServerSidePropsContext } from 'next';
Modal.setAppElement('#__next');

interface IAdminUserDataPageProps {
  selectedPlanCard: string;
  setSelectedPlanCard: (selectedCard: string) => void;
  plans: IPlan[]
  userData: any
  properties: IPropertyInfo
  ownerData: IOwnerData
}

const AdminUserDataPage: NextPageWithLayout<IAdminUserDataPageProps> = ({
  plans,
  userData,
  properties,
  ownerData
}) => {
  console.log("🚀 ~ file: adminUserData.tsx:41 ~ ownerData:", ownerData)
  const router = useRouter();
  const isOwner = properties?.docs?.length > 0 ? true : false;
  const [selectedPlan, setSelectedPlan] = useState(ownerData?.owner ? ownerData?.owner?.plan : '');
  const [creditCardIsOpen, setCreditCardIsOpen] = useState(false);
  const [isAdminPage, setIsAdminPage] = useState(false);
  const isEdit = true;
  const isMobile = useIsMobile();
  const reversedCards = [...plans].reverse();

  const [formData, setFormData] = useState<IUserDataComponent>({
    username: '',
    email: '',
    cpf: '',
    cellPhone: '',
    phone: '',
  });

  const [formDataErrors, setFormDataErrors] = useState({
    username: '',
    email: '',
    cpf: '',
    cellPhone: '',
  });

  // Lida com o autoscroll das validações de erro dos inputs;
  const userDataInputRefs = {
    username: useRef<HTMLElement>(null),
    email: useRef<HTMLElement>(null),
    cpf: useRef<HTMLElement>(null),
    cellPhone: useRef<HTMLElement>(null),
  };

  const [address, setAddress] = useState<IAddress>({
    zipCode: '',
    city: '',
    streetName: '',
    streetNumber: '',
    complement: '',
    neighborhood: '',
    uf: ''
  });

  const [addressErrors, setAddressErrors] = useState({
    zipCode: '',
    city: '',
    streetName: '',
    streetNumber: '',
    uf: ''
  });

  // Lida com o auto-scroll para os inputs de Address que mostrarem erro;
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
    cvc: '',
    expiry: '',
  });

  // Lida com o auto-scroll para os inputs de creditCard que mostrarem erro;
  const creditCardInputRefs = {
    cardName: useRef<HTMLInputElement>(null),
    cardNumber: useRef<HTMLInputElement>(null),
    expiry: useRef<HTMLInputElement>(null),
    cvc: useRef<HTMLInputElement>(null),
  };

  // Recebe alterações do componente address;
  const handleAddressUpdate = (updatedAddress: IAddress) => {
    setAddress(updatedAddress);
  };

  // Recebe o valor do componente dos inputs de user data;
  const handleUserDataUpdate = (updatedUserData: IUserDataComponent) => {
    setFormData(updatedUserData)
  };

  // Recebe a seleção do card de planos do compnente dos cards;
  const setSelectedPlanCard = (selectedCard: string) => {
    setSelectedPlan(selectedCard);
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
      uf: ''
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
      uf: ''
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

    setFormDataErrors(newFormDataErrors);
    setAddressErrors(newAddressErrors);

    // Combina os erros de registro e endereço em um único objeto de erros
    const combinedErrors = {
      ...newAddressErrors,
      ...newFormDataErrors,
    };

    // Verifica se algum dos valores do objeto de erros combinados não é uma string vazia
    const hasErrors = Object.values(combinedErrors).some((error) => error !== '');
    
    if (!hasErrors) {
      const userFormData: IUser = {
        id: userData._id,
        address,
        username: formData.username,
        email: formData.email,
        cpf: formData.cpf,
      }

      const ownerFormData: IOwner = {
        id: ownerData.owner ? ownerData.owner._id : '',
        ownername: formData.username,
        phones: [formData.cellPhone, formData.phone],
        userId: userData._id,
        adCredits: ownerData.owner?.adCredits ? ownerData.owner?.adCredits : 0
      }

      try {
        toast.loading("Enviando...");
        const response = await fetch('http://localhost:3001/user/edit-user', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            user: userFormData,
            owner: ownerFormData
          })
        });

        if (response.ok) {
          toast.dismiss();
          toast.success("Dados de usuário atualizados com sucesso.");
          router.push("/admin");
        } else {
          toast.dismiss();
          toast.error("Houve um erro na atualização dos dados deste usuário. Por favor tente novamente.")
        }
      } catch (error) {
        toast.dismiss();
        toast.error("Não foi possível se conectar ao servidor. Por favor, tente novamente mais tarde.")
        console.error("Houve um erro na resposta da chamada", error);
      }
    } else {
      toast.error("Algum campo obrigatório não foi preenchido.")
    }
  };

  return (
    <div className="max-w-[412px] md:max-w-[912px] lg:max-w-[1024px] xl:max-w-[1536px] mx-auto">
      <div className="fixed z-50 top-0 w-full inset-x-0">
        <AdminHeader/>
      </div>

      <div className="flex flex-row items-center justify-center w-full xl:justify-center">
        {!isMobile && (
          <div className="fixed left-0 top-20 sm:hidden hidden md:hidden lg:flex">
            <SideMenu 
              isOwnerProp={isOwner}
            />
          </div>
        )}

        <div className="flex flex-col mt-16 lg:ml-64 lg:w-[65%] w-full mx-5">
          <div className="my-10 lg:mx-10 md:mx-2 w-full">
            <div className="my-5">
              
              <UserDataInputs 
                isEdit={isEdit}
                userData={ownerData} 
                onUserDataUpdate={handleUserDataUpdate}
                error={formDataErrors}
                userDataInputRefs={userDataInputRefs}
              />

              <h2 className="md:text-3xl text-2xl leading-10 text-quaternary font-bold mb-5 md:mb-10">
                Dados de Cobrança
              </h2> 

              <div className="absolute z-40 inset-x-1 xl:inset-x-auto md:flex gap-8">
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
                        setSelectedPlanCard={(selectedCard: string) =>
                          setSelectedPlanCard(selectedCard)
                        }
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
                      />
                    </>
                  )
                )}
              </div>

              <div className='flex mt-[930px] md:mt-80'>
                <Address 
                  isEdit={isEdit} 
                  address={ownerData?.user?.address} 
                  onAddressUpdate={handleAddressUpdate} 
                  errors={addressErrors}
                  addressInputRefs={addressInputRefs}
                />
              </div>
            </div>

            <div className="lg:float-right flex md:justify-end justify-center md:w-[90%] mb-10 md:mr-16">
              <button
                className="bg-primary w-fit h-16 item text-quinary rounded-[10px] py-5 px-20 text-xl md:text-2xl font-extrabold transition-colors duration-300 hover:bg-red-600 hover:text-white"
                onClick={handleUpdateBtn}
              >
                Atualizar Dados
              </button>
            </div>

            <div className='md:pt-20 pt-0.5 mb-20'>
              <label
                className="flex flex-row items-center justify-between sm:min-w-[300px] md:min-w-[620px] lg:min-w-[600px] xl:min-w-[800px] 2xl:min-w-[1000px] h-12 bg-tertiary border-2 border-quaternary mt-10 px-8 md:text-3xl text-xl text-quaternary font-bold transition bg-opacity-90 hover:bg-gray-300"
              >
                Dados do Cartão de Crédito
                <span 
                  className={`transition-transform transform`}
                  onClick={() => setCreditCardIsOpen(!creditCardIsOpen)}
                >
                  <ArrowDownIcon
                    width='13'
                    className={`cursor-pointer ${
                      creditCardIsOpen ?
                      '' : 
                      'rotate-180'
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
                  />
                )}
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

  const session = await getSession(context) as any;
  const userId = session?.user.data._id;
  let token = session?.user?.data?.access_token!!;
  let refreshToken = session?.user?.data.refresh_token;

  if(!session){
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  } else {
    token = session?.user.data.access_token!!;
    refreshToken = session.user?.data.refresh_token;
    const decodedToken = jwt.decode(token) as JwtPayload;
    const isTokenExpired = decodedToken.exp
      ? decodedToken.exp <= Math.floor(Date.now() / 1000)
      : false;

    if (isTokenExpired) {
      const decodedRefreshToken = jwt.decode(refreshToken) as JwtPayload;
      const isRefreshTokenExpired = decodedRefreshToken.exp
        ? decodedRefreshToken.exp <= Math.floor(Date.now() / 1000)
        : false;

      if (isRefreshTokenExpired) {
        destroyCookie(context, 'next-auth.session-token');
        destroyCookie(context, 'next-auth.csrf-token');

        return {
          redirect: {
            destination: '/login',
            permanent: false
          }
        }
      } else {
        try {
          const response = await fetch('http://localhost:3001/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              refresh_token: refreshToken
            })
          });

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
            console.log("Não foi possível atualizar o token.");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    const baseUrl = process.env.BASE_API_URL;

    const [userData, ownerData, plans, properties] = await Promise.all([
      fetch(`${baseUrl}/user/${userId}`)
        .then((res) => res.json())
        .catch(() => []),
      fetch(`${baseUrl}/user/find-owner-by-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: userId,
        })
      })
        .then((res) => res.json())
        .catch(() => []),
      fetch(`${baseUrl}/plan`)
        .then((res) => res.json())
        .catch(() => []),
      fetch(`${baseUrl}/property/owner-properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ownerId: userId,
          page: 1
        })
      })
        .then((res) => res.json())
        .catch(() => []),
      fetchJson(`${baseUrl}/user/${userId}`),
      fetchJson(`${baseUrl}/user/find-owner-by-user`),
      fetchJson(`${baseUrl}/plan`),
      fetchJson(`${baseUrl}/property/owner-properties`),
    ]);
    
    return {
      props: {
        userData,
        plans,
        properties,
        ownerData
      },
    };
  }
}
