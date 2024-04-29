import Image from "next/image";

export interface IMiniPropertyCards {
  key: string,
  _id: string,
  src: string,
  streetName: string,
  neighborhood: string,
  city: string,
  price: string,
  isSelected: boolean;
  setSelectedCard: (card: string) => void
}

const MiniPropertyCards = ({
  key,
  _id,
  src,
  neighborhood,
  streetName,
  city,
  price,
  isSelected,
  setSelectedCard
}: IMiniPropertyCards) => {

  return (
    <div
      key={_id}
      className={`md:max-w-[112px] w-36 lg:w-28 rounded-3xl flex flex-col hover:shadow-2xl transition-shadow ease-in-out duration-200 cursor-pointer my-5 ${isSelected ? 'shadow-2xl border-2 border-secondary opacity-100' : 'shadow-md opacity-50'}`}
      onClick={() => {
        setSelectedCard(_id);
      }}
    >
      <Image
        src={src}
        alt={"Property card"}
        width={80}
        height={80}
        className="md:max-w-28 w-36 md:w-28 h-28 rounded-t-3xl max-h-24 object-cover"
      />

      <div className="text-xs text-quaternary px-2 pb-3 flex flex-col justify-between">
        <h1 className="text-sm font-semibold">{streetName}</h1>
        <p>{neighborhood}</p>
        <p>{city}</p>
        <p>R$ {price}</p>
      </div>
    </div>
  )
}

export default MiniPropertyCards