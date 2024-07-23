import { GetServerSidePropsContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import store from 'store';
import { IOwnerData } from '../common/interfaces/owner/owner';
import { IPlan } from '../common/interfaces/plans/plans';
import { IAddress, IData } from '../common/interfaces/property/propertyData';
import {
  ICreateProperty_propertyData,
  ICreateProperty_userData,
  IRegisterPropertyData_Step3
} from '../common/interfaces/property/register/register';
import { IUserDataComponent } from '../common/interfaces/user/user';
import { fetchJson } from '../common/utils/fetchJson';
import { geocodeAddress } from '../common/utils/geocodeAddress';
import { defaultProfileImage } from '../common/utils/images/defaultImage/defaultImage';
import { clearIndexDB, getAllImagesFromDB } from '../common/utils/indexDb';
import useProgressRedirect from '../common/utils/stepProgressHandler';
import { ErrorToastNames, showErrorToast } from '../common/utils/toasts';
import Loading from '../components/atoms/loading';
import ChangePlanModal from '../components/atoms/modals/changePlanModal';
import PaymentFailModal from '../components/atoms/modals/paymentFailModal';
import SelectAdsToDeactivateModal from '../components/atoms/modals/selectAdsToDeactivateModal';
import LinearStepper from '../components/atoms/stepper/stepper';
import { PlansCardsHidden } from '../components/molecules';
import Address from '../components/molecules/address/address';
import ChangeAddressCheckbox from '../components/molecules/address/changeAddressCheckbox';
import OwnerPlanBoard from '../components/molecules/boards/owwnerPlanBoard';
import Coupons from '../components/molecules/coupons/coupons';
import PaymentBoard from '../components/molecules/payment/paymentBoard';
import CreditCard, {
  CreditCardForm,
} from '../components/molecules/userData/creditCard';
import UserDataInputs from '../components/molecules/userData/userDataInputs';
import { Footer, Header } from '../components/organisms';
import { useProgress } from '../context/registerProgress';
import { NextPageWithLayout } from './page';

interface IRegisterStep3Props {
  selectedPlanCard: string;
  setSelectedPlanCard: (_selectedCard: string) => void;
  plans: IPlan[];
  ownerData: IOwnerData;
  docs: IData[]
}

type BodyReq = {
  propertyData: ICreateProperty_propertyData;
  userData: ICreateProperty_userData;
  plan: string;
  isPlanFree: boolean;
  phone: string;
  cellPhone: string;
  creditCardData?: CreditCardForm;
  picture?: string;
  deactivateProperties: string[];
  coupon?: string;
};

// To-do: verificar se a página está exigindo os dados do cartão mesmo quando o usuário ainda tem créditos no plano;
// To-do: Se não for feita uma nova compra não deve mostrar o valor no box do final da página;

const RegisterStep3: NextPageWithLayout<IRegisterStep3Props> = ({ plans, ownerData, docs }) => {

  const router = useRouter();
  const { progress, updateProgress } = useProgress();
  const query = router.query;
  const urlEmail = query.email as string;
  const storedData = store.get('propertyData');
  const storedPlan = store.get('plans');
  const chosenPlan = storedPlan ? storedPlan : '';
  const propertyAddress = storedData?.storedData?.address ? storedData?.storedData?.address : storedData?.address;
  const [paymentError, setPaymentError] = useState('');
  const [loading, setLoading] = useState(false);
  const freePlan = plans?.find((plan) => plan.price === 0);
  const ownerPlan = plans?.find((plan) => plan._id === ownerData?.owner?.plan)
  const [selectedPlan, setSelectedPlan] = useState(chosenPlan !== '' ? chosenPlan : ownerPlan?._id);
  const [selectedPlanData, setSelectedPlanData] = useState(plans?.find((plan) => plan._id === selectedPlan));
  const reversedCards = [...plans].reverse();
  const [isAdminPage, setIsAdminPage] = useState(false);
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [termsAreRead, setTermsAreRead] = useState(false);
  const property = store.get('propertyData');
  const [isFreePlan, setIsFreePlan] = useState(false);
  const [failPaymentModalIsOpen, setFailPaymentModalIsOpen] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [changePlanModalIsOpen, setChangePlanModalIsOpen] = useState(false);
  const [propsToDeactivateIsOpen, setPropsToDeactivateIsOpen] = useState(false);
  const [changePlanMessage, setChangePlanMessage] = useState('');
  const [isChangePlan, setIsChangePlan] = useState(false);
  const [confirmAdsToDeactivate, setConfirmAdsToDeactivate] = useState(false);
  const [docsToDeactivate, setDocsToDeactivate] = useState<string[]>([])
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const [coupon, setCoupon] = useState('');
  const [useCoupon, setUseCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const couponInputRef = useRef<HTMLElement>(null);

  // Atualiza o selectedPlanData
  useEffect(() => {
    const data = plans?.find((plan) => plan._id === selectedPlan)
    setSelectedPlanData(data)
  }, [selectedPlan])

  const userDataInputRefs = {
    username: useRef<HTMLElement>(null),
    email: useRef<HTMLElement>(null),
    cpf: useRef<HTMLElement>(null),
    cellPhone: useRef<HTMLElement>(null),
  };

  const addressInputRefs = {
    zipCode: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    streetName: useRef<HTMLInputElement>(null),
    streetNumber: useRef<HTMLInputElement>(null),
    uf: useRef<HTMLInputElement>(null),
  };

  const creditCardInputRefs = {
    cardName: useRef<HTMLInputElement>(null),
    cardNumber: useRef<HTMLInputElement>(null),
    expiry: useRef<HTMLInputElement>(null),
    cvc: useRef<HTMLInputElement>(null),
  };

  const plansRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession() as any;
  const userId = session?.user?.data._id;

  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(storedData?.geolocation ? { lat: storedData?.geolocation[1], lng: storedData?.geolocation[0] } : null);

  const [userDataForm, setUserDataForm] = useState<IUserDataComponent>({
    username: '',
    email: '',
    cpf: '314.715.150-60',
    cellPhone: '',
    phone: '',
    picture: {
      id: '',
      src: ''
    },
    wwpNumber: ''
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
    uf: '',
  });

  const [creditCard, setCreditCard] = useState<CreditCardForm>({
    cardName: 'Teste Locale',
    cardNumber: '5418931939544954',
    ccv: '776',
    expiry: '0525',
    cpfCnpj: '314.715.150-60',
    cardBrand: ''
  });

  const [creditCardErrors, setCreditCardErrors] = useState<CreditCardForm>({
    cardName: '',
    cardNumber: '',
    ccv: '',
    expiry: '',
    cpfCnpj: '',
    cardBrand: ''
  });

  const [planError, setPlanError] = useState('');

  useEffect(() => {
    if (planError !== '' && plansRef.current) {
      plansRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'center',
      });
    }
  }, [planError]);

  // Verifica se o estado progress que determina em qual step o usuário está corresponde ao step atual;
  useProgressRedirect(progress, 3, '/register');

  useEffect(() => {
    setAddressData(property ? property.address : '');
  }, []);

  // Busca as coordenadas geográficas do endereço do imóvel;
  useEffect(() => {
    if (addressData?.city && addressData?.streetName && addressData?.zipCode) {
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

  const handleSubmit = async (confirmChange: boolean) => {

    if (
      !isFreePlan &&
      !confirmAdsToDeactivate &&
      ownerPlan !== undefined &&
      selectedPlanData !== undefined &&
      selectedPlan !== ownerPlan._id &&
      // selectedPlanData.price < ownerPlan.price &&
      docs.some((doc) => doc.isActive === true) ||
      selectedPlanData?.commonAd &&
      selectedPlanData?.commonAd - docs?.filter((doc) => doc.isActive === true).length > selectedPlanData.commonAd
    ) {
      setPropsToDeactivateIsOpen(true);
      return;
    }

    const error = `Este campo é obrigatório.`;
    const planErrorMessage = `Selecione um plano de anúncios.`
    const emptyCreditsErrorMsg = 'Parece que você esgotou seus créditos de anúncio no seu plano atual. Não se preocupe! Você pode mudar para um plano diferente ou comprar mais créditos para continuar anunciando seus imóveis.'
    const invalidCouponError = 'Cupom de desconto inválido.'
    const noCreditsError = 'Você não possui mais créditos para criar anuncios em seu plano. Contrate um novo plano para poder continuar anunciando seus imóveis.'

    // Limpa o estado de erro da seleção do plano, verifica se um plano foi selecionado e emite um erro caso contrário
    const planData: IPlan | undefined = plans.find(
      (plan) => plan._id === selectedPlan
    );
    const isPlanFree = planData === undefined || planData.name === 'Free';

    setPlanError('');

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
      uf: '',
    });

    setTermsError('');
    setPaymentError('');
    setCouponError('');

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
      uf: '',
    };

    const newCreditCardErrors = {
      cardName: '',
      cardNumber: '',
      ccv: '',
      expiry: '',
      cpfCnpj: '',
      cardBrand: ''
    };

    let newPlanError = '';
    let newChangePlanError = '';
    let newPaymentError = '';
    let newCouponError = '';

    if (
      ownerData?.owner?.adCredits &&
      ownerData?.owner?.adCredits < 1 &&
      selectedPlan === ownerPlan?._id
    ) {
      setPaymentError(emptyCreditsErrorMsg);
      newPaymentError = emptyCreditsErrorMsg;
    }
    if (ownerPlan?._id !== selectedPlan && ownerPlan !== undefined && !confirmChange) newChangePlanError = `Você está alterando seu plano de ${ownerPlan?.name === 'Free' ? 'Grátis' : ownerPlan?.name} para o plano ${selectedPlanData?.name === 'Free' ? 'Grátis' : selectedPlanData?.name}. A diferença entre os valores dos planos será cobrada na próxima fatura do seu cartão de crédito.`;
    if (
      ownerData?.owner?.adCredits === 0 &&
      ownerPlan?._id === selectedPlan &&
      selectedPlan !== ''
    ) newPlanError = noCreditsError;
    if (!userDataForm?.username) newUserDataErrors.username = error;
    if (!selectedPlan && !useCoupon) newPlanError = planErrorMessage;
    if (!userDataForm?.email) newUserDataErrors.email = error;
    if (!userDataForm?.cpf) newUserDataErrors.cpf = error;
    if (!userDataForm?.cellPhone) newUserDataErrors.cellPhone = error;
    if (!addressData?.zipCode) newAddressErrors.zipCode = error;
    if (!addressData?.streetName) newAddressErrors.streetName = error;
    if (!addressData?.city) newAddressErrors.city = error;
    if (!addressData?.uf) newAddressErrors.uf = error;
    if (!termsAreRead) setTermsError(error);
    if (selectedPlan !== '') {
      if (planData && planData.name !== 'Free') {
        if (!creditCard.cardName) newCreditCardErrors.cardName = error;
        if (!creditCard.cardNumber) newCreditCardErrors.cardNumber = error;
        if (!creditCard.expiry) newCreditCardErrors.expiry = error;
        if (!creditCard.ccv) newCreditCardErrors.ccv = error;
        if (!creditCard.cpfCnpj) newCreditCardErrors.cpfCnpj = error;
      }
    }
    if (useCoupon && !coupon) newCouponError = invalidCouponError

    setUserDataErrors(newUserDataErrors);
    setAddressErrors(newAddressErrors);
    setCreditCardErrors(newCreditCardErrors);
    setPlanError(newPlanError);
    setCouponError(newCouponError);

    const combinedErrors = {
      ...newAddressErrors,
      ...newUserDataErrors,
      ...newCreditCardErrors,
      newPlanError,
      newCouponError
    };

    const hasErrors = Object.values(combinedErrors).some(
      (error) => error !== ''
    );

    const hasPaymentError = newPaymentError !== '' ? true : false;
    const planWasChanged = newChangePlanError !== '' && !confirmChange ? true : false;


    if (!hasErrors && termsAreRead) {
      if (!hasPaymentError && !planWasChanged) {
        try {

          const result = await geocodeAddress(addressData);

          if (result !== null) {
            setCoordinates(result);
          } else {
            console.log(
              'Não foi possível buscar as coordenadas geográficas do imóvel'
            );
          }
        } catch (error) {
          console.error(error);
        }

        const storedData = store.get('propertyData');

        // To-do: remover hardcode de dados de pagamento;
        const propertyDataStep3: IRegisterPropertyData_Step3 = {
          username: userDataForm.username,
          email: userDataForm.email,
          // cpf: userDataForm.cpf,
          cpf: "314.715.150-60",
          cellPhone: userDataForm.cellPhone,
          picture: userDataForm.picture
            ? userDataForm.picture
            : { id: '1', src: defaultProfileImage },
          phone: userDataForm.phone,
          wwpNumber: userDataForm.wwpNumber ? userDataForm.wwpNumber : '',
          zipCode: addressData.zipCode,
          city: addressData.city,
          uf: addressData.uf,
          streetName: addressData.streetName,
          streetNumber: addressData.streetName ? addressData.streetName : '123',
          geolocation: coordinates
            ? [coordinates?.lng, coordinates?.lat]
            : [-52.1872864, -32.1013804],
          plan: selectedPlan !== '' ? selectedPlan : freePlan,
          isPlanFree: selectedPlanData?.name === 'Free' ? true : false,
          propertyAddress,
        };

        const userData: ICreateProperty_userData = {
          _id: userId ? userId : '',
          username: userDataForm.username,
          email: userDataForm.email,
          address: isSameAddress ? { ...storedData.address, streetNumber: storedData.address.streetNumber ? storedData.address.streetNumber : '123' } : { ...addressData, streetNumber: addressData.streetNumber ? addressData.streetNumber : '123' },
          cpf: userDataForm.cpf.replace(/\D/g, ''),
          picture: userDataForm.picture
            ? userDataForm.picture
            : { id: '1', src: defaultProfileImage },
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
          size: storedData.size,
          ownerInfo: {
            picture: userDataForm.picture
              ? userDataForm.picture
              : { id: '1', src: defaultProfileImage },
            name: userDataForm.username,
            phone: userDataForm.phone,
            cellPhone: userDataForm.cellPhone,
            wwpNumber: userDataForm.wwpNumber ? `55 ${userDataForm.wwpNumber}` : ''
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
          let body: BodyReq = {
            propertyData,
            userData,
            plan: propertyDataStep3.plan,
            isPlanFree: selectedPlanData?.name === 'Free' ? true : false,
            phone: userDataForm.phone,
            cellPhone: userDataForm.cellPhone !== '' ? `${userDataForm.cellPhone}` : '',
            deactivateProperties: docsToDeactivate,
          };

          if (!isPlanFree) {
            body.creditCardData = creditCard;
          }

          if (useCoupon) {
            body = {
              ...body,
              coupon
            }
          }

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
              couponUsed: useCoupon && coupon ? true : false
            };

            const indexDbImages = (await getAllImagesFromDB()) as {
              id: string;
              data: Blob;
              name: string;
            }[];

            const propertyImagesFormData = new FormData();

            for (let i = 0; i < indexDbImages.length; i++) {
              if (indexDbImages[i].id !== userDataForm.picture.id) {
                const file = new File(
                  [indexDbImages[i].data],
                  `${indexDbImages[i].name}`
                );
                propertyImagesFormData.append('images', file);
              }
            }

            propertyImagesFormData.append('propertyId', data.createdProperty._id);

            const propertyImagesResponse = await fetch(
              `${baseUrl}/property/upload-property-images`,
              {
                method: 'POST',
                body: propertyImagesFormData,
              }
            );

            if (propertyImagesResponse.ok) {
              if (userDataForm.picture.id) {
                const profileImageFormData = new FormData();

                for (let i = 0; i < indexDbImages.length; i++) {
                  if (indexDbImages[i].id === userDataForm.picture.id) {
                    const file = new File(
                      [indexDbImages[i].data],
                      `${indexDbImages[i].name}`
                    );
                    profileImageFormData.append('images', file);
                  }
                }

                profileImageFormData.append('userId', data.user._id);

                const profileImageResponse = await fetch(
                  `${baseUrl}/property/upload-profile-image/owner/${data.createdProperty._id}`,
                  {
                    method: 'POST',
                    body: profileImageFormData,
                  }
                );

                if (!profileImageResponse.ok) {
                  showErrorToast(ErrorToastNames.SendImages);
                  showErrorToast(ErrorToastNames.OwnerImageUpload);
                  setTimeout(() => {
                    router.push('/admin');
                  }, 7000);
                }
              }

              clearIndexDB();
              updateProgress(4);
              store.set('creditCard', paymentData);
              toast.dismiss();
              store.set('propertyData', {
                propertyDataStep3,
                storedData,
                paymentData,
              });
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
              showErrorToast(ErrorToastNames.SendImages);
              showErrorToast(ErrorToastNames.ImagesUploadError);
              setTimeout(() => {
                router.push('/register');
              }, 7000);
            }
          } else {
            toast.dismiss();
            const error = await response.json();
            setPaymentError(error.message);
            setFailPaymentModalIsOpen(true);
            setLoading(false)
          }
        } catch (error) {
          toast.dismiss();
          setLoading(false);
          showErrorToast(ErrorToastNames.ServerConnection)
          console.error(error);
        }
      } else {
        if (planWasChanged) {
          setChangePlanModalIsOpen(true);
          setChangePlanMessage(newChangePlanError)
        } else {
          setFailPaymentModalIsOpen(true)
          setPaymentError(emptyCreditsErrorMsg);
          setFailPaymentModalIsOpen(true);
          setLoading(false)
        }
      }
    } else {
      showErrorToast(ErrorToastNames.EmptyFields)
      setLoading(false)
    }
  };

  const classes = {
    body: 'max-w-[1215px] mx-auto',
    stepLabel: 'md:mt-26 mt-28 sm:mt-32 md:mb-8 mx-auto',
    userData: 'flex justify-center flex-col',
    containerButton:
      'flex flex-col-reverse md:flex-row lg:flex-row xl:flex-row lg:mx-5 gap-4 md:gap-0 lg:gap-0 xl:gap-0 items-center justify-between my-4 max-w-[1215px]',
    button:
      `flex items-center flex-row justify-around w-44 h-14 text-tertiary rounded font-bold text-lg md:text-xl ${loading ?
        'bg-red-300 transition-colors duration-300' :
        'bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer'
      }`,
  };

  return (
    <>
      {progress !== 3 ? (
        <div className='flex justify-center items-center h-screen'>
          <Loading className='md:w-20 w-10 h-10 md:h-20 animate-spin text-gray-200 dark:text-gray-600 fill-tertiary' fill={'#F75D5F'} />
        </div>
      ) : (
        <>
          <div className={classes.body}>
            <Header userIsOwner={docs?.length > 0} />
            <div className="justify-center">
              <div className={classes.stepLabel}>
                <LinearStepper activeStep={2} />
              </div>

              <div className='flex flex-col'>
                <div ref={plansRef} className={`md:flex md:w-fit mx-auto md:px-8 justify-center gap-10 ${planError !== "" ? 'border-2 rounded-xl pt-7 border-red-500 transition-opacity ease-in-out opacity-100' : ''}`}>
                  {ownerData?.owner?.adCredits! === 0 || isChangePlan || !ownerData.owner ? (
                    reversedCards.map(
                      ({ _id, name, price, highlightAd, commonAd, smartAd }: IPlan) => (
                        <PlansCardsHidden
                          key={_id}
                          selectedPlanCard={selectedPlan}
                          setSelectedPlanCard={(selectedCard: string) => {
                            setSelectedPlan(selectedCard);
                            setPlanError('');
                            const planData = plans.find(
                              (plan) => plan._id === selectedCard
                            );
                            if (planData && planData?.name === 'Free') {
                              setIsFreePlan(true);
                            } else {
                              setIsFreePlan(false);
                              if (ownerData?.owner?.plan !== planData?._id) {
                                setIsChangePlan(true);
                              }
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
                          userPlan={ownerData.owner?.plan}
                          ownerCredits={ownerData?.owner?.adCredits}
                          plans={plans}
                        />
                      )
                    )
                  ) : (
                    <OwnerPlanBoard
                      ownerPlan={ownerPlan!}
                      owner={ownerData?.owner!}
                      isChangePlan={isChangePlan}
                      setIsChangePlan={(isChange: boolean) => setIsChangePlan(isChange)}
                    />
                  )}
                </div>
                {planError !== "" && (
                  <span className='text-sm text-red-500 font-normal text-center'>{planError}</span>
                )}
              </div>

              <Coupons
                onUseCouponSwitchChange={(isUseCoupon: boolean) => setUseCoupon(isUseCoupon)}
                error={couponError}
                onCouponChange={(coupon: string) => setCoupon(coupon)}
                couponInputRefs={couponInputRef}
              />

              <div className="lg:mx-0">
                <div className={classes.userData}>
                  <UserDataInputs
                    isEdit={false}
                    onUserDataUpdate={(updatedUserData: IUserDataComponent) =>
                      setUserDataForm(updatedUserData)
                    }
                    urlEmail={urlEmail ? urlEmail : undefined}
                    error={userDataErrors}
                    userDataInputRefs={userDataInputRefs}
                    ownerData={ownerData}
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

                {selectedPlan !== '' && isChangePlan &&
                  (() => {
                    const planData = plans.find((plan) => plan._id === selectedPlan);
                    if ((planData && planData.name !== 'Free' && ownerPlan?.price === 0) || (planData && planData.name !== 'Free' && !ownerPlan)) {
                      return (
                        <CreditCard
                          isEdit={false}
                          creditCardInfo={ownerData?.owner?.paymentData?.creditCardInfo}
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
                  ownerActualPlan={ownerPlan!}
                />

                <div className={classes.containerButton}>
                  <button className={classes.button} onClick={handlePreviousStep}>
                    Voltar
                  </button>
                  <button
                    className={classes.button}
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                  >
                    <span className={`${loading ? 'ml-5' : ''}`}>Continuar</span>
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

            <ChangePlanModal
              isOpen={changePlanModalIsOpen}
              setModalIsOpen={setChangePlanModalIsOpen}
              message={changePlanMessage}
              onConfirm={(confirmChange: boolean) => {
                setChangePlanModalIsOpen(false);
                handleSubmit(confirmChange);
              }}
            />

            <SelectAdsToDeactivateModal
              isOpen={propsToDeactivateIsOpen}
              setModalIsOpen={(isOpen: boolean) => setPropsToDeactivateIsOpen(isOpen)}
              docs={docs}
              ownerCredits={ownerData?.owner ? ownerData.owner.adCredits : 0}
              setConfirmAdsToDeactivate={(isConfirmed: boolean) => setConfirmAdsToDeactivate(isConfirmed)}
              onSubmit={(isConfirmed: boolean) => handleSubmit(isConfirmed)}
              docsToDeactivate={(docs: string[]) => setDocsToDeactivate(docs)}
              selectedPlan={selectedPlanData}
              ownerPrevPlan={ownerPlan}
            />
          </div >

          <Footer />
        </>
      )}
    </>
  );
};

export default RegisterStep3;

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const session = (await getSession(context) as any);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  let docs: IData[];

  const userId =
    session?.user.data._id !== undefined
      ? session?.user.data._id
      : session?.user.id;

  const [plans, ownerData] = await Promise.all([
    fetch(`${baseUrl}/plan`)
      .then((res) => res.json())
      .catch(() => []),
    fetch(`${baseUrl}/user/find-owner-by-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      }
    )
      .then((res) => res.json())
      .catch(() => []),
    fetchJson(`${baseUrl}/plan`),
    fetchJson(`${baseUrl}/user/find-owner-by-user`)
  ]);

  if (ownerData?.owner?._id) {
    const response = await fetch(`${baseUrl}/property/owner-properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ownerId: ownerData.owner._id }),
    })

    if (response.ok) {
      const data = await response.json()
      docs = data.docs;

      return {
        props: {
          plans,
          ownerData,
          docs
        },
      };
    } else {
      return {
        props: {
          plans,
          ownerData
        },
      };
    }
  } else {
    return {
      props: {
        plans,
        ownerData
      },
    };
  }
}