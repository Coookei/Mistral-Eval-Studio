import type { User } from '@/lib/auth';
import { ProfileSettingsCard } from './ProfileSettingsCard';

type AccountPageComponentProps = {
  user: Pick<User, 'name' | 'email' | 'image' | 'createdAt'>; // only include the fields we need
};

const AccountPageComponent = ({ user }: AccountPageComponentProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and profile</p>
      </div>
      <ProfileSettingsCard defaultName={user.name} defaultImageUrl={user.image ?? null} />
    </div>
  );
};

export default AccountPageComponent;
