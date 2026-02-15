import type { Metadata } from 'next';
import DocsComponent from './DocsComponent';

export const metadata: Metadata = {
  title: 'Documentation',
};

const DocsPage = () => {
  return <DocsComponent />;
};

export default DocsPage;
