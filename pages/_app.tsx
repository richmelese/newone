import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Inter, Sora, Noto_Sans_Ethiopic } from 'next/font/google';
import { AnimatePresence, motion } from 'framer-motion';
import { pageTransition } from '../lib/motion';
import { LanguageProvider } from '../lib/language';
import { AuthProvider } from '../lib/auth';
import { FavoritesProvider } from '../lib/favorites';
import { CompareProvider } from '../lib/compare';
import { ViewedHistoryProvider } from '../lib/viewedHistory';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' });
const notoEthiopic = Noto_Sans_Ethiopic({ subsets: ['ethiopic'], variable: '--font-noto-ethiopic', display: 'swap' });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <div className={`${inter.variable} ${sora.variable} ${notoEthiopic.variable} font-sans`}>
      <LanguageProvider>
        <AuthProvider>
          <FavoritesProvider>
            <CompareProvider>
              <ViewedHistoryProvider>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={router.asPath}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageTransition}
                  >
                    <Component {...pageProps} />
                  </motion.div>
                </AnimatePresence>
              </ViewedHistoryProvider>
            </CompareProvider>
          </FavoritesProvider>
        </AuthProvider>
      </LanguageProvider>
    </div>
  );
}
