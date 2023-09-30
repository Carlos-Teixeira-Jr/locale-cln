import { useEffect, useRef, useState } from 'react';
import FurnitureIcon from '../../atoms/icons/furnitureIcon';
import PetsIcon from '../../atoms/icons/petsIcon';
import PoolIcon from '../../atoms/icons/poolIcon';
import ParkingIcon from '../../atoms/icons/parkingIcon';
import CloseIcon from '../../atoms/icons/closeIcon';
import { useRouter } from 'next/router';

export interface ISearchShortcut {
  onMobileFilterIsOpenChange: (isOpen: boolean) => void;
}

const SearchShortcut: React.FC<ISearchShortcut> = ({
  onMobileFilterIsOpenChange
}) => {

  const router = useRouter();
  const query = router.query;

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Pega as tags que vieram da query na passagem da Home para a Search usando os cards de acesso rápido;
  useEffect(() => {
    if (query.tags === 'aceita pets' && !selectedTags.includes('aceita pets')) {
      setSelectedTags(['aceita pets']);
    } else if (query.tags === 'mobiliado' && !selectedTags.includes('mobiliado')) {
      setSelectedTags(['mobiliado']);
    }
  }, [query.tags]);

  const getTagsShortcuts = () => {
    const tagsShortcuts = [
      {
        label: 'Pets',
        key: 'pets',
        tag: 'aceita pets',
        icon: <PetsIcon 
          fill='#6B7280'
          className='group-hover:fill-tertiary'
        />
      },
      {
        label: 'Mobiliado',
        key: 'furnished',
        tag: 'mobiliado',
        icon: <FurnitureIcon
          fill='#6B7280'
          className='group-hover:fill-tertiary'
        />
      },
      {
        label: 'Piscina',
        key: 'pool',
        tag: 'piscina',
        icon: <PoolIcon
          fill='#6B7280'
          className='group-hover:fill-tertiary'
        />
      },
      {
        label: 'Garagem',
        key: 'garage',
        tag: 'garagem',
        icon: <ParkingIcon
          fill='#6B7280'
          viewBox='4 -12 40 70'
          width='24'
          height='48'
          className='group-hover:fill-tertiary'
        />
      },
    ]
    return tagsShortcuts
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

  // Insere e remove as tags clicadas nos parâmetros da URL;
  const toggleSelection = (item: string) => {
    const tags: string[] = Array.isArray(query.tags) ? query.tags : query.tags ? query.tags.split(',') : [];
  
    let updatedTags: string[];
  
    if (tags.includes(item)) {
      updatedTags = tags.filter((tag) => tag !== item);
    } else {
      updatedTags = [...tags, item];
    }
  
    const updatedQueryTags = updatedTags.join(',');
  
    if (updatedQueryTags) {
      router.push({
        pathname: router.pathname,
        query: { ...query, tags: updatedQueryTags },
      });
    } else {
      const { tags, ...updatedQuery } = query;
      // Faz com que o parametro page volte a ser 1 quando o parametro tags é removido da url;
      updatedQuery.page = "1";
      router.push({
        pathname: router.pathname,
        query: updatedQuery,
      });
    }
  };

  return (
    <>
      <div className="overflow-x-scroll overflow-y-hidden scroll-smooth overflow-hidden md:overflow-hidden flex flex-row items-center max-w-[350px] md:max-w-[870px] h-[77px] bg-tertiary shadow-md mt-9 md:mt-12 mx-auto md:mx-2 lg:ml-8 rounded-[30px] px-2 gap-5">
        {/* Filter button */}
        <div
          onClick={() => onMobileFilterIsOpenChange(true)}
          className={`flex md:hidden flex-row items-center max-w-[153px] h-[44px] border border-quaternary rounded-[30px] p-3 lg:hover:bg-quaternary cursor-pointer ${
            isOpen ? 'bg-quaternary' : 'bg-tertiary'
          }`}
        >
          <div className="border rounded-[30px] bg-tertiary text-quaternary px-2 font-bold">
            1
          </div>
          <h3
            className={`font-bold text-lg leading-5 mx-4 ${
              isOpen ? 'text-tertiary' : 'text-quaternary'
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
              : toggleSelection(shortcut.tag)
            } }
            className={`group flex flex-row items-center max-w-[153px] h-[44px] border ${
              query.tags?.includes(shortcut.tag)
                ? 'border-2 border-secondary'
                : 'border-quaternary'
            } rounded-[30px] p-3 bg-transparent hover:bg-quaternary cursor-pointer`}
          >
            <span 
              onClick={() => toggleSelection(shortcut.tag)}
            >
              {query.tags?.includes(shortcut.tag) ? (
                <CloseIcon
                  width="24"
                  height="24"
                  fill="quaternary"
                  className={`group-hover:fill-tertiary ${
                    query.tags?.includes(shortcut.tag)
                      ? 'fill-secondary'
                      : 'fill-quaternary'
                  }`}
                />
              ) : (
                <span>
                  {shortcut.icon}
                </span>
              )}
            </span>
            <h3
              className={`font-bold
                ${query.tags?.includes(shortcut.tag) ? 'font-extrabold text-secondary' : 'font-bold'}
                text-quaternary text-lg leading-5 group-hover:text-tertiary mx-4`
              }
            >
              {shortcut.label}
            </h3>
          </div>
        ))}
      </div> 
    </>
  );
};

export default SearchShortcut;