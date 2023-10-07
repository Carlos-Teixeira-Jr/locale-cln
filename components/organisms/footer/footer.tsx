import Link from 'next/link';
import EmailIcon from '../../atoms/icons/emailIcon';
import InstragramIcon from '../../atoms/icons/instagramIcon';
import TwitterIcon from '../../atoms/icons/twitterIcon';

interface IFooter {
  smallPage: boolean;
}

const Footer = ({ smallPage }: IFooter) => {
  return (
    <footer
      className={` bg-tertiary block ${
        smallPage ? 'w-full absolute mt-20' : 'w-full relative bottom-0 mt-5'
      }`}
    >
      <div className="container p-6 m-auto bg-tertiary max-w-none">
        <div className="grid lg:grid-cols-4 md:grid-cols-2">
          <div className="mx-auto pb-5">
            <h5 className="font-bold mb-2.5 text-gray-800">ENCONTRE IMÓVEIS</h5>

            <ul className="list-none mb-0 text-center">
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <a href="#!" className="text-gray-800" tabIndex={0}>
                  Venda
                </a>
              </li>
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <a href="#!" className="text-gray-800">
                  Aluguel
                </a>
              </li>
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <a href="#!" className="text-gray-800">
                  Encontre imóveis
                </a>
              </li>
            </ul>
          </div>

          <div className="mx-auto pb-5">
            <h5 className="font-bold mb-2.5 text-gray-800">ANUNCIE IMÓVEIS</h5>

            <ul className="list-none mb-0 text-center">
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <a href="#!" className="text-gray-800">
                  Locale PRO
                </a>
              </li>
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <a href="#!" className="text-gray-800">
                  Planos de anúncio
                </a>
              </li>
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <a href="#!" className="text-gray-800">
                  Venda seu imóvel
                </a>
              </li>
            </ul>
          </div>

          <div className="mx-auto pb-5">
            <h5 className="uppercase font-bold mb-2.5 text-gray-800">
              INSTITUCIONAL
            </h5>

            <ul className="list-none mb-0 text-center">
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <a
                  href="https://www.linkedin.com/company/locale-im%C3%B3veis/"
                  className="text-gray-800"
                  target="_blank"
                  rel="noreferrer"
                >
                  trabalhe conosco
                </a>
              </li>
            </ul>
          </div>

          <div className="mx-auto">
            <h5 className="uppercase font-bold mb-2.5 text-gray-800">
              CONTATO
            </h5>

            <ul className="list-none mb-0">
              <li>
                <Link href="" target="blank" className="text-gray-800">
                  <InstragramIcon />
                </Link>
              </li>
              <li>
                <a
                  href="https://twitter.com/locale_imoveis"
                  target="blank"
                  className="text-gray-800"
                >
                  <TwitterIcon />
                </a>
              </li>
              <li>
                <Link
                  href="/send-email-to-locale"
                  target="blank"
                  className="text-gray-800"
                >
                  <EmailIcon />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-gray-700 text-center p-4 bg-secondary">
        © 2023 Locale Imóveis
      </div>
    </footer>
  );
};

export default Footer;
