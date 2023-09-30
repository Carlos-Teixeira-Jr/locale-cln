declare module 'next-auth' {
  export interface Session {
    user: {
      _id: string,
      username?: string,
      email: string,
      picture?: string,
      token: string,
      refreshToken:string,
      isEmailerified: boolean
      provider: string
    }
  }
}