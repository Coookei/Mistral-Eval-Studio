import type { Metadata } from 'next';
import TermsComponent from './TermsComponent';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

const TermsPage = () => {
  return <TermsComponent />;
};

export default TermsPage;
