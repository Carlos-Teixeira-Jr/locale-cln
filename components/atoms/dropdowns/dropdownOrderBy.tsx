import { useRouter } from 'next/router';

const DropdownOrderBy: React.FC = () => {
  const router = useRouter();
  const query = router.query;

  // Insere nos parametros da url o tipo de ordenação escolhida;
  const handleSortTypeChange = (sortType: string) => {
    if (sortType === 'mostRecent') {
      const queryParams = { ...query, sort: 'mostRecent' };
      router.push({ query: queryParams });
    }
    if (sortType === 'lowestPrice') {
      const queryParams = { ...query, sort: 'lowestPrice' };
      router.push({ query: queryParams });
    }
    if (sortType === 'biggestPrice') {
      const queryParams = { ...query, sort: 'biggestPrice' };
      router.push({ query: queryParams });
    }
  };

  const dropdownOptions = [
    {
      key: 'relevance',
      name: 'maior relevância',
    },
    {
      key: 'biggestPrice',
      name: 'maior preço',
    },
    {
      key: 'lowestPrice',
      name: 'menor preço',
    },
    {
      key: 'mostRecent',
      name: 'mais recentes',
    },
  ];

  return (
    <div className="hidden md:flex absolute z-50 max-w-[180px] h-fit rounded-xl bg-tertiary overflow-hidden cursor-pointer shadow-md ml-2">
      <div className="flex flex-col text-left font-normal text-sm text-quaternary">
        {dropdownOptions.map((option) => (
          <h3
            key={option.key}
            className={`translate-x-[1px] w-[201px] h-fit hover:bg-quaternary hover:text-tertiary py-1 ${
              option.key === 'relevance'
                ? 'rounded-t-xl'
                : option.key === 'mostRecent'
                ? 'rounded-b-xl'
                : ''
            }`}
            onClick={() => handleSortTypeChange(option.key)}
          >
            <span className="px-3">{option.name}</span>
          </h3>
        ))}
      </div>
    </div>
  );
};

export default DropdownOrderBy;
