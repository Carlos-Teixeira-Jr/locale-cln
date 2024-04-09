import Loading from "../../atoms/loading"

type Btn = {
  className?: string,
  onClick?: () => void,
  isLoading: boolean
}

const Button = ({
  className = "bg-primary rounded-full w-full h-12 md:h-fit lg:h-[34px] md:mt-9 lg:mt-8 float-right text-tertiary text-lg shadow-md hover:bg-red-600 hover:text-tertiary hover:shadow-lg transition-all duration-200 active:bg-primary-dark active:text-tertiary active:shadow-none focus:outline-none",
  isLoading,
  onClick
}: Btn) => {
  return (
    <div className="w-full">
      <button className={className} onClick={onClick}>
        {isLoading ? (
          <span className={`flex justify-center transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
            <Loading />
          </span>
        ) : (
          <span>
            Buscar
          </span>
        )}
      </button>
    </div>
  )
}

export default Button