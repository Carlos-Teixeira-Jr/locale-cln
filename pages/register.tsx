import { useRouter } from 'next/router';
import { MouseEvent, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  IAddress,
  PricesType
} from '../common/interfaces/property/propertyData';
import {
  IRegisterMainFeatures,
  IRegisterPropertyData_Step1,
} from '../common/interfaces/property/register/register';
import { ErrorToastNames, showErrorToast } from '../common/utils/toasts';
import Loading from '../components/atoms/loading';
import LinearStepper from '../components/atoms/stepper/stepper';
import Address from '../components/molecules/address/address';
import AreaCalculatorModal from '../components/molecules/areaModal/areaModal';
import { Footer, Header } from '../components/organisms';
import MainFeatures from '../components/organisms/mainFeatures/mainFeatures';
import { useProgress } from '../context/registerProgress';
var store = require('store')

const Register = () => {
  const router = useRouter();
  const { updateProgress, progress } = useProgress();
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [geocode, setGeocode] = useState<{ lat: number, lng: number }>();

  const [registration, setRegistration] = useState<IRegisterMainFeatures>({
    adType: 'comprar',
    adSubtype: 'residencial',
    propertyType: 'casa',
    propertySubtype: 'padrao',
    description: '',
    metadata: [
      { type: 'bathroom', amount: 0 },
      { type: 'garage', amount: 0 },
      { type: 'bedroom', amount: 0 },
      { type: 'dependencies', amount: 0 },
      { type: 'suites', amount: 0 },
    ],
    size: {
      width: 0,
      height: 0,
      totalArea: 0,
      useableArea: 0,
    },
    propertyValue: '',
    condominium: false,
    iptu: false,
    condominiumValue: '',
    iptuValue: '',
  });

  const [registrationErrors, setRegistrationErrors] = useState({
    description: '',
    totalArea: '',
    propertyValue: '',
    condominiumValue: '',
    iptuValue: '',
  });

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
    uf: '',
    city: '',
    streetName: '',
  });

  const query = router.query;

  const urlEmail = query.email;

  const mainFeaturesInputRefs = {
    description: useRef<HTMLElement>(null),
    totalArea: useRef<HTMLInputElement>(null),
    propertyValue: useRef<HTMLInputElement>(null),
    condominiumValue: useRef<HTMLInputElement>(null),
    iptuValue: useRef<HTMLInputElement>(null),
  };

  const addressInputRefs = {
    zipCode: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    streetName: useRef<HTMLInputElement>(null),
    streetNumber: useRef<HTMLInputElement>(null),
    uf: useRef<HTMLInputElement>(null),
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const error = 'Este campo é obrigatório';

    setRegistrationErrors({
      description: '',
      totalArea: '',
      propertyValue: '',
      condominiumValue: '',
      iptuValue: '',
    });

    setAddressErrors({
      zipCode: '',
      uf: '',
      city: '',
      streetName: '',
    });

    const newRegistrationErrors = {
      description: '',
      totalArea: '',
      propertyValue: '',
      condominiumValue: '',
      iptuValue: '',
    };

    const newAddressErrors = {
      zipCode: '',
      uf: '',
      streetNumber: '',
      city: '',
      streetName: '',
    };

    if (!address.zipCode) newAddressErrors.zipCode = error;
    if (!address.city) newAddressErrors.city = error;
    if (!address.streetName) newAddressErrors.streetName = error;
    if (!address.uf) newAddressErrors.uf = error;
    if (!registration.description) newRegistrationErrors.description = error;
    if (registration.size.totalArea === 0)
      newRegistrationErrors.totalArea = error;
    if (!registration.propertyValue)
      newRegistrationErrors.propertyValue = error;
    if (registration.condominium) {
      if (!registration.condominiumValue)
        newRegistrationErrors.condominiumValue = error;
    }
    if (registration.iptu) {
      if (!registration.iptuValue) newRegistrationErrors.iptuValue = error;
    }

    setRegistrationErrors(newRegistrationErrors);

    setAddressErrors(newAddressErrors);

    const combinedErrors = {
      ...newRegistrationErrors,
      ...newAddressErrors,
    };

    const hasErrors = Object.values(combinedErrors).some(
      (error) => error !== ''
    );

    if (!hasErrors) {
      const propertyDataStep1: IRegisterPropertyData_Step1 = {
        adType: registration.adType,
        adSubtype: registration.adSubtype,
        propertyType: registration.propertyType,
        propertySubtype: registration.propertySubtype,
        address: address,
        geolocation: { type: 'Point', coordinates: [geocode?.lng ? geocode?.lng : -52.1872864, geocode?.lat ? geocode?.lat : -32.1013804] },
        description: registration.description,
        metadata: registration.metadata,
        size: {
          width: registration.size.width,
          height: registration.size.height,
          totalArea: registration.size.totalArea,
          useableArea: registration.size.useableArea,
        },
        prices: [
          {
            type: registration.adType === 'alugar' ? PricesType.mensal : PricesType.mensal,
            value: parseInt(
              registration.propertyValue.replace(/\./g, '')
            ),
          },
          {
            type: PricesType.condominio,
            value: parseInt(registration.condominiumValue.replace(/\./g, '')),
          },
          {
            type: PricesType.IPTU,
            value: parseInt(
              registration.iptuValue.replace(/\./g, '')
            )
          }
        ],
        condominium: registration.condominium,
        tags: registration.metadata.some((item) => item.amount > 0)
          ? ['garagem']
          : [],
      };

      toast.loading('Enviando...');

      setLoading(true);

      store.set('propertyData', propertyDataStep1);

      toast.dismiss();

      updateProgress(2);

      if (urlEmail !== undefined) {
        router.push({
          pathname: '/registerStep2',
          query: {
            email: urlEmail,
          },
        });
      } else {
        router.push('/registerStep2');
      }
    } else {
      showErrorToast(ErrorToastNames.EmptyFields)
      setLoading(false);
    }
  };

  const classes = {
    stepLabel:
      'md:mt-[130px] mt-[120px] md:mb-10 lg:mb-2 w-full mx-auto lg:mx-24 xl:mx-auto',
    buttonContainer:
      'flex md:justify-end justify-center lg:justify-end xl:justify-end px-5 max-w-[1215px]',
    button:
      `flex items-center flex-row justify-around w-44 h-14 text-tertiary rounded font-bold text-lg md:text-xl ${loading ?
        'bg-red-300 transition-colors duration-300' :
        'bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer'
      }`,
  };

  return (
    <>
      {!progress ? (
        <div className='flex justify-center items-center h-screen'>
          <Loading width='md:w-20' height='md:h-20' />
        </div>
      ) : (
        <>
          <div>
            <Header />
          </div>
          <AreaCalculatorModal
            open={open}
            handleClose={handleClose}
            handleSize={(value: number) => {
              setRegistration({
                ...registration,
                size: { ...registration.size, totalArea: value },
              });
            }}
          />
          <div className="max-w-[1215px] mx-auto">
            <div className={classes.stepLabel}>
              <LinearStepper activeStep={0} />
            </div>

            <MainFeatures
              propertyId={''}
              editarAdType={router.pathname === '/register' ? 'vender' : 'comprar'}
              editarSubType={'comercial'}
              editarPropertyType={'apartamento'}
              editarPropertySubtype={'cobertura'}
              editarSize={registration.size}
              editarNumBedroom={0}
              editarNumBathroom={0}
              editarNumGarage={0}
              editarNumDependencies={0}
              editarNumSuite={0}
              editarDescription={''}
              editarPropertyValue={''}
              editarCondominium={false}
              editarCondominiumValue={''}
              editarIptuValue={''}
              editarIptu={false}
              isEdit={false}
              onMainFeaturesUpdate={(updatedFeatures: any) =>
                setRegistration(updatedFeatures)
              }
              errors={registrationErrors}
              mainFeaturesInputRefs={mainFeaturesInputRefs}
            />

            <Address
              isEdit={false}
              address={address}
              onAddressUpdate={(updatedAddress: IAddress) =>
                setAddress(updatedAddress)
              }
              errors={addressErrors}
              addressInputRefs={addressInputRefs}
              onGetGeocode={(geocode: any) => { if (geocode !== undefined) setGeocode(geocode) }}
            />

            <div className={classes.buttonContainer}>
              <button
                className={classes.button}
                onClick={handleSubmit}
                disabled={loading}
              >
                <span className={`${loading ? 'ml-5' : ''}`}>Continuar</span>
                {loading && <Loading />}
              </button>
            </div>
          </div>

          <div className="flex flex-col mt-10">
            <Footer />
          </div>
        </>
      )}
    </>
  );
};

export default Register;
