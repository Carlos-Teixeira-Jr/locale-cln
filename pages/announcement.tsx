import { fetchJson } from '../common/utils/fetchJson';
import AdvantagesArea from '../components/molecules/advantagesArea/advantagesArea';
import PlansCards from '../components/molecules/cards/plansCards/plansCards';
import RegisterCard from '../components/molecules/cards/registrationCard.tsx/registerCard';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import { NextPageWithLayout } from './page';

const AnnouncementPage: NextPageWithLayout = ({ plans }: any) => {
  const reversedCards = [...plans].reverse();

  return (
    <>
      <div className="fixed z-10 top-0 md:w-full">
        <Header />
      </div>

      <div className="bg-secondary w-full h-[575px] md:h-[700px] rounded-bl-[250px] md:rounded-bl-[500px] drop-shadow-2xl pt-[100px]">
        <div className="2xl:max-w-[1536px] 2xl:mx-auto">
          <div className="float-right md:mr-[50px] md:pt-[25px]">
            <RegisterCard />
          </div>

          <div className="md:pt-[75px] md:ml-[100px] lg:ml-[200px]">
            <p className="md:bg-tertiary md:rounded-full md:w-[225px] lg:w-[325px] md:h-[225px] lg:h-[325px] font-extrabold md:text-3xl lg:text-4xl text-2xl text-quaternary text-center md:pt-[40px] lg:pt-[75px] md:px-2 md:border-[5px] md:border-secondary md:shadow-tertiary md:shadow-[-5px_15px_100px_-5px_rgba(0,0,0,0.3)]">
              A Melhor Solução para Anúnciar seu Imóvel
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-flow-row mx-2 md:mb-10">
        <AdvantagesArea />

        <h1 className="font-bold md:text-2xl lg:text-4xl text-2xl md:leading-tight md:w-4/5 m-auto text-primary drop-shadow-2xl text-center md:mb-10">
          Não perca mais tempo procurando por imóveis em outros lugares. Visite
          nosso site hoje mesmo e encontre a propriedade dos seus sonhos!
        </h1>

        {/* <PlansCards /> */}
        <div className='md:flex justify-center'>
          {reversedCards.map(
            ({
              id,
              name,
              price,
              highlightAd,
              commonAd,
              smartAd,
            }: any) => (
              <PlansCards
                key={id}
                name={name}
                price={price}
                commonAd={commonAd}
                highlightAd={highlightAd}
                smartAd={smartAd}
              />
            )
          )}
        </div>
      </div>

      <Footer smallPage={false} />
    </>
  );
};

export default AnnouncementPage;

export async function getStaticProps() {

  const baseUrl = process.env.BASE_API_URL;

  const [plans] = await Promise.all([
    fetch(`${baseUrl}/plan`)
      .then((res) => res.json())
      .catch(() => []),
    fetchJson(`${baseUrl}/plan`)
  ]);

  return {
    props: {
      plans,
    },
  };
}
