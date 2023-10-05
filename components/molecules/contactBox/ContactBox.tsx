import Image from 'next/image';
import React, { useState } from 'react';
import Modal from 'react-modal';
import MessageModal from '../../atoms/modals/messageModal';
import { useSession } from 'next-auth/react';
import UserIcon from '../../atoms/icons/userIcon';
Modal.setAppElement('#__next');

export interface IContactBox {
  propertyID: {
    src: string;
    nameA: string;
  };
  href: string;
}

const ContactBox: React.FC<IContactBox> = (
  { propertyID }: any,
  { href }: IContactBox
) => {

  const session = useSession() as any;
  const profilePicture = session.data?.user?.data?.picture;
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleMessageBtnClick = () => {
    setModalIsOpen(true);
  };

  const handleWhatsappBtnClick = () => {
    const propertyStreet = propertyID.address.streetName;
    const propertyNumber = propertyID.address.streetNumber;
    const propertyCity = propertyID.address.city;
    window.open(`https://api.whatsapp.com/send/?phone=5553991775245&text=Ol%C3%A1%2C+estou+interessado+no+im%C3%B3vel+${propertyStreet}%2C+${propertyNumber}%2C+${propertyCity}.+Gostaria+de+mais+informa%C3%A7%C3%B5es.&type=phone_number&app_absent=0`, '_blank');
  };

  const buttons = [
    {
      key: 'contact',
      label: 'Contato',
      onClick: handleMessageBtnClick,
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
      <div className="lg:w-fit md:h-fit md:pt-0 grid items-center justify-items-center align-middle justify lg:ml-2 mb-5 mt-5">
        <div className="flex flex-row w-72 justify-between">
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
              className='rounded-full border-4 border-quaternary drop-shadow-lg w-20 h-20 p-2 mx-2 shrink-0'
              fill='#F75D5F'
            />
          )}
          
          <p className="w-48 h-fit text-quaternary font-extrabold text-2xl md:text-4xl text-center pt-3 md:pt-0 drop-shadow-lg">
            {propertyID.ownerInfo.name}
          </p>
        </div>
        <div className="lg:grid md:grid-rows-2 md:items-center flex md:grid-flow-col mt-5">

          {buttons.map((btn) => (
            <div 
              className={`md:w-72 w-36 h-14 text-tertiary font-extrabold text-xl rounded-[10px] p-2.5 top-[861px] left-[999px] gap-y-2.5 md:grid flex drop-shadow-lg md:m-2 align-middle my-auto justify-center mr-2 ${
                btn.key === 'contact' ?
                'bg-secondary' :
                'bg-[#25D366]'
              }`}
              key={btn.key}
            >
              <button onClick={() => btn.onClick()}>
                {btn.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {modalIsOpen && (
        <div className=' z-50'>
          <MessageModal
            isOpen={modalIsOpen}
            setModalIsOpen={handleModalClose}
          />
        </div>
        
      )}
    </>
  );
};

export default ContactBox;
