import Image from 'next/image';
import { ReactElement } from 'react';
import ClockIcon from '../../atoms/icons/clockIcon';
import HouseIcon from '../../atoms/icons/houseIcon';
import ShieldIcon from '../../atoms/icons/shieldIcon';
import SnapFingersIcon from '../../atoms/icons/snapFingersIcon';

export interface IAdvantages {
  key: number,
  icon: ReactElement,
  title: string,
  description: string
}

const AdvantagesArea: React.FC = () => {

  const advantages: IAdvantages[] = [
    {
      key: 1,
      icon: <HouseIcon width="90" height="90" fill="#F75D5F" />,
      title: "Enorme Variedade de Imóveis",
      description: "Temos uma grande variedade de propriedades disponíveis, desde casas e apartamentos até terrenos e imóveis comerciais. Você certamente encontrará algo que atenda às suas necessidades e orçamento."
    },
    {
      key: 2,
      icon: <SnapFingersIcon width="90" height="90" fill="#F75D5F" />,
      title: "Fácil de Usar",
      description: "Nossa plataforma é simples e permite filtrar propriedades conforme preferências: localização, tamanho, quartos, banheiros, amenidades e preço. Navegação rápida pelos resultados de pesquisa."
    },
    {
      key: 3,
      icon: <ClockIcon width="90" height="90" fill="#F75D5F" className="mt-1" />,
      title: "Atualizações Frequentes",
      description: "Nosso site é atualizado frequentemente com novas propriedades, então você sempre encontrará algo novo para explorar."
    },
    {
      key: 4,
      icon: <ShieldIcon width="90" height="90" fill="#F75D5F" className="mt-2" />,
      title: "Segurança",
      description: "Nosso site é seguro e confiável. Verificamos a autenticidade de cada anúncio de propriedade para garantir que você esteja recebendo informações precisas e confiáveis."
    }
  ]

  return (
    <div className="max-w-[1232px] justify-self-center">
      <div className="flex justify-center mx-[50px] my-5 md:my-0">
        <div className="md:absolute md:mr-[500px]">
          <Image
            src={'/images/marker.png'}
            alt={'locale logo brand'}
            width={122}
            height={147}
          />
        </div>
        <div className="md:pl-[130px]">
          <Image
            src={'/images/logo-only-fonts.png'}
            alt={'locale logo type'}
            width={590}
            height={157}
          />
        </div>
      </div>
      <div className="flex justify-center md:px-[15rem]">
        <p className="md:w-[600px] lg:w-full md:text-xl lg:text-xl text-base font-bold text-quaternary text-center">
          Nosso site é a melhor escolha para quem está procurando comprar ou
          alugar imóveis. Aqui estão alguns motivos pelos quais você deve usar o
          nosso site:
        </p>
      </div>

      {advantages.map((adv) => (
        <div
          key={adv.key}
          className={`bg-secondary md:rounded-full rounded-3xl md:w-full lg:w-[810px] md:h-fit md:grid flex flex-col md:grid-cols-5 md:gap-[100px] lg:gap-[200px] md:my-[40px] my-[30px] drop-shadow-xl py-[30px] md:py-0 ${adv.key % 2 === 0 ?
            'lg:float-left lg:ml-[50px]' :
            'lg:float-right lg:mr-[50px]'
            }`}
        >
          <div className="w-[125px] h-[125px] flex bg-tertiary rounded-full md:m-10 m-auto shadow-tertiary shadow-[-5px_15px_100px_-5px_rgba(0,0,0,0.3)] border-[5px] border-secondary col-span-1">
            <div className="ml-3 mt-2">
              {adv.icon}
            </div>
          </div>
          <div className="col-span-4">
            <p className="font-bold text-2xl my-5 mx-5 md:mx-0 text-quaternary text-center md:text-left">
              {adv.title}
            </p>
            <p className="font-semibold text-quaternary text-lg m-5 md:p-2 md:m-0 text-center md:text-left">
              {adv.description}
            </p>
          </div>
        </div>
      ))}

    </div>
  );
};

export default AdvantagesArea;
