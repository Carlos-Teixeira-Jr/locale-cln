import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { IData } from '../../../common/interfaces/property/propertyData';
import { capitalizeFirstLetter } from '../../../common/utils/strings/capitalizeFirstLetter';
import UserIcon from '../../atoms/icons/userIcon';
import MessageModal from '../../atoms/modals/messageModal';
Modal.setAppElement('#__next');

export interface IContactBox {
  propertyID: IData;
}

const ContactBox: React.FC<IContactBox> = ({ propertyID }: any) => {
  const session = useSession() as any;
  const profilePicture = propertyID.ownerInfo.profilePicture;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const owner = propertyID.ownerInfo.name;

  console.log(session);
  console.log(propertyID);

  const handleWhatsappBtnClick = () => {
    const propertyStreet = propertyID.address.streetName;
    const propertyNumber = propertyID.address.streetNumber;
    const propertyCity = capitalizeFirstLetter(propertyID.address.city);
    const whatsappMessage = `Olá, gostaria de obter mais informações sobre o imóvel localizado em ${propertyStreet}, número ${propertyNumber}, na cidade de ${propertyCity}. 🏡✨`;

    const whatsappLink = `https://api.whatsapp.com/send/?phone=5553991775245&text=${encodeURIComponent(
      whatsappMessage
    )}&type=phone_number&app_absent=0`;

    window.open(whatsappLink, '_blank');
  };

  const buttons = [
    {
      key: 'contact',
      label: 'Contato',
      onClick: () => setModalIsOpen(true),
    },
    {
      key: 'Message',
      label: 'WhatsApp',
      onClick: handleWhatsappBtnClick,
    },
  ];

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="lg:w-fit md:h-10 md:pt-0 flex flex-col md:flex-row md:grid items-center justify-items-center align-middle justify lg:ml-2 m-5 lg:m-0">
        <div className="flex flex-col md:flex-row md:w-full lg:w-72 justify-between items-center">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt={'A image of the property owner'}
              width={93}
              height={93}
              className="rounded-full border-4 border-quaternary drop-shadow-lg"
            />
          ) : (
            <UserIcon
              className="rounded-full border-4 border-quaternary drop-shadow-lg w-20 h-20 p-2 mx-2 shrink-0"
              fill="#F75D5F"
            />
          )}

          <p className="w-48 md:w-full h-fit text-quaternary font-extrabold text-2xl md:text-3xl text-center pt-3 md:pt-0 drop-shadow-lg">
            {owner}
          </p>
        </div>
        <div className="flex md:flex-col gap-4 mt-5 w-full justify-between">
          {buttons.map((btn) => (
            <div
              onClick={() => btn.onClick()}
              className={`md:w-full w-36 h-12 md:h-14 text-tertiary font-extrabold text-xl rounded-[10px] p-2.5 top-[861px] left-[999px] gap-y-2.5 md:grid flex drop-shadow-lg md:m-2 align-middle my-auto justify-center mr-2 cursor-pointer ${
                btn.key === 'contact' ? 'bg-secondary' : 'bg-[#25D366]'
              }`}
              key={btn.key}
            >
              {btn.label}
            </div>
          ))}
        </div>
      </div>

      {modalIsOpen && (
        <div className="">
          <MessageModal
            isOpen={modalIsOpen}
            setModalIsOpen={handleModalClose}
            propertyInfo={propertyID}
          />
        </div>
      )}
    </>
  );
};

export default ContactBox;
