import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IMessage } from '../common/interfaces/message/messages';
import { IOwner } from '../common/interfaces/owner/owner';
import { IPlan } from '../common/interfaces/plans/plans';
import { IOwnerProperties } from '../common/interfaces/properties/propertiesList';
import { IData } from '../common/interfaces/property/propertyData';
import { fetchJson } from '../common/utils/fetchJson';
import SentimentIcon from '../components/atoms/icons/sentimentIcon';
import Pagination from '../components/atoms/pagination/pagination';
import { MessagesCard } from '../components/molecules';
import { AdminHeader, SideMenu } from '../components/organisms';
import { useIsMobile } from '../hooks/useIsMobile';

interface IMessages {
  docs: IMessage[];
  properties: IData[];
  totalPages: number;
  page: number;
}

interface IAdminMessagesPage {
  ownerProperties: IOwnerProperties;
  messages: IMessages;
  notifications: [];
  plans: IPlan[];
  owner: IOwner;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

const AdminMessages = ({
  ownerProperties,
  messages,
  notifications,
  plans,
  owner
}: IAdminMessagesPage) => {

  const router = useRouter();
  const query = router.query as any;
  const [isOwner, setIsOwner] = useState<boolean>(ownerProperties?.docs?.length > 0 ? true : false);
  const properties = messages?.properties;
  const messagesCount = messages?.docs?.length;
  const totalPages = messages?.totalPages;
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const unreadMessages = messages?.docs?.length > 0 ? messages?.docs?.filter((e) => e.isRead === false) : [];
  const plusPlan = plans.find((e) => e.name === 'Locale Plus');
  const ownerIsPlus = owner?.plan === plusPlan?._id ? true : false;

  useEffect(() => {
    if (router.query.page !== undefined && typeof query.page === 'string') {
      const parsedPage = parseInt(query.page);
      setCurrentPage(parsedPage);
    }
  }, [router.query.page, query.pag]);

  useEffect(() => {
    const pageQueryParam =
      router.query.page !== undefined && typeof query.page === 'string'
        ? parseInt(query.page)
        : 1;

    if (pageQueryParam !== currentPage) {
      const queryParams = {
        ...query,
        page: currentPage,
      };
      router.push({ query: queryParams }, undefined, { scroll: false });
    }
  }, [currentPage]);

  const classes = {
    body: 'flex flex-row items-center justify-center lg:ml-72 xl:ml-72',
    sideMenu: 'fixed sm:hidden hidden md:hidden lg:flex xl:flex left-0 top-7',
    content: 'flex flex-col mt-16 w-full xl:mx-auto max-w-[1232px] justify-center md:mx-auto',
    title:
      'font-extrabold text-lg md:text-2xl text-quaternary md:my-5 text-center md:mx-auto',
    notFound:
      'flex flex-col items-center align-middle lg:mt-36 justify-center mr-0 lg:mx-auto',
    cardContainer:
      `grid sm:grid-cols-1 grid-cols-1 my-5 gap-10 lg:justify-start ${messagesCount === 1 ? 'md:grid-cols-1 xl:grid-cols-1' : 'md:grid-cols-2 xl:grid-cols-3'}`,
  };

  return (
    <main>
      <AdminHeader isOwnerProp={isOwner} isPlus={ownerIsPlus} />
      <div className={classes.body}>
        <div className={classes.sideMenu}>
          {!isMobile ? (
            <SideMenu
              isOwnerProp={isOwner}
              notifications={notifications}
              unreadMessages={unreadMessages}
              isPlus={ownerIsPlus}
            />
          ) : (
            ''
          )}
        </div>
        <div className={classes.content}>
          <h1 className={classes.title}>Mensagens</h1>
          {!messagesCount ? (
            ''
          ) : (
            <Pagination
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          )}
          {!messagesCount && (
            <div className={classes.notFound}>
              <SentimentIcon />
              <h1 className="text-2xl text-quaternary mt-2">
                Não tem nenhuma mensagem.
              </h1>
            </div>
          )}
          {messagesCount > 0 &&
            properties.map(({ _id, images, address }: IData) => (
              <div key={_id} className={classes.cardContainer}>
                <MessagesCard
                  key={_id}
                  image={images[0]}
                  address={address}
                  messages={messages?.docs.filter(
                    (message) => message.propertyId === _id
                  )}
                  propertyId={_id}
                />
              </div>
            ))
          }
          <div className="flex justify-center mb-10">
            {messagesCount ? (
              <Pagination
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminMessages;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id || session?.user.id;
  const page = Number(context.query.page);
  let ownerId;
  let owner;

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

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
      const ownerData = await ownerIdResponse.json();
      owner = ownerData.owner;
      ownerId = ownerData?.owner?._id;
    }
  } catch (error) {
    console.error(error);
  }

  const [
    notifications,
    ownerProperties,
    messages,
    plans
  ] = await Promise.all([
    fetch(
      `${baseUrl}/notification/user/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .catch(() => []),
    fetch(`${baseUrl}/property/owner-properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ownerId,
        page: 1,
      }),
    })
      .then((res) => res.json())
      .catch(() => []),
    fetch(`${baseUrl}/message/find-all-by-ownerId`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ownerId,
        page,
      }),
    })
      .then((res) => res.json())
      .catch(() => []),
    fetch(`${baseUrl}/plan`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch(() => []),
    fetchJson(`${baseUrl}/notification/${userId}`),
    fetchJson(`${baseUrl}/property/owner-properties`),
    fetchJson(`${baseUrl}/message/find-all-by-ownerId`),
    fetchJson(`${baseUrl}/plan`),
  ]);

  return {
    props: {
      ownerProperties,
      messages,
      notifications,
      plans,
      owner
    },
  };
}
