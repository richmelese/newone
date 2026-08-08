import type { ReactNode } from 'react';
import clsx from 'clsx';
import Navbar from './Navbar';
import Footer from './Footer';
import CompareBar from './CompareBar';
import Seo from './Seo';
import ForHotelsBand from '@/components/home/ForHotelsBand';

type LayoutProps = {
  children: ReactNode;
  seo: {
    title: string;
    description: string;
    image?: string;
    path?: string;
    noindex?: boolean;
    jsonLd?: object | object[];
  };
  /** Set when the page's first section is a full-bleed hero that already reserves space for the floating navbar. */
  overlapHeader?: boolean;
  /** Account and utility pages can opt out of the promotional band. */
  showForHotelsBand?: boolean;
};

export default function Layout({ children, seo, overlapHeader, showForHotelsBand = true }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Seo {...seo} />
      <Navbar overlapHeader={overlapHeader} />
      <main className={clsx('flex-1 pb-16', !overlapHeader && 'pt-24 sm:pt-28')}>
        {children}
        {showForHotelsBand && <ForHotelsBand />}
      </main>
      <Footer />
      <CompareBar />
    </div>
  );
}
