import jwt, { JwtPayload } from 'jsonwebtoken';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  IEditPropertyData,
  IEditPropertyMainFeatures,
} from '../../../common/interfaces/property/editPropertyData';
import {
  IAddress,
  IData,
  IMetadata,
  IPrices,
  PricesType,
} from '../../../common/interfaces/property/propertyData';
import { fetchJson } from '../../../common/utils/fetchJson';
import { clearIndexDB, getAllImagesFromDB } from '../../../common/utils/indexDb';
import {
  ErrorToastNames,
  SuccessToastNames,
  showErrorToast,
  showSuccessToast
} from '../../../common/utils/toasts';
import ArrowDownIconcon from '../../../components/atoms/icons/arrowDownIcon';
import Address from '../../../components/molecules/address/address';
import UploadImages from '../../../components/molecules/uploadImages/uploadImages';
import AdminHeader from '../../../components/organisms/adminHeader/adminHeader';
import MainFeatures from '../../../components/organisms/mainFeatures/mainFeatures';
import PropertyDifferentials from '../../../components/organisms/register/propertyDifferential';
import SideMenu from '../../../components/organisms/sideMenu/sideMenu';
import { NextPageWithLayout } from '../../page';

interface IEditAnnouncement {
  property: IData;
}

const EditAnnouncement: NextPageWithLayout<IEditAnnouncement> = ({
  property,
}) => {
  const [rotate1, setRotate1] = useState(false);
  const [rotate2, setRotate2] = useState(false);
  const [rotate3, setRotate3] = useState(false);
  const [rotate4, setRotate4] = useState(false);
  const router = useRouter();

  const isEdit = router.pathname == '/property/modify/[id]';

  const [address, setAddress] = useState<IAddress>({
    zipCode: '96215-180',
    city: '',
    streetName: '',
    streetNumber: '123',
    complement: '',
    neighborhood: '',
    uf: '',
  });

  const [addressErrors, setAddressErrors] = useState({
    zipCode: '',
    uf: '',
    streetNumber: '',
    city: '',
    streetName: '',
  });

  const addressInputRefs = {
    zipCode: useRef<HTMLInputElement>(null),
    city: useRef<HTMLInputElement>(null),
    streetName: useRef<HTMLInputElement>(null),
    streetNumber: useRef<HTMLInputElement>(null),
    uf: useRef<HTMLInputElement>(null),
  };

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
      useableArea: 0,
    },
    propertyValue: '',
    condominium: false,
    iptu: false,
    condominiumValue: '',
    iptuValue: '',
    metadata: [],
  });

  const [mainFeaturesErrors, setMainFeaturesErrors] = useState({
    description: '',
    totalArea: '',
    propertyValue: '',
    condominiumValue: '',
    iptuValue: '',
  });

  const mainFeaturesInputRefs = {
    description: useRef<HTMLElement>(null),
    totalArea: useRef<HTMLInputElement>(null),
    propertyValue: useRef<HTMLInputElement>(null),
    condominiumValue: useRef<HTMLInputElement>(null),
    iptuValue: useRef<HTMLInputElement>(null),
  };

  const [tags, setTags] = useState<string[]>(isEdit ? property.tags : []);

  const [condominiumTags, setCondominiumTags] = useState<string[]>(
    isEdit ? property.condominiumTags : []
  );

  const [videoLink, setVideoLink] = useState<string>(
    isEdit ? property.youtubeLink : ''
  );

  useEffect(() => {
    setVideoLink(property.youtubeLink);
  }, [property.youtubeLink]);

  const [images, setImages] = useState<string[]>(isEdit ? property.images : []);

  const imagesInputRef = useRef<HTMLElement>(null);

  const [errorInfo, setErrorInfo] = useState({
    error: '',
    prop: '',
  });

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

  const errorHandler = useRef<{ error: string; prop: string }>({
    error: '',
    prop: '',
  });

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const error = 'Este campo é obrigatório';

    setErrorInfo({
      prop: '',
      error: '',
    });

    errorHandler.current = {
      prop: '',
      error: '',
    };

    setMainFeaturesErrors({
      description: '',
      totalArea: '',
      propertyValue: '',
      condominiumValue: '',
      iptuValue: '',
    });

    setAddressErrors({
      zipCode: '',
      city: '',
      streetName: '',
      streetNumber: '',
      uf: '',
    });

    const newMainFeaturesErrors = {
      description: '',
      totalArea: '',
      propertyValue: '',
      condominiumValue: '',
      iptuValue: '',
    };

    const newAddressErrors = {
      zipCode: '',
      city: '',
      streetName: '',
      streetNumber: '',
      uf: '',
    };

    if (!mainFeatures.description) newMainFeaturesErrors.description = error;
    if (!mainFeatures.size.totalArea) newMainFeaturesErrors.totalArea = error;
    if (!mainFeatures.propertyValue)
      newMainFeaturesErrors.propertyValue = error;
    if (mainFeatures.condominium) {
      if (!mainFeatures.condominiumValue)
        newMainFeaturesErrors.condominiumValue = error;
    }
    if (mainFeatures.iptu) {
      if (!mainFeatures.iptuValue) newMainFeaturesErrors.iptuValue = error;
    }
    if (!address.zipCode) newAddressErrors.zipCode = error;
    if (!address.streetName) newAddressErrors.streetName = error;
    if (!address.streetNumber) newAddressErrors.streetNumber = error;
    if (!address.city) newAddressErrors.city = error;
    if (!address.uf) newAddressErrors.uf = error;
    if (images.length < 5) {
      const imagesError = 'Você precisa ter pelo menos cinco fotos.';
      setErrorInfo({
        error: imagesError,
        prop: 'images',
      });
      errorHandler.current = {
        error: error,
        prop: 'images',
      };
    }

    setMainFeaturesErrors(newMainFeaturesErrors);
    setAddressErrors(newAddressErrors);

    const combinedErrors = {
      ...newAddressErrors,
      ...newMainFeaturesErrors,
    };

    const hasErrors = Object.values(combinedErrors).some(
      (error) => error !== ''
    );

    if (
      errorHandler.current.prop === '' &&
      errorHandler.current.error === '' &&
      !hasErrors
    ) {

      const propertyData: IEditPropertyData = {
        id: property._id,
        adType: mainFeatures.adType,
        adSubtype: mainFeatures.adSubtype,
        propertyType: mainFeatures.propertyType,
        propertySubtype: mainFeatures.propertySubtype,
        address: address,
        description: mainFeatures.description,
        metadata: mainFeatures.metadata,
        size: {
          width: mainFeatures.size.width,
          height: mainFeatures.size.height,
          totalArea: mainFeatures.size.totalArea,
          useableArea: mainFeatures.size.useableArea
            ? mainFeatures.size.useableArea
            : 0,
        },
        tags: tags,
        condominiumTags: condominiumTags,
        prices: [
          {
            type: PricesType.mensal,
            value: parseInt(
              mainFeatures.propertyValue.replace(/\./g, '').replace(',', '.')
            ),
          },
          {
            type: PricesType.condominio,
            value: mainFeatures.condominium
              ? parseInt(
                mainFeatures.condominiumValue
                  .replace(/\./g, '')
                  .replace(',', '.')
              )
              : 0,
          },
        ],
        youtubeLink: videoLink,
      };

      try {
        toast.loading('Enviando...');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/property/edit-property`,
          {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify(propertyData),
          }
        );

        if (response.ok) {
          try {
            const indexDbImages = (await getAllImagesFromDB()) as {
              id: string;
              data: Blob;
              name: string;
            }[];

            const editImagesFormData = new FormData();

            for (let i = 0; i < indexDbImages.length; i++) {
              const file = new File(
                [indexDbImages[i].data],
                `${indexDbImages[i].name}`
              );
              editImagesFormData.append('images', file);
            }

            const data = {
              propertyId: property._id,
              prevImages: [""]
            }

            data.prevImages = images.filter(image => !image.startsWith('blob'));

            editImagesFormData.append('data', JSON.stringify(data));

            try {
              await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/property/edit-property-images`,
                {
                  method: 'POST',
                  body: editImagesFormData
                }
              );
            } catch (error) {
              clearIndexDB();
              showErrorToast(ErrorToastNames.ImageUploadError);
            }
          } catch (error) {
            toast.dismiss();
            showErrorToast(ErrorToastNames.ImageUploadError);
          }
          clearIndexDB();
          toast.dismiss();
          showSuccessToast(SuccessToastNames.PropertyUpdate);
          router.push('/admin?page=1');
        } else {
          toast.dismiss();
          showErrorToast(ErrorToastNames.PropertyUpdate);
        }
      } catch (error) {
        toast.dismiss();
        showErrorToast(ErrorToastNames.ServerConnection);
      }
    } else {
      showErrorToast(ErrorToastNames.EmptyFields);

      const addressErrorSection = Object.values(newAddressErrors).some(
        (error) => error !== ''
      );

      const mainFeaturesErrorSection = Object.values(
        newMainFeaturesErrors
      ).some((error) => error !== '');
      const imagesErrorSection = errorInfo.error !== '';

      if (
        addressErrorSection &&
        document.getElementById('accordion-1')?.classList?.contains('hidden')
      )
        showHide('accordion-1');

      if (
        imagesErrorSection &&
        document.getElementById('accordion-2')?.classList?.contains('hidden')
      )
        showHide('accordion-2');

      if (
        mainFeaturesErrorSection &&
        document.getElementById('accordion-3')?.classList?.contains('hidden')
      )
        showHide('accordion-3');
    }
  };

  return (
    <div>
      <AdminHeader isOwnerProp={true} />
      <div className={classes.body}>
        <div className={classes.sideMenu}>
          <SideMenu
            isOwnerProp={property !== undefined && true}
            notifications={[]}
          />
        </div>
        <div className={classes.content}>
          <h1 className={classes.title}>
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
                <label htmlFor="painel-1" className={classes.labelAccordion}>
                  Endereço
                  <span
                    className={`transition-transform transform ${rotate1 ? 'rotate-180' : ''
                      }`}
                  >
                    <ArrowDownIconcon width="13" className="cursor-pointer" />
                  </span>
                </label>
                <div className={classes.accordionContainer} id="accordion-1">
                  <div className="accordion__body" id="painel1">
                    <Address
                      isEdit={isEdit}
                      address={property.address}
                      onAddressUpdate={(updatedAddress: IAddress) =>
                        setAddress(updatedAddress)
                      }
                      addressInputRefs={addressInputRefs}
                      errors={addressErrors}
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
                <label htmlFor="painel-2" className={classes.labelAccordion}>
                  Fotos
                  <span
                    className={`transition-transform transform ${rotate2 ? 'rotate-180' : ''
                      }`}
                  >
                    <ArrowDownIconcon width="13" className="cursor-pointer" />
                  </span>
                </label>
                <div className={classes.accordionContainer} id="accordion-2">
                  <div className="accordion__body" id="painel2">
                    <UploadImages
                      editarImages={property.images}
                      onImagesUpdate={(updatedImages: string[]) =>
                        setImages(updatedImages)
                      }
                      onErrorsInfo={errorInfo}
                      imagesInputRef={imagesInputRef}
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
                <label htmlFor="painel-3" className={classes.labelAccordion}>
                  Características
                  <span
                    className={`transition-transform transform ${rotate3 ? 'rotate-180' : ''
                      }`}
                  >
                    <ArrowDownIconcon width="13" className="cursor-pointer" />
                  </span>
                </label>
                <div className={classes.accordionContainer} id="accordion-3">
                  <div className="accordion__body" id="painel3">
                    <MainFeatures
                      propertyId={property._id}
                      editarAdType={property.adType}
                      editarSubType={property.adSubtype}
                      editarPropertyType={property.propertyType}
                      editarPropertySubtype={property.propertySubtype}
                      editarNumBedroom={
                        property.metadata.find((obj) => obj.type === 'bedroom')
                          ?.amount || 0
                      }
                      editarNumBathroom={
                        property.metadata.find((obj) => obj.type === 'bathroom')
                          ?.amount || 0
                      }
                      editarNumGarage={
                        property.metadata.find(
                          (obj: IMetadata) => obj.type === 'garage'
                        )?.amount || 0
                      }
                      editarNumDependencies={
                        property.metadata.find(
                          (obj: IMetadata) => obj.type === 'dependencies'
                        )?.amount || 0
                      }
                      editarNumSuite={
                        property.metadata.find((obj) => obj.type === 'suites')
                          ?.amount || 0
                      }
                      editarDescription={property.description}
                      editarPropertyValue={property.prices[0].value.toString()}
                      editarCondominium={property.prices.some(
                        (obj: IPrices) =>
                          obj.type === 'condominio' && obj.value !== null
                      )}
                      editarCondominiumValue={
                        property.prices.find(
                          (obj: IPrices) => obj.type === 'condominio'
                        )?.value !== null
                          ? property.prices
                            .find(
                              (obj: IPrices) => obj.type === 'condominio'
                            )!
                            .value.toString()
                          : ''
                      }
                      editarIptuValue={
                        property.prices.find(
                          (price) => price.type === 'IPTU'
                        ) !== undefined
                          ? property.prices
                            .find((price) => price.type === 'IPTU')!
                            .value?.toString()
                          : ''
                      }
                      editarIptu={property.prices.some(
                        (obj: IPrices) => obj.type === 'IPTU'
                      )}
                      isEdit={isEdit}
                      onMainFeaturesUpdate={(
                        updatedFeatures: IEditPropertyMainFeatures
                      ) => setMainFeatures(updatedFeatures)}
                      editarSize={property.size}
                      errors={mainFeaturesErrors}
                      mainFeaturesInputRefs={mainFeaturesInputRefs}
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
                <label htmlFor="painel-4" className={classes.labelAccordion}>
                  Outras características
                  <span
                    className={`transition-transform transform ${rotate4 ? 'rotate-180' : ''
                      }`}
                  >
                    <ArrowDownIconcon width="13" className="cursor-pointer" />
                  </span>
                </label>
                <div className={classes.accordionContainer} id="accordion-4">
                  <div className="accordion__body mx-2" id="painel4">
                    <PropertyDifferentials
                      shouldRenderCondDiv={
                        property.propertyType === 'apartamento' ||
                        property.propertySubtype === 'Casa de condomínio'
                      }
                      property={property}
                      isEdit={isEdit}
                      onTagsUpdate={(updatedTags: string[]) =>
                        setTags(updatedTags)
                      }
                      onCondominiumTagsUpdate={(updatedCondTags: string[]) =>
                        setCondominiumTags(updatedCondTags)
                      }
                      onVideoLinkUpdate={(updatedVideo: string) =>
                        setVideoLink(updatedVideo)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.buttonContainer}>
              <button className={classes.button} onClick={handleSubmit}>
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
  const session = (await getSession(context)) as any;
  const query = context.query;
  const propertyId = query.id;
  let token = session?.user?.data?.access_token!!;
  let refreshToken = session?.user?.data.refresh_token;
  const isEdit = (await session) ? true : false;

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

    const [property] = await Promise.all([
      fetch(`${baseUrl}/property/${propertyId}?isEdit=${isEdit}`)
        .then((res) => res.json())
        .catch(() => { }),
      fetchJson(`${baseUrl}/property/${propertyId}?isEdit=${isEdit}`),
    ]);

    return {
      props: {
        property,
      },
    };
  }
}

const classes = {
  body: 'flex flex-row justify-center w-full',
  sideMenu: 'fixed left-0 top-7 sm:hidden hidden md:hidden lg:hidden xl:flex',
  content:
    'flex flex-col items-center mt-16 max-w-[900px] px-2 md:px-10 sm:ml-0 ml-0 xl:ml-24 2xl:ml-24',
  labelAccordion:
    'flex flex-row items-center justify-between sm:min-w-[300px] md:min-w-[620px] lg:min-w-[600px] xl:min-w-[800px] 2xl:min-w-[1000px] h-12 bg-tertiary border-2 border-quaternary mt-10 px-8 mx-4 text-lg transition bg-opacity-90 hover:bg-gray-300',
  accordionContainer: 'accordion__content hidden bg-grey-lighter dis',
  title: 'font-bold text-xl lg:text-2xl text-quaternary my-10 mx-auto',
  buttonContainer: 'flex self-end md:justify-end justify-center mb-32 mt-16',
  button:
    'bg-primary w-56 h-12 text-lg text-tertiary rounded transition-colors duration-300 hover:bg-red-600 hover:text-white',
};
