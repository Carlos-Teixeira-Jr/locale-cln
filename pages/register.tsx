import { MouseEvent, useRef, useState } from 'react';
import LinearStepper from '../components/atoms/stepper/stepper';
import AreaCalculatorModal from '../components/molecules/areaModal/areaModal';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import MainFeatures from '../components/organisms/mainFeatures/mainFeatures';
import { IRegisterMainFeatures, IRegisterPropertyData_Step1 } from '../common/interfaces/property/register/register';
import store from 'store';
import Address from '../components/molecules/address/address';
import { IAddress, PricesType } from '../common/interfaces/property/propertyData';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useProgress } from '../context/registerProgress';

const Register = () => {

  const router = useRouter();
  const query = router.query;
  const urlEmail = query.email;
  const { updateProgress } = useProgress();

  // Lida com o auto-scroll para os inputs de MainFeatures que mostrarem erro;
  const mainFeaturesInputRefs = {
    description: useRef<HTMLElement>(null),
    totalArea: useRef<HTMLInputElement>(null),
    propertyValue: useRef<HTMLInputElement>(null),
    condominiumValue: useRef<HTMLInputElement>(null),
    iptuValue: useRef<HTMLInputElement>(null)
  }

  // Lida com o auto-scroll para os inputs de Address que mostrarem erro;
  const addressInputRefs = {
    zipCode: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    streetName: useRef<HTMLInputElement>(null),
    streetNumber: useRef<HTMLInputElement>(null),
    uf: useRef<HTMLInputElement>(null),
  }
  
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
      useableArea: 0
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
    uf: ''
  });

  const [addressErrors, setAddressErrors] = useState({
    zipCode: '',
    uf: '',
    streetNumber: '',
    city: '',
    streetName: '',
  });

  // modal functions
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

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
      streetNumber: '',
      city: '',
      streetName: '',
    })

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
    if (!address.streetNumber) newAddressErrors.streetNumber = error;
    if (!address.uf) newAddressErrors.uf = error;
    if (!registration.description) newRegistrationErrors.description = error;
    if (registration.size.totalArea === 0) newRegistrationErrors.totalArea = error;
    if (!registration.propertyValue) newRegistrationErrors.propertyValue = error;
    if (registration.condominium) {
      if (!registration.condominiumValue) newRegistrationErrors.condominiumValue = error;
    }
    if (registration.iptu) {
      if (!registration.iptuValue) newRegistrationErrors.iptuValue = error;
    }

    setRegistrationErrors(newRegistrationErrors);
    setAddressErrors(newAddressErrors);

    // Combina os erros de registro e endereço em um único objeto de erros
    const combinedErrors = {
      ...newRegistrationErrors,
      ...newAddressErrors,
    };

    // Verifica se algum dos valores do objeto de erros combinados não é uma string vazia
    const hasErrors = Object.values(combinedErrors).some((error) => error !== '');

    if(!hasErrors) {
      const propertyDataStep1: IRegisterPropertyData_Step1 = {
        adType: registration.adType,
        adSubtype: registration.adSubtype,
        propertyType: registration.propertyType,
        propertySubtype: registration.propertySubtype,
        address: address,
        description: registration.description,
        metadata: registration.metadata,
        size: {
          width: registration.size.width,
          height: registration.size.height,
          totalArea: registration.size.totalArea,
          useableArea: registration.size.useableArea
        },
        prices: [
          {
            type: PricesType.mensal,
            value: parseInt(registration.propertyValue)
          },
          {
            type: PricesType.condominio,
            value: parseInt(registration.condominiumValue),
          }
        ],
        condominium: registration.condominium
      };

      toast.loading('Enviando...');
      store.set('propertyData', propertyDataStep1);
      toast.dismiss();
      updateProgress(2)
      if (urlEmail !== undefined) {
        router.push({
          pathname: '/registerStep2',
          query: {
            email: urlEmail
          }
        });
      } else {
        router.push('/registerStep2')
      }
    } else {
      toast.error(`Algum campo obrigatório não foi preenchido.`);
    }
  };

  return (
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
        <div className="md:mt-[150px] mt-[120px] md:mb-10 lg:mb-2 w-full mx-auto lg:mx-24  xl:mx-auto">
          <LinearStepper isSubmited={false} sharedActiveStep={0} />
        </div>

        <MainFeatures 
          propertyId={''} 
          editarAdType={'comprar'} 
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
          onMainFeaturesUpdate={(updatedFeatures: any) => setRegistration(updatedFeatures)}      
          errors={registrationErrors}  
          mainFeaturesInputRefs={mainFeaturesInputRefs}
        />

        <Address 
          isEdit={false} 
          address={address} 
          onAddressUpdate={(updatedAddress: IAddress) => setAddress(updatedAddress)} 
          errors={addressErrors}
          addressInputRefs={addressInputRefs}
        />

        <div className="flex self-end md:justify-end justify-center px-5 mb-32 mt-16 max-w-[1215px] mx-auto">
          <button className="bg-primary w-80 h-16 text-tertiary rounded transition-colors duration-300 font-bold text-2xl lg:text-3xl hover:bg-red-600 hover:text-white" onClick={handleSubmit}>
              Continuar
          </button>
        </div>
      </div>
      
      <div className="flex flex-col mt-10">
        <Footer smallPage={false} />
      </div>
    </>
  );
};

export default Register;
