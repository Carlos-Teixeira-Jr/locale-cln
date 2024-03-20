import Image from 'next/image';
import { useRouter } from 'next/router';
import { IMessage } from '../../../../common/interfaces/message/messages';
import { IAddress } from '../../../../common/interfaces/property/propertyData';
import MessageBalloonIcon from '../../../atoms/icons/messageBalloonIcon';

interface IMessageCard {
  image: string
  address: IAddress
  messages: IMessage[]
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
      onClick={() => {
        router.push({
          pathname: `/message/${propertyId}`,
          query: { page: 1 }
        })
      }}
    >
      <div className="rounded-[30px] bg-tertiary md:w-fit m-2 drop-shadow-lg flex flex-col justify-between md:max-w-[225px]">
        <Image
          src={image}
          alt={'Property image'}
          width={150}
          height={150}
          className="rounded-t-[30px] w-full min-h-[150px] max-h-[150px]"
        />
        <div className="bg-tertiary rounded-b-[30px] px-5">
          <h2 className="text-lg my-3 font-bold leading-6">
            {`${address.streetName}, ${address.streetNumber}`}
          </h2>
          <p className="text-xs text-quaternary">{address.neighborhood}</p>
          <p className="text-xs text-quaternary">{`${address.city} - ${address.uf}`}</p>
          <div
            className="pb-2 mt-2 flex"

          >
            <div className="mr-1">
              <MessageBalloonIcon fill="#6B7280" viewBox="0 96 1200 1200" width='34' />
            </div>
            <p className="text-lg font-bold text-quaternary">{`${messages.length}`} {messages.length > 1 || messages.length === 0 ? 'Mensagens' : 'Mensagem'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesCard;
