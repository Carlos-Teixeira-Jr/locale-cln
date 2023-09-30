export default function DropdownFilterList() {
  return (
    <div className="hidden md:flex absolute z-50 top-[327px] md:w-[360px] h-[200px] rounded-[30px] bg-tertiary overflow-hidden cursor-pointer shadow-md">
      <div className="flex flex-col text-center font-normal text-base text-quaternary leading-5">
        <span className="translate-x-[1px] w-[360px] h-[50px] rounded-t-xl hover:bg-quaternary hover:text-tertiary py-3">
          Todos
        </span>
        <span className="translate-x-[1px] w-[360px] h-[50px] hover:bg-quaternary hover:text-tertiary py-3">
          Casa
        </span>
        <span className="translate-x-[1px] w-[360px] h-[50px] text-quaternary leading-5 hover:bg-quaternary hover:text-tertiary py-3">
          Apartamento
        </span>
        <span className="translate-x-[1px] w-[360px] h-[50px] text-quaternary leading-5 rounded-b-xl hover:bg-quaternary hover:text-tertiary py-3">
          Sala
        </span>
      </div>
    </div>
  );
}
