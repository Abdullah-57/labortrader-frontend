import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LandingDesignLab } from './preview';

export const metadata: Metadata = {
  title: 'Landing Page Design Lab',
  robots: { index: false, follow: false, noarchive: true },
};

export default function DesignLabPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <LandingDesignLab />;
}
