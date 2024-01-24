import React, { useEffect, useRef, useState } from 'react';
import DeleteIcon from '../../../atoms/icons/deleteIcon';
export interface INotification {
  description: string;
  title: string;
  _id: string;
  isRead: boolean;
  adminNots?: [];
}

const NotificationCard: React.FC<INotification> = ({
  description,
  title,
  isRead,
  _id,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const [deleteNot, setDeleteNot] = useState<boolean>(false);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const [seen, setSeen] = useState<boolean>(isRead);

  useEffect(() => {
    if (messageRef.current) {
      const isOverflowing =
        messageRef.current.scrollHeight > messageRef.current.clientHeight;
      setIsExpandable(isOverflowing);
    }
  }, [description]);

  const toggleExpanded = (e: React.MouseEvent) => {
    e.preventDefault();
    setExpanded(!expanded);
    expanded && setSeen(!seen);
  };

  const handleDelete = async (_id: any) => {
    try {
      setDeleteNot(!deleteNot);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/notification`,
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/** ! */}
      <div
        className={`${
          !seen && !deleteNot
            ? 'relative top-7 left-[94%] w-10 h-10 bg-white border-2 border-secondary rounded-full text-primary font-bold text-3xl text-center'
            : 'hidden'
        }`}
      >
        !
      </div>

      {!deleteNot ? (
        <div
          className={`${
            !seen
              ? 'border-4 border-secondary bg-tertiary p-5'
              : 'border-4 border-quaternary bg-tertiary p-5 mt-10'
          } `}
        >
          <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row items-center justify-between sm:w-[250px] md:w-[500px] w-[250px] lg:w-[600px] xl:w-[600px] gap-5">
            {/** Text part */}
            <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row items-center justify-between">
              <div className="flex flex-col items-start">
                <h1 className="text-quaternary text-xl font-semibold">
                  {title}
                </h1>
                <div className="">
                  <p
                    ref={messageRef}
                    style={{
                      overflow: expanded ? 'visible' : 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      lineClamp: expanded ? 'unset' : 2,
                      WebkitLineClamp: expanded ? 'unset' : 4,
                      WebkitBoxOrient: 'vertical',
                      whiteSpace: 'initial',
                    }}
                    className="font-medium text-sm text-quaternary mt-4  text-justify"
                  >
                    {description}
                  </p>
                  {messageRef.current && isExpandable && (
                    <span
                      onClick={toggleExpanded}
                      className="font-semibold text-sm text-secondary mt-4  text-justify"
                    >
                      {!expanded ? 'Continuar lendo...' : 'Ler menos...'}
                    </span>
                  )}
                </div>
              </div>
              {/** delete icon part */}
            </div>
            <div className="flex items-end">
              <button
                className="flex items-center justify-center bg-primary rounded-md w-8 h-8"
                onClick={() => handleDelete(_id)}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};
export default NotificationCard;
