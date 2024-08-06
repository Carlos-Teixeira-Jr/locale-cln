import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { IPlan } from '../common/interfaces/plans/plans';
import { IOwnerProperties } from '../common/interfaces/properties/propertiesList';
import { fetchJson } from '../common/utils/fetchJson';
import AdvantagesArea from '../components/molecules/advantagesArea/advantagesArea';
import PlansCards from '../components/molecules/cards/plansCards/plansCards';
import RegisterCard from '../components/molecules/cards/registrationCard.tsx/registerCard';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';

interface IAnnouncementPage {
  ownerProperties: IOwnerProperties,
  plans: IPlan[]
}

const defaultOwnerProperties: IOwnerProperties = {
  docs: [],
  count: 0,
  totalPages: 0,
  messages: []
};

const AnnouncementPage = ({
  plans,
  ownerProperties = defaultOwnerProperties
}: IAnnouncementPage) => {

  const reversedCards = [...plans].reverse();
  const isOwner = ownerProperties?.docs.length > 0;

  return (
    <main className='flex flex-col min-h-screen'>
      <div className='flex flex-col flex-grow'>
        <div className="fixed z-10 top-0 md:w-full">
          <Header userIsOwner={isOwner} />
        </div>

        <div className={classes.container}>
          <div className="2xl:max-w-[1536px] 2xl:mx-auto">
            <div className={classes.registerCard}>
              <RegisterCard />
            </div>

            <div className={classes.title}>
              <p className={classes.p}>
                A Melhor Solução para Anúnciar seu Imóvel
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-flow-row mx-2 md:mb-10">
          <AdvantagesArea />

          <h1 className={classes.h1}>
            Não perca mais tempo procurando por imóveis em outros lugares. Visite
            nosso site hoje mesmo e encontre a propriedade dos seus sonhos!
          </h1>

          <div id='plans' className={classes.plans}>
            {reversedCards.map(
              ({ _id, name, price, highlightAd, commonAd, smartAd }: any) => (
                <PlansCards
                  key={_id}
                  name={name}
                  price={price}
                  commonAd={commonAd}
                  highlightAd={highlightAd}
                  smartAd={smartAd}
                  _id={_id}
                />
              )
            )}
          </div>
        </div>
      </div>


      <Footer />
    </main>
  );
};

export default AnnouncementPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id || session?.user.id;
  const page = 1;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  let ownerData;
  let ownerProperties = defaultOwnerProperties;

  try {
    const ownerIdResponse = await fetch(
      `${baseUrl}/user/find-owner-by-user`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      }
    );

    if (ownerIdResponse.ok) {
      const response = await ownerIdResponse.json();
      if (response?.owner?._id) {
        ownerData = response;

        ownerProperties = await fetch(`${baseUrl}/property/owner-properties`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ownerId: ownerData?.owner?._id,
            page,
          }),
        })
          .then((res) => res.json())
          .catch(() => [])
      } else {
        console.log('Error:')
      }
    } else {
      ownerData = {};
    }
  } catch (error) {
    console.error(`Error:`, error)
  }

  const [plans] = await Promise.all([
    fetch(`${baseUrl}/plan`)
      .then((res) => res.json())
      .catch(() => []),
    fetchJson(`${baseUrl}/plan`),
  ]);

  return {
    props: {
      ownerProperties: ownerProperties ?? defaultOwnerProperties,
      plans
    },
  };
}

const classes = {
  container:
    'bg-secondary w-full h-[575px] md:h-[700px] rounded-bl-[250px] md:rounded-bl-[500px] drop-shadow-2xl pt-[100px]',
  registerCard: 'float-right md:mr-[50px] md:pt-[25px]',
  title: 'md:pt-[75px] md:ml-[100px] lg:ml-[200px]',
  p: 'md:bg-tertiary md:rounded-full md:w-[225px] lg:w-[325px] md:h-[225px] lg:h-[325px] font-extrabold md:text-3xl lg:text-4xl text-2xl text-quaternary text-center md:pt-[40px] lg:pt-[75px] md:px-2 md:border-[5px] md:border-secondary md:shadow-tertiary md:shadow-[-5px_15px_100px_-5px_rgba(0,0,0,0.3)]',
  h1: 'font-bold text-2xl md:leading-tight md:w-4/5 m-auto text-primary drop-shadow-2xl text-center md:mb-10',
  plans:
    'grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-center max-w-[1232px] items-center mx-auto',
};
