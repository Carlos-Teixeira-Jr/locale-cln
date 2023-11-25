import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { IMessage } from '../../../../common/interfaces/message/messages';
import MessageIcon from '../../../atoms/icons/messageIcon';
import StarIcon from '../../../atoms/icons/starIcon';
import ViewIcon from '../../../atoms/icons/viewIcon';
import formatCurrency from '../../../atoms/masks/currencyFormat';
import ConfirmActivationModal from '../../../atoms/modals/confirmActivationModal';

interface IAdminPropertyCard {
  _id: string;
  image: string;
  price: number;
  location: string;
  views: number;
  messages: IMessage[];
  isActiveProp: boolean;
  highlighted: boolean;
}

type btnTypes = {
  key: string;
  title: string;
  link: string;
  className: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const AdminPropertyCard: React.FC<IAdminPropertyCard> = ({
  _id,
  price,
  image,
  location,
  views,
  messages,
  isActiveProp,
  highlighted,
}: IAdminPropertyCard) => {

  const priceToInt = price;
  const formattedPrice = formatCurrency(priceToInt);
  const [isActive, setIsActive] = useState<boolean>(isActiveProp);
  const { data: session } = useSession() as any;
  const user = session?.user?.data._id;
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleHighlight = async () => {
    try {
      toast.loading('Destacando...');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/property/highlight-property`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            propertyId: _id,
            userId: user,
          }),
        }
      );

      if (response.ok) {
        toast.dismiss();
        toast.success('Anúncio destacado com sucesso.');
        window.location.reload();
      } else {
        toast.dismiss();
        toast.warning('Houve um erro ao destacar o anuncio.');
      }
    } catch (error) {
      toast.dismiss();
      toast.error(
        'Não foi possível estabelecer comunicação com o servidor no momento. Por favor, tente novamente mais tarde.'
      );
    }
  };

  const buttons = [
    {
      key: 'edit',
      title: 'Editar',
      link: '/property/modify/',
      className:
        'bg-secondary w-full h-12 px-10 rounded-md font-bold text-tertiary text-2xl transition-colors duration-300 hover:bg-yellow-500 hover:text-white',
    },
    {
      key: 'deactivate',
      title: 'Inativar',
      link: '',
      className: `bg-quaternary w-full h-12 px-10 rounded-md font-bold text-tertiary text-2xl shadow-sm transition-colors duration-300 hover:bg-gray-600 hover:text-white`,
      onClick: () => {
        setModalIsOpen(true);
      },
    },
    {
      key: 'visualize',
      title: 'Visualizar',
      link: '',
      className:
        'bg-[#5BC0DE] w-full h-12 px-10 rounded-md font-bold text-tertiary text-2xl shadow-sm transition-colors duration-300 hover:bg-blue-500 hover:text-white',
    },
    {
      key: 'highlight',
      title: 'Destacar',
      link: '',
      className:
        'flex flex-row items-center justify-center bg-primary w-full h-12 px-10 rounded-md font-bold text-secondary text-2xl shadow-sm mb-6 md:mb-0 md:mr-6 transition-colors duration-300 hover:bg-red-500 hover:text-yellow-300',
      onClick: handleHighlight,
    },
  ];

  return (
    <div className="flex flex-col items-center mt-10 justify-between">
      <Link href={`/property/${_id}?isEdit=true`}>
        <div
          className={`flex flex-col md:flex-row bg-tertiary max-w-5xl h-fit md:h-64 shadow-lg ${
            isActive ? '' : 'opacity-100'
          }`}
        >
          <Image
            src={image}
            alt={'Admin property image'}
            className={!isActive ? 'opacity-30' : ''}
            width={310}
            height={265}
          />
          {highlighted && (
            <div
              className={`absolute mt-2 opacity-70 hover:opacity-100 hover:scale-110 transition-opacity duration-200 ease-in-out ml-2 ${
                !isActive ? 'opacity-30' : ''
              }`}
            >
              <StarIcon
                width="35"
                height="35"
                className={!isActive ? 'opacity-30' : ''}
              />
            </div>
          )}
          <div
            className={`flex flex-col mt-6 px-5 ${
              !isActive ? 'opacity-30' : ''
            }`}
          >
            <h1 className="font-bold text-4xl text-black mb-5">
              {' '}
              {formattedPrice}
            </h1>
            <div className="flex flex-row space-x-2 items-center text-quaternary font-bold text-xl mb-3">
              <ViewIcon />
              <span>{views}</span>
              <h2>{views === 1 ? 'visualização' : 'visualizações'}</h2>
            </div>
            <div className="flex flex-row space-x-2 items-center text-quaternary font-bold text-xl mb-5">
              <MessageIcon />
              <span>{messages.length}</span>
              <h2>{messages.length === 1 ? 'mensagem' : 'mensagens'}</h2>
            </div>
            <h3 className="max-w-[200px] text-quaternary font-bold text-sm">
              {location}
            </h3>
          </div>

          <div className="flex flex-col gap-1 justify-center px-2 mt-4 md:mt-0 pr-2">
            {buttons.map((btn: btnTypes) =>
              btn.key !== 'highlight' ? (
                <Link
                  href={btn.key !== 'deactivate' ? btn.link + `${_id}` : '#'}
                >
                  <button
                    key={btn.key}
                    className={`${
                      btn.key !== 'deactivate' && !isActive
                        ? `${btn.className} opacity-30`
                        : `${btn.className}`
                    }`}
                    onClick={btn.onClick}
                  >
                    {btn.key === 'deactivate' && !isActive
                      ? 'Ativar'
                      : btn.title}
                  </button>
                </Link>
              ) : (
                <Link href={btn.link}>
                  <button
                    key={btn.key}
                    className={!highlighted ? btn.className : 'hidden'}
                    onClick={btn.onClick}
                  >
                    {btn.title}
                  </button>
                </Link>
              )
            )}
          </div>
        </div>
      </Link>

      <ConfirmActivationModal
        isOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        isActiveProp={isActive}
        propertyIdProp={_id}
      />
    </div>
  );
};

export default AdminPropertyCard;
