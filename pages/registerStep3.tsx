import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import store from 'store';
import { IPlan } from '../common/interfaces/plans/plans';
import { IAddress } from '../common/interfaces/property/propertyData';
import {
  ICreateProperty_propertyData,
  ICreateProperty_userData,
  IRegisterPropertyData_Step3,
} from '../common/interfaces/property/register/register';
import { IUserDataComponent } from '../common/interfaces/user/user';
import { geocodeAddress } from '../common/utils/geocodeAddress';
import { clearIndexDB, getAllImagesFromDB } from '../common/utils/indexDb';
import Loading from '../components/atoms/loading';
import PaymentFailModal from '../components/atoms/modals/paymentFailModal';
import LinearStepper from '../components/atoms/stepper/stepper';
import Address from '../components/molecules/address/address';
import ChangeAddressCheckbox from '../components/molecules/address/changeAddressCheckbox';
import PlansCardsHidden from '../components/molecules/cards/plansCards/plansCardHidden';
import PaymentBoard from '../components/molecules/payment/paymentBoard';
import CreditCard, {
  CreditCardForm,
} from '../components/molecules/userData/creditCard';
import UserDataInputs from '../components/molecules/userData/userDataInputs';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import { useProgress } from '../context/registerProgress';
import { NextPageWithLayout } from './page';

interface IRegisterStep3Props {
  selectedPlanCard: string;
  setSelectedPlanCard: (_selectedCard: string) => void;
  plans: IPlan[];
}

type BodyReq = {
  propertyData: ICreateProperty_propertyData;
  userData: ICreateProperty_userData;
  plan: string;
  isPlanFree: boolean;
  phone: string;
  cellPhone: string;
  creditCardData?: CreditCardForm;
  profilePicture?: string;
};

const RegisterStep3: NextPageWithLayout<IRegisterStep3Props> = ({ plans }) => {
  const router = useRouter();
  const query = router.query;
  const urlEmail = query.email as string;
  const { progress, updateProgress } = useProgress();
  const storedData = store.get('propertyData');
  const storedPlan = store.get('plans');
  const choosedPlan = storedPlan ? storedPlan : '';
  const propertyAddress = storedData?.address ? storedData.address : {};
  const [paymentError, setPaymentError] = useState('');

  const [loading, setLoading] = useState(false);

  // Lida com o autoscroll das validações de erro dos inputs;
  const userDataInputRefs = {
    username: useRef<HTMLElement>(null),
    email: useRef<HTMLElement>(null),
    cpf: useRef<HTMLElement>(null),
    cellPhone: useRef<HTMLElement>(null),
  };

  // Lida com o auto-scroll para os inputs de Address que mostrarem erro;
  const addressInputRefs = {
    zipCode: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    streetName: useRef<HTMLInputElement>(null),
    streetNumber: useRef<HTMLInputElement>(null),
    uf: useRef<HTMLInputElement>(null),
  };

  // Lida com o auto-scroll para os inputs de creditCard que mostrarem erro;
  const creditCardInputRefs = {
    cardName: useRef<HTMLInputElement>(null),
    cardNumber: useRef<HTMLInputElement>(null),
    expiry: useRef<HTMLInputElement>(null),
    cvc: useRef<HTMLInputElement>(null),
  };

  const { data: session } = useSession() as any;
  const userId = session?.user?.data._id;

  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [selectedPlan, setSelectedPlan] = useState(choosedPlan);
  const freePlan = '645a46d4388b9fbde84b6e8a';
  const reversedCards = [...plans].reverse();
  const [isAdminPage, setIsAdminPage] = useState(false);
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [termsAreRead, setTermsAreRead] = useState(false);
  const property = store.get('propertyData');
  const [isFreePlan, setIsFreePlan] = useState(false);
  const [failPaymentModalIsOpen, setFailPaymentModalIsOpen] = useState(false);
  const [termsError, setTermsError] = useState('');

  const [userDataForm, setUserDataForm] = useState<IUserDataComponent>({
    username: '',
    email: '',
    cpf: '',
    cellPhone: '',
    phone: '',
    profilePicture: '',
  });

  const [userDataErrors, setUserDataErrors] = useState({
    username: '',
    email: '',
    cpf: '',
    cellPhone: '',
  });

  const [addressData, setAddressData] = useState<IAddress>({
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

  const [creditCard, setCreditCard] = useState<CreditCardForm>({
    cardName: '',
    cardNumber: '',
    ccv: '',
    expiry: '',
  });

  const [creditCardErrors, setCreditCardErrors] = useState<CreditCardForm>({
    cardName: '',
    cardNumber: '',
    ccv: '',
    expiry: '',
  });

  // Verifica se o estado progress que determina em qual step o usuário está corresponde ao step atual;
  useEffect(() => {
    if (progress < 3) {
      router.push('/register');
    }
  });

  // // Busca o endereço do imóvel armazenado no local storage e atualiza o valor de addressData sempre que há o componente de endereço é aberto ou fechado - isso é necessário para que o componente ChangeAddressCheckbox recupere o endereço do localStorage quando a opção é alterada;
  useEffect(() => {
    setAddressData(property ? property.address : '');
  }, []);

  // Busca as coordenadas geográficas do endereço do imóvel;
  useEffect(() => {
    if (addressData.city && addressData.streetName && addressData.zipCode) {
      const getGeocoordinates = async () => {
        try {
          const result = await geocodeAddress(addressData);
  
          if (result) {
            setCoordinates(result);
          } else {
            console.error('Não foi possível buscar as coordenadas geográficas do imóvel.')
          }
        } catch (error) {
          console.error('Não foi possível buscar as coordenadas geográficas do imóvel:', error)
        }
      }
      getGeocoordinates();
    }
  }, [addressData]);  

  useEffect(() => {
    const url = router.pathname;
    if (url === '/adminUserData') {
      setIsAdminPage(true);
    }
  }, [router.pathname]);

  const handlePreviousStep = () => {
    updateProgress(2);
    router.back();
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const error = `Este campo é obrigatório.`;
    const planObj: IPlan | undefined = plans.find(
      (plan) => plan._id === selectedPlan
    );
    const isPlanFree = planObj === undefined || planObj.name === 'Free';

    setUserDataErrors({
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

    setTermsError('');

    const newUserDataErrors = {
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

    const newCreditCardErrors = {
      cardName: '',
      cardNumber: '',
      ccv: '',
      expiry: '',
    };
    if (!userDataForm.username) newUserDataErrors.username = error;
    if (!userDataForm.email) newUserDataErrors.email = error;
    if (!userDataForm.cpf) newUserDataErrors.cpf = error;
    if (!userDataForm.cellPhone) newUserDataErrors.cellPhone = error;
    if (!addressData.zipCode) newAddressErrors.zipCode = error;
    if (!addressData.streetName) newAddressErrors.streetName = error;
    if (!addressData.streetNumber) newAddressErrors.streetNumber = error;
    if (!addressData.city) newAddressErrors.city = error;
    if (!addressData.uf) newAddressErrors.uf = error;
    if (!termsAreRead) setTermsError(error);
    if (selectedPlan !== '') {
      const planObj = plans.find((plan) => plan._id === selectedPlan);
      if (planObj && planObj.name !== 'Free') {
        if (!creditCard.cardName) newCreditCardErrors.cardName = error;
        if (!creditCard.cardNumber) newCreditCardErrors.cardNumber = error;
        if (!creditCard.expiry) newCreditCardErrors.expiry = error;
        if (!creditCard.ccv) newCreditCardErrors.ccv = error;
      }
    }

    setUserDataErrors(newUserDataErrors);
    setAddressErrors(newAddressErrors);
    setCreditCardErrors(newCreditCardErrors);

    // Combina os erros de registro e endereço em um único objeto de erros
    const combinedErrors = {
      ...newAddressErrors,
      ...newUserDataErrors,
      ...newCreditCardErrors,
    };

    // Verifica se algum dos valores do objeto de erros combinados não é uma string vazia
    const hasErrors = Object.values(combinedErrors).some(
      (error) => error !== ''
    );

    if (!hasErrors && termsAreRead) {
      const storedData = store.get('propertyData');

      const propertyDataStep3: IRegisterPropertyData_Step3 = {
        username: userDataForm.username,
        email: userDataForm.email,
        cpf: userDataForm.cpf,
        cellPhone: userDataForm.cellPhone,
        profilePicture: userDataForm.profilePicture
          ? userDataForm.profilePicture
          : 'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png',
        phone: userDataForm.phone,
        zipCode: addressData.zipCode,
        city: addressData.city,
        uf: addressData.uf,
        streetName: addressData.streetName,
        geolocation: coordinates
          ? [coordinates?.lng, coordinates?.lat]
          : [-52.1872864, -32.1013804],
        plan: selectedPlan !== '' ? selectedPlan : freePlan,
        isPlanFree,
        propertyAddress,
      };

      const userData: ICreateProperty_userData = {
        _id: userId ? userId : '',
        username: userDataForm.username,
        email: userDataForm.email,
        address: isSameAddress ? storedData.address : addressData,
        cpf: userDataForm.cpf.replace(/\D/g, ''),
        profilePicture: userDataForm.profilePicture
          ? userDataForm.profilePicture
          : 'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png',
      };

      const propertyData: ICreateProperty_propertyData = {
        adType: storedData.adType,
        adSubtype: storedData.adSubtype,
        propertyType: storedData.propertyType,
        propertySubtype: storedData.propertySubtype,
        address:
          !isSameAddress && storedData.address
            ? storedData.address
            : addressData,
        description: storedData.description,
        metadata: storedData.metadata,
        //images: storedData.images,
        size: storedData.size,
        ownerInfo: {
          profilePicture: userDataForm.profilePicture
            ? userDataForm.profilePicture
            : 'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png',
          name: userDataForm.username,
          phones: [userDataForm.cellPhone, userDataForm.phone],
        },
        tags: storedData.tags,
        condominiumTags: storedData.condominiumTags,
        prices: storedData.prices,
        youtubeLink: storedData.youtubeLink,
        geolocation: {
          type: 'Point',
          coordinates: propertyDataStep3.geolocation,
        },
        highlighted: false,
      };

      try {
        toast.loading('Enviando...');
        setLoading(true);
        const body: BodyReq = {
          propertyData,
          userData,
          plan: propertyDataStep3.plan,
          isPlanFree,
          phone: userDataForm.phone,
          cellPhone: userDataForm.cellPhone,
        };

        if (!isPlanFree) {
          body.creditCardData = creditCard;
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

        const response = await fetch(`${baseUrl}/property`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const data = await response.json();
          const paymentData = {
            cardBrand: data.creditCardBrand ? data.creditCardBrand : 'Free',
            value: data.paymentValue ? data.paymentValue : '00',
          };
          store.set('creditCard', paymentData);
          toast.dismiss();
          store.set('propertyData', {
            propertyDataStep3,
            storedData,
            paymentData,
          });

          // Salvar imagens

          const indexDbImages = (await getAllImagesFromDB()) as {
            id: string;
            data: Blob;
            name: string;
          }[];

          const formData = new FormData();

          for (let i = 0; i < indexDbImages.length; i++) {
            const file = new File(
              [indexDbImages[i].data],
              `${indexDbImages[i].name}`
            );
            formData.append('images', file);
          }

          formData.append('propertyId', data.createdProperty._id);

          const imagesResponse = await fetch(
            `${baseUrl}/property/upload-images`,
            {
              method: 'POST',
              body: formData,
            }
          );

          if (imagesResponse.ok) {
            clearIndexDB();
            updateProgress(4);
            if (!urlEmail) {
              router.push('/registerStep35');
            } else {
              router.push({
                pathname: '/registerStep35',
                query: {
                  email: urlEmail,
                },
              });
            }
          } else {
            console.log('Erro ao enviar as imagens');
          }
        } else {
          toast.dismiss();
          const error = await response.json();
          console.error(response);
          setPaymentError(error.message);
          setFailPaymentModalIsOpen(true);
        }
      } catch (error) {
        toast.dismiss();
        toast.error(
          'Não foi possivel se conectar ao servidor. Por favor, tente novamente mais tarde.'
        );
        console.error(error);
      }
    } else {
      toast.error(`Algum campo obrigatório não foi preenchido.`);
    }
  };

  return (
    <>
      <div className="max-w-[1215px] mx-auto">
        <Header />
        <div className="justify-center">
          <div className="md:mt-26 mt-28 sm:mt-32 md:mb-8 lg:mb-2 mx-auto">
            <LinearStepper isSubmited={false} sharedActiveStep={2} />
          </div>

          <div className="md:flex">
            {reversedCards.map(
              ({ _id, name, price, highlightAd, commonAd, smartAd }: IPlan) => (
                <PlansCardsHidden
                  key={_id}
                  selectedPlanCard={selectedPlan}
                  setSelectedPlanCard={(selectedCard: string) => {
                    setSelectedPlan(selectedCard);
                    const planObj = plans.find(
                      (plan) => plan._id === selectedCard
                    );
                    if (planObj && planObj?.name === 'Free') {
                      setIsFreePlan(true);
                    } else {
                      setIsFreePlan(false);
                    }
                  }}
                  isAdminPage={isAdminPage}
                  name={name}
                  price={price}
                  commonAd={commonAd}
                  highlightAd={highlightAd}
                  smartAd={smartAd}
                  id={_id}
                  isEdit={false}
                />
              )
            )}
          </div>

          <div className="lg:mx-0">
            <div className="flex justify-center flex-col">
              <UserDataInputs
                isEdit={false}
                onUserDataUpdate={(updatedUserData: IUserDataComponent) =>
                  setUserDataForm(updatedUserData)
                }
                urlEmail={urlEmail ? urlEmail : undefined}
                error={userDataErrors}
                userDataInputRefs={userDataInputRefs}
              />
            </div>

            <ChangeAddressCheckbox
              onAddressCheckboxChange={(value: boolean) =>
                setIsSameAddress(value)
              }
              userAddress={addressData}
              propertyAddress={storedData}
            />

            {!isSameAddress && (
              <Address
                isEdit={false}
                address={addressData}
                onAddressUpdate={(address: IAddress) => setAddressData(address)}
                errors={addressErrors}
                addressInputRefs={addressInputRefs}
              />
            )}

            {selectedPlan !== '' &&
              (() => {
                const planObj = plans.find((plan) => plan._id === selectedPlan);
                if (planObj && planObj.name !== 'Free') {
                  return (
                    <CreditCard
                      isEdit={false}
                      onCreditCardUpdate={(creditCard) => {
                        if (!isFreePlan) {
                          setCreditCard(creditCard);
                        }
                      }}
                      error={creditCardErrors}
                      creditCardInputRefs={creditCardInputRefs}
                    />
                  );
                }
              })()}

            <PaymentBoard
              onTermsChange={(value: boolean) => setTermsAreRead(value)}
              selectedPlan={selectedPlan}
              plans={plans}
              termsError={termsError}
            />

            <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row gap-4 md:gap-0 lg:gap-0 xl:gap-0 items-center justify-between my-4 max-w-[1215px]">
              <button
                className="active:bg-gray-500 cursor-pointer flex items-center flex-row justify-around bg-primary w-80 h-16 text-tertiary rounded transition-colors duration-300 font-bold text-2xl lg:text-3xl hover:bg-red-600 hover:text-white"
                onClick={handlePreviousStep}
              >
                Voltar
              </button>

              <button
                className="active:bg-gray-500 cursor-pointer flex items-center flex-row justify-around bg-primary w-80 h-16 text-tertiary rounded transition-colors duration-300 font-bold text-2xl lg:text-3xl hover:bg-red-600 hover:text-white"
                onClick={handleSubmit}
                disabled={loading}
              >
                <span className={`${loading ? 'ml-16' : ''}`}>Continuar</span>
                {loading && <Loading />}
              </button>
            </div>
          </div>
        </div>

        <PaymentFailModal
          isOpen={failPaymentModalIsOpen}
          setModalIsOpen={setFailPaymentModalIsOpen}
          paymentError={paymentError}
        />
      </div>

      <Footer smallPage={false} />
    </>
  );
};

export default RegisterStep3;

export async function getStaticProps() {
  const plans = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/plan`)
    .then((res) => res.json())
    .catch(() => ({}));

  return {
    props: {
      plans,
    },
    revalidate: 60,
  };
}
