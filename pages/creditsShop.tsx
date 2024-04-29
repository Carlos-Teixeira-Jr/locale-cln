import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { IMessagesByOwner } from "../common/interfaces/message/messages";
import { IOwner } from "../common/interfaces/owner/owner";
import { IPlan } from "../common/interfaces/plans/plans";
import { fetchJson } from "../common/utils/fetchJson";
import { ErrorToastNames, showErrorToast, showSuccessToast, SuccessToastNames } from "../common/utils/toasts";
import Loading from "../components/atoms/loading";
import CreditsConfirmationModal from "../components/atoms/modals/creditsConfirmattionModal";
import { INotification } from "../components/molecules/cards/notificationCard/notificationCard";
import { AdminHeader, SideMenu } from "../components/organisms";
import CreditsShopBoard, { Credits } from "../components/organisms/creditsShop/creditsShopBoard";
import useDeviceSize from "../hooks/deviceSize";

interface ICreditsShop {
  notifications: INotification[],
  messages: IMessagesByOwner,
  owner: IOwner;
  plans: IPlan[];
  ownerPlanPrice: number;
  ownerPlan: IPlan
}

const CreditsShop = ({
  notifications,
  messages,
  owner,
  ownerPlanPrice,
  ownerPlan
}: ICreditsShop) => {

  const [width] = useDeviceSize();
  const unreadMessages = messages?.docs?.length > 0 ? messages?.docs.filter((message) => !message.isRead) : [];
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const [showCreditsConfirmattionModal, setShowCreditsConfirmationModal] = useState(false);
  const [btnIsDisabled, setBtnIsDisabled] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const ownerIsPlus = ownerPlan?.name === "Locale Plus" ? true : false;

  const [credits, setCredits] = useState<Credits>({
    adCredits: owner.adCredits,
    highlightCredits: owner.highlightCredits === undefined ? 0 : owner.highlightCredits
  });

  useEffect(() => {
    if (
      notifications! &&
      messages! &&
      owner! &&
      ownerPlanPrice!
    ) {
      setPageLoading(false)
    }
  }, [notifications, messages, owner, ownerPlanPrice])

  // Controla o disable do botão;
  useEffect(() => {
    if (
      credits.adCredits > owner.adCredits ||
      credits.highlightCredits > owner.highlightCredits!
    ) {
      setBtnIsDisabled(false);
    } else {
      setBtnIsDisabled(true);
    }
  });

  const classes = {
    sideMenu: `${width < 1080 ? 'hidden' : 'fixed left-0 top-7 lg:flex xl:flex md:hidden'
      } `,
  };

  const handleSubmit = async () => {
    console.log("entrou")
    try {
      setSubmitLoading(true)
      const response = await fetch(
        `${baseUrl}/payment/increase-credits/${owner._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credits: [
              {
                type: 'adCredits',
                amount: Number(credits.adCredits - owner.adCredits),
              },
              {
                type: 'highlightCredits',
                amount: Number(credits.highlightCredits - owner.highlightCredits!)! ? Number(credits.highlightCredits - owner.highlightCredits!) : 0,
              },
            ],
          }),
        }
      );

      if (response.ok) {
        showSuccessToast(SuccessToastNames.CreditsSuccess);
        window.location.reload();
      }
      setSubmitLoading(false);
    } catch (error) {
      showErrorToast(ErrorToastNames.ServerConnection);
      console.error(error);
      setSubmitLoading(false)
    }
  }

  return (
    <>
      {pageLoading ? (
        <Loading width='md:w-20' height='md:h-20' />
      ) : (
        <main>
          <AdminHeader isOwnerProp={true} isPlus={ownerIsPlus} />

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
              className={`flex flex-col w-full items-center md:mx-0 mt-24 ${width < 1080 ? 'justify-center px-2' : 'lg:ml-[26rem]'}`}
            >
              <div className="mb-10 md:px-5 lg:px-0 w-full">

                <CreditsShopBoard
                  adCredits={owner?.adCredits}
                  highlightCredits={owner?.highlightCredits!}
                  ownerId={owner._id}
                  handleCreditsChange={(credits) => setCredits(credits)}
                  handleTotalPriceChange={(value) => setTotalPrice(value)}
                />

                <div className="w-full flex justify-center">
                  <button
                    className={`flex items-center flex-row justify-around w-full shadow-lg md:w-44 h-14 text-tertiary rounded font-bold text-lg md:text-xl ${submitLoading || btnIsDisabled ?
                      'bg-red-300 transition-colors duration-300' :
                      'bg-primary transition-colors duration-300 hover:bg-red-600 hover:text-white cursor-pointer'
                      }`}
                    onClick={() => setShowCreditsConfirmationModal(true)}
                    disabled={submitLoading || btnIsDisabled}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <CreditsConfirmationModal
            isOpen={showCreditsConfirmattionModal}
            setModalIsOpen={(isOpen) => setShowCreditsConfirmationModal(isOpen)}
            credits={credits}
            ownerAdCredits={owner?.adCredits}
            ownerHighlightCredits={owner?.highlightCredits!}
            totalPrice={totalPrice}
            ownerPlanPrice={ownerPlanPrice}
            onConfirm={() => {
              setShowCreditsConfirmationModal(false); // Fecha o modal
              handleSubmit(); // Chama a função de envio do formulário após a confirmação
            }}
          />
        </main>
      )}

    </>
  )
}

export default CreditsShop

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = (await getSession(context)) as any;
  const userId = session?.user.data._id || session?.user.id;
  const page = Number(context.query.page);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
  const paymentUrl = process.env.NEXT_PUBLIC_PAYMENT_API_URL;
  let ownerSubscription;
  let owner;
  let ownerPlanPrice;

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
        ownerSubscription = ownerData?.owner?.paymentData?.subscriptionId;
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

  const [notifications, messages, ownerPlan] = await Promise.all([
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
    fetch(`http://localhost:8080/payment/subscription/${ownerSubscription}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch(() => { }),
    fetchJson(`${baseUrl}/notification/user/${userId}`),
    fetchJson(`${baseUrl}/message/find-all-by-ownerId`),
    fetchJson(`${paymentUrl}/payment/subscription/${ownerSubscription}`),
  ]);

  ownerPlanPrice = ownerPlan?.value;

  return {
    props: {
      notifications,
      messages,
      owner,
      ownerPlanPrice,
      ownerPlan
    },
  };
}