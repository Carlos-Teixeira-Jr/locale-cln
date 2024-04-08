import { useEffect, useRef, useState } from "react"
import DeleteIcon from "../../../atoms/icons/deleteIcon"
import MailIcon from "../../../atoms/icons/mailIcon"
import MessageBalloonIcon from "../../../atoms/icons/messageBalloonIcon"
import PhoneIcon from "../../../atoms/icons/phoneIcon"
import UserIcon from "../../../atoms/icons/userIcon"

interface IMessageInfoCard {
  _id: string
  name: string
  email: string
  phone: string
  message: string
  isRead: boolean
  handleDelete: (messageId: string) => void;
}


const MessageInfoCard = ({
  _id,
  name,
  phone,
  message,
  email,
  isRead,
  handleDelete
}: IMessageInfoCard) => {

  const [expanded, setExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isExpandable, setIsExpandable] = useState(false);
  const isVisualized = isRead;
  const [isDeleted, setIsDeleted] = useState(false);

  // Verifica se o texto excede os limites do corpo do card e atribui esse valor ao estado isExpandable;
  useEffect(() => {
    if (descriptionRef.current) {
      const isOverflowing =
        descriptionRef.current.scrollHeight >
        descriptionRef.current.clientHeight;
      setIsExpandable(isOverflowing);
    }
  }, [message]);

  return (
    <div className={`w-full h-fit text-quaternary flex flex-col p-2 my-5 max-w-[1232px] ${isVisualized ? 'border-quaternary border' : 'border-primary border-2'}`}>
      <div className="flex gap-2">
        <UserIcon
          fill="#6B7280"
          width="32"
        />
        <h1 className="font-bold text-xl my-auto">{name}</h1>
      </div>
      <div className="flex gap-2">
        <MailIcon
          fill="#6B7280"
          width="32"
        />
        <h2 className="font-medium text-lg my-auto">{email}</h2>
        <div
          className={`${!isVisualized && !isDeleted
            ? 'relative w-10 h-10 bg-white border-2 bottom-18 bottom-[70px] left-[70%] border-secondary rounded-full text-primary font-bold text-3xl text-center'
            : 'hidden'
            }`}
        >
          !
        </div>
      </div>
      <div className="flex gap-2">
        <PhoneIcon
          fill="#6B7280"
          width="32"
        />
        <h2 className="font-medium text-lg my-auto">{phone}</h2>
      </div>
      <div className="flex gap-2">
        <MessageBalloonIcon
          fill="#6B7280"
          width="32"
          className="shrink-0"
        />
        <div>
          <p
            ref={descriptionRef}
            className="font-medium text-lg my-auto overflow-hidden line-clamp-3"
            style={{
              overflow: expanded ? 'visible' : 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              lineClamp: expanded ? 'unset' : 2,
              WebkitLineClamp: expanded ? 'unset' : 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {message}
          </p>
          {descriptionRef.current && isExpandable && (
            <div className="w-full text-end">
              <span
                onClick={() => setExpanded(!expanded)}
                className="font-medium text-sm text-primary mt-4 whitespace-nowrap text-end cursor-pointer"
              >
                {!expanded ? 'Ler mais...' : 'Ler menos...'}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-end">
          <button
            className="flex items-center justify-center bg-primary rounded-md w-8 h-8 transition-colors duration-300 hover:bg-red-500"
            onClick={() => {
              handleDelete(_id);
            }}
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageInfoCard