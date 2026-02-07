import type { Metadata } from 'next';
import PrivacyComponent from './PrivacyComponent';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

const PrivacyPage = () => {
  return <PrivacyComponent />;
};

export default PrivacyPage;
