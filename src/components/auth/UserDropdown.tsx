import { User } from '@/lib/auth';
import {
  LayoutDashboard as DashboardIcon,
  SettingsIcon,
  ShieldIcon,
  LogOut as SignOutIcon,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

function initials(input: string) {
  return input
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
export type UserDropdownProps = {
  onSignOut: () => void;
  user: User;
};

export default function UserDropdown({ onSignOut, user }: UserDropdownProps) {
  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              src={user.image ?? undefined}
            />
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/dashboard">
            <DropdownMenuItem className="cursor-pointer">
              <DashboardIcon className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
          </Link>
          {user.role === 'admin' && (
            <Link href="/admin">
              <DropdownMenuItem className="cursor-pointer">
                <ShieldIcon className="mr-2 h-4 w-4" />
                Admin
              </DropdownMenuItem>
            </Link>
          )}
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              My Profile
            </DropdownMenuItem>
          </Link>
          <Link href="/settings">
            <DropdownMenuItem className="cursor-pointer">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={onSignOut} className="cursor-pointer">
            <SignOutIcon className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
