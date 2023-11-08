import UserIcon from "../../../atoms/icons/userIcon"

interface IMessageInfoCard {
  name: string
}


const MessageInfoCard = ({
  name
}: IMessageInfoCard) => {
  return (
    <div className="w-full border border-quaternary text-quaternary">
      <div className="flex">
        <UserIcon
          fill="#6B7280"
        />
        <h1 className="font-bold text-xl my-auto">{name}</h1>
      </div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default MessageInfoCard