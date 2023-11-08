import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import MessageBalloonIcon from '../../../atoms/icons/messageBalloonIcon';
import { IAddress } from '../../../../common/interfaces/property/propertyData';
import { IMessage } from '../../../../common/interfaces/message/messages';
import { useRouter } from 'next/router';

interface IMessageCard {
  image: string
  address: IAddress
  messages: any[]
  propertyId: string
}

const MessagesCard = ({
  propertyId,
  image,
  address,
  messages,
}: IMessageCard) => {

  const router = useRouter();

  return (
    <div className="lg:flex justify-center mx-auto">
      <div className="rounded-[30px] bg-tertiary w-fit my-10 drop-shadow-lg">
        <div className="md:w-64 h-fit">
          <Image
            src={image}
            alt={''}
            width="280"
            height="135"
            className="max-h-[135px]"
          />
        </div>
        <div className="bg-tertiary rounded-b-[30px] mx-5">
          <h2 className="text-xl my-3 font-bold leading-6">
            {`${address.streetName}, ${address.streetNumber}`}
          </h2>
          <p className="text-xs text-quaternary">{address.neighborhood}</p>
          <p className="text-xs text-quaternary">{`${address.city} - ${address.uf}`}</p>
          <div 
            className="pb-2 mt-2 flex" 
            onClick={() =>{
              router.push({
                pathname: router.pathname,
                query: propertyId
              })
            }}
          >
            <div className="mr-1">
              <MessageBalloonIcon fill="#6B7280" viewBox="0 96 1200 1200" />
            </div>
            <p className="text-xl font-bold text-quaternary">{`${messages.length}`} {messages.length > 1 || messages.length === 0 ? 'Mensagens' : 'Mensagem'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesCard;
