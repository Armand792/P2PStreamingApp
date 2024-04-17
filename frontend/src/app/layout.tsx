import { Inter } from 'next/font/google';
import { NotificationProvider } from './NotificationProiver';
import NextAuthProvider from './NextAuthProvider';
import ContextProvider from './ContextProvider';
import '../global_styles/index.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
  ...rest
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <NextAuthProvider {...rest}>
          <ContextProvider {...rest}>
            <NotificationProvider />
            {children}
          </ContextProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
