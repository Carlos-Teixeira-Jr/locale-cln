import { GetServerSidePropsContext } from 'next';
import PropertyCard from '../components/molecules/cards/propertyCard/PropertyCard';
import AdminHeader from '../components/organisms/adminHeader/adminHeader';
import SideMenu from '../components/organisms/sideMenu/sideMenu';
import { NextPageWithLayout } from './page';
import { getSession } from 'next-auth/react';
import { destroyCookie } from 'nookies';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { fetchJson } from '../common/utils/fetchJson';
import { IData, IPropertyInfo } from '../common/interfaces/property/propertyData';

interface IAdminFavProperties {
  favouriteProperties: IData[]
  properties: IPropertyInfo
}

const AdminFavProperties: NextPageWithLayout<IAdminFavProperties> = ({
  favouriteProperties,
  properties
}) => {

  const isOwner = properties?.docs?.length > 0 ? true : false;

  return (
    <>
      <AdminHeader isOwnerProp={isOwner}/>
      <div className="flex flex-row items-center justify-evenly">
        <div className="fixed left-0 top-20 sm:hidden hidden md:hidden lg:flex">
          <SideMenu 
            isOwnerProp={isOwner}
            notifications={[]}          
          />
        </div>
        <div className="flex flex-col items-center mt-24 w-full lg:pl-72">
          <div className="flex flex-col items-center mb-5 max-w-[1215px]">
            <h1 className="font-extrabold text-2xl md:text-4xl text-quaternary md:mb-5 text-center">
              Imóveis Favoritos
            </h1>
            {/* <Pagination 
              totalPages={0} 
            />   */}
            <div className="flex flex-col md:flex-row flex-wrap md:gap-10 lg:gap-20 my-5 justify-center">
              {favouriteProperties?.length > 0 && favouriteProperties.map(
                ({
                  _id,
                  prices,
                  address,
                  images,
                  highlighted,
                  description
                }: IData) => (
                <PropertyCard
                  key={_id}
                  description={description}
                  images={images}
                  location={`${address.city}, ${address.uf} - ${address.streetName}`}
                  favorited={highlighted} 
                  id={_id} 
                  prices={prices} 
                  highlighted={highlighted} 
                />
              ))}
              
            </div> 
            {/* <Pagination 
              totalPages={0} 
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminFavProperties;

export async function getServerSideProps(context:GetServerSidePropsContext) {

  const session = await getSession(context) as any;
  const userId = session?.user.data._id;
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
          } else {
            console.log("Não foi possível atualizar o token.");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    const baseUrl = process.env.BASE_API_URL;

    const [favouriteProperties, properties] = await Promise.all([
      fetch(`${baseUrl}/user/favourite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: userId,
        })
      })
      .then((res) => res.json())
      .catch(() => []),
      fetch(`${baseUrl}/property/owner-properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ownerId: userId,
          page: 1
        })
      })
      .then((res) => res.json())
      .catch(() => []),
      fetchJson(`${baseUrl}/user/favourite`),
      fetchJson(`${baseUrl}/property/owner-properties`)
    ]);

    return {
      props: {
        favouriteProperties,
        properties
      }
    }
  }
}