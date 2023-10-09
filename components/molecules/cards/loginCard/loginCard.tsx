import bcrypt from 'bcryptjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../../../context/auth';
import CheckIcon from '../../../atoms/icons/checkIcon';
import EyeIcon from '../../../atoms/icons/eyeIcon';
import TurnedOffEyeIcon from '../../../atoms/icons/turnedOffEyeIcon';
import ForgotPasswordModal from '../../../atoms/modals/forgotPasswordModal';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { sendRequest } from '../../../../hooks/sendRequest';
import VerifyEmailModal from '../../../atoms/modals/verifyEmailModal';
import { SocialAuthButton } from '../../buttons/socialAuthButtons';

// const LoginCard = () => {
//   const router = useRouter();
//   const [terms, setTerms] = useState(false);
//   const [email, setEmail] = useState<string>('');
//   const [emailError, setEmailError] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
//   const [passwordError, setPasswordError] = useState<string>('');
//   const [passwordConfirmationError, setPasswordConfirmationError] =
//     useState<string>('');
//   const [termsConfirmationError, setTermsConfirmationError] =
//     useState<string>('');
//   const [passwordHash, setPasswordHash] = useState<string>('');
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showPasswordConfirmation, setShowPasswordConfirmation] =
//     useState(false);
//   const [isRegister, setIsRegister] = useState(false);
//   const [token, setToken] = useState('');
//   const [formData, setFormData] = useState({
//     email: '',
//     passwordHash: '',
//   });

//   useEffect(() => {
//     // setEmailVerificationData({...emailVerificationData, email: email })
//   }, [email]);

//   const handleTermsCheckbox = () => {
//     setTerms(!terms);
//   };

//   const { signIn, signUp } = useContext(AuthContext);

//   useEffect(() => {
//     function handleResize() {
//       setIsMobile(window.innerWidth < 768);
//     }

//     handleResize();

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   const handleOnChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
//     const email = event.target.value;
//     setEmail(email);
//     setFormData({ ...formData, email });
//   };

//   const handleOnChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
//     const password = event.target.value;
//     setPassword(password);
//     const saltRounds = 10;
//     const passwordHash = bcrypt.hashSync(password, saltRounds);
//     setPasswordHash(passwordHash);
//     setFormData({ ...formData, passwordHash });
//   };

//   const handleOpenModal = (event: MouseEvent<HTMLParagraphElement>) => {
//     event.preventDefault();
//     setModalIsOpen(true);
//   };

//   const handlePasswordVisibility = (id: string) => {
//     console.log(
//       '🚀 ~ file: loginCard.tsx:62 ~ handlePasswordVisibility ~ id:',
//       id
//     );

//     if (id === 'password') {
//       setShowPassword(!showPassword);
//     }
//     if (id === 'passwordConfirmation') {
//       setShowPasswordConfirmation(!showPasswordConfirmation);
//     }
//   };

//   const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
//     event.preventDefault();

//     setFormData((prevState) => ({
//       ...prevState,
//       email: email,
//       passwordHash: passwordHash,
//     }));

//     if (isRegister) {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       const isValid = emailRegex.test(email);
//       if (email === '') {
//         setEmailError('Por favor, insira seu email para cadastrar uma conta.');
//       }
//       if (!isValid && email !== '') {
//         setEmailError(
//           'O e-mail inserido não tem o formato de um e-mail válido.'
//         );
//       }
//       if (password === '') {
//         setPasswordError(
//           'Por favor, insira uma senha para cadastrar sua conta.'
//         );
//       }
//       if (password.length <= 5) {
//         setPasswordError('A senha precisa ter pelo menos 6 caracteres.');
//       }
//       if (passwordConfirmation === '') {
//         setPasswordConfirmationError(
//           'Por favor, insira a confirmação de senha.'
//         );
//       }
//       if (passwordConfirmation !== '' && password !== passwordConfirmation) {
//         setPasswordConfirmationError(
//           'A confirmação de senha precisa ser igual a senha.'
//         );
//       }
//       if (!terms) {
//         setTermsConfirmationError(
//           'O cadastro só é possível se os termos de uso forem aceitos.'
//         );
//       }
//     } else {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       const isValid = emailRegex.test(email);
//       if (email === '') {
//         setEmailError('Por favor, insira seu email para cadastrar uma conta.');
//       }
//       if (!isValid && email !== '') {
//         setEmailError(
//           'O e-mail inserido não tem o formato de um e-mail válido.'
//         );
//       }
//       if (password === '') {
//         setPasswordError(
//           'Por favor, insira uma senha para cadastrar sua conta.'
//         );
//       }
//       if (!terms) {
//         setTermsConfirmationError(
//           'O cadastro só é possível se os termos de uso forem aceitos.'
//         );
//       }
//     }

//     if (isRegister) {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       const isValid = emailRegex.test(email);
//       if (
//         email !== '' &&
//         isValid &&
//         password !== '' &&
//         password.length >= 6 &&
//         passwordConfirmation !== '' &&
//         password === passwordConfirmation &&
//         terms
//       ) {
//         signUp(email, password, passwordConfirmation);
//       } else {
//         console.error('alguma informação está faltando');
//       }
//     } else {
//       if (email !== undefined && password !== undefined) {
//         signIn(email, password);
//       } else {
//         console.error('alguma informação está faltando');
//       }
//     }
//   };

//   useEffect(() => {
//     if (email !== '') {
//       setEmailError('');
//     }
//   }, [email]);

//   const getSelectedCheckboxDivClass = (selected: boolean): string => {
//     return `items-center w-6 h-6 border bg-tertiary rounded-md mt-8 drop-shadow-lg cursor-pointer ${
//       selected ? 'border-secondary' : 'border-quaternary'
//     }`;
//   };

//   const getSelectedTerms = (selected: boolean): string => {
//     return ` pb-7 pt-1 ${selected ? ' border-secondary' : ' hidden'}`;
//   };
//   return (
//     <div className="md:w-fit md:h-fit md:rounded-[30px] bg-tertiary drop-shadow-xl grid grid-flow-rows justify-items-center">
//       <div className="md:m-2 w-[125px]">
//         <Image
//           src={'/images/logo-marker.png'}
//           alt={'Locale imóveis logomarca'}
//           width={230}
//           height={110}
//         />
//       </div>
//       <div className="grid w-full px-5">
//         <label className="md:text-xl text-lg font-bold text-quaternary drop-shadow-md md:w-fit mt-auto mb-1">
//           E-mail
//         </label>
//         <input
//           className={`w-full h-fit md:h-12 rounded-[10px] border-[1px] border-quaternary drop-shadow-xl bg-tertiary text-quaternary md:p-2 text-xl font-semibold ${
//             emailError === '' ? '' : 'border-[2px] border-red-500'
//           }`}
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           //onBlur={handleEmailValidation}
//         />

//         {emailError !== '' && (
//           <span className="text-sm text-red-500">{emailError}</span>
//         )}
//       </div>
//       <div className="grid mt-3 w-full px-5">
//         <label className="md:text-xl text-lg font-bold text-quaternary drop-shadow-md md:w-fit mt-auto mb-1">
//           Senha
//         </label>
//         <div className="flex flex-col">
//           <div className="flex">
//             <input
//               className={`w-full h-fit md:h-12 rounded-[10px] border-[1px] border-quaternary drop-shadow-xl bg-tertiary text-quaternary md:p-2 text-xl font-semibold ${
//                 passwordError === '' ? '' : 'border-[2px] border-red-500'
//               }`}
//               type={showPassword ? 'text' : 'password'}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             <button
//               className="w-fit md:p-2 md:mt-0 md:flex absolute md:right-3 right-4 mx-2 pb-2 md:pt-1"
//               onClick={() => handlePasswordVisibility('password')}
//               id="password"
//             >
//               {showPassword ? (
//                 <EyeIcon
//                   fill="#6B7280"
//                   width={!isMobile ? '40' : '30'}
//                   height={!isMobile ? '40' : '30'}
//                 />
//               ) : (
//                 <TurnedOffEyeIcon
//                   fill="#6B7280"
//                   width={!isMobile ? '40' : '30'}
//                   height={!isMobile ? '40' : '30'}
//                 />
//               )}
//             </button>
//           </div>

//           {passwordError !== '' && (
//             <span className="text-sm text-red-500">{passwordError}</span>
//           )}
//         </div>

//         {isRegister && (
//           <>
//             <label className="md:text-xl text-lg font-bold text-quaternary drop-shadow-md md:w-fit mt-3 mb-1">
//               Confirmação de Senha
//             </label>
//             <div className="flex flex-col">
//               <div className="flex">
//                 <input
//                   className={`w-full h-fit md:h-12 rounded-[10px] border-[1px] border-quaternary drop-shadow-xl bg-tertiary text-quaternary md:p-2 text-xl font-semibold ${
//                     passwordConfirmationError === ''
//                       ? ''
//                       : 'border-[2px] border-red-500'
//                   }`}
//                   type={showPasswordConfirmation ? 'text' : 'password'}
//                   value={passwordConfirmation}
//                   onChange={(e) => setPasswordConfirmation(e.target.value)}
//                   //onBlur={() => setPasswordConfirmationError("A confirmação de senha precisa ser igual a senha inserida.")}
//                 />

//                 <button
//                   className="w-fit md:p-2 md:mt-0 md:flex absolute md:right-3 right-4 mx-2 pb-2 md:pt-1"
//                   onClick={() =>
//                     handlePasswordVisibility('passwordConfirmation')
//                   }
//                   id="passwordConfirmation"
//                 >
//                   {showPasswordConfirmation ? (
//                     <EyeIcon
//                       fill="#6B7280"
//                       width={!isMobile ? '40' : '30'}
//                       height={!isMobile ? '40' : '30'}
//                     />
//                   ) : (
//                     <TurnedOffEyeIcon
//                       fill="#6B7280"
//                       width={!isMobile ? '40' : '30'}
//                       height={!isMobile ? '40' : '30'}
//                     />
//                   )}
//                 </button>
//               </div>

//               {passwordConfirmationError !== '' && (
//                 <span className="text-sm text-red-500">
//                   {passwordConfirmationError}
//                 </span>
//               )}
//             </div>
//           </>
//         )}
//       </div>

//       <div>
//         <button
//           className="md:w-[400px] w-fit px-10 md:h-fit bg-primary p-2.5 gap-2.5 rounded-[50px] font-normal text-xl text-tertiary leading-6 mt-5 transition-colors duration-300 hover:bg-red-600 hover:text-white"
//           onClick={handleSubmit}
//         >
//           {isRegister ? 'Cadastrar' : 'Entrar'}
//         </button>
//       </div>

//       <Link href={'/requestPassword'}>
//         <p
//           className="text-secondary font-bold text-md my-4 cursor-pointer transition-colors duration-300 hover:text-yellow-600"
//           onClick={handleOpenModal}
//         >
//           Esqueci minha senha
//         </p>
//       </Link>

//       <div className="flex flex-col justify-center">
//         <label className="font-bold text-xs text-quaternary mx-5 my-5 md:my-0 md:mx-2 text-center">
//           {isRegister
//             ? 'Já possui uma conta cadastrada?'
//             : 'Ainda não possui uma conta?'}
//         </label>
//         <a
//           className="text-secondary text-center font-bold text-2xl mb-4 cursor-pointer transition-colors duration-300 hover:text-yellow-600 my-1"
//           onClick={() => {
//             setIsRegister(!isRegister);
//             setEmail('');
//             setPassword('');
//             setPasswordConfirmation('');
//           }}
//         >
//           {isRegister ? 'Faça login na sua conta' : 'Cadastre-se'}
//         </a>
//       </div>

//       <div className="flex">
//         <div>
//           <button
//             className="bg-quinary md:w-fit h-fit rounded-[30px] border-[1px] border-quaternary flex justify-center items-center mx-2 transition-colors duration-300 hover:bg-gray-200 hover:border-gray-500 p-2 gap-2"
//             //onClick={handleGoogleBtn}
//           >
//             <div className="md:pl-0">
//               <Image
//                 src={'/images/google-icon.png'}
//                 alt={''}
//                 width={32}
//                 height={32}
//               />
//             </div>
//             <div>
//               <p className="font-bold text-quaternary text-sm transition-colors duration-300 hover:text-gray-500">
//                 Continuar com o Google
//               </p>
//             </div>
//           </button>
//         </div>
//         {/* <div>
//           <button className="bg-quinary md:w-[253px] h-fit p-2 rounded-[30px] border-[1px] border-quaternary flex justify-evenly items-center mx-2">
//             <div className="pl-2 md:pl-0">
//               <Image
//                 src={'/images/fb-icon.png'}
//                 alt={''}
//                 width={32}
//                 height={32}
//               />
//             </div>
//             <div>
//               <p className="font-bold text-quaternary text-sm">
//                 Continuar com o Facebook
//               </p>
//             </div>
//           </button>
//         </div> */}
//       </div>
//       <div className="flex flex-row justify-around mb-4 pt-2 px-2 items-center">
//         <div className="flex items-center">
//           <div
//             className={getSelectedCheckboxDivClass(terms)}
//             onClick={handleTermsCheckbox}
//             id="terms-checkbox"
//           >
//             <CheckIcon
//               fill="#F5BF5D"
//               width="24"
//               className={getSelectedTerms(terms)}
//             />
//           </div>
//         </div>
//         <a
//           className="font-bold text-xs text-quaternary mx-5 mt-5 md:my-0 md:mx-2 pt-8 relative inline-block group transition-colors duration-300 hover:text-secondary"
//           href="/termos-de-uso"
//           target="_blank"
//           rel="noreferrer"
//         >
//           Ao entrar aceito os Termos de Uso da Locale Imóveis e afirmo ter 18
//           anos ou mais.
//           <span className="absolute left-0 bottom-0 w-full h-0.5 bg-secondary transition-transform transform scale-x-0 group-hover:scale-x-100"></span>
//         </a>
//       </div>
//       {termsConfirmationError !== '' && (
//         <span className="text-sm text-red-500 mb-4 -mt-4">
//           {termsConfirmationError}
//         </span>
//       )}
//       {modalIsOpen && (
//         <ForgotPasswordModal
//           isOpen={modalIsOpen}
//           setModalIsOpen={setModalIsOpen}
//         />
//       )}
//     </div>
//   );
// };

// export default LoginCard;

const LoginCard: React.FC = () => {
  const router = useRouter();
  const query = router.query;
  const [email, setEmail] = useState<string>('');
  const queryEmail = query.email ? query.email : null;
  const [emailError, setEmailError] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<string>('');
  const [forgotPasswordModalIsOpen, setForgotPasswordModalIsOpen] = useState(false);
  const [verifyEmailModalIsOpen, setVerifyEmailModalIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [ emailVerificationData, setEmailVerificationData ] = useState({
    email: queryEmail ? queryEmail : email,
    isEmailVerified: false,
    emailVerificationCode: '',
    password: password
  });

  useEffect(() => {
    setEmailVerificationData({...emailVerificationData, email: email })
  }, [email])
  

  // Apaga a mensagem de erro;
  useEffect(() => {
    if (email !== '') {
      setEmailError('');
    }
  }, [email]);

  // Insere o email no input caso este esteja presente na url query params;
  useEffect(() => {
    if (queryEmail !== null) {
      setEmail(queryEmail.toString());
    }
  })

  const handlePasswordVisibility = (id: string) => {
    if (id === 'password') {
      setShowPassword(!showPassword);
    }
    if (id === 'passwordConfirmation') {
      setShowPasswordConfirmation(!showPasswordConfirmation);
    }
  };

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setEmailError('');
    setPasswordError('');
    setPasswordConfirmationError('');

    const isValidEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (isRegister) {
      if(!email) {
        setEmailError('Por favor, insira seu email para cadastrar uma conta.');
      } else if (!isValidEmailFormat) {
        setEmailError('O e-mail inserido não tem o formato de um e-mail válido.');
      }
      if (!password) {
        setPasswordError('Por favor, insira uma senha para cadastrar sua conta.');
      } else if (password.length <= 5) {
        setPasswordError('A senha precisa ter pelo menos 6 caracteres.');
      }
      if (passwordConfirmation === '') {
        setPasswordConfirmationError(
          'Por favor, insira a confirmação de senha.'
        );
      }
      if (!passwordConfirmation) {
        setPasswordConfirmationError('Por favor, insira a confirmação de senha.');
      } else if (password !== passwordConfirmation) {
        setPasswordConfirmationError('A confirmação de senha precisa ser igual a senha.');
      }
    } else {
      if (!email) {
        setEmailError('Por favor, insira seu email para cadastrar uma conta.');
      } else if (!isValidEmailFormat) {
        setEmailError('O e-mail inserido não tem o formato de um e-mail válido.');
      }
      if (!password) {
        setPasswordError('Por favor, insira uma senha para cadastrar sua conta.');
      }
    }

    if (isRegister) {
      if (
        email &&
        isValidEmailFormat &&
        password &&
        password.length >= 6 &&
        passwordConfirmation === password
      ) {
        try {
          const data = await sendRequest('http://localhost:3001/auth/register', 'POST', {
            email,
            password,
            passwordConfirmation,
          });
  
          if(data){
            const { email, emailVerificationCode, isEmailVerified } = data;
            setEmailVerificationData({
              email,
              isEmailVerified,
              emailVerificationCode,
              password
            });
            setVerifyEmailModalIsOpen(true);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        toast.error('Alguma informação está faltando.');
      }
    } else {
      if (email && password ) {
        try {
          const data = await sendRequest('http://localhost:3001/user/find-by-email', 'POST', {email});

          if(data) {
            const isEmailVerified = data.isEmailVerified;
            if(isEmailVerified) {
              try {
                const signInResponse = await signIn('credentials', {
                  email, 
                  password,
                  redirect: false
                }).then(({ ok, error }: any) => {
                  if (ok) {
                    toast.dismiss();
                    router.push("/admin");
                  } else {
                    console.error(error);
                    toast.dismiss();
                    toast.warning("Email ou senha inválidos.", { type: "error" });
                  }
                });
    
                if (signInResponse === null) {
                  toast.warn('Dados de login inválidos ou usuário não encontrado');
                }
              } catch (error) {
                toast.dismiss();
                console.error(error);
                toast.warn('Erro ao fazer login');
              }
            } else {
              toast.warn('Por favor, verifique a autenticidade de sua conta informando o código de verificação enviado para o seu e-mail.');
              setVerifyEmailModalIsOpen(true);
            }
          } else {
            toast.dismiss();
            toast.error('Não há nenhum usuário cadastrado com o e-mail informado.')
          }
        } catch (error) {
          toast.dismiss();
          toast.error("Ocorreu um erro ao tentar se conectar com o servidor, por favor tente novamente mais tarde.")
          console.error(error)
        }
      } else {
        toast.warn('alguma informação está faltando');
      }
    }
  };

  return (
    <div className="md:w-fit md:h-fit md:rounded-[30px] bg-tertiary drop-shadow-xl grid grid-flow-rows justify-items-center">
      <div className="md:m-2 w-[125px]">
        <Image
          src={'/images/logo-marker.png'}
          alt={'Locale imóveis logomarca'}
          width={230}
          height={110}
        />
      </div>
      <div className="grid w-full px-5">
        <label className="md:text-xl text-lg font-bold text-quaternary drop-shadow-md md:w-fit mt-auto mb-1">
          E-mail
        </label>
        <input
          className={`w-full h-fit md:h-12 rounded-[10px] border-[1px] border-quaternary drop-shadow-xl bg-tertiary text-quaternary p-2 md:text-xl font-semibold ${
            emailError === '' ? '' : 'border-[2px] border-red-500'
          }`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {emailError !== '' && (
          <span className="text-sm text-red-500">{emailError}</span>
        )}
      </div>
      <div className="grid mt-3 w-full px-5">
        <label className="md:text-xl text-lg font-bold text-quaternary drop-shadow-md md:w-fit mt-auto mb-1">
          Senha
        </label>
        <div className="flex flex-col">
          <div className="flex">
            <input
              className={`w-full h-fit md:h-12 rounded-[10px] border-[1px] border-quaternary drop-shadow-xl bg-tertiary text-quaternary p-2 md:text-xl font-semibold ${
                passwordError === '' ? '' : 'border-[2px] border-red-500'
              }`}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setEmailVerificationData({...emailVerificationData, password: e.target.value})
              }}
            />

            <button
              className="w-fit md:p-2 md:mt-0 md:flex absolute md:right-3 right-4 m-2 md:pt-1"
              onClick={() => handlePasswordVisibility('password')}
              id="password"
            >
              {showPassword ? (
                <EyeIcon
                  fill="#6B7280"
                  width={!isMobile ? '40' : '30'}
                  height={!isMobile ? '40' : '30'}
                />
              ) : (
                <TurnedOffEyeIcon
                  fill="#6B7280"
                  width={!isMobile ? '40' : '30'}
                  height={!isMobile ? '40' : '30'}
                />
              )}
            </button>
          </div>

          {passwordError !== '' && (
            <span className="text-sm text-red-500">{passwordError}</span>
          )}
        </div>

        {isRegister && (
          <>
            <label className="md:text-xl text-lg font-bold text-quaternary drop-shadow-md md:w-fit mt-3 mb-1">
              Confirmação de Senha
            </label>
            <div className="flex flex-col">
              <div className="flex">
                <input
                  className={`w-full h-fit md:h-12 rounded-[10px] border-[1px] border-quaternary drop-shadow-xl bg-tertiary text-quaternary md:p-2 text-xl font-semibold ${
                    passwordConfirmationError === ''
                      ? ''
                      : 'border-[2px] border-red-500'
                  }`}
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />

                <button
                  className="w-fit md:p-2 md:mt-0 md:flex absolute md:right-3 right-4 mx-2 pb-2 md:pt-1"
                  onClick={() =>
                    handlePasswordVisibility('passwordConfirmation')
                  }
                  id="passwordConfirmation"
                >
                  {showPasswordConfirmation ? (
                    <EyeIcon
                      fill="#6B7280"
                      width={!isMobile ? '40' : '30'}
                      height={!isMobile ? '40' : '30'}
                    />
                  ) : (
                    <TurnedOffEyeIcon
                      fill="#6B7280"
                      width={!isMobile ? '40' : '30'}
                      height={!isMobile ? '40' : '30'}
                    />
                  )}
                </button>
              </div>

              {passwordConfirmationError !== '' && (
                <span className="text-sm text-red-500">
                  {passwordConfirmationError}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <div>
        <button
          className="md:w-[400px] w-fit px-10 md:h-fit bg-primary p-2.5 gap-2.5 rounded-[50px] font-normal text-xl text-tertiary leading-6 my-5 transition-colors duration-300 hover:bg-red-600 hover:text-white"
          onClick={handleSubmit}
        >
          {isRegister ? 'Cadastrar' : 'Entrar'}
        </button>
      </div>

      <p
        className="text-secondary font-bold text-md my-4 cursor-pointer transition-colors duration-300 hover:text-yellow-600"
        onClick={() => setForgotPasswordModalIsOpen(true)}
      >
        Esqueci minha senha
      </p>

      <div className="flex flex-col justify-center">
        <label className="font-bold text-xs text-quaternary mx-5 my-5 md:my-0 md:mx-2 text-center">
          {isRegister
            ? 'Já possui uma conta cadastrada?'
            : 'Ainda não possui uma conta?'}
        </label>
        <a
          className="text-secondary text-center font-bold text-2xl mb-4 cursor-pointer transition-colors duration-300 hover:text-yellow-600 my-1"
          onClick={() => {
            setIsRegister(!isRegister);
            setEmail('');
            setPassword('');
            setPasswordConfirmation('');
          }}
        >
          {isRegister ? 'Faça login na sua conta' : 'Cadastre-se'}
        </a>
      </div>

      <div className="flex">
        <div>
          <SocialAuthButton 
            provider={'google'} 
            onClick={() => signIn('google')}
          />
        </div>
        <div>
          <SocialAuthButton 
            provider={'facebook'} 
            onClick={() => signIn('facebook')}
          />
        </div>
      </div>

      <a
        className="font-bold text-xs text-quaternary mx-5 my-5 md:my-0 md:mb-4 md:mx-4 pt-2 relative inline-block group transition-colors duration-300 hover:text-secondary"
        href="/termos-de-uso"
        target="_blank"
        rel="noreferrer"
      >
        Ao entrar aceito os Termos de Uso da Locale Imóveis e afirmo ter 18 anos
        ou mais.
        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-secondary transition-transform transform scale-x-0 group-hover:scale-x-100"></span>
      </a>

      {forgotPasswordModalIsOpen && (
        <ForgotPasswordModal
          isOpen={forgotPasswordModalIsOpen}
          setModalIsOpen={setForgotPasswordModalIsOpen}
        />
      )}

      {verifyEmailModalIsOpen && (
        <VerifyEmailModal 
          isOpen={verifyEmailModalIsOpen}
          setModalIsOpen={setVerifyEmailModalIsOpen}
          emailVerificationDataProp={emailVerificationData} 
        />
      )}

    </div>
  );
};

export default LoginCard;
