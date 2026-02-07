import type { Metadata } from 'next';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorks } from '@/components/landing/HowItWorks';

export const metadata: Metadata = {
  title: 'Mistral Eval Studio',
};

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
    </>
  );
}
