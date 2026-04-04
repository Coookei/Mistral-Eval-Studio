import { requireUser } from '@/lib/requireAuth';
import type { Metadata } from 'next';
import NewComparisonPageComponent from './NewComparisonPageComponent';

export const metadata: Metadata = {
  title: 'New Comparison',
};

const NewComparisonPage = async () => {
  await requireUser();

  return <NewComparisonPageComponent />;
};

export default NewComparisonPage;
