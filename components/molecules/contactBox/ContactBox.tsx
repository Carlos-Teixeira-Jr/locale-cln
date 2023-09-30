import Image from 'next/image';
import React, { MouseEvent, useState } from 'react';
import Modal from 'react-modal';
import MessageModal from '../../atoms/modals/messageModal';
Modal.setAppElement('#__next');

export interface IContactBox {
  propertyID: {
    src: string;
    nameA: string;
  };
  href: string;
  onModalIsOpenChange: (isOpen: boolean) => void;
}

const ContactBox: React.FC<IContactBox> = (
  { propertyID }: any,
  { href, onModalIsOpenChange }: IContactBox
) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleMessageBtnClick = (event: MouseEvent<HTMLParagraphElement>) => {
    event.preventDefault();
    setModalIsOpen(true);
    onModalIsOpenChange(true);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
    onModalIsOpenChange(false);
  };

  const handleWhatsappBtnClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.open(href, '_blank');
  };

  return (
    <>
      <div className="lg:w-fit md:h-[312px] md:pt-0 grid items-center justify-items-center align-middle justify lg:ml-2 mb-5 mt-5">
        <div className="flex flex-row w-[320px] justify-between">
          <Image
            src={propertyID.images[0]}
            alt={'A image of the property owner'}
            width={93}
            height={93}
            className="rounded-full border-4 border-quaternary drop-shadow-lg"
          />
          <p className="w-[217px] h-[88px] text-quaternary font-extrabold text-2xl md:text-4xl align-middle pt-3 md:pt-0 drop-shadow-lg">
            {propertyID.ownerInfo.name}
          </p>
        </div>
        <div className="lg:grid md:grid-rows-2 md:items-center flex md:grid-flow-col mt-5">
          <div className="md:w-[320px] w-[150px] h-[67px] rounded-[10px] p-2.5 bg-secondary top-[861px] left-[999px] gap-y-2.5 md:grid flex drop-shadow-lg md:m-5 align-middle my-auto justify-center mr-2">
            <button className="">
              <p
                className="text-tertiary font-extrabold leading-6 text-xl"
                onClick={handleMessageBtnClick}
              >
                Contato
              </p>
            </button>
          </div>
          <div className="md:w-[320px] w-[150px] h-[67px] rounded-[10px] p-2.5 bg-[#25D366] top-[946px] left-[999px] gap-y-2.5 grid drop-shadow-lg md:m-5 ml-2">
            <button onClick={handleWhatsappBtnClick}>
              <p className="text-tertiary font-extrabold leading-6 text-xl align-middle">
                WhatsApp
              </p>
            </button>
          </div>
        </div>
      </div>

      {modalIsOpen && (
        <MessageModal
          isOpen={modalIsOpen}
          setModalIsOpen={handleModalClose}
          _id={''}
          nameA={''}
        />
      )}
    </>
  );
};

export default ContactBox;
