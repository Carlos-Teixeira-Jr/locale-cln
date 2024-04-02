type Btn = {
  className?: string,
  onClick?: () => void
}

const Button = ({
  className = "bg-primary rounded-full w-full h-12 md:h-fit lg:h-[34px] md:mt-9 lg:mt-8 float-right text-tertiary text-lg shadow-md hover:bg-red-600 hover:text-tertiary hover:shadow-lg transition-all duration-200 active:bg-primary-dark active:text-tertiary active:shadow-none focus:outline-none",
  onClick
}: Btn) => {
  return (
    <div className="w-full">
      <button className={className} onClick={onClick}>
        Buscar
      </button>
    </div>
  )
}

export default Button