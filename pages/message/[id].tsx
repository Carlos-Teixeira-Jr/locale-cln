import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { destroyCookie } from "nookies";
import { fetchJson } from "../../common/utils/fetchJson";
import jwt, { JwtPayload } from 'jsonwebtoken';
import AdminHeader from "../../components/organisms/adminHeader/adminHeader";
import { useEffect, useState } from "react";
import SideMenu from "../../components/organisms/sideMenu/sideMenu";
import Pagination from "../../components/atoms/pagination/pagination";
import { IOwnerProperties } from "../../common/interfaces/properties/propertiesList";
import MessagesCard from "../../components/molecules/cards/messagesCard.tsx/messagesCard";
import { IMessage } from "../../common/interfaces/message/messages";
import { useRouter } from "next/router";
import { IData } from "../../common/interfaces/property/propertyData";
import Image from "next/image";
import MessageInfoCard from "../../components/molecules/cards/messageInfoCard/messageInfoCard";

interface IMessagePage {
  messages: any[],
  property: IData
}

interface IMessagePage {
  ownerProperties: IOwnerProperties
  message: IMessagePage
}

const MessagePage = ({
  ownerProperties,
  message
}: IMessagePage) => {
  console.log("🚀 ~ file: [id].tsx:32 ~ message:", message)

  const [isOwner, setIsOwner] = useState<boolean>(false);
  const router = useRouter();
  const query = router.query as any;
  const propertyId = query.id;
  const propertyData = message?.property

  // Determina se o usuário já possui anúncios ou não;
  useEffect(() => {
    setIsOwner(ownerProperties?.docs?.length > 0 ? true : false);
  }, [ownerProperties]);

  return (
    <main>
      <AdminHeader isOwnerProp={isOwner} />

      <div className="flex flex-row items-center justify-evenly">
        <div className="fixed left-0 top-20 sm:hidden hidden md:hidden lg:flex">
          <SideMenu
            isOwnerProp={isOwner}
          />
        </div>

        <div className="flex flex-col mt-24 lg:ml-[330px] w-full mr-10">
          <div className="flex flex-col">

            <h1 className="font-extrabold text-2xl md:text-4xl text-quaternary md:mb-10">
              Mensagens
            </h1>

            <div className="flex gap-2">
              <div>
                <Image 
                  src={propertyData.images[0]} 
                  alt={"property image"}
                  width={200}
                  height={200}
                />
              </div>
              <div>
                <h2 className="text-quaternary font-bold text-2xl">{propertyData.address.streetName}, {propertyData.address.streetNumber}</h2>
                <div className="text-quaternary font-medium text-xl">
                  <p>{propertyData.address.neighborhood}</p>
                  <p>{propertyData.address.city} - {propertyData.address.uf}</p>
                </div>
              </div>
            </div>

            <Pagination totalPages={0} />

            {message?.messages.map(
              ({
                name,
                email,
                phone,
                message,
                _id
              }: IMessage) => (
              <MessageInfoCard
                key={_id}
                name={name}
                email={email}
                message={message}
                phone={phone}
              />
            ))}
            
          </div>
        </div>
      </div>
    </main>
  )
}

export default MessagePage

export async function getServerSideProps(context: GetServerSidePropsContext) {

  const propertyId = context.query.id;
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id;
  let token;
  let refreshToken;

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  } else {
    token = session?.user.data.access_token!!;
    refreshToken = session.user?.data.refresh_token;
    const decodedToken = jwt.decode(token) as JwtPayload;
    const isTokenExpired = decodedToken.exp
      ? decodedToken.exp <= Math.floor(Date.now() / 1000)
      : false;

    if (isTokenExpired) {
      const decodedRefreshToken = jwt.decode(refreshToken) as JwtPayload;
      const isRefreshTokenExpired = decodedRefreshToken.exp
        ? decodedRefreshToken.exp <= Math.floor(Date.now() / 1000)
        : false;

      if (isRefreshTokenExpired) {
        destroyCookie(context, 'next-auth.session-token');
        destroyCookie(context, 'next-auth.csrf-token');

        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      } else {
        try {
          const response = await fetch('http://localhost:3001/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refresh_token: refreshToken,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const newToken = data.access_token;
            const newRefreshToken = data.refresh_token;
            refreshToken = newRefreshToken;
            token = newToken;
            session.user.data.refresh_token = newRefreshToken;
            token = newToken;
            session.user.data.access_token = newToken;
          } else {
            console.log('Não foi possível atualizar o token.');
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;    
    let ownerId;

    try {
      const ownerIdResponse = await fetch(`${baseUrl}/user/find-owner-by-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id: userId}),
      })

      if (ownerIdResponse.ok) {
        const ownerData = await ownerIdResponse.json();
        ownerId = ownerData?.owner?._id
      }
    } catch (error) {
      console.error(error)
    }

    const [ownerProperties, message] = await Promise.all([
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
      fetch(`${baseUrl}/message/find-by-propertyId` ,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId,
        }),
      })
        .then((res) => res.json())
        .catch(() => []),
      fetchJson(`${baseUrl}/property/owner-properties`),
      fetchJson(`${baseUrl}/message/find-by-propertyId`),
    ]);

    const notifications = await fetch(
      `http://localhost:3001/notification/64da04b6052b4d12939684b0`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const dataNot = await notifications.json();

    return {
      props: {
        ownerProperties,
        message,
        dataNot,
      },
    };
  }
}