'use client';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/utils/hooks/store.hooks';
import { RootState } from '@/store';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

const WithAuthMiddleware = ({ children }: { children: ReactNode }) => {
  const navigation = useRouter();
  const { status } = useSession();
  const userAuth = useAppSelector((state: RootState) => state.user.auth);

  const checkAuth = () => {
    if (userAuth.token === '' && userAuth.user_id === '') {
      navigation.push('/login');
    }
  };

  useEffect(() => {
    checkAuth();
  }, [status, userAuth]);

  return <>{children} </>;
};

export default WithAuthMiddleware;
