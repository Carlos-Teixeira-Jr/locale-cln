import React, { useEffect, useRef, useState } from 'react';
import ArrowDownIconcon from '../../../components/atoms/icons/arrowDownIcon';
import Address from '../../../components/molecules/address/address';
import UploadImages from '../../../components/molecules/uploadImages/uploadImages';
import AdminHeader from '../../../components/organisms/adminHeader/adminHeader';
import MainFeatures from '../../../components/organisms/mainFeatures/mainFeatures';
import PropertyDifferentials from '../../../components/organisms/register/propertyDifferential';
import SideMenu from '../../../components/organisms/sideMenu/sideMenu';
import { NextPageWithLayout } from '../../page';
import { GetServerSidePropsContext } from 'next';
import { IAddress, IData, IMetadata, IPrices, PricesType } from '../../../common/interfaces/property/propertyData';
import { getSession } from 'next-auth/react';
import { IEditPropertyData, IEditPropertyMainFeatures } from '../../../common/interfaces/property/editPropertyData';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { fetchJson } from '../../../common/utils/fetchJson';
import { destroyCookie } from 'nookies';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface IEditAnnouncement {
  property: IData;
}

const EditAnnouncement: NextPageWithLayout<IEditAnnouncement> = ({ property }) => {

  const [rotate1, setRotate1] = useState(false);
  const [rotate2, setRotate2] = useState(false);
  const [rotate3, setRotate3] = useState(false);
  const [rotate4, setRotate4] = useState(false);

  const router = useRouter();
  const isEdit = router.pathname == '/property/modify/[id]';
  
  const [address, setAddress] = useState<IAddress>({
    zipCode: '',
    city: '',
    streetName: '',
    streetNumber: '',
    complement: '',
    neighborhood: '',
    uf: ''
  });

  const [mainFeatures, setMainFeatures] = useState<IEditPropertyMainFeatures>({
    _id: '',
    adType: 'comprar',
    adSubtype: 'residencial',
    propertyType: 'casa',
    propertySubtype: 'padrao',
    description: '',
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
    metadata: [],
  });

  const [tags, setTags] = useState<string[]>(isEdit ? property.tags : []);
  const [condominiumTags, setCondominiumTags] = useState<string[]>(isEdit ? property.condominiumTags : []);
  const [videoLink, setVideoLink] = useState<string>(isEdit ? property.youtubeLink : '');
  const [images, setImages] = useState<string[]>(isEdit ? property.images : []);

  // Envia as mensagens de erros para os componetes;
  const [errorInfo, setErrorInfo] = useState({
    error: '',
    prop: ''
  });

  useEffect(() => {
    setVideoLink(property.youtubeLink)
  }, [property.youtubeLink]);

  const showHide = (element: string) => {
    const classList = document.getElementById(element)?.classList;
    classList?.contains('hidden')
      ? classList?.remove('hidden')
      : classList?.add('hidden');

    document.getElementById('accordion-1')?.classList?.contains('hidden')
      ? setRotate1(true)
      : setRotate1(false);
    document.getElementById('accordion-2')?.classList?.contains('hidden')
      ? setRotate2(true)
      : setRotate2(false);
    document.getElementById('accordion-3')?.classList?.contains('hidden')
      ? setRotate3(true)
      : setRotate3(false);
    document.getElementById('accordion-4')?.classList?.contains('hidden')
      ? setRotate4(true)
      : setRotate4(false);
  };

  // Lida com a verificação de erros do handleSubmit (necessário para acessar o valor atualizado de erros ainda antes do final da execução do handleSubmit)
  const errorHandler = useRef<{ error: string; prop: string }>({
    error: '',
    prop: ''
  });

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
      setErrorInfo({
        error: error,
        prop: 'zipCode'
      });
      errorHandler.current = {
        error: error,
        prop: 'zipCode'
      }
    }
    if (address.streetNumber === '') {
      setErrorInfo({
        error: error,
        prop: 'streetNumber'
      });
      errorHandler.current = {
        error: error,
        prop: 'streetNumber'
      }
    }    
    if (address.city === '') {
      setErrorInfo({
        error: error,
        prop: 'city'
      });
      errorHandler.current = {
        error: error,
        prop: 'city'
      }
    }
    if (address.uf === '') {
      setErrorInfo({
        error: error,
        prop: 'uf'
      });
      errorHandler.current = {
        error: error,
        prop: 'uf'
      }
    }
    if (address.streetName === '') {
      setErrorInfo({
        error: error,
        prop: 'streetName'
      });
      errorHandler.current = {
        error: error,
        prop: 'streetName'
      }
    }
    if (address.neighborhood === '') {
      setErrorInfo({
        error: error,
        prop: 'neighborhood'
      });
      errorHandler.current = {
        error: error,
        prop: 'neighborhood'
      }
    }
    if (images.length < 3) {
      const imagesError = 'Você precisa ter pelo menos três fotos.'
      setErrorInfo({
        error: imagesError,
        prop: 'images'
      });
      errorHandler.current = {
        error: error,
        prop: 'images'
      }
    }
    if (mainFeatures.description === '') {
      setErrorInfo({
        error: error,
        prop: 'description'
      });
      errorHandler.current = {
        error: error,
        prop: 'description'
      }
    }
    if (mainFeatures.size.totalArea === 0) {
      setErrorInfo({
        error: error,
        prop: 'size.area'
      });
      errorHandler.current = {
        error: error,
        prop: 'size.area'
      }
    }
    if (mainFeatures.propertyValue === '') {
      setErrorInfo({
        error: error,
        prop: 'propertyValue'
      });
      errorHandler.current = {
        error: error,
        prop: 'propertyValue'
      }
    }
    if (mainFeatures.condominium) {
      if (mainFeatures.condominiumValue === '') {
        setErrorInfo({
          error: error,
          prop: 'condominiumValue'
        });
        errorHandler.current = {
          error: error,
          prop: 'condominiumValue'
        }
      }
    }
    if (mainFeatures.iptu && mainFeatures.iptuValue === '') {
      setErrorInfo({
        error: error,
        prop: 'iptuValue'
      });
      errorHandler.current = {
        error: error,
        prop: 'iptuValue'
      }
    }

    if(errorHandler.current.prop === '' && errorHandler.current.error === '') {
      const propertyData: IEditPropertyData = {
        id: property._id,
        adType: mainFeatures.adType,
        adSubtype: mainFeatures.adSubtype,
        propertyType: mainFeatures.propertyType,
        propertySubtype: mainFeatures.propertySubtype,
        address: address,
        description: mainFeatures.description,
        metadata: mainFeatures.metadata,
        images: images,
        size: {
          width: mainFeatures.size.width,
          height: mainFeatures.size.height,
          totalArea: mainFeatures.size.totalArea,
          useableArea: mainFeatures.size.useableArea
        },
        tags: tags,
        condominiumTags: condominiumTags,
        prices: [
          {
            type: PricesType.mensal,
            value: parseInt(mainFeatures.propertyValue)
          },
          {
            type: PricesType.condominio,
            value: parseInt(mainFeatures.condominiumValue),
          }
        ],
        youtubeLink: videoLink,
      }

      try {
        toast.loading("Enviando...");
        const response = await fetch('http://localhost:3001/property/edit-property', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(propertyData)
        });

        if (response.ok) {
          toast.dismiss();
          toast.success("Imóvel atualizado com sucesso.");
          router.push("/admin");
        } else {
          toast.dismiss();
          toast.error("Houve um erro na atualização dos dados deste imóvel. Por favor tente novamente.")
        }
      } catch (error) {
        toast.dismiss();
        toast.error("Não foi possível se conectar ao servidor. Pro favor, tente novamente mais tarde.")
        console.error("Houve um erro na resposta da chamada", error);
      }
    } else {
      toast.error("Algum campo obrigatório não foi preenchido.")
    }
  }

  return (
    <div>
      <AdminHeader />
      <div className="flex flex-row justify-center lg:justify-end xl:justify-end 2xl:justify-center">
        <div className="fixed left-0 top-20 sm:hidden hidden md:hidden lg:flex">
          <SideMenu
            isMobileProp={false}
            isOwnerProp={property !== undefined && true}
          />
        </div>
        <div className="flex flex-col items-center mt-16 max-w-[900px] px-2 md:px-10">
          <h1 className="font-bold text-2xl lg:text-3xl text-quaternary my-10 mx-auto">
            Edição do Anúncio
            <div className="accordion flex flex-col">
              <div>
                <input
                  type="checkbox"
                  name="painel"
                  id="painel-1"
                  className="hidden"
                  onClick={() => showHide('accordion-1')}
                />
                <label
                  htmlFor="painel-1"
                  className="flex flex-row items-center justify-between sm:min-w-[300px] md:min-w-[620px] lg:min-w-[600px] xl:min-w-[800px] 2xl:min-w-[1000px] h-12 bg-tertiary border-2 border-quaternary mt-10 px-8 text-xl transition bg-opacity-90 hover:bg-gray-300"
                >
                  Endereço
                  <span className={`transition-transform transform ${rotate1 ? 'rotate-180' : ''}`}>
                    <ArrowDownIconcon
                      width='13'
                      className='cursor-pointer'
                    />
                  </span>
                </label>
                <div
                  className="accordion__content hidden bg-grey-lighter dis"
                  id="accordion-1"
                >
                  <div className="accordion__body" id="painel1">
                    <Address
                      isEdit={isEdit}
                      address={property.address}
                      onAddressUpdate={(updatedAddress: IAddress) => setAddress(updatedAddress)}
                      onErrorsInfo={errorInfo}
                    />
                  </div>
                </div>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="painel"
                  id="painel-2"
                  className="hidden"
                  onClick={() => showHide('accordion-2')}
                />
                <label
                  htmlFor="painel-2"
                  className="flex flex-row items-center justify-between sm:min-w-[300px] md:min-w-[620px] lg:min-w-[600px] xl:min-w-[800px] 2xl:min-w-[1000px] h-12 bg-tertiary border-2 border-quaternary mt-10 px-8 text-xl transition bg-opacity-90 hover:bg-gray-300"
                >
                  Fotos
                  <span className={`transition-transform transform ${rotate2 ? 'rotate-180' : ''}`}>
                    <ArrowDownIconcon
                      width='13'
                      className='cursor-pointer'
                    />
                  </span>
                </label>
                <div
                  className="accordion__content hidden bg-grey-lighter dis"
                  id="accordion-2"
                >
                  <div className="accordion__body" id="painel2">
                    <UploadImages 
                      editarImages={property.images} 
                      onImagesUpdate={(updatedImages: string[]) => setImages(updatedImages)}
                      onErrorsInfo={errorInfo}
                    />
                  </div>
                </div>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="painel"
                  id="painel-3"
                  className="hidden"
                  onClick={() => showHide('accordion-3')}
                />
                <label
                  htmlFor="painel-3"
                  className="flex flex-row items-center justify-between sm:min-w-[300px] md:min-w-[620px] lg:min-w-[600px] xl:min-w-[800px] 2xl:min-w-[1000px] h-12 bg-tertiary border-2 border-quaternary mt-10 px-8 text-xl transition bg-opacity-90 hover:bg-gray-300"
                >
                  Características
                  <span className={`transition-transform transform ${rotate3 ? 'rotate-180' : ''}`}>
                    <ArrowDownIconcon
                      width='13'
                      className='cursor-pointer'
                    />
                  </span>
                </label>
                <div
                  className="accordion__content hidden bg-grey-lighter dis"
                  id="accordion-3"
                >
                  <div className="accordion__body" id="painel3">
                    <MainFeatures
                      propertyId={property._id}
                      editarAdType={property.adType}
                      editarSubType={property.adSubtype}
                      editarPropertyType={property.propertyType}
                      editarPropertySubtype={property.propertySubtype}
                      editarNumBedroom={property.metadata.find((obj) => obj.type === 'bedroom')?.amount || 0}
                      editarNumBathroom={property.metadata.find((obj) => obj.type === 'bathroom')?.amount || 0}
                      editarNumGarage={property.metadata.find((obj: IMetadata) => obj.type === "garage")?.amount || 0}
                      editarNumDependencies={property.metadata.find((obj: IMetadata) => obj.type === 'dependencies')?.amount || 0}
                      editarNumSuite={property.metadata.find((obj) => obj.type === 'suites')?.amount || 0}
                      editarDescription={property.description}
                      editarPropertyValue={property.prices[0].value.toString()}
                      editarCondominium={property.prices.some((obj: IPrices) => obj.type === 'condominio')}
                      editarCondominiumValue={property.prices.find((obj: IPrices) => obj.type === 'condominio')?.value.toString() || ''}
                      editarIptuValue={property.prices.find((obj: IPrices) => obj.type === 'condominio')?.value.toString() || ''}
                      editarIptu={property.prices.some((obj: IPrices) => obj.type === 'condominio')}
                      isEdit={isEdit}
                      onErrorsInfo={errorInfo}
                      onMainFeaturesUpdate={(updatedFeatures: IEditPropertyMainFeatures) => setMainFeatures(updatedFeatures)} 
                      editarSize={property.size}
                    />
                  </div>
                </div>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="painel"
                  id="painel-4"
                  className="hidden"
                  onClick={() => showHide('accordion-4')}
                />
                <label
                  htmlFor="painel-4"
                  className="flex flex-row items-center justify-between sm:min-w-[300px] md:min-w-[620px] lg:min-w-[600px] xl:min-w-[800px] 2xl:min-w-[1000px] h-12 bg-tertiary border-2 border-quaternary mt-10 px-8 text-xl transition bg-opacity-90 hover:bg-gray-300"
                >
                  Outras Características
                  <span className={`transition-transform transform ${rotate4 ? 'rotate-180' : ''}`}>
                    <ArrowDownIconcon
                      width='13'
                      className='cursor-pointer'
                    />
                  </span>
                </label>
                <div
                  className="accordion__content hidden bg-grey-lighter dis"
                  id="accordion-4"
                >
                  <div className="accordion__body" id="painel4">
                    <PropertyDifferentials
                      shouldRenderCondDiv={
                        property.propertyType === 'apartamento' || 
                        property.propertySubtype === 'Casa de condomínio'
                      }
                      property={property}
                      isEdit={isEdit}
                      onTagsUpdate={(updatedTags: string[]) => setTags(updatedTags)}
                      onCondominiumTagsUpdate={(updatedCondTags: string[]) => setCondominiumTags(updatedCondTags)}
                      onVideoLinkUpdate={(updatedVideo: string) => setVideoLink(updatedVideo)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex self-end md:justify-end justify-center mb-32 mt-16">
              <button className="bg-primary w-80 h-16 text-tertiary rounded transition-colors duration-300 hover:bg-red-600 hover:text-white" onClick={handleSubmit}>
                  Atualizar Dados
              </button>
            </div>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default EditAnnouncement;

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const session = await getSession(context) as any;
  const query = context.query;
  const propertyId = query.id;
  let token = session?.user?.data?.access_token!!;
  let refreshToken = session?.user?.data.refresh_token;
  const isEdit = await session ? true : false;
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
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

    const [property] = await Promise.all([
      fetch(`${baseUrl}/property/${propertyId}?isEdit=${isEdit}`)
      .then((res) => res.json())
      .catch(() => {}),
      fetchJson(`${baseUrl}/property/${propertyId}?isEdit=${isEdit}`)
    ]) 
    
    return {
      props: {
        property,
      },
    };
  }
}