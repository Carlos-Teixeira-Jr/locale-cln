// context/MenuContext.tsx
import { useSession } from 'next-auth/react';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { IFavProperties } from '../common/interfaces/properties/favouriteProperties';
import { IOwnerProperties } from '../common/interfaces/properties/propertiesList';
import { INotification } from '../components/molecules/cards/notificationCard/notificationCard';

type MenuItems = {
  ownerProperties: IOwnerProperties | null,
  favouriteProperties: IFavProperties | null,
  notifications: INotification[] | null
}

interface MenuContextType {
  menuItems: MenuItems;
  setMenuItems: (items: any) => void;
}

interface MenuProviderProps {
  children: ReactNode;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const [menuItems, setMenuItems] = useState({
    favouriteProperties: null,
    ownerProperties: null,
    notifications: null
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const session = useSession() as any;
  const userId = session.data?.user._id

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

        const ownerIdResponse = await fetch(`${baseUrl}/user/find-owner-by-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (ownerIdResponse.ok) {
          const response = await ownerIdResponse.json();
          if (response?.owner?._id) {
            const ownerData = response;

            const [ownerProperties, favouriteProperties, notifications] = await Promise.all([
              fetch(`${baseUrl}/property/owner-properties`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ownerId: ownerData?.owner?._id,
                  page: 1,
                }),
              }).then(res => res.json()).catch(() => null),
              fetch(`${baseUrl}/user/favourite`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id: userId,
                  page: 1,
                }),
              }).then(res => res.json()).catch(() => null),
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
                .catch(() => null),
            ]);

            setMenuItems((prevMenuItems) => ({
              ...prevMenuItems,
              ownerProperties,
              favouriteProperties,
              notifications,
            }));
          } else {
            // Redirecionar ou lidar com erro
            console.error('No owner found');
          }
        } else {
          console.error('Failed to fetch owner');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  return (
    <MenuContext.Provider value={{ menuItems, setMenuItems }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};