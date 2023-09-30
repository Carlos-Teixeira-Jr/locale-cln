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

  const [address, setAddress] = useState<IAddress>({
    zipCode: '',
    city: '',
    streetName: '',
    streetNumber: '',
    complement: '',
    neighborhood: '',
    uf: ''
  });

  // Modal
  const handleCalcSizeArea = (value: number) => {
    setRegistration({
      ...registration,
      size: { ...registration.size, totalArea: value },
    });
  };

  // modal functions
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  // Envia as mensagens de erros para os componentes;
  const [errorInfo, setErrorInfo] = useState({
    error: '',
    prop: ''
  });

  const errorHandler = useRef<{ error: string; prop: string }>({
    error: '',
    prop: ''
  });

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const error = 'Este campo é obrigatório';

    setErrorInfo({
      prop: '',
      error: ''
    });

    errorHandler.current = {
      prop: '',
      error: ''
    }

    if (address.zipCode === '') {
      setErrorInfo({ error: error, prop: 'zipCode' });
      errorHandler.current = { error: error, prop: 'zipCode' }
    }
    if (address.streetNumber === '') {
      setErrorInfo({ error: error, prop: 'streetNumber' });
      errorHandler.current = { error: error, prop: 'streetNumber' }
    }
    if (address.city === '') {
      setErrorInfo({ error: error, prop: 'city' });
      errorHandler.current = { error: error, prop: 'city' }
    }
    if (address.zipCode === '') {
      setErrorInfo({ error: error, prop: 'zipCode' });
      errorHandler.current = { error: error, prop: 'zipCode' }
    }
    if (registration.description === '') {
      setErrorInfo({ error: error, prop: 'description' });
      errorHandler.current = { error: error, prop: 'description' }
    }
    if (registration.size.totalArea === 0) {
      setErrorInfo({ error: error, prop: 'totalArea' });
      errorHandler.current = { error: error, prop: 'totalArea' }
    }
    if (registration.propertyValue === '') {
      setErrorInfo({ error: error, prop: 'propertyValue' });
      errorHandler.current = { error: error, prop: 'propertyValue' }
    }
    if (registration.condominium) {
      if (registration.condominiumValue === '') {
        setErrorInfo({ error: error, prop: 'condominiumValue' });
        errorHandler.current = { error: error, prop: 'condominiumValue' }
      }
    }
    if (registration.iptu && registration.iptuValue === '') {
      setErrorInfo({ error: error, prop: 'iptuValue' });
      errorHandler.current = { error: error, prop: 'iptuValue' }
    }

    if(errorHandler.current.prop === '' && errorHandler.current.error === '') {
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
      router.push({
        pathname: '/registerStep2',
        query: {
          email: urlEmail
        }
      });

    } else {
      toast.error(`Algum campo obrigatório ${errorInfo.prop} não foi preenchido.`);
    }
  };

  return (
    <>
      <div className="fixed z-10 top-0 w-auto md:w-full">
        <Header />
      </div>
      <AreaCalculatorModal
        open={open}
        handleClose={handleClose}
        handleSize={handleCalcSizeArea}
      />
      <div className="lg:mx-24">
        <div className="md:mt-[150px] mt-[120px] md:mb-14 lg:mb-2 w-full mx-auto lg:mx-24 max-w-[1536px] xl:mx-auto">
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
          onErrorsInfo={errorInfo} 
          onMainFeaturesUpdate={(updatedFeatures: any) => setRegistration(updatedFeatures)}        
        />

        <Address 
          isEdit={false} 
          address={address} 
          onAddressUpdate={(updatedAddress: IAddress) => setAddress(updatedAddress)} 
          onErrorsInfo={errorInfo}
        />

        <div className="flex self-end md:justify-end justify-center mb-32 mt-16">
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
