import Image from 'next/image';
import Link from 'next/link';
import { TransactionType } from '../../../../pages';

export interface IAccessCard {
  transactionType: TransactionType;
}

export interface ICardsContent {
  key: string;
  link: string;
  src: string;
  alt: string;
  description: string;
  title: string;
}

const AccessCard = ({ transactionType }: IAccessCard) => {
  const cardsContent = [
    {
      link: `/search?tags=mobiliado&${
        transactionType === TransactionType.BUY
          ? 'adType=compra'
          : 'adType=aluguel'
      }`,
      key: 'furnished',
      src: '/images/card-mobiliados.png',
      alt: 'Imóveis mobiliados',
      title: 'Mobiliados!',
      description:
        'Encontre imóveis mobiliados perto de você e que cabem no seu bolso',
    },
    {
      link: `/search?tags=aceita+pets&${
        transactionType === TransactionType.BUY
          ? 'adType=compra'
          : 'adType=aluguel'
      }`,
      key: 'petsCard',
      src: '/images/card-pets.png',
      alt: 'Imóveis que aceitam pets',
      title: 'Amigo dos pets',
      description:
        'Encontre imóveis que aceitam pets perto de você e que cabem no seu bolso',
    },
    {
      link: `/search?minSize=999&${
        transactionType === TransactionType.BUY
          ? 'adType=compra'
          : 'adType=aluguel'
      }`,
      key: 'bigHouses',
      src: '/images/card-casa-grande.png',
      alt: 'casas grandes',
      title: 'Casa grande',
      description:
        'Encontre imóveis amplos para alugar perto de você e que cabem no seu bolso',
    },
  ];

  return (
    <div className="lg:w-[1200px] lg:h-[278px] w-full m-auto">
      <h3 className="md:text-[26px] text-[18px] font-bold md:my-4 my-2 mt-10 text-quaternary align-middle md:text-left text-center">
        O que você procura a um clique de distância
      </h3>
      <div className="rounded-[30px] bg-tertiary m-auto p-4 drop-shadow-2xl md:w-fit">
        <div className="md:flex lg:flex-row justify-between">
          {cardsContent.map(
            ({ key, link, src, alt, description, title }: ICardsContent) => (
              <Link href={link} key={key}>
                <div className="lg:flex flex-row items-center rounded-[30px] hover:shadow-xl transition-shadow duration-300 ease-in-out p-3 justify-self-auto active:bg-primary-dark active:text-tertiary active:shadow-none focus:outline-none">
                  <Image
                    alt={alt}
                    src={src}
                    width={159}
                    height={216}
                    className="mx-auto lg:mx-0"
                  />
                  <div>
                    <h3 className="md:w-[162px] md:h-[27px] text-center font-bold text-quaternary">
                      {title}
                    </h3>
                    <p className="md:w-[164px] md:h-[76px] m-3 items-center text-quaternary text-base font-medium text-center">
                      {description}
                    </p>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessCard;
