import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IMessage, IMessagesByProperty } from '../../common/interfaces/message/messages';
import { IOwnerProperties } from '../../common/interfaces/properties/propertiesList';
import usePageQueryParam from '../../common/utils/actions/getQueryParamPage';
import { fetchJson } from '../../common/utils/fetchJson';
import Pagination from '../../components/atoms/pagination/pagination';
import MessageInfoCard from '../../components/molecules/cards/messageInfoCard/messageInfoCard';
import { INotification } from '../../components/molecules/cards/notificationCard/notificationCard';
import AdminHeader from '../../components/organisms/adminHeader/adminHeader';
import SideMenu from '../../components/organisms/sideMenu/sideMenu';

interface IMessagePage {
  ownerProperties: IOwnerProperties;
  message: IMessagesByProperty;
  notifications: INotification[];
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

const MessagePage = ({ ownerProperties, message, notifications }: IMessagePage) => {
  const router = useRouter();
  const query = router.query as any;
  const [isOwner, setIsOwner] = useState<boolean>(ownerProperties?.docs?.length > 0 ? true : false);
  const propertyData = message?.property;
  const [messagesDocs, setMessagesDocs] = useState(message?.messages?.docs);
  const totalPages = message?.messages?.totalPages;
  const [currentPage, setCurrentPage] = useState(1);
  const unreadMessages = message?.messages?.docs?.length > 0 ? message?.messages?.docs.filter((message) => !message.isRead) : [];
  const initialPage = 1;

  // Atualiza a current page a partir dos parametros do url
  usePageQueryParam(initialPage, setCurrentPage);

  // Atualiza a page nos parâmetros da url quando a página é trocada no componente de paginação;
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

  // Atualiza a propriedade isRead das mensagens não lidas de false para true após o componente ser desmontado;
  useEffect(() => {
    // Função a ser executada quando o componente for desmontado
    const updateMessages = async () => {
      try {
        await fetch(`${baseUrl}/message/update-messages`,
          {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify(unreadMessages),
          })
      } catch (error) {
        console.error(error)
      }
    }

    return () => {
      updateMessages();
    };
  }, []);

  const handleDelete = async (_id: string) => {
    try {
      location.reload();
      await fetch(
        `${baseUrl}/message`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _id,
          }),
        }
      ).then((response) => response.json());
      setMessagesDocs(message?.messages?.docs);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <AdminHeader isOwnerProp={isOwner} />

      <div className={classes.body}>
        <div className={classes.sideMenu}>
          <SideMenu
            isOwnerProp={isOwner}
            notifications={notifications}
            unreadMessages={unreadMessages}
          />
        </div>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <h1 className={classes.title}>Mensagens</h1>
            <div className="flex gap-2 mb-3">
              <div>
                <Image
                  src={propertyData?.images[0]}
                  alt={'property image'}
                  width={200}
                  height={200}
                />
              </div>
              <div className="my-auto">
                <h2 className={classes.address1}>
                  {propertyData?.address.streetName},{' '}
                  {propertyData?.address.streetNumber}
                </h2>
                <div className={classes.address2}>
                  <p>{propertyData?.address.neighborhood}</p>
                  <p>
                    {propertyData?.address.city} - {propertyData?.address.uf}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center w-full md:block">
              <Pagination
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            </div>

            {messagesDocs?.map(
              ({ name, email, phone, message, _id, isRead }: IMessage) => (
                <MessageInfoCard
                  _id={_id}
                  key={_id}
                  name={name}
                  email={email}
                  message={message}
                  phone={phone}
                  isRead={isRead}
                  handleDelete={(messageId: string) => handleDelete(messageId)}
                />
              )
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MessagePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const propertyId = context.query.id;
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id;
  const page = Number(context.query.page);
  let ownerId;

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
      ownerId = ownerData?.owner?._id;
    }
  } catch (error) {
    console.error(error);
  }

  const [ownerProperties, message, notifications] = await Promise.all([
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
    fetch(`${baseUrl}/message/find-by-propertyId`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyId,
        page,
      }),
    })
      .then((res) => res.json())
      .catch(() => []),
    fetch(`${baseUrl}/notification/${ownerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch(() => []),
    fetchJson(`${baseUrl}/property/owner-properties`),
    fetchJson(`${baseUrl}/message/find-by-propertyId`),
    fetchJson(`${baseUrl}/notification/${ownerId}`),
  ]);

  return {
    props: {
      ownerProperties,
      message,
      notifications,
    },
  };
}

const classes = {
  body: 'flex flex-row items-center justify-evenly mx-2 lg:mx-0',
  sideMenu: 'fixed left-0 top-7  sm:hidden hidden md:hidden lg:flex',
  contentContainer: 'flex flex-col mt-24 lg:ml-[330px] w-full lg:mr-10',
  content: 'flex flex-col items-start xl:items-center',
  address1: 'text-quaternary font-bold text-lg md:text-2xl mb-5',
  address2: 'text-quaternary font-medium text-md md:text-xl',
  title:
    'font-extrabold text-2xl md:text-4xl text-quaternary mb-2 md:mb-10 text-center md:text-start',
};
