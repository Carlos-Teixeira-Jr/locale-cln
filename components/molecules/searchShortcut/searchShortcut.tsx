import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTagEffect } from '../../../hooks/useTagEffect';
import CloseIcon from '../../atoms/icons/closeIcon';
import FurnitureIcon from '../../atoms/icons/furnitureIcon';
import ParkingIcon from '../../atoms/icons/parkingIcon';
import PetsIcon from '../../atoms/icons/petsIcon';
import PoolIcon from '../../atoms/icons/poolIcon';
import { toggleSelection } from './toggleSelection';

export interface ISearchShortcut {
  onMobileFilterIsOpenChange: (isOpen: boolean) => void;
}

const SearchShortcut: React.FC<ISearchShortcut> = ({
  onMobileFilterIsOpenChange,
}) => {
  const router = useRouter();
  const query = router.query;

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Handles the query url params checking to verify the tags thats already selected on rendering;
  useTagEffect(query, selectedTags, setSelectedTags);

  const getTagsShortcuts = () => {
    const iconClassName = "group-hover:fill-tertiary";
    const iconFill = "#6B7280";
    const tagsShortcuts = [
      {
        label: 'Pets',
        key: 'pets',
        tag: 'aceita pets',
        icon: <PetsIcon fill={iconFill} className={iconClassName} />,
      },
      {
        label: 'Mobiliado',
        key: 'furnished',
        tag: 'mobiliado',
        icon: (
          <FurnitureIcon fill={iconFill} className={iconClassName} />
        ),
      },
      {
        label: 'Piscina',
        key: 'pool',
        tag: 'piscina',
        icon: <PoolIcon fill={iconFill} className={iconClassName} />,
      },
      {
        label: 'Garagem',
        key: 'garage',
        tag: 'garagem',
        icon: (
          <ParkingIcon
            fill={iconFill}
            viewBox="4 -12 40 70"
            width="24"
            height="48"
            className={iconClassName}
          />
        ),
      },
    ];
    return tagsShortcuts;
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
    function handleClick(event: MouseEvent) {
      if (ref && ref.current) {
        const myRef = ref.current;
        if (!myRef.contains(event.target as Node)) {
          setOpen(false);
        }
      }
    }
  });

  return (
    <>
      <div className="overflow-x-scroll overflow-y-hidden scroll-smooth md:overflow-hidden lg:overflow-hidden xl:overflow-hidden flex flex-row items-center justify-between max-w-full md:max-w-[750px] lg:max-w-[900px] lg:w-full h-[70px] bg-tertiary shadow-md mt-9 md:mt-8 lg:mt-12 mx-auto md:mx-2 lg:ml-8 lg:mx-[35px] rounded-[30px] px-2 gap-5">
        <div
          onClick={() => onMobileFilterIsOpenChange(true)}
          className={`flex lg:hidden flex-row items-center max-w-[153px] h-[44px] border border-quaternary rounded-[30px] p-3 lg:hover:bg-quaternary cursor-pointer ${isOpen ? 'bg-quaternary' : 'bg-tertiary'
            }`}
        >
          <div className="border rounded-[30px] bg-tertiary text-quaternary px-2 font-bold">
            1
          </div>
          <h3
            className={`font-bold text-lg leading-5 mx-4 ${isOpen ? 'text-tertiary' : 'text-quaternary'
              }`}
          >
            Filtros
          </h3>
        </div>

        {getTagsShortcuts().map((shortcut) => (
          <div
            key={shortcut.key}
            onClick={() => {
              query.tags?.includes(shortcut.tag)
                ? null
                : toggleSelection(query, router, shortcut.tag);
            }}
            className={`group flex flex-row items-center max-w-[153px] h-[40px] border ${query.tags?.includes(shortcut.tag)
              ? 'border-2 border-secondary'
              : 'border-quaternary'
              } rounded-[30px] p-3 bg-transparent hover:bg-quaternary cursor-pointer`}
          >
            <div
              onClick={() => toggleSelection(query, router, shortcut.tag)}
              className="flex flex-row items-center justify-between"
            >
              {query.tags?.includes(shortcut.tag) ? (
                <CloseIcon
                  width="24"
                  height="24"
                  fill="quaternary"
                  className={`group-hover:fill-tertiary ${query.tags?.includes(shortcut.tag)
                    ? 'fill-secondary'
                    : 'fill-quaternary'
                    }`}
                />
              ) : (
                <span>{shortcut.icon}</span>
              )}
              <h3
                className={`font-bold
                ${query.tags?.includes(shortcut.tag)
                    ? 'font-extrabold text-secondary'
                    : 'font-bold'
                  }
                text-quaternary text-md leading-5 group-hover:text-tertiary mx-4`}
              >
                {shortcut.label}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchShortcut;
