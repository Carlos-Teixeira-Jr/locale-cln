import Image from 'next/image';
import Link from 'next/link';

export interface ICardsContent {
  key: string;
  link: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  description: string;
  title: string;
}
const AccessCard = () => {
  const cardsContent = [
    {
      link: '/search?page=1&tags=mobiliado',
      key: 'furnished',
      src: '/images/card-mobiliados.png',
      alt: 'Imóveis mobiliados',
      width: 160,
      height: 160,
      title: 'Mobiliados!',
      description:
        'Encontre imóveis mobiliados perto de você e que cabem no seu bolso',
    },
    {
      link: 'search?tags=aceita+pets&page=1',
      key: 'petsCard',
      src: '/images/card-pets.png',
      alt: 'Imóveis que aceitam pets',
      width: 160,
      height: 160,
      title: 'Amigo dos pets',
      description:
        'Encontre imóveis que aceitam pets perto de você e que cabem no seu bolso',
    },
    {
      link: '/search?minSize=100&page=1',
      key: 'bigHouses',
      src: '/images/card-casa-grande.png',
      alt: 'casas grandes',
      width: 160,
      height: 160,
      title: 'Casa grande',
      description:
        'Encontre imóveis amplos para alugar perto de você e que cabem no seu bolso',
    },
  ];

  return (
    <div className="w-full lg:h-[278px] m-auto">
      <div className="rounded-[30px] bg-tertiary m-auto p-4 drop-shadow-2xl md:w-fit">
        <div className="md:flex lg:flex-row justify-between">
          {cardsContent.map(
            ({
              key,
              link,
              src,
              alt,
              description,
              title,
              height,
              width,
            }: ICardsContent) => (
              <Link href={link} key={key}>
                <div className="lg:flex flex-row items-center rounded-[30px] hover:shadow-xl transition-shadow duration-300 ease-in-out p-3 justify-self-auto active:bg-primary-dark active:text-tertiary active:shadow-none focus:outline-none">
                  <Image
                    alt={alt}
                    src={src}
                    width={width}
                    height={height}
                    className="mx-auto lg:mx-0"
                    priority
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
