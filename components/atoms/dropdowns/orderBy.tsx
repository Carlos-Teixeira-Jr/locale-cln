const DropdownOrderBy: React.FC = () => {
  return (
    <div className="hidden md:flex absolute z-50 top-[290px] max-w-[210px] h-[200px] rounded-xl bg-tertiary overflow-hidden cursor-pointer shadow-md">
      <div className="flex flex-col text-center font-normal text-base text-quaternary leading-5">
        <span className="translate-x-[1px] w-[201px] h-[50px] rounded-t-xl hover:bg-quaternary hover:text-tertiary py-3">
          Maior Relevância
        </span>
        <span className="translate-x-[1px] w-[201px] h-[50px] hover:bg-quaternary hover:text-tertiary py-3">
          Maior Preço
        </span>
        <span className="translate-x-[1px] w-[201px] h-[50px] text-quaternary leading-5 hover:bg-quaternary hover:text-tertiary py-3">
          Menor Preço
        </span>
        <span className="translate-x-[1px] w-[201px] h-[50px] text-quaternary leading-5 rounded-b-xl hover:bg-quaternary hover:text-tertiary py-3">
          Mais Recentes
        </span>
      </div>
    </div>
  );
};

export default DropdownOrderBy;
