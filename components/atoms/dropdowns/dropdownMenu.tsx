import Link from 'next/link';

export default function DropdownMenu() {
  return (
    <div className="flex flex-col md:hidden absolute w-36 h-[110px] z-10 top-[82px] right-7 md:right-[48px] overflow-hidden mt-2. bg-tertiary items-center rounded-b-[10px] shadow-md">
      <div className="flex flex-col text-center font-semibold text-lg text-quaternary leading-4">
        <Link
          href={'/search'}
          className="cursor-pointer translate-x-1 w-[152px] h-[36px] hover:bg-quaternary hover:text-tertiary py-2"
        >
          <p>Comprar</p>
        </Link>
        <Link
          href={'/search'}
          className="cursor-pointer translate-x-1 w-[156px] h-[36px] hover:bg-quaternary hover:text-tertiary py-3"
        >
          <p>Alugar</p>
        </Link>
        <Link
          href={'/'}
          className="cursor-pointer translate-x-1 w-[156px] h-[40px] hover:bg-quaternary hover:text-tertiary py-3"
        >
          <p>Anunciar</p>
        </Link>
      </div>
    </div>
  );
}
