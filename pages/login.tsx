import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { IOwnerProperties } from '../common/interfaces/properties/propertiesList';
import LoginCard from '../components/molecules/cards/loginCard/loginCard';
import Footer from '../components/organisms/footer/footer';
import Header from '../components/organisms/header/header';
import { useIsMobile } from '../hooks/useIsMobile';

interface ILoginPage {
  ownerProperties: IOwnerProperties
}

const LoginPage = ({ ownerProperties }: ILoginPage) => {

  const isMobile = useIsMobile();
  const isOwner = ownerProperties?.docs.length > 0;

  return (
    <>
      <div className={`min-h-screen flex flex-col ${isMobile ? `md:flex md:flex-col justify-between` : ''}`}>

        <Header userIsOwner={isOwner} />

        <div className="flex-grow flex justify-center mt-32 lg:mb-20">
          <LoginCard />
        </div>

        <Footer />

      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = (await getSession(context)) as any;

  if (!session) {
    const session = (await getSession(context)) as any;
    const userId = session?.user.data._id || session?.user.id;
    const page = 1;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    let ownerData;
    let ownerProperties;

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

    return {
      props: {
        ownerProperties,
      },
    };
  }

  return {
    redirect: {
      destination: '/admin?page=1',
      permanent: false,
    },
  };
};

export default LoginPage;
