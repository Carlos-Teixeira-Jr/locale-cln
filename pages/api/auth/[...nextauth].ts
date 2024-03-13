import jwt, { JwtPayload } from 'jsonwebtoken';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';

interface MyCredentials {
  email: string;
  password: string;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  picture: string;
  token: string;
  refreshToken: string;
  isEmailVerified: boolean;
  provider: string;
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_SECRET as string,
    }),
    CredentialsProvider({
      name: 'login',
      credentials: {},
      // @ts-ignore
      async authorize(credentials: MyCredentials) {
        const { email, password } = credentials;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const user = {
            ...data,
          };

          if (data) {
            return user;
          } else {
            return null;
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }: any) {
      const provider = account.provider;
      const { email, name, image } = user;

      if (provider && provider !== 'credentials') {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/social-register`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              username: name,
              picture: image,
            }),
          }
        );

        const data = await response.json();

        user = {
          ...user,
          ...data
        };
        user.provider = provider;

        return user;
      } else {
        if (!user) {
          return false;
        } else {
          return user;
        }
      }
    },
    // async jwt({ token, user }: any) {
    //   user && (token.user = user);
    //   return token;
    // },
    async jwt({ token, user }: any) {
      console.log("🚀 ~ jwt ~ user:", user)
      console.log("🚀 ~ jwt ~ token:", token)

      //Tentar colocar os dados no token

      token.sub = user.access_token;
      if (user) {
        const decodedToken = jwt.decode(user.access_token) as JwtPayload;
        const isTokenExpired = decodedToken?.exp
          ? decodedToken?.exp <= Math.floor(Date.now() / 1000)
          : false;

        if (isTokenExpired) {
          try {
            // Faça a renovação do token aqui e atualize o token e o refreshToken no token JWT
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/refresh`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  refresh_token: token.user.data.refresh_token,
                }),
              }
            );

            if (response.ok) {
              const data = await response.json();
              const newToken = data.access_token;
              const newRefreshToken = data.refresh_token;
              user.data.refresh_token = newRefreshToken;
              user.data.access_token = newToken;

              console.log("🚀 ~ jwt ~ { ...token, user }:", { ...token, user })

              return { ...token, user }; // Garanta que o objeto user seja passado junto com o token
            } else {
              console.log('Não foi possível atualizar o token.');
            }
          } catch (error) {
            console.log(error);
          }
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      // console.log("🚀 ~ session ~ token:", token)
      // console.log("🚀 ~ session ~ session:", session)
      session.user = { ...session.user, ...token.user };

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};

// @ts-ignore
export default NextAuth(authOptions);
