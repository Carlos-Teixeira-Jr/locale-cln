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
      name: 'Maior Relevância',
    },
    {
      key: 'biggestPrice',
      name: 'Maior Preço',
    },
    {
      key: 'lowestPrice',
      name: 'Menor Preço',
    },
    {
      key: 'mostRecent',
      name: 'Mais Recentes',
    },
  ];

  return (
    <div className="hidden md:flex absolute z-50 top-[253px] max-w-[210px] h-[200px] rounded-xl bg-tertiary overflow-hidden cursor-pointer shadow-md">
      <div className="flex flex-col text-center font-normal text-base text-quaternary leading-5">
        {dropdownOptions.map((option) => (
          <span
            key={option.key}
            className={`translate-x-[1px] w-[201px] h-[50px] hover:bg-quaternary hover:text-tertiary py-3 ${
              option.key === 'relevance'
                ? 'rounded-t-xl'
                : option.key === 'mostRecent'
                ? 'rounded-b-xl'
                : ''
            }`}
            onClick={() => handleSortTypeChange(option.key)}
          >
            {option.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DropdownOrderBy;
