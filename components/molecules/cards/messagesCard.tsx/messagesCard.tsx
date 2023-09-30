import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import MessageBalloonIcon from '../../../atoms/icons/messageBalloonIcon';

const MessagesCard: React.FC = () => {
  return (
    <div className="lg:flex justify-center mx-auto">
      <div className="rounded-[30px] bg-tertiary w-fit m-10 drop-shadow-lg">
        <div className="md:w-[280px] h-[135px]">
          <Image
            src={'/images/messageCard.png'}
            alt={''}
            width="280"
            height="135"
            className="max-h-[135px]"
          />
        </div>
        <div className="bg-tertiary rounded-b-[30px] mx-5">
          <h2 className="text-xl my-3 font-bold leading-6">
            Rua Eliú Araujo, 45
          </h2>
          <p className="text-xs text-quaternary">Cassino</p>
          <p className="text-xs text-quaternary">Rio Grande - RS</p>
          <Link href={'/admin-notifications'}>
            <div className="pb-2 mt-2 flex">
              <div className="mr-1">
                <MessageBalloonIcon fill="#6B7280" viewBox="0 96 1200 1200" />
              </div>
              <p className="text-xl font-bold text-quaternary">25 Mensagens</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="rounded-[30px] bg-tertiary w-fit m-10 drop-shadow-lg">
        <div className="md:w-[280px] h-[135px]">
          <Image
            src={'/images/messageCard2.png'}
            alt={''}
            width="280"
            height="135"
            className="max-h-[135px]"
          />
        </div>
        <div className="bg-tertiary rounded-b-[30px] mx-5">
          <h2 className="text-xl my-3 font-bold leading-6">
            Rua Fábio Junior, 12
          </h2>
          <p className="text-xs text-quaternary">Centro</p>
          <p className="text-xs text-quaternary">Bacabal - MA</p>
          <div className="pb-2 mt-2 flex">
            <div className="mr-1">
              <MessageBalloonIcon fill="#6B7280" viewBox="0 96 1200 1200" />
            </div>
            <p className="text-xl font-bold text-quaternary">5 Mensagens</p>
          </div>
        </div>
      </div>

      <div className="rounded-[30px] bg-tertiary w-fit m-10 drop-shadow-lg">
        <div className="md:w-[280px] h-[135px]">
          <Image
            src={'/images/messageCard3.png'}
            alt={''}
            width="280"
            height="135"
            className="max-h-[135px]"
          />
        </div>
        <div className="bg-tertiary rounded-b-[30px] mx-5">
          <h2 className="text-xl my-3 font-bold leading-6">Rua Jorge, 2</h2>
          <p className="text-xs text-quaternary">Bom Jesus</p>
          <p className="text-xs text-quaternary">Piracicaba - SP</p>
          <div className="pb-2 mt-2 flex">
            <div className="mr-1">
              <MessageBalloonIcon fill="#6B7280" viewBox="0 96 1200 1200" />
            </div>
            <p className="text-xl font-bold text-quaternary">2 Mensagens</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesCard;
