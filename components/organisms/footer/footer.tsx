import Link from 'next/link';
import { useEffect, useState } from 'react';
import useDeviceSize from '../../../hooks/deviceSize';
import EmailIcon from '../../atoms/icons/emailIcon';
import InstragramIcon from '../../atoms/icons/instagramIcon';
import XSocialMediaIcon from '../../atoms/icons/xSoacialMediaIcon';

const Footer = () => {
  const [width, height] = useDeviceSize();
  const [mobile, setMobile] = useState(false);
  const [notebook, setNotebook] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [table, setTablet] = useState(false);

  useEffect(() => {
    if (height > 900) {
      setDesktop(!desktop);
    } else if (height < 500) {
      setMobile(!mobile);
    } else if (height < 700 && height > 500) {
      setNotebook(!notebook);
    }
  }, [height]);

  const footerPositionCSS = `bg-tertiary bottom-0 w-full ${desktop
    ? 'mt-44'
    : mobile
      ? 'mt-36'
      : notebook
        ? 'mt-36'
        : 'mt-36'
    }`;

  return (
    <footer className={footerPositionCSS}>
      <div className="container pt-3 m-auto bg-tertiary max-w-none">
        <div className="grid lg:grid-cols-4 md:grid-cols-2">
          <div className="mx-auto pb-2">
            <h5 className="font-bold mb-1 text-gray-800 text-md">
              ENCONTRE IMÓVEIS
            </h5>

            <ul className="list-none mb-0 text-center">
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <Link
                  href="/search?adType=comprar"
                  className="text-gray-800 text-md"
                  tabIndex={0}
                >
                  Venda
                </Link>
              </li>
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <Link
                  href="/search?adType=alugar"
                  className="text-gray-800 text-md"
                >
                  Aluguel
                </Link>
              </li>
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <Link
                  href="/search?adType=alugar"
                  className="text-gray-800 text-md"
                >
                  Encontre imóveis
                </Link>
              </li>
            </ul>
          </div>

          <div className="mx-auto pb-2">
            <h5 className="font-bold mb-1 text-gray-800 text-md">
              ANUNCIE IMÓVEIS
            </h5>

            <ul className="list-none mb-0 text-center">
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <Link href="/announcement#plans" className="text-gray-800 text-md">
                  Locale PRO
                </Link>
              </li>
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <Link href="/announcement#plans" className="text-gray-800 text-md">
                  Planos de anúncio
                </Link>
              </li>
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <Link href="/announcement#plans" className="text-gray-800 text-md">
                  Venda seu imóvel
                </Link>
              </li>
            </ul>
          </div>

          <div className="mx-auto pb-2">
            <h5 className="uppercase font-bold mb-1 text-gray-800 text-md">
              INSTITUCIONAL
            </h5>

            <ul className="list-none mb-0 text-center">
              <li className="transition duration-300 ease-in-out transform hover:scale-125">
                <a
                  href="https://www.linkedin.com/company/locale-im%C3%B3veis/"
                  className="text-gray-800 text-md"
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
                  href="https://www.instagram.com/locale.imoveis.oficial/"
                  target="blank"
                  className="text-gray-800"
                >
                  <InstragramIcon />
                </Link>
              </li>
              <li>
                <a
                  href="https://x.com/locale_oficial"
                  target="blank"
                  className="text-gray-800"
                >
                  <XSocialMediaIcon />
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
