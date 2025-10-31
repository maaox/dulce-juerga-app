import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      barra: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
    barra: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    barra: string | null;
  }
}
