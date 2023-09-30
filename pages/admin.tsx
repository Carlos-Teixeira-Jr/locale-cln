import AdminPropertyCard from '../components/molecules/cards/adminPropertyCard/adminPropertyCard';
import AdminHeader from '../components/organisms/adminHeader/adminHeader';
import SideMenu from '../components/organisms/sideMenu/sideMenu';
import { NextPageWithLayout } from './page';
import { destroyCookie } from 'nookies';
import jwt, { JwtPayload } from 'jsonwebtoken';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../components/atoms/pagination/pagination';
import { useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';

interface AdminPageProps {
  ownerProperties: any
}

const AdminPage: NextPageWithLayout<AdminPageProps> = ({
  ownerProperties,
}) => {
  const {data: session} = useSession() as any;
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    setIsOwner(ownerProperties.docs?.length > 0 ? true : false)
  }, [ownerProperties])
  
  return (
    <div>
      <AdminHeader/>
      <div className="flex flex-row items-center justify-evenly">
        <div className="fixed left-0 top-20 sm:hidden hidden md:hidden lg:flex">
          <SideMenu 
            isMobileProp={false} 
            isOwnerProp={isOwner}
          />
        </div>
        <div className="flex flex-col items-center mt-24 lg:ml-[305px]">
          {/* <PaginationAndTitle adminName={'Joilson Leal'} /> */}

          <div className="flex flex-col items-center">
            <h1 className="font-extrabold text-2xl md:text-4xl text-quaternary mb-10 mr-12 md:mr-20">
              Bem vindo {session?.username !== undefined ? session?.username : ''}!
            </h1>

            <Pagination 
              totalPages={ownerProperties.totalPages} 
              page={1} 
              onPageChange={function (newPageIndex: number): void {
                throw new Error('Function not implemented.');
              } }
            />
          </div>

          <h1>{session?.email}</h1>

          <div className='mb-10'>
            {isOwner && ownerProperties?.docs?.map(
              ({
                _id,
                prices,
                address,
                images,
                isActive,
                highlighted
              }: any) => (
              <AdminPropertyCard
                _id={_id}
                image={images[0]}
                price={prices[0].value}
                location={address.streetName}
                views={1}
                messages={0}
                isActiveProp={isActive}
                highlighted={highlighted}
              />
            ))}
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

export async function getServerSideProps(context: any) {

  const session = await getSession(context) as any;
  const userId = session?.user.data._id;
  let ownerProperties;
  let token;
  let refreshToken;

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  } else {
    token = session?.user.data.access_token!!;
    refreshToken = session.user?.data.refresh_token;
    const decodedToken = jwt.decode(token) as JwtPayload;
    const isTokenExpired = decodedToken.exp
      ? decodedToken.exp <= Math.floor(Date.now() / 1000)
      : false;

    try {
      const properties = await fetch(`http://localhost:3001/property/owner-properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ownerId: userId,
          page: 1
        })
      })

      if (properties.ok) {
        ownerProperties = await properties.json();
      } else {
        console.log("Erro na resposta da busca por imoveis do usuário");
      }
    } catch (error) {
      console.log(error)
    }
    
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
            permanent: false
          }
        }
      } else {
        try {
          const response = await fetch('http://localhost:3001/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              refresh_token: refreshToken
            })
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

            return {
              props: {
                ownerProperties
              },
            };
          } else {
            console.log("Não foi possível atualizar o token.");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    return {
      props: {
        ownerProperties
      },
    };
  }
}
