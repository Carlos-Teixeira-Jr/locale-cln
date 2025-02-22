import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { IMessagesByOwner } from '../../../common/interfaces/message/messages';
import { IOwner } from '../../../common/interfaces/owner/owner';
import { IPlan } from '../../../common/interfaces/plans/plans';
import { IFavProperties } from '../../../common/interfaces/properties/favouriteProperties';
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
import Loading from '../../../components/atoms/loading';
import Address from '../../../components/molecules/address/address';
import { INotification } from '../../../components/molecules/cards/notificationCard/notificationCard';
import UploadImages from '../../../components/molecules/uploadImages/uploadImages';
import AdminHeader from '../../../components/organisms/adminHeader/adminHeader';
import MainFeatures from '../../../components/organisms/mainFeatures/mainFeatures';
import PropertyDifferentials from '../../../components/organisms/register/propertyDifferential';
import SideMenu from '../../../components/organisms/sideMenu/sideMenu';
import { NextPageWithLayout } from '../../page';

interface IEditAnnouncement {
  property: IData;
  ownerData: IOwner;
  plans: IPlan[];
  notifications: INotification[];
  messages: IMessagesByOwner;
  favouriteProperties: IFavProperties
}

const EditAnnouncement: NextPageWithLayout<IEditAnnouncement> = ({
  property,
  ownerData,
  plans,
  notifications,
  messages,
  favouriteProperties
}) => {
  const [rotate1, setRotate1] = useState(false);
  const [rotate2, setRotate2] = useState(false);
  const [rotate3, setRotate3] = useState(false);
  const [rotate4, setRotate4] = useState(false);
  const router = useRouter();
  const plusPlan = plans.find((e) => e.name === 'Locale Plus');
  const ownerIsPlus = ownerData?.plan === plusPlan?._id ? true : false;
  const [loading, setLoading] = useState(false);
  const isFavourite = favouriteProperties?.docs?.some((e) => e._id === property._id)

  const isEdit = router.pathname == '/property/modify/[id]';

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
    if (!mainFeatures.propertyValue || mainFeatures.propertyValue === '0') newMainFeaturesErrors.propertyValue = error;
    if (mainFeatures.condominium) {
      if (!mainFeatures.condominiumValue) newMainFeaturesErrors.condominiumValue = error;
    }
    if (mainFeatures.iptu) {
      if (!mainFeatures.iptuValue) newMainFeaturesErrors.iptuValue = error;
    }
    if (!address.zipCode) newAddressErrors.zipCode = error;
    if (!address.streetName) newAddressErrors.streetName = error;
    //if (!address.streetNumber) newAddressErrors.streetNumber = error;
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
        setLoading(true);
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
            setLoading(false);
            showErrorToast(ErrorToastNames.ImageUploadError);
          }
          clearIndexDB();
          toast.dismiss();
          showSuccessToast(SuccessToastNames.PropertyUpdate);
          router.push('/admin?page=1');
        } else {
          toast.dismiss();
          setLoading(false);
          showErrorToast(ErrorToastNames.PropertyUpdate);
        }
      } catch (error) {
        toast.dismiss();
        setLoading(false);
        showErrorToast(ErrorToastNames.ServerConnection);
      }
    } else {
      showErrorToast(ErrorToastNames.EmptyFields);
      setLoading(false);

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

  const classes = {
    body: 'flex flex-row justify-center w-full',
    sideMenu: 'fixed left-0 top-7 sm:hidden hidden md:hidden lg:hidden xl:flex',
    content:
      'flex flex-col items-center w-full mt-16 max-w-[900px] px-2 md:px-10 sm:ml-0 ml-0 xl:ml-24 2xl:ml-24',
    content2: 'font-bold text-xl lg:text-2xl text-quaternary w-full mb-5 mx-auto',
    labelAccordion:
      'flex flex-row items-center justify-between sm:min-w-[300px] md:min-w-[620px] lg:min-w-[600px] xl:min-w-[800px] 2xl:min-w-[1000px] h-12 bg-tertiary border-2 border-quaternary mt-10 px-8 md:mx-4 text-lg transition bg-opacity-90 hover:bg-gray-300',
    accordionContainer: 'accordion__content hidden bg-grey-lighter dis',
    title: 'font-bold text-xl lg:text-2xl text-quaternary text-center mt-5 mx-auto',
    buttonContainer: 'flex self-end md:justify-end justify-center mb-32 mt-16 mx-3',
    button:
      `flex items-center flex-row justify-around w-64 h-14 text-tertiary rounded font-normal text-md md:text-xl ${loading ?
        'bg-red-300 transition-colors duration-300' :
        'bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer'
      }`,
  };

  return (
    <div>
      <AdminHeader isOwnerProp={true} isPlus={ownerIsPlus} />
      <div className={classes.body}>
        <div className={classes.sideMenu}>
          <SideMenu
            isOwnerProp={property !== undefined && true}
            notifications={notifications} isPlus={ownerIsPlus}
            hasProperties={true}
            favouriteProperties={favouriteProperties}
            messages={messages?.docs}
          />
        </div>
        <div className={classes.content}>
          <h1 className={classes.title}>
            Edição do Anúncio
          </h1>
          <div className={classes.content2}>
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
                        property?.metadata?.find((obj) => obj.type === 'bedroom')
                          ?.amount || 0
                      }
                      editarNumBathroom={
                        property?.metadata?.find((obj) => obj.type === 'bathroom')
                          ?.amount || 0
                      }
                      editarNumGarage={
                        property?.metadata?.find(
                          (obj: IMetadata) => obj.type === 'garage'
                        )?.amount || 0
                      }
                      editarNumDependencies={
                        property?.metadata?.find(
                          (obj: IMetadata) => obj.type === 'dependencies'
                        )?.amount || 0
                      }
                      editarNumSuite={
                        property?.metadata?.find((obj) => obj.type === 'suites')
                          ?.amount || 0
                      }
                      editarDescription={property.description}
                      editarPropertyValue={'0'}
                      editarCondominium={property?.prices?.some(
                        (obj: IPrices) =>
                          obj.type === 'condominio' && obj.value !== null
                      )}
                      editarCondominiumValue={
                        property?.prices?.find(
                          (obj: IPrices) => obj.type === 'condominio'
                        )?.value !== null
                          ? property?.prices
                            ?.find(
                              (obj: IPrices) => obj.type === 'condominio'
                            )!
                            .value.toString()
                          : ''
                      }
                      editarIptuValue={
                        property?.prices?.find(
                          (price) => price.type === 'IPTU'
                        ) !== undefined
                          ? property?.prices
                            ?.find((price) => price.type === 'IPTU')!
                            .value?.toString()
                          : ''
                      }
                      editarIptu={property?.prices?.some(
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
                      shouldRenderCondDiv={property.condominiumTags?.length > 0}
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
              <button
                className={classes.button}
                onClick={handleSubmit}
                disabled={loading}
              >
                <span className={`${loading ? 'ml-5' : ''}`}>Atualizar Dados</span>
                {loading && <Loading />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAnnouncement;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id || session?.user.id;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  let property;
  let favouriteProperties: boolean = false;
  let ownerData;
  let ownerId;
  const params = context.params?.id as string;
  const id = params.split('id=')[1];
  // Captura o valor de increment da url para incrementar as vidualizações;
  const firsSubstring = params.split('increment=')[1];
  const increment = JSON.parse(firsSubstring?.split('+id')[0]);

  try {
    const propertyResponse = await fetch(
      `${baseUrl}/property/findOne/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, isEdit: false, increment }),
      }
    );

    if (propertyResponse.ok) {
      property = await propertyResponse.json();
      ownerId = property.owner;
    } else {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.log(error);
  }

  if (property?.ownerInfo) {
    try {
      const fetchUser = await fetch(`${baseUrl}/user/find-user-by-owner/${ownerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (fetchUser.ok) {
        ownerData = await fetchUser.json();

        const userId = ownerData.user._id

        try {
          const fetchFavourites = await fetch(`${baseUrl}/user/favourite`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: userId,
              page: 1,
            }),
          });

          if (fetchFavourites.ok) {
            const favourites = await fetchFavourites.json();

          } else {
            console.error('Não foi possível buscar os imoveis favoritos')
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        ownerData = null;
        console.error('Não foi possível achar o usuário.');
      }
    } catch (error) {
      console.error('Não foi possível achar o usuário.');
    }
  } else {
    console.error('não foi possível buscar os dados do anunciante.')
  }

  const [notifications, messages, plans] = await Promise.all([
    fetch(
      `${baseUrl}/notification/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .catch(() => []),
    fetch(`${baseUrl}/message/find-all-by-ownerId`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ownerId: ownerData?.owner?._id,
        page: 1,
      }),
    })
      .then((res) => res.json())
      .catch(() => []),
    fetch(`${baseUrl}/plan`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch(() => []),
    fetchJson(`${baseUrl}/notification/user/${userId}`),
    fetchJson(`${baseUrl}/message/find-all-by-ownerId`),
    fetchJson(`${baseUrl}/plan`),
  ]);

  const url = `${baseUrl}/property/filter/?page=1&limit=4`;
  const relatedProperties = await fetch(url).then((res) => res.json());

  return {
    props: {
      property,
      favouriteProperties,
      relatedProperties,
      ownerData,
      plans,
      notifications,
      messages
    },
  };
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = (await getSession(context)) as any;
//   const userId =
//     session?.user.data._id !== undefined
//       ? session?.user.data._id
//       : session?.user.id;
//   const propertyId = context.query.id;
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
//   let ownerId;

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }

//   try {
//     const ownerIdResponse = await fetch(
//       `${baseUrl}/user/find-owner-by-user`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ userId }),
//       }
//     );
//     if (ownerIdResponse.ok) {
//       const ownerData = await ownerIdResponse.json();
//       ownerId = ownerData?.owner?._id;
//     } else {
//       return {
//         redirect: {
//           destination: '/adminFavProperties?page=1',
//           permanent: false,
//         },
//       };
//     }
//   } catch (error) {
//     console.error(error);
//   }

//   const [notifications, property, ownerData, plans, messages] = await Promise.all([
//     fetch(`${baseUrl}/notification/user/${userId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then((res) => res.json())
//       .catch(() => []),
//     fetch(`${baseUrl}/property/${propertyId}?isEdit=true`)
//       .then((res) => res.json())
//       .catch(() => { }),
//     fetch(`${baseUrl}/user/find-owner-by-user`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ userId }),
//     })
//       .then((res) => res.json())
//       .catch(() => { }),
//     fetch(`${baseUrl}/plan`)
//       .then((res) => res.json())
//       .catch(() => []),
//     fetch(`${baseUrl}/message/find-all-by-ownerId`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         ownerId,
//         page: 1,
//       }),
//     })
//       .then((res) => res.json())
//       .catch(() => []),
//     fetchJson(`${baseUrl}/notification/user/${userId}`),
//     fetchJson(`${baseUrl}/property/${propertyId}?isEdit=true`),
//     fetchJson(`${baseUrl}/user/find-owner-by-user`),
//     fetchJson(`${baseUrl}/plan`),
//     fetchJson(`${baseUrl}/message/find-all-by-ownerId`),
//   ]);

//   return {
//     props: {
//       notifications,
//       property,
//       ownerData,
//       plans,
//       messages
//     },
//   };
// }
