import { useRouter } from 'next/router';
import { useEffect, useRef, useState, MouseEvent } from 'react';
import LinearStepper from '../components/atoms/stepper/stepper';
import PlansCardsHidden from '../components/molecules/cards/plansCards/plansCardHidden';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import UserDataInputs from '../components/molecules/userData/userDataInputs';
import { NextPageWithLayout } from './page';
import { IPlan } from '../common/interfaces/plans/plans';
import { IUserDataComponent } from '../common/interfaces/user/user';
import ChangeAddressCheckbox from '../components/molecules/address/changeAddressCheckbox';
import Address from '../components/molecules/address/address';
import store from 'store';
import { IAddress } from '../common/interfaces/property/propertyData';
import CreditCard, { CreditCardForm } from '../components/molecules/userData/creditCard';
import 'react-credit-cards/es/styles-compiled.css';
import PaymentBoard from '../components/molecules/payment/paymentBoard';
import { 
  ICreateProperty_propertyData, 
  ICreateProperty_userData, 
  IRegisterPropertyData_Step3 
} from '../common/interfaces/property/register/register';
import { toast } from 'react-toastify';
import { useProgress } from '../context/registerProgress';
import PaymentFailModal from '../components/atoms/modals/paymentFailModal';
import { useSession } from 'next-auth/react';
import { geocodeAddress } from '../common/utils/geocodeAddress';

interface IRegisterStep3Props {
  selectedPlanCard: string;
  setSelectedPlanCard: (_selectedCard: string) => void;
  plans: IPlan[];
}

type BodyReq = {
  propertyData: ICreateProperty_propertyData,
  userData: ICreateProperty_userData,
  plan: string,
  isPlanFree: boolean,
  phone: string,
  cellPhone: string
  creditCardData?: CreditCardForm
}

const RegisterStep3: NextPageWithLayout<IRegisterStep3Props> = ({ plans }) => {

  const router = useRouter();
  const query = router.query;
  const urlEmail = query.email as string;
  const { progress, updateProgress } = useProgress();
  const storedData = store.get('propertyData');
  const propertyData = storedData.address;

  const { data: session } = useSession() as any;
  const userId = session?.user?.data._id;

  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('');
  const freePlan = '645a46d4388b9fbde84b6e8a';
  const reversedCards = [...plans].reverse();
  const [isAdminPage, setIsAdminPage] = useState(false);
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [termsAreRead, setTermsAreRead] = useState(false);
  const property = store.get('propertyData');
  const [isFreePlan, setIsFreePlan] = useState(false);
  const [failPaymentModalIsOpen, setFailPaymentModalIsOpen] = useState(false);

  const [userDataForm, setUserDataForm] = useState<IUserDataComponent>({
    username: '',
    email: '',
    cpf: '',
    cellPhone: '',
    phone: '',
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
    uf: ''
  });

  const [addressErrors, setAddressErrors] = useState({
    zipCode: '',
    city: '',
    streetName: '',
    streetNumber: '',
    uf: ''
  });

  const [creditCard, setCreditCard] = useState<CreditCardForm>({
    cardName: '',
    cardNumber: '',
    cvc: '',
    expiry: '',
  });
  
  
  // Verifica se o estado progress que determina em qual step o usuário está corresponde ao step atual;
  useEffect(() => {
    if (progress < 3) {
      router.push('/register');
    }
  });

  // Busca o endereço do imóvel armazenado no local storage e atualiza o valor de addressData sempre que há o componente de endereço é aberto ou fechado - isso é necessário para que o componente ChangeAddressCheckbox recupere o endereço do localStorage quando a opção é alterada;
  useEffect(() => {
    setAddressData(property ? property.address : '')
  },[isSameAddress]);

  // Envia as mensagens de erros para os componentes;
  // const [errorInfo, setErrorInfo] = useState({
  //   error: '',
  //   prop: ''
  // });

  // // Lida com a verificação de erros do handleSubmit (necessário para acessar o valor atualizado de erros ainda antes do final da execução do handleSubmit)
  // const errorHandler = useRef<{ error: string; prop: string }>({
  //   error: '',
  //   prop: ''
  // });

  useEffect(() => {
    const url = router.pathname;
    if (url === '/adminUserData') {
      setIsAdminPage(true);
    }
  }, [router.pathname]);

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const error = `Este campo é obrigatório.`;

    const planObj: IPlan | undefined = plans.find((plan) => plan._id === selectedPlan);
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
      uf: ''
    });

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
      uf: ''
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
    if (!termsAreRead) setTermsAreRead(false);

    setUserDataErrors(newUserDataErrors);
    setAddressErrors(newAddressErrors);
    
    // Combina os erros de registro e endereço em um único objeto de erros
    const combinedErrors = {
      ...newAddressErrors,
      ...newUserDataErrors,
    };

    // Verifica se algum dos valores do objeto de erros combinados não é uma string vazia
    const hasErrors = Object.values(combinedErrors).some((error) => error !== '');

    // setErrorInfo({
    //   prop: '',
    //   error: ''
    // });

    // errorHandler.current = {
    //   prop: '',
    //   error: ''
    // };

    // if (!userDataForm.username) {
    //   setErrorInfo({ error: error, prop: 'username' });
    //   errorHandler.current = { error: error, prop: 'username' }
    // }
    // if (!userDataForm.email) {
    //   setErrorInfo({ error: error, prop: 'email' });
    //   errorHandler.current = { error: error, prop: 'email' }
    // }
    // if (!userDataForm.cpf) {
    //   setErrorInfo({ error: error, prop: 'cpf' });
    //   errorHandler.current = { error: error, prop: 'cpf' }
    // }
    // if (!userDataForm.cellPhone) {
    //   setErrorInfo({ error: error, prop: 'cellPhone' });
    //   errorHandler.current = { error: error, prop: 'cellPhone' }
    // }
    // if (!userDataForm.phone) {
    //   setErrorInfo({ error: error, prop: 'phone' });
    //   errorHandler.current = { error: error, prop: 'phone' }
    // }
    // if (!termsAreRead) {
    //   setErrorInfo({ error: error, prop: 'terms' });
    //   errorHandler.current = { error: error, prop: 'terms' }
    // }
    // if (!isPlanFree) {
    //   if (!creditCard.cardName) {
    //     setErrorInfo({ error: error, prop: 'cardName' });
    //     errorHandler.current = { error: error, prop: 'cardName' }
    //   }
    //   if (!creditCard.cardNumber) {
    //     setErrorInfo({ error: error, prop: 'cardNumber' });
    //     errorHandler.current = { error: error, prop: 'cardNumber' }
    //   }
    //   if (!creditCard.cvc) {
    //     setErrorInfo({ error: error, prop: 'cvc' });
    //     errorHandler.current = { error: error, prop: 'cvc' }
    //   }
    //   if (!creditCard.expiry) {
    //     setErrorInfo({ error: error, prop: 'expiry' });
    //     errorHandler.current = { error: error, prop: 'expiry' }
    //   }
    // }
    // if (!isSameAddress) {
    //   if (!addressData.zipCode) {
    //     setErrorInfo({ error: error, prop: 'zipcode' });
    //     errorHandler.current = { error: error, prop: 'zipcode' }
    //   }
    //   if (!addressData.city) {
    //     setErrorInfo({ error: error, prop: 'city' });
    //     errorHandler.current = { error: error, prop: 'city' }
    //   }
    //   if (!addressData.uf) {
    //     setErrorInfo({ error: error, prop: 'uf' });
    //     errorHandler.current = { error: error, prop: 'uf' }
    //   }
    //   if (!addressData.streetName) {
    //     setErrorInfo({ error: error, prop: 'streetName' });
    //     errorHandler.current = { error: error, prop: 'streetName' }
    //   }
    //   if (!addressData.streetNumber) {
    //     setErrorInfo({ error: error, prop: 'streetNumber' });
    //     errorHandler.current = { error: error, prop: 'streetNumber' }
    //   }
    //   if (!addressData.neighborhood) {
    //     setErrorInfo({ error: error, prop: 'neighborhood' });
    //     errorHandler.current = { error: error, prop: 'neighborhood' }
    //   }
    //}

    if (!hasErrors) {

      try {
        const result = await geocodeAddress(addressData);

        if (result !== null) {
          console.log("🚀 ~ file: registerStep3.tsx:216 ~ handleSubmit ~ result:", result)
          setCoordinates(result);
        } else {
          console.log('Deu erro na chamada geocode')
        }
      } catch (error) {
        console.error(error)
      }      

      const storedData = store.get('propertyData');

      const propertyDataStep3: IRegisterPropertyData_Step3 = {
        username: userDataForm.username,
        email: userDataForm.email,
        cpf: userDataForm.cpf,
        cellPhone: userDataForm.cellPhone,
        phone: userDataForm.phone,
        zipCode: addressData.zipCode,
        city: addressData.city,
        geolocation: coordinates ? [coordinates?.lat, coordinates?.lng] : [-52.1872864, -32.1013804],
        plan: selectedPlan ? selectedPlan : freePlan,
        isPlanFree,
        propertyAddress: 
      };

      const userData: ICreateProperty_userData = {
        _id: userId ? userId : '',
        username: userDataForm.username,
        email: userDataForm.email,
        address: !isSameAddress ? storedData.address : addressData,
        cpf: userDataForm.cpf
      }

      const propertyData: ICreateProperty_propertyData = {
        adType: storedData.adType,
        adSubtype: storedData.adSubtype,
        propertyType: storedData.propertyType,
        propertySubtype: storedData.propertySubtype,
        address: storedData.address,
        description: storedData.description,
        metadata: storedData.metadata,
        images: storedData.images,
        size: storedData.size,
        tags: storedData.tags,
        condominiumTags: storedData.condominiumTags,
        prices: storedData.prices,
        youtubeLink: storedData.youtubeLink,
        geolocation: {
          type: "Point",
          coordinates: propertyDataStep3.geolocation
        }
      }

      try {
        toast.loading('Enviando...');
        const body: BodyReq = {
          propertyData,
          userData,
          plan: selectedPlan,
          isPlanFree,
          phone: userDataForm.phone,
          cellPhone: userDataForm.cellPhone
        };
        
        if (!isPlanFree) {
          body.creditCardData = creditCard;
        }
        const response = await fetch(`http://localhost:3001/property`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        });

        if (response.ok) {
          const data = await response.json();
          const paymentData = {
            cardBrand: data.creditCardBrand ? data.creditCardBrand : 'Free',
            value: data.paymentValue ? data.paymentValue : '00'
          };
          store.set('creditCard', paymentData);
          toast.dismiss();
          store.set('propertyData', {
            propertyDataStep3,
            storedData,
            paymentData
          });
          updateProgress(4);
          if (!urlEmail) {
            router.push('/registerStep35');
          } else {
            router.push({
              pathname: '/registerStep35',
              query: {
                email: urlEmail
              }
            });
          }
        } else {
          toast.dismiss();
          console.error(response);
          setFailPaymentModalIsOpen(true);
        }
      } catch (error) {
        toast.dismiss()
        toast.error("Não foi possivel se conectar ao servidor. Por favor, tente novamente mais tarde.")
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="fixed z-50 top-0 w-auto md:w-full">
        <Header />
      </div>
      <div className="lg:mx-[100px] justify-center">
        <div className="md:mt-36 mt-28 md:mb-5 mx-auto">
          <LinearStepper isSubmited={false} sharedActiveStep={2} />
        </div>

        <div className="flex justify-center flex-col md:flex-row md:ml-14 ml-6 max-w-[1232px] absolute z-40 md:top-52">
          {reversedCards.map(
            ({ 
              _id, 
              name, 
              price, 
              highlightAd, 
              commonAd, 
              smartAd 
            }: IPlan) => (
              <PlansCardsHidden
                key={_id}
                selectedPlanCard={selectedPlan}
                setSelectedPlanCard={(selectedCard: string) => {
                  setSelectedPlan(selectedCard);
                  const planObj = plans.find((plan) => plan._id === selectedCard);
                  if (planObj && planObj?.name === 'Free') {
                    setIsFreePlan(true)
                  } else {
                    setIsFreePlan(false)
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

        {errorInfo.prop === 'selectedPlan' && (
          <span className="text-red-500 mt-2 text-xl ml-20">{errorInfo.error}</span>
        )}

        <div className='mx-5 md:mx-0'>
          <div className="max-w-[1536px] mt-[980px] md:mt-[1300px] lg:mt-96 flex justify-center flex-col">
            <UserDataInputs 
              isEdit={false} 
              onUserDataUpdate={(updatedUserData: IUserDataComponent) => setUserDataForm(updatedUserData)} 
              onErrorsInfo={errorInfo}
              urlEmail={urlEmail ? urlEmail : undefined}
            />
          </div>

          <ChangeAddressCheckbox 
            onAddressCheckboxChange={(value: boolean) => setIsSameAddress(value)}
            address={addressData}
          />

          {!isSameAddress && (
            <Address 
              isEdit={false} 
              address={addressData} 
              onAddressUpdate={(address: IAddress) => setAddressData(address)} 
              onErrorsInfo={errorInfo}
              errors={addressErrors}
            />
          )}

          {selectedPlan !== '' && (
            (() => {
              const planObj = plans.find((plan) => plan._id === selectedPlan);
              if (planObj && planObj.name !== 'Free') {
                return (
                  <CreditCard
                    isEdit={false}
                    onErrorInfo={errorInfo}
                    onCreditCardUpdate={(creditCard) => {
                      if (!isFreePlan) {
                        setCreditCard(creditCard);
                      }
                    }}
                  />
                );
              }
            })()
          )}

          <PaymentBoard 
            onTermsChange={(value: boolean) => setTermsAreRead(value)}
            selectedPlan={selectedPlan}
            plans={plans}
            onErrorInfo={errorInfo}
          />

          <div className="flex self-end md:justify-end justify-center mt-14 mb-32">
            <button className="bg-primary w-80 h-16 text-tertiary rounded transition-colors duration-300 font-bold text-2xl lg:text-3xl hover:bg-red-600 hover:text-white" onClick={handleSubmit}>
                Continuar
            </button>
          </div>
        </div>
      </div>

      <PaymentFailModal 
        isOpen={failPaymentModalIsOpen} 
        setModalIsOpen={setFailPaymentModalIsOpen}
      />

      <Footer smallPage={false} />
    </>
  );
};

export default RegisterStep3;

export async function getStaticProps() {
  const plans = await fetch(`http://localhost:3001/plan`)
    .then((res) => res.json())
    .catch(() => ({}));

  return {
    props: {
      plans,
    },
  };
}