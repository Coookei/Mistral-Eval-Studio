'use client';

import { Button } from '@/components/ui/button';
import { User } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { listUsers } from './actions';

export function ListUsers() {
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<User[]>([]);

  const handleListUsers = () => {
    startTransition(async () => {
      try {
        const users = await listUsers();
        if (users) {
          setUsers(users);
        } else {
          toast.error('No users found');
        }

        toast.success('Users listed successfully');
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
      }
    });
  };

  return (
    <div className="max-w-md">
      <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
        <div className="space-y-3">
          <div>
            <h2 className="text-destructive font-medium">List Users</h2>
            <p className="text-muted-foreground text-sm">
              This action will show all users in the application.
            </p>
          </div>
          <Button
            variant={'default'}
            className={`w-full mt-6`}
            disabled={isPending}
            onClick={handleListUsers}
          >
            {'List Users'}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
          {users.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Users:</h3>
              <ul className="list-disc list-inside max-h-60 overflow-y-auto">
                {users.map((user) => (
                  <li key={user.id}>
                    {user.name} ({user.email}) - Role: {user.role ?? 'none'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
