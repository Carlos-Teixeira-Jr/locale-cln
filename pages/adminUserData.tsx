import { useRouter } from 'next/router';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ChangeEvent, useEffect, useState } from 'react';
import Cards, { Focused } from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import Modal from 'react-modal';
import MaskedInput from '../components/atoms/masks/maskedInput';
import ErrorOnUpdateModal from '../components/atoms/modals/errorOnUpdateModal';
import SuccessOnUpdateModal from '../components/atoms/modals/successOnUpdateModal';
import PlansCardsHidden from '../components/molecules/cards/plansCards/plansCardHidden';
import AdminHeader from '../components/organisms/adminHeader/adminHeader';
import SideMenu from '../components/organisms/sideMenu/sideMenu';
import { NextPageWithLayout } from './page';
import { getSession } from 'next-auth/react';
import { destroyCookie } from 'nookies';
Modal.setAppElement('#__next');

interface IAdminUserDataPageProps {
  selectedPlanCard: string;
  setSelectedPlanCard: (selectedCard: string) => void;
  plans: any;
  ownerProperties: any
}

interface ViaCepData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero: string;
}

const AdminUserDataPage: NextPageWithLayout<IAdminUserDataPageProps> = ({
  selectedPlanCard,
  plans,
  ownerProperties
}) => {
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState('');
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);
  const [succesModalIsOpen, setSuccesModalIsOpen] = useState(false);
  const [isAdminPage, setIsAdminPage] = useState(false);
  //A constante de estado abaixo serve para mockar a situação em que ocorre um erro na submissão do formulário e que determina qual dos dois modais serão abertos após a tentativa de submeter;
  const [errorOnSubmitForm, setErrorOnSubmitForm] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const setSelectedPlanCard = (selectedCard: string) => {
    setSelectedPlan(selectedCard);
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    cellPhone: '',
    phone: '',
    plan: '',
  });

  const [cvc, setCvc] = useState('');
  const [expiry, setExpiry] = useState('');
  const [focus, setFocus] = useState<Focused | undefined>();
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const [cep, setCep] = useState('');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [complement, setComplement] = useState('');

  const reversedCards = [...plans].reverse();

  const [viaCepData, setViaCepData] = useState<ViaCepData>({
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    numero: '',
  });

  const [isOwner, setIsOwner] = useState(false);  

  useEffect(() => {
    setIsOwner(ownerProperties.docs?.length > 0 ? true : false)
  }, [ownerProperties])

  const handleInputFocus = (e: any) => {
    setFocus(e.target.name as Focused);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const unmaskedCardNumber = value.replace(/\./g, '');

    switch (name) {
      case 'cardNumber':
        setCardNumber(unmaskedCardNumber);
        break;
      case 'expiry':
        setExpiry(value);
        break;
      case 'cvc':
        setCvc(value);
        break;
      case 'cardName':
        setCardName(value.replace(/\d/g, ''));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // atualiza o estado "focus" sempre que algum dos inputs é alterado
    setFocus(focus);
  }, [cvc, expiry, cardName, cardNumber]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const maskedValue = value.replace(/\d/g, '');
    setFormData({ ...formData, name: maskedValue });
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData({ ...formData, email: value });
  };

  const handleCpfChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData({ ...formData, cpf: value });
  };

  const handleCellPhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData({ ...formData, cellPhone: value });
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData({ ...formData, phone: value });
  };

  useEffect(() => {
    if (selectedPlan === 'Free') {
      setFormData({ ...formData, plan: 'free' });
    } else if (selectedPlan === 'Básico') {
      setFormData({ ...formData, plan: 'basico' });
    } else if (selectedPlan === 'Locale Plus') {
      setFormData({ ...formData, plan: 'plus' });
    } else {
      setFormData({ ...formData, plan: '' });
    }
  }, [selectedPlan]);

  const handleCepChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cep = event.target.value;
    const formattedCep = cep.replace(/-/g, '');
    setCep(formattedCep);
  };

  const handleCepBlur = () => {
    if (cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.erro) {
            setViaCepData(data);
          } else {
            alert('CEP não encontrado.');
          }
        })
        .catch((error) => console.error(error));
    } else {
      alert('Formato de CEP inválido.');
    }
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const city = event.target.value;
    const formattedCity = city.replace(/-/g, '');
    const cityMask = formattedCity.replace(/\d/g, '');
    setCity(cityMask);
  };

  const handleUFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uf = event.target.value;
    const formattedUF = uf.replace(/-/g, '');
    setUf(formattedUF);
  };

  const handleStreetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const street = event.target.value;
    const formattedStreet = street.replace(/-/g, '');
    setStreet(formattedStreet);
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const number = event.target.value;
    const formattedNumber = number.replace(/-/g, '');
    const numberMask = formattedNumber.replace(/\D/g, '');
    setNumber(numberMask);
  };

  const handleDistrictChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const district = event.target.value;
    const formattedDistrict = district.replace(/-/g, '');
    setDistrict(formattedDistrict);
  };

  const handleComplementChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const complement = event.target.value;
    const formattedComplement = complement.replace(/-/g, '');
    setComplement(formattedComplement);
  };

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const url = router.pathname;

    if (url === '/adminUserData') {
      setIsAdminPage(true);
    }
  }, [router.pathname]);

  const handleUpdateBtn = async () => {
    const submitFormData = {
      cep: cep,
      uf: viaCepData.uf ? viaCepData.uf : uf,
      number: number,
      city: viaCepData.localidade ? viaCepData.localidade : city,
      street: viaCepData.logradouro ? viaCepData.logradouro : street,
      district: viaCepData.bairro ? viaCepData.bairro : district,
      name: formData.name,
      email: formData.email,
      cpf: formData.cpf,
      cellPhone: formData.cellPhone,
      phone: formData.phone,
      plan: formData.plan,
      cvc: cvc,
      expiry: expiry,
      cardName: cardName,
      cardNumber: cardNumber,
    };

    const updatedValuesFormData = Object.fromEntries(
      Object.entries(submitFormData).filter(([key, value]) => value !== '')
    );

    //TESTE DO MODAL EM CASO DE ERRO NO ENVIO DO FORMULÁRIO
    if (errorOnSubmitForm) {
      setErrorModalIsOpen(true);
    } else {
      setSuccesModalIsOpen(true);
    }
  };

  return (
    <div className="max-w-[412px] md:max-w-[912px] lg:max-w-[1024px] xl:max-w-[1536px] mx-auto">
      <div className="fixed z-50 top-0 w-full inset-x-0">
        <AdminHeader/>
      </div>

      <div className="flex flex-row items-center justify-center w-full xl:justify-center">
        {!isMobile && (
          <div className="fixed left-0 top-20 sm:hidden hidden md:hidden lg:flex">
            <SideMenu 
              isMobileProp={false} 
              isOwnerProp={isOwner}
            />
          </div>
        )}

        {/* TIVE QUE JOGAR O CÓDIGO NA PÁGINA PQ O COMPONENTE QUE CONTÉM O MESMO FORMULÁRIO TAMBÉM TEM CAMPOS QUE NÃO SERÃO USADOS NESSA PÁGINA // TALVEZ SEJA O CASO DE CRIAR UM COMPONENTE INDIVIDUAL APENAS PARA OS CAMPOS DE DADOS PESSOAIS E CHAMAR ELE TANTO AQUI QUANTO NA OUTRA PÁGINA */}
        <div className="flex flex-col mt-16 lg:ml-80 lg:w-[900px] w-full mx-5">
          <div className="my-10 lg:mx-10 md:mx-2 w-full">
            <h1 className="md:text-3xl text-2xl leading-10 text-quaternary font-bold mb-10">
              Dados Pessoais
            </h1>
            <div className="my-5">
              <div className="my-5 w-full">
                <h3 className="text-xl font-normal text-quaternary leading-7">
                  Nome Completo
                </h3>
                <input
                  className="border w-[90%] p-5 h-12 my-5 border-quaternary rounded-[10px] bg-tertiary font-bold text-2xl text-quaternary leading-7 drop-shadow-xl flex"
                  onChange={handleNameChange}
                  value={formData.name}
                  required
                />
              </div>
              <div className="my-5 mx-a lg:flex w-full">
                <div className=" w-full">
                  <h3 className="text-xl font-normal text-quaternary leading-7">
                    E-mail
                  </h3>
                  <input
                    className="border p-5 w-full h-12 my-5 border-quaternary rounded-[10px] bg-tertiary font-bold text-2xl text-quaternary leading-7 drop-shadow-xl flex"
                    onChange={handleEmailChange}
                    type="e-mail"
                    required
                  />
                </div>
                <div className="lg:ml-5 w-full">
                  <h3 className="text-xl font-normal text-quaternary leading-7">
                    CPF
                  </h3>
                  <MaskedInput
                    className="border p-5 h-12 w-fit my-5 border-quaternary rounded-[10px] bg-tertiary font-bold text-2xl text-quaternary leading-7 drop-shadow-xl"
                    onChange={handleCpfChange}
                    required
                    mask={'cpf'}
                  />
                </div>
              </div>
              <div className="my-5 lg:flex justify-between w-[90%]">
                <div className="flex flex-col w-full">
                  <h3 className="text-xl font-normal text-quaternary leading-7">
                    Celular
                  </h3>
                  <MaskedInput
                    className="border p-5 h-12 lg:w-full my-5 border-quaternary rounded-[10px] bg-tertiary font-bold text-2xl text-quaternary leading-7 drop-shadow-xl"
                    onChange={handleCellPhoneChange}
                    required
                    mask={'cellPhone'}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <h3 className="text-xl font-normal text-quaternary leading-7">
                    Telefone
                  </h3>
                  <MaskedInput
                    className="border p-5 h-12 lg:w-full my-5 border-quaternary rounded-[10px] bg-tertiary font-bold text-2xl text-quaternary leading-7 drop-shadow-xl lg:ml-5"
                    onChange={handlePhoneChange}
                    mask={'phone'}
                  />
                </div>
              </div>
              <h2 className="md:text-3xl text-2xl leading-10 text-quaternary font-bold mb-10">
                Dados de Cobrança
              </h2>

              <div className="absolute z-40 inset-x-1 xl:inset-x-auto flex gap-8">
                {reversedCards.map(
                  ({
                    _id,
                    name,
                    price,
                    highlightAd,
                    commonAd,
                    smartAd,
                    description,
                  }: any) => (
                    <>
                      <PlansCardsHidden
                        selectedPlanCard={selectedPlan}
                        setSelectedPlanCard={(selectedCard: string) =>
                          setSelectedPlanCard(selectedCard)
                        }
                        isAdminPage={isAdminPage}
                        key={_id}
                        name={name}
                        price={price}
                        commonAd={commonAd}
                        highlightAd={highlightAd}
                        smartAd={smartAd}
                        id={_id}
                      />
                    </>
                  )
                )}
              </div>

              <div className="lg:mt-[350px] md:mt-[350px] mt-[920px]">
                <h2 className="md:text-4xl text-2xl leading-10 text-quaternary font-bold mb-10 mx-1 md:mx-0 mt-16">
                  Endereço de Cobrança
                </h2>
                <div className="lg:ml-5 mx-1 md:mx-2">
                  <form>
                    <div className="my-10">
                      <h3 className="md:text-[32px] text-3xl text-quaternary font-semibold  leading-9 my-5">
                        Endereço do Imóvel
                      </h3>
                      <label className="text-xl font-normal text-quaternary leading-7">
                        CEP
                      </label>
                      <div className="lg:flex grid grid-flow-row">
                        <div>
                          <MaskedInput
                            mask={'cep'}
                            className="border border-quaternary rounded-[10px] h-12 sm:w-1/3 md:w-full text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                            type="cep"
                            value={cep}
                            onChange={handleCepChange}
                            onBlur={handleCepBlur}
                            maxLength={8}
                            required
                          />
                        </div>
                        <a
                          href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                          target="_blank"
                          className="text-secondary text-[24px] font-normal lg:mt-8 md:mx-2 lg:ml-5 leading-8 mt-5 cursor-pointer"
                          rel="noreferrer"
                        >
                          Não sei meu CEP
                        </a>
                      </div>
                    </div>
                    <div className="md:flex w-[90%]">
                      <div className="lg:flex flex-col md:mr-5 md:w-full">
                        <label className="text-[24px]  text-quaternary leading-7 font-bold">
                          Cidade
                        </label>
                        <input
                          className="border border-quaternary rounded-[10px] w-full h-12 text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                          value={
                            viaCepData.localidade ? viaCepData.localidade : city
                          }
                          onChange={handleCityChange}
                          required
                        />
                      </div>
                      <div className="flex flex-col md:ml-5 mt-5 md:mt-0 md:w-1/4">
                        <label className="text-[24px]  font-bold text-quaternary leading-7">
                          UF
                        </label>
                        <MaskedInput
                          required
                          className="border border-quaternary rounded-[10px] md:w-full w-[150px] h-12 text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                          value={viaCepData.uf ? viaCepData.uf : uf}
                          onChange={handleUFChange}
                          mask={'uf'}
                        />
                      </div>
                    </div>
                    <div className="md:flex mt-10 w-[90%]">
                      <div className="md:flex flex-col md:mr-5 md:w-4/5">
                        <label className="text-[24px]  font-bold text-quaternary leading-7">
                          Logradouro
                        </label>
                        <input
                          required
                          className="border border-quaternary rounded-[10px] w-full h-12 text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                          value={
                            viaCepData.logradouro
                              ? viaCepData.logradouro
                              : street
                          }
                          onChange={handleStreetChange}
                        />
                      </div>
                      <div className="flex flex-col md:ml-5 md:w-1/5">
                        <label className="text-[24px]  font-bold text-quaternary leading-7 mt-5 md:mt-0">
                          Número
                        </label>
                        <input
                          required
                          className="border border-quaternary rounded-[10px] md:w-full w-[150px] h-12 text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                          value={viaCepData.numero ? viaCepData.numero : number}
                          onChange={handleNumberChange}
                        />
                      </div>
                    </div>
                    <div className="lg:flex mt-10 mb-10 w-[90%]">
                      <div className="flex flex-col md:mr-5 w-full">
                        <label className="text-[24px]  font-bold text-quaternary leading-7">
                          Complemento
                        </label>
                        <input
                          className="border border-quaternary rounded-[10px] h-12 text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                          onChange={handleComplementChange}
                          value={complement}
                        />
                      </div>
                      <div className="flex flex-col lg:ml-5 w-full mt-5 lg:mt-0">
                        <label className="text-[24px]  font-bold text-quaternary leading-7">
                          Bairro
                        </label>
                        <input
                          className="border border-quaternary rounded-[10px] h-12 text-quaternary md:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5"
                          value={
                            viaCepData.bairro ? viaCepData.bairro : district
                          }
                          onChange={handleDistrictChange}
                          required
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className='w-[90%]'>
              <h2 className="md:text-4xl text-2xl leading-10 text-quaternary font-bold mb-10 mt-16 w-full">
                Formas de Pagamento
              </h2>

              <div className="lg:flex">
                <div className="my-auto">
                  <Cards
                    cvc={cvc}
                    expiry={expiry}
                    focused={focus}
                    name={cardName}
                    number={cardNumber}
                  />
                </div>

                <form className="flex flex-col w-full">
                  <div className="flex flex-col lg:mx-0 w-full mx-auto">
                    <MaskedInput
                      type="tel"
                      name="cardNumber"
                      placeholder="Número do Cartão"
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      className={`border border-quaternary rounded-[10px] h-12 text-quaternary lg:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5 lg:ml-5 w-full mr-1`}
                      required
                      mask={'cardNumber'}
                    />
                  </div>

                  <div className="flex flex-col lg:mx-0 w-full mx-auto">
                    <input
                      type="tel"
                      name="cardName"
                      placeholder="Nome do Cartão"
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      value={cardName}
                      className={`border border-quaternary rounded-[10px] h-12 text-quaternary lg:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5 lg:ml-5 lg:w-full`}
                      required
                    />
                  </div>

                  <div className=" lg:mx-0 w-full mx-auto">
                    <div className="flex flex-col">
                      <MaskedInput
                        type="tel"
                        name="expiry"
                        placeholder="Válido até..."
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        className={`border border-quaternary rounded-[10px] h-12 w-full text-quaternary lg:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5 lg:ml-5`}
                        required
                        mask={'expiryDate'}
                      />
                    </div>

                    <div className="flex flex-col">
                      <MaskedInput
                        type="tel"
                        name="cvc"
                        placeholder="Código de verificação"
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        className={`border border-quaternary rounded-[10px] h-12 text-quaternary lg:text-[26px] text-xl font-bold px-5 drop-shadow-lg bg-tertiary mt-5 lg:ml-5 w-full`}
                        required
                        mask={'cvc'}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="my-20 lg:float-right flex justify-center w-[90%]">
              <button
                className="bg-primary w-fit h-16 item text-quinary rounded-[10px] py-5 px-20 gap-3 text-2xl font-extrabold leading-10"
                onClick={handleUpdateBtn}
              >
                Atualizar Dados
              </button>
            </div>

            {errorModalIsOpen ? (
              <ErrorOnUpdateModal
                errorModalIsOpen={errorModalIsOpen}
                setErrorModalIsOpen={setErrorModalIsOpen}
              />
            ) : (
              <SuccessOnUpdateModal
                successModalIsOpen={succesModalIsOpen}
                setSuccessModalIsOpen={setSuccesModalIsOpen}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDataPage;

export async function getServerSideProps(context: any) {

  const session = await getSession(context) as any;
  const userId = session?.user.data._id;
  let ownerProperties;
  let plans;

  if(!session){
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  } else {
    let token = session?.user?.data?.access_token!!;
    console.log("🚀 ~ file: adminUserData.tsx:625 ~ getServerSideProps ~ token:", token)
    let refreshToken = session.user?.data.refresh_token;
    const decodedToken = jwt.decode(token) as JwtPayload;
    const isTokenExpired = decodedToken.exp
      ? decodedToken.exp <= Math.floor(Date.now() / 1000)
      : false;

    try {
      const properties = await fetch(`http://localhost:3001/property/owner-properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ownerId: userId,
          page: 1
        })
      })

      if (properties.ok) {
        ownerProperties = await properties.json();
      } else {
        console.log("Erro na resposta da busca por imoveis do usuário");
      }
    } catch (error) {
      console.log(error)
    }

    plans = await fetch(`http://localhost:3001/plan`)
    .then((res) => res.json())
    .catch(() => ({}));
    
    if (isTokenExpired) {
      const decodedRefreshToken = jwt.decode(refreshToken) as JwtPayload;
      const isRefreshTokenExpired = decodedRefreshToken.exp
        ? decodedRefreshToken.exp <= Math.floor(Date.now() / 1000)
        : false;

      if (isRefreshTokenExpired) {
        destroyCookie(context, 'locale.token');
        destroyCookie(context, 'next-auth.session-token');
        destroyCookie(context, 'next-auth.csrf-token');

        return {
          redirect: {
            destination: '/login',
            permanent: false
          }
        }
      } else {
        try {
          const response = await fetch('http://localhost:3001/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              refresh_token: refreshToken
            })
          });

          if (response.ok) {
            const data = await response.json();
            const newToken = data.access_token;
            const newRefreshToken = data.refresh_token;
            refreshToken = newRefreshToken;
            token = newToken;

            return {
              props: {
                ownerProperties,
                plans
              },
            };
          } else {
            console.log("erro na chamada");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    return {
      props: {
        ownerProperties,
        plans
      },
    };
  }
}
