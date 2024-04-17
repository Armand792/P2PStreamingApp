'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export default function NextAuthProvider({ children, ...rest }: { children: ReactNode }) {
  return <SessionProvider {...rest}>{children}</SessionProvider>;
}
