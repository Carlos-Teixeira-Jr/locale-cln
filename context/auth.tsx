import { useRouter } from 'next/router';
import { parseCookies, setCookie } from 'nookies';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Api } from '../services/api';

type User = {
  _id: string;
  username: string;
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    passwordConfirmation: string
  ) => Promise<void>;
  googleLogin: any;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;
  const router = useRouter();

  useEffect(() => {
    const { 'locale.token': token } = parseCookies();
    const { 'locale.id': userId } = parseCookies();

    const fetchData = async () => {
      if (token) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/user/${userId}`
          );

          if (response.ok) {
            const data = await response.json();
            setUser({
              _id: data._id,
              username: data.username,
              email: data.email,
            });
          } else {
            console.error('Erro ao obter dados do usuário');
          }
        } catch (error) {
          console.error('Erro ao conectar com o servidor');
        }
      }
    };
    fetchData();
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        const token = data.access_token;
        const refreshToken = data.refresh_token;
        const userId = data._id;

        setCookie(undefined, 'locale.token', token, {
          maxAge: 60 * 60 * 24 * 10, // 10 dias; // colocar em uma variavel de ambiente;
        });
        setCookie(undefined, 'locale.id', userId, {
          maxAge: 60 * 60 * 24 * 10,
        });
        setCookie(undefined, 'locale.refresh_token', refreshToken, {
          maxAge: 60 * 60 * 24 * 10,
        });

        // Insere o token no cabeçalho de cada requisição feita ao backend usando o Api;
        Api.defaults.headers['Authorization'] = `Bearer ${token}`;

        setUser({
          _id: data._id,
          username: data.username,
          email: data.email,
        });

        router.push('/admin?page=1');
      } else {
        console.error('Erro ao fazer login');
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor');
    }
  }

  async function signUp(
    email: string,
    password: string,
    passwordConfirmation: string
  ) {
    try {
      toast.success('Enviando...');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            passwordConfirmation,
          }),
        }
      );

      if (response.ok) {
        toast.dismiss();
        toast.success(`Cadastro realizado com sucesso`);
        const data = await response.json();
        const token = data.access_token;
        const refreshToken = data.refresh_token;
        const userId = data._id;

        setCookie(undefined, 'locale.token', token, {
          maxAge: 60 * 60 * 24 * 10, // 10 dias; // colocar em uma variavel de ambiente;
        });
        setCookie(undefined, 'locale.id', userId, {
          maxAge: 60 * 60 * 24 * 10,
        });
        setCookie(undefined, 'locale.refresh_token', refreshToken, {
          maxAge: 20 * 24 * 60 * 60,
        });

        // Insere o token no cabeçalho de cada requisição feita ao backend usando o Api;
        Api.defaults.headers['Authorization'] = `Bearer ${token}`;

        setUser({
          _id: data._id,
          username: data.username,
          email: data.email,
        });

        router.push('/admin?page=1');
      } else {
        console.error('Erro ao fazer o cadastro');
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Erro ao conectar com o servidor');
    }
  }

  async function googleLogin() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/google`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        }
      );

      console.log('login do google funfou');
    } catch (error) {
      console.error('Erro ao conectar com o servidor');
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signUp,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
