import Link from 'next/link';
import { useEffect, useState } from 'react';
import useDeviceSize from '../../../hooks/deviceSize';
import { useIsMobile } from '../../../hooks/useIsMobile';
import EmailIcon from '../../atoms/icons/emailIcon';
import InstragramIcon from '../../atoms/icons/instagramIcon';
import TwitterIcon from '../../atoms/icons/twitterIcon';

interface IFooter {
  smallPage?: boolean;
}

const Footer = ({ smallPage }: IFooter) => {
  const [width, height] = useDeviceSize();
  const [mobile, setMobile] = useState(false);
  const [notebook, setNotebook] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (height > 900) {
      setDesktop(!desktop);
    } else if (height < 500) {
      setMobile(!mobile);
    } else if (height < 700 && height > 500) {
      setNotebook(!notebook);
    }
  }, [height]);

  const footerPositionCSS = `bg-tertiary block w-full ${
    desktop
      ? 'fixed bottom-0 mt-5'
      : mobile
      ? 'absolute mt-36'
      : notebook
      ? 'absolute mt-36'
      : 'absolute mt-36'
  }`;

  return (
    <footer className={footerPositionCSS}>
      <div className="container p-6 m-auto bg-tertiary max-w-none">
        <div className="grid lg:grid-cols-4 md:grid-cols-2">
          <div className="mx-auto pb-5">
            <h5 className="font-bold mb-2.5 text-gray-800">ENCONTRE IMÓVEIS</h5>

            <ul className="list-none mb-0 text-center">
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <Link
                  href="/search?adType=comprar"
                  className="text-gray-800"
                  tabIndex={0}
                >
                  Venda
                </Link>
              </li>
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <Link href="/search?adType=alugar" className="text-gray-800">
                  Aluguel
                </Link>
              </li>
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <Link href="/search?adType=alugar" className="text-gray-800">
                  Encontre imóveis
                </Link>
              </li>
            </ul>
          </div>

          <div className="mx-auto pb-5">
            <h5 className="font-bold mb-2.5 text-gray-800">ANUNCIE IMÓVEIS</h5>

            <ul className="list-none mb-0 text-center">
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <Link href="/announcement" className="text-gray-800">
                  Locale PRO
                </Link>
              </li>
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <Link href="/announcement" className="text-gray-800">
                  Planos de anúncio
                </Link>
              </li>
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <Link href="/announcement" className="text-gray-800">
                  Venda seu imóvel
                </Link>
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
                <Link
                  href="https://www.instagram.com/locale_imoveis/"
                  target="blank"
                  className="text-gray-800"
                >
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
