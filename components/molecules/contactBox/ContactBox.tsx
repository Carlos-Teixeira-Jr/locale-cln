import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import {
  IData,
  IOwnerInfo,
} from '../../../common/interfaces/property/propertyData';
import { monetaryFormat } from '../../../common/utils/masks/monetaryFormat';
import UserIcon from '../../atoms/icons/userIcon';
import MessageModal from '../../atoms/modals/messageModal';
Modal.setAppElement('#__next');

export interface IContactBox {
  ownerInfo: IOwnerInfo;
  property: IData;
}

const ContactBox: React.FC<IContactBox> = ({ ownerInfo, property }: IContactBox) => {

  const picture = property?.ownerInfo?.picture;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [fullMessage, setFullMessage] = useState(false);
  const owner = ownerInfo?.name;
  const ownerPropertyWpp = ownerInfo?.wppNumber ? ownerInfo?.wppNumber : ownerInfo?.cellPhone;
  const ownerWhatsapp = ownerPropertyWpp?.replace(/[^0-9]+/g, '');
  const formattedPrice = monetaryFormat(String(property?.prices[0]?.value));
  const uf = property?.address.uf;
  const city = property?.address.city;
  const propertyType = property?.propertyType;
  const announcementCode = property?.announcementCode;

  useEffect(() => {
    if (
      uf !== undefined &&
      city !== undefined &&
      propertyType !== undefined &&
      announcementCode !== undefined
    ) {
      setFullMessage(true);
    } else {
      console.log('uf', uf);
      console.log('city', city);
      console.log('propertyType', propertyType);
      console.log('announcementCode', announcementCode);
    }
  }, []);

  const handleWhatsappBtnClick = () => {
    if (fullMessage) {
      const fullMsg = `https://api.whatsapp.com/send/?pFhone=${ownerWhatsapp}&text=${encodeURIComponent(`
      🏡📱 Olá! Encontrei o seu imóvel na Locale Imóveis e me interessei! 📱🏡
        
      ${propertyType !== 'todos' ? `🏠Imóvel: ${propertyType}` : '🏠Imóvel'} ${city && `na cidade de ${city}`
        }${uf && `, ${uf}`}.
      ${formattedPrice && `💰 Valor: ${formattedPrice}`}
      ${announcementCode && `🔗 Código do imóvel: ${announcementCode}`}
            
      Gostaria de mais informações e talvez agendar uma visita. 
      Quando você estiver disponível, podemos conversar?`)}&type=phone_number&app_absent=0`;

      window.open(fullMsg, '_blank');
    } else {
      const basicMsg = `https://api.whatsapp.com/send/?pFhone=${ownerWhatsapp}&text=${encodeURIComponent(`
      🏡📱 Olá! Encontrei o seu imóvel na Locale Imóveis e me interessei! 
      Gostaria de mais informações e talvez agendar uma visita. 📱🏡
      Quando você estiver disponível, podemos conversar?`)}&type=phone_number&app_absent=0`;

      window.open(basicMsg, '_blank');
    }
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
      <div className="lg:w-fit md:h-10 md:pt-0 flex flex-col md:flex-row md:grid items-center justify-items-center align-middle justify lg:ml-2 mx-5 lg:m-0">
        <div className="flex flex-row w-full lg:w-72 justify-evenly md:justify-between items-center">
          {picture ? (
            <Image
              src={picture}
              alt={'A image of the property owner'}
              width={90}
              height={90}
              className="rounded-full w-[90px] max-w-[90px] h-[90px] max-h-[90px] shrink-0 border-2 border-primary"
            />
          ) : (
            <UserIcon
              className="rounded-full drop-shadow-lg w-20 h-20 p-2 mx-2 shrink-0"
              fill="#F75D5F"
              width="90"
              height="90"
            />
          )}

          <p
            className={`${owner?.length > 25 ? 'text-lg' : 'text-xl'
              } w-48 md:w-full h-fit text-quaternary font-extrabold text-center pt-3 md:pt-0 drop-shadow-lg`}
          >
            {owner}
          </p>
        </div>
        <div className="flex md:flex-col gap-4 mt-5 w-full justify-between">
          {buttons.map((btn) => (
            <div
              onClick={() => btn.onClick()}
              className={`md:w-full w-36 h-12 text-tertiary font-extrabold text-lg rounded-[10px] p-2.5 top-[861px] left-[999px] gap-y-1.5 md:grid flex drop-shadow-lg md:m-2 align-middle my-auto justify-center md:mr-2 cursor-pointer transition-colors  duration-300 ${btn.key === 'contact' ? 'bg-secondary hover:bg-yellow-600' : 'bg-[#25D366] hover:bg-green-700'
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
            propertyInfo={property}
          />
        </div>
      )}
    </>
  );
};

export default ContactBox;
