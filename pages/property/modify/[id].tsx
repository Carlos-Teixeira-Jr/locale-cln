import { useEffect, useState } from 'react';
import ArrowDownIconcon from '../../../components/atoms/icons/arrowDownIcon';
import Address from '../../../components/molecules/address/address';
import UploadImages from '../../../components/molecules/uploadImages/uploadImages';
import AdminHeader from '../../../components/organisms/adminHeader/adminHeader';
import MainFeatures from '../../../components/organisms/mainFeatures/mainFeatures';
import PropertyDifferentials from '../../../components/organisms/register/propertyDifferential';
import SideMenu from '../../../components/organisms/sideMenu/sideMenu';
import { NextPageWithLayout } from '../../page';
import { NextPageContext } from 'next';
import { IAddress, IData } from '../../../common/interfaces/propertyData';
import { getSession } from 'next-auth/react';

export interface IEditAnnouncement {
  property: IData;
}

const EditAnnouncement: NextPageWithLayout<IEditAnnouncement> = ({ property }) => {

  const [rotate1, setRotate1] = useState(false);
  const [rotate2, setRotate2] = useState(false);
  const [rotate3, setRotate3] = useState(false);
  const [rotate4, setRotate4] = useState(false);

  const [updatedProperty, setUpdatedProperty] = useState<IData>();
  const [updatedAddress, setUpdatedAddress] = useState<IAddress>();
  const [updatedImages, setUpdatedImages] = useState<string[]>();

  useEffect(() => {
  }, [updatedImages])

  const handleAddressUpdate = (updatedAddress: IAddress) => {
    setUpdatedAddress(updatedAddress);
  };

  const handleImagesUpdate = (updatedImages: string[]) => {
    setUpdatedImages(updatedImages);
  };

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
        <div className="flex flex-col items-center mt-16 max-w-[900px] text-xl lg:text-4xl px-2 md:px-10">
          <h1 className="font-bold text-2xl lg:text-4xl text-quaternary mb-10 mt-20">
            Edição do Anúncio
            <div className="accordion flex flex-col">
              {/** Accordion 1 */}
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
                  className="flex flex-row items-center justify-between sm:min-w-[300px] md:min-w-[620px] lg:min-w-[600px] xl:min-w-[800px] 2xl:min-w-[1000px] h-12 bg-tertiary border-2 border-quaternary mt-10 px-8 text-xl"
                >
                  Endereço
                  <span className={`transition-transform transform ${rotate1 ? 'rotate-180' : ''}`}>
                    <ArrowDownIconcon
                      width='13'
                    />
                  </span>
                </label>
                <div
                  className="accordion__content hidden bg-grey-lighter dis"
                  id="accordion-1"
                >
                  <div className="accordion__body p-4" id="painel1">
                    <Address
                      editar={true}
                      editarCep={property.address.zipCode}
                      editarCity={property.address.city}
                      editarUf={''}
                      editarStreet={property.address.streetName}
                      editarNumber={property.address.number}
                      editarNeighborhood={property.address.neighborhood}
                      editarComplement={property.address.complement}
                      onAddressUpdate={handleAddressUpdate}
                    />
                  </div>
                </div>
              </div>
              {/** Accordion 2 */}
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
                  className="flex flex-row items-center justify-between sm:min-w-[300px] md:min-w-[620px] lg:min-w-[600px] xl:min-w-[800px] 2xl:min-w-[1000px] h-12 bg-tertiary border-2 border-quaternary mt-10 px-8 text-xl"
                >
                  Fotos
                  <span className={`transition-transform transform ${rotate2 ? 'rotate-180' : ''}`}>
                    <ArrowDownIconcon
                      width='13'
                    />
                  </span>
                </label>
                <div
                  className="accordion__content hidden bg-grey-lighter dis"
                  id="accordion-2"
                >
                  <div className="accordion__body p-4" id="painel2">
                    <UploadImages 
                      editarImages={property.images} 
                      onImagesUpdate={handleImagesUpdate}
                    />
                  </div>
                </div>
              </div>
              {/** Accordion 3 */}
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
                  className="flex flex-row items-center justify-between sm:min-w-[300px] md:min-w-[620px] lg:min-w-[600px] xl:min-w-[800px] 2xl:min-w-[1000px] h-12 bg-tertiary border-2 border-quaternary mt-10 px-8 text-xl"
                >
                  Características
                  <span className={`transition-transform transform ${rotate3 ? 'rotate-180' : ''}`}>
                    <ArrowDownIconcon
                      width='13'
                    />
                  </span>
                </label>
                <div
                  className="accordion__content hidden bg-grey-lighter dis"
                  id="accordion-3"
                >
                  <div className="accordion__body p-4" id="painel3">
                    <MainFeatures
                      editarPropertyType={property.propertyType}
                      editarPropertySubtype={property.propertySubtype}
                      editarUseableArea={property.size}
                      editarTotalArea={property.size}
                      editarNumBedroom={2}
                      editarNumBathroom={2}
                      editarNumParkingSpaces={2}
                      editarNumFloors={2}
                      editarNumSuite={2}
                      editarDescription={property.description}
                      editarPropertyValue={property.prices[0].value.toString()}
                      editarCondominium={false}
                      editarCondominiumValue={property.prices[0].value.toString()}
                      editarIptuValue={'valor iptu'}
                      editarIptu={false}
                    />
                  </div>
                </div>
              </div>
              {/** Accordion 4 */}
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
                  className="flex flex-row items-center justify-between sm:min-w-[300px] md:min-w-[620px] lg:min-w-[600px] xl:min-w-[800px] 2xl:min-w-[1000px] h-12 bg-tertiary border-2 border-quaternary mt-10 px-8 text-xl"
                >
                  Outras Características
                  <span className={`transition-transform transform ${rotate4 ? 'rotate-180' : ''}`}>
                    <ArrowDownIconcon
                      width='13'
                    />
                  </span>
                </label>
                <div
                  className="accordion__content hidden bg-grey-lighter dis"
                  id="accordion-4"
                >
                  {/* <p className="accordion__body p-4" id="painel4">
                    <PropertyDifferentials
                      shouldRenderCondDiv={true}
                      sharedImagesArray={undefined}
                      setMinimunImagesUpload={undefined}
                      id={''} //continueButton={false}
                    />
                  </p> */}
                </div>
              </div>
            </div>
            <div className="flex self-end justify-end mb-32 mt-16">
              <button className="bg-primary w-80 h-16 rounded">
                <span className="text-quinary font-bold text-2xl p-2">
                  Atualizar Dados
                </span>
              </button>
            </div>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default EditAnnouncement;

export async function getServerSideProps(context: NextPageContext) {

  const id = context.query.id;
  const session = getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  const property = await fetch(`http://localhost:3001/property/${id}`)
    .then((res) => res.json())
    .catch(() => { })

  return {
    props: {
      property,
    },
  };
}


