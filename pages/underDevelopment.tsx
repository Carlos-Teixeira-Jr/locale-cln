import Image from "next/image"
import Link from "next/link"
import FacebookIcon from "../components/atoms/icons/facebookIcon"
import InstragramIcon from "../components/atoms/icons/instagramIcon"
import XSocialMediaIcon from "../components/atoms/icons/xSocialMediaIcon"

const UnderDevelopmentPage = () => {
  return (
    <main className="flex flex-col gap-5 justify-center items-center min-h-screen">
      <Image
        src={"/images/Logo_Locale_HD.png"}
        alt={"Logo do Site"}
        width={300}
        height={300}
      />

      <h1 className="text-3xl md:text-2xl font-bold text-quaternary p-5 text-center">Estamos Construindo Algo Novo Para Você!</h1>
      <div className="flex flex-col gap-3 justify-center items-center px-5">
        <p className="md:text-xl text-lg font-semibold text-quaternary text-center">Nosso site está em desenvolvimento e estará disponível em breve. Fique atento!</p>
        <p className="md:text-xl text-lg font-semibold text-quaternary text-center">Estamos trabalhando arduamente para lançar uma plataforma que vai renovar a busca e anúncio de imóveis.</p>
      </div>

      <div className="flex justify-between gap-8 md:gap-5">
        <Link href={"https://facebook.com//profile.php?id=61559753950029"} legacyBehavior>
          <a target="_blank">
            <FacebookIcon fill="#F75D5F" className="w-11 h-11 transform hover:scale-110 transition-transform duration-300" />
          </a>
        </Link>
        <Link href={"https://twitter.com/locale_oficial"} legacyBehavior>
          <a target="_blank">
            <XSocialMediaIcon fill="#F75D5F" className="w-12 h-12 transform hover:scale-110 transition-transform duration-300" />
          </a>
        </Link>
        <Link href={"https://instagram.com/locale.imoveis.oficial"} legacyBehavior>
          <a target="_blank">
            <InstragramIcon fill="#F75D5F" className="w-10 h-10 mt-2 transform hover:scale-110 transition-transform duration-300" />
          </a>
        </Link>
        {/* <Link href={"https://linkedin.com/"}></Link> */}
      </div>
    </main>
  )
}

export default UnderDevelopmentPage