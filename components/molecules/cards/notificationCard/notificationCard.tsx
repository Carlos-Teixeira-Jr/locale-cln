import React from 'react';
import MailIcon from '../../../atoms/icons/mailIcon';
import MessageBalloonIcon from '../../../atoms/icons/messageBalloonIcon';
import PhoneIcon from '../../../atoms/icons/phoneIcon';
import UserIcon from '../../../atoms/icons/userIcon';

export interface INotificationCard {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const NotificationCard: React.FC<INotificationCard> = ({
  name,
  email,
  message,
  phone,
}) => {
  return (
    <div className="border-2 border-quaternary my-5 bg-tertiary p-5">
      <div className="mb-5 lg:flex">
        <UserIcon className="mr-2" fill="#6B7280" />
        <h3 className="text-2xl text-quaternary font-bold leading-7 my-auto">
          {name}
        </h3>
      </div>

      <div className="mb-5 lg:flex">
        <MailIcon className="mr-2" fill="#6B7280" />
        <h3 className="text-quaternary text-xl font-medium leading-6 my-auto">
          {email}
        </h3>
      </div>

      <div className="mb-5 lg:flex">
        <PhoneIcon className="mr-2" fill="#6B7280" />
        <h3 className="text-quaternary text-xl font-medium leading-6 my-auto">
          {phone}
        </h3>
      </div>

      <div className="lg:flex">
        <MessageBalloonIcon className="shrink-0 mr-2" fill="#6B7280" />
        <p className="text-quaternary text-base font-normal leading-5 my-auto">
          {message}
        </p>
      </div>
    </div>
  );
};

export default NotificationCard;
