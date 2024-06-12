
interface IWelcomeAdmin {
  userName: string
}

const WelcomeAdmin = ({ userName }: IWelcomeAdmin) => {

  return (
    <section className="text-quaternary flex flex-col w-full justify-center mb-2">
      <header>
        <h1 className="text-3xl font-bold text-center">Área Administrativa!</h1>
      </header>
      {userName && (
        <p className="text-xl text-center font-semibold text-primary">Olá, {userName}! É bom ver você de volta.</p>
      )}
    </section>
  )
}

export default WelcomeAdmin