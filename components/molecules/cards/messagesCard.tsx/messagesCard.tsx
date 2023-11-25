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
    <div 
      className="lg:flex justify-center cursor-pointer"
      onClick={() =>{
        router.push({
          pathname: `/message/${propertyId}`,
          query: { page: 1 }
        })
      }}
    >
      <div className="rounded-[30px] bg-tertiary w-fit m-2 drop-shadow-lg flex flex-col justify-between">
        <div className="md:w-64 h-fit">
          <div className="rounded-t-[30px] w-full">
            <Image
              src={image}
              alt={'Property image'}
              width={150}
              height={150}
              className="rounded-t-[30px] w-full max-h-[150px]"
            />
          </div>
          
        </div>
        <div className="bg-tertiary rounded-b-[30px] mx-5">
          <h2 className="text-lg my-3 font-bold leading-6">
            {`${address.streetName}, ${address.streetNumber}`}
          </h2>
          <p className="text-xs text-quaternary">{address.neighborhood}</p>
          <p className="text-xs text-quaternary">{`${address.city} - ${address.uf}`}</p>
          <div 
            className="pb-2 mt-2 flex" 

          >
            <div className="mr-1">
              <MessageBalloonIcon fill="#6B7280" viewBox="0 96 1200 1200" width='34'/>
            </div>
            <p className="text-lg font-bold text-quaternary">{`${messages.length}`} {messages.length > 1 || messages.length === 0 ? 'Mensagens' : 'Mensagem'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesCard;
