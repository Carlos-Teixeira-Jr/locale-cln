import React, { useEffect, useRef, useState } from 'react';
import DeleteIcon from '../../../atoms/icons/deleteIcon';
export interface INotification {
  description: string;
  title: string;
  _id: string;
}

const NotificationCard: React.FC<INotification> = ({ description, title }) => {
  const [expanded, setExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const [deleteNot, setDeleteNot] = useState<boolean>(false);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const [seen, setSeen] = useState<boolean>(false);

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

  const deleteNotification = (_del: boolean) => {
    setDeleteNot(!deleteNot);
  };

  return (
    <>
      {/** ! */}
      <div
        className={`${
          !seen
            ? 'relative top-10 left-[94%] w-10 h-10 bg-white border-2 border-secondary rounded-full text-primary font-bold text-3xl text-center'
            : ''
        }`}
      >
        !
      </div>

      {!deleteNot ? (
        <div
          className={`${
            !seen
              ? 'border-4 border-secondary bg-tertiary p-5'
              : 'border-4 border-tertiary bg-tertiary p-5'
          } `}
        >
          <div>
            {/** Text part */}
            <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row gap-2 justify-between items-center">
              <div>
                <h1 className="text-quaternary text-xl font-semibold">
                  {title}
                </h1>
                <div className="max-w-[1000px]">
                  <p
                    ref={messageRef}
                    style={{
                      overflow: expanded ? 'visible' : 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      lineClamp: expanded ? 'unset' : 2,
                      WebkitLineClamp: expanded ? 'unset' : 3,
                      WebkitBoxOrient: 'vertical',
                      whiteSpace: 'initial',
                    }}
                    className="font-medium text-sm text-quaternary mt-4 max-w-[1000px] text-justify"
                  >
                    {description}
                  </p>
                  {messageRef.current && isExpandable && (
                    <span
                      onClick={toggleExpanded}
                      className="font-semibold text-sm text-secondary mt-4 max-w-[1000px] text-justify"
                    >
                      {!expanded ? 'Continuar lendo...' : 'Ler menos...'}
                    </span>
                  )}
                </div>
              </div>

              {/** delete icon part */}
              <button
                className="flex items-center justify-center bg-primary rounded-md w-8 h-8"
                onClick={() => deleteNotification(!deleteNot)}
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
