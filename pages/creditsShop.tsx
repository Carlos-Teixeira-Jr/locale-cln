import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { IMessagesByOwner } from "../common/interfaces/message/messages";
import { IOwner } from "../common/interfaces/owner/owner";
import { IPlan } from "../common/interfaces/plans/plans";
import { fetchJson } from "../common/utils/fetchJson";
import { ErrorToastNames, showErrorToast, showSuccessToast, SuccessToastNames } from "../common/utils/toasts";
import { INotification } from "../components/molecules/cards/notificationCard/notificationCard";
import { AdminHeader, SideMenu } from "../components/organisms";
import CreditsShopBoard, { Credits } from "../components/organisms/creditsShop/creditsShopBoard";
import useDeviceSize from "../hooks/deviceSize";

interface ICreditsShop {
  notifications: INotification[],
  messages: IMessagesByOwner,
  owner: IOwner;
  plans: IPlan[]
}

const CreditsShop = ({
  notifications,
  messages,
  owner,
  plans
}: ICreditsShop) => {

  const [width] = useDeviceSize();
  const unreadMessages = messages?.docs?.length > 0 ? messages?.docs.filter((message) => !message.isRead) : [];
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const [credits, setCredits] = useState<Credits>({
    adCredits: owner.adCredits,
    highlightCredits: owner.highlightCredits === undefined ? 0 : owner.highlightCredits
  });

  const classes = {
    sideMenu: `${width < 1080 ? 'hidden' : 'fixed left-0 top-7 lg:flex xl:flex md:hidden'
      } `,
  };

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${baseUrl}/payment/increase-credits/${owner.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            {
              type: 'adCredits',
              amount: credits.adCredits
            },
            {
              type: 'highlightCredits',
              amount: credits.highlightCredits
            },
          ]),
        }
      );

      if (response.ok) {
        showSuccessToast(SuccessToastNames.CreditsSuccess)
      }
      setLoading(false);
    } catch (error) {
      showErrorToast(ErrorToastNames.ServerConnection);
      console.error(error);
      setLoading(false)
    }
  }

  return (
    <main>
      <AdminHeader isOwnerProp={true} />

      <div className="flex flex-row items-center justify-evenly xl:w-fit 2xl:w-full w-full max-w-full">
        <div className={classes.sideMenu}>
          <SideMenu
            isOwnerProp={true}
            notifications={notifications}
            unreadMessages={unreadMessages}
            isPlus={true}
          />
        </div>

        <div
          className={`flex flex-col items-center mt-24 ${width < 1080 ? 'justify-center' : 'lg:ml-[26rem]'}`}
        >
          <div className="mb-10 md:px-5 lg:px-0">

            <CreditsShopBoard
              adCredits={owner?.adCredits}
              highlightCredits={owner?.highlightCredits!}
              ownerId={owner.id}
              handleCreditsChange={(credits) => setCredits(credits)}
            />

            <div className="w-full flex justify-center">
              <button
                className={`flex items-center flex-row justify-around w-44 h-14 text-tertiary rounded font-bold text-lg md:text-xl ${loading ?
                  'bg-red-300 transition-colors duration-300' :
                  'bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer'
                  }`}
                onClick={handleSubmit}
                disabled={loading}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default CreditsShop

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id || session?.user.id;
  const page = Number(context.query.page);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
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
      if (ownerData?.owner?._id) {
        owner = ownerData?.owner;
      } else {
        return {
          redirect: {
            destination: '/adminFavProperties?page=1',
            permanent: false,
          },
        };
      }
    } else {
      console.log('erro - find-owner-by-user:', ownerIdResponse);
    }
  } catch (error) {
    console.error(error);
  }

  const [notifications, messages, plans] = await Promise.all([
    fetch(
      `${baseUrl}/notification/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .catch(() => []),
    fetch(`${baseUrl}/message/find-all-by-ownerId`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ownerId: owner?._id,
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
    fetchJson(`${baseUrl}/plan`),
    fetchJson(`${baseUrl}/notification/user/${userId}`),
    fetchJson(`${baseUrl}/message/find-all-by-ownerId`),
  ]);

  return {
    props: {
      notifications,
      messages,
      owner,
      plans
    },
  };
}